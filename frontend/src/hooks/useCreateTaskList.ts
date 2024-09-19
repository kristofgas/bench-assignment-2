import { useMutation, useQueryClient } from '@tanstack/react-query';
import { genApiClient } from '../services/backend/genApiClient';
import { TaskListDto } from '../services/backend/types';

export const useCreateTaskList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (list: { name: string; description: string }) => {
      const client = await genApiClient();
      return client.tasks_CreateTaskList(list);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskLists'] });
    },
  });
};