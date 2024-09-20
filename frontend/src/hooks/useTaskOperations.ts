import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { Task, NewTask, UpdateTaskDetails, TaskList } from '../types/task';
import { getRankValue } from '../utils/taskUtils';
import { TaskFilters } from 'components/FilterTasks';
import { TaskDto, TaskListDto } from '../services/backend/types';

export function useTaskOperations(listId: number, filters: TaskFilters) {
  const { apiCall } = useApi();
  const queryClient = useQueryClient();

  const { data: taskList, isLoading: isTaskListLoading, error: taskListError } = useQuery<TaskListDto, Error, TaskList>({
    queryKey: ['taskList', listId],
    queryFn: () => apiCall(client => client.tasks_GetTaskList(listId)),
    select: (data): TaskList => ({
      id: data.id ?? 0,
      name: data.name ?? '',
      description: data.description ?? '',
    }) ,
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
    select: (data): Task[] => data.map(task => ({
      id: task.id ?? 0,
      title: task.title ?? '',
      description: task.description ?? '',
      rank: task.rank ?? 0,
      color: task.color ?? '',
      isCompleted: task.isCompleted ?? false,
      isFavorite: task.isFavorite ?? false,
      taskListId: task.taskListId ?? 0,
    }) ) as Task [],
  });

  const { data: taskLists, isLoading: isTaskListsLoading, error: taskListsError } = useQuery<TaskListDto[]>({
    queryKey: ['taskLists'],
    queryFn: () => apiCall(client => client.tasks_GetUserTaskLists()),
  });
  
  const createTaskList = useMutation({
    mutationFn: (list: { name: string; description: string }) => 
      apiCall(client => client.tasks_CreateTaskList(list)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskLists'] });
    },
  });


  const createTask = useMutation({
    mutationFn: (newTask: NewTask) => 
      apiCall(client => client.tasks_CreateTask({
        ...newTask,
        rank: getRankValue(newTask.rank),
        taskListId: listId
      })),
    onSuccess: (newTask) => {
      queryClient.setQueryData(['tasks', listId, filters], (oldTasks: Task[] | undefined) => 
        oldTasks ? [...oldTasks, newTask] : [newTask]
      );
      queryClient.invalidateQueries({ queryKey: ['tasks', listId] });
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: (taskId: number) => 
      apiCall(async client => {
        const currentTasks = queryClient.getQueryData<Task[]>(['tasks', listId, filters]);
        const task = currentTasks?.find(t => t.id === taskId);
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
  taskLists,
  isTaskListsLoading,
  taskListsError,
  createTaskList,
};
}