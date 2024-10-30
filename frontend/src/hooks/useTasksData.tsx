// src/hooks/useTasksData.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { useApi } from './useApi';
import { TaskDto } from '../services/backend/types';
import { Task } from '../types/task';
import { TaskFilters } from '../types/filters';
import { Color } from '../utils/taskUtils';
import { useQueryInvalidation } from './useQueryInvalidation';

export function useTasksData(listId: number, filters: TaskFilters) {
  const { apiCall } = useApi();
  const { invalidateQueries } = useQueryInvalidation();



  const { data: tasks, isLoading: isTasksLoading } = useQuery<TaskDto[], Error, Task[]>({
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

  return {
    tasks: tasks ?? [],
    isTasksLoading,
    updateTaskStatus
  };
}