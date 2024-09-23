import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { TaskListDto } from '../services/backend/types';

export function useTaskOperations() {
  const { apiCall } = useApi();
  const queryClient = useQueryClient();

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

  return {
    taskLists,
    isTaskListsLoading,
    taskListsError,
    createTaskList,
  };
}