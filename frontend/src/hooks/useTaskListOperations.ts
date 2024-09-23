import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { Task, NewTask, UpdateTaskDetails, TaskList } from '../types/task';
import { Color, getRankValue } from '../utils/taskUtils';
import { TaskFilters } from 'components/FilterTasks';
import { TaskDto, TaskListDto, UserDto } from '../services/backend/types';
import { useMemo, useState } from 'react';

export function useTaskListOperations(listId: number, filters: TaskFilters) {
  const { apiCall } = useApi();
  const queryClient = useQueryClient();
  const [isSharing, setIsSharing] = useState(false);

  const { data: taskList, isLoading: isTaskListLoading, error: taskListError } = useQuery<TaskListDto, Error, TaskList>({
    queryKey: ['taskList', listId],
    queryFn: () => apiCall(client => client.tasks_GetTaskList(listId)),
    select: (data): TaskList => ({
      id: data.id ?? 0,
      name: data.name ?? '',
      description: data.description ?? '',
    }),
  });

  const { data: tasks, isLoading: isTasksLoading, error: tasksError } = useQuery<TaskDto[], Error, Task[]>({
    queryKey: ['tasks', listId, filters],
    queryFn: () => apiCall(client => client.tasks_GetTasksByState(
      filters.isCompleted,
      filters.isFavorite,
      filters.sortBy,
      filters.sortDescending,
      listId
    )),
    select: (data): Task[] => {
      const mappedTasks = data.map(task => ({
        id: task.id ?? 0,
        title: task.title ?? '',
        description: task.description ?? '',
        rank: task.rank ?? 0,
        color: task.color as Color ?? '#FF0000',
        isCompleted: task.isCompleted ?? false,
        isFavorite: task.isFavorite ?? false,
        taskListId: task.taskListId ?? 0,
      }));

      return mappedTasks.sort((a, b) => {
        if (filters.sortBy === 'title') {
          return filters.sortDescending ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title);
        } else if (filters.sortBy === 'rank') {
          return filters.sortDescending ? b.rank - a.rank : a.rank - b.rank;
        }
        return 0;
      });
    },
  });

  const createTask = useMutation({
    mutationFn: (newTask: NewTask) => 
      apiCall(client => client.tasks_CreateTask({
        ...newTask,
        rank: getRankValue(newTask.rank),
        taskListId: listId
      })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', listId, filters] });
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: (taskId: number) => 
      apiCall(async client => {
        const task = tasks?.find(t => t.id === taskId);
        return client.tasks_UpdateTaskStatus(taskId, { id: taskId, isCompleted: !task?.isCompleted });
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', listId, filters] });
    },
  });

  const updateTaskDetails = useMutation({
    mutationFn: (updatedTask: UpdateTaskDetails) => 
      apiCall(client => client.tasks_UpdateTaskDetails(updatedTask.id, updatedTask)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', listId, filters] });
    },
  });

  const { data: associatedUsers, isLoading: isAssociatedUsersLoading, error: associatedUsersError } = useQuery<UserDto[]>({
    queryKey: ['associatedUsers', listId],
    queryFn: () => apiCall(client => client.tasks_GetUsersByTaskListAssociation(listId, true)),
  });
  
  const { data: nonAssociatedUsers, isLoading: isNonAssociatedUsersLoading, error: nonAssociatedUsersError } = useQuery<UserDto[]>({
    queryKey: ['nonAssociatedUsers', listId],
    queryFn: () => apiCall(client => client.tasks_GetUsersByTaskListAssociation(listId, false)),
  });
  
  const shareTaskList = useMutation({
    mutationFn: (userIdsToShare: number[]) => {
      setIsSharing(true);
      return apiCall(client => client.tasks_ShareTaskList(listId, userIdsToShare));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['associatedUsers', listId] });
      queryClient.invalidateQueries({ queryKey: ['nonAssociatedUsers', listId] });
      setIsSharing(false);
    },
    onError: () => {
      setIsSharing(false);
    }
  });

  return {
    taskList,
    isTaskListLoading,
    taskListError,
    tasks,
    isTasksLoading,
    tasksError,
    createTask,
    updateTaskStatus,
    updateTaskDetails,
    associatedUsers,
    isAssociatedUsersLoading,
    associatedUsersError,
    nonAssociatedUsers,
    isNonAssociatedUsersLoading,
    nonAssociatedUsersError,
    shareTaskList,
    isSharing,
  };
}