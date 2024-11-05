import { useQuery, useMutation } from '@tanstack/react-query';
import { useApi } from './useApi';
import { Task, NewTask, UpdateTaskDetails } from '../types/task';
import { TaskDto } from '../services/backend/types';

import { Color, getRankValue } from '../utils/taskUtils';
import { TaskFilters } from 'types/filters';

export function useTasksData(listId: number, filters: TaskFilters) {
  const { apiCall } = useApi();

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
        createdBy: task.createdBy ?? null,
        lastModified: task.lastModified ?? null,
        lastModifiedBy: task.lastModifiedBy ?? null,
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

  const updateTaskStatus = useMutation({
    mutationFn: (taskId: number) => 
      apiCall(async client => {
        const task = tasks?.find(t => t.id === taskId);
        return client.tasks_UpdateTaskStatus(taskId, { id: taskId, isCompleted: !task?.isCompleted });
      }),
  });

  const updateTaskDetails = useMutation({
    mutationFn: (updatedTask: UpdateTaskDetails) => 
      apiCall(client => client.tasks_UpdateTaskDetails(updatedTask.id!, {
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        rank: updatedTask.rank,
        color: updatedTask.color,
        isFavorite: updatedTask.isFavorite
      })),
  });

  return {
    tasks,
    isTasksLoading,
    tasksError,
    updateTaskStatus,
    updateTaskDetails,
  };
}