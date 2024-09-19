import { useMutation, useQueryClient } from '@tanstack/react-query';
import { genApiClient } from '../services/backend/genApiClient';
import { NewTask, Task } from '../types/task';
import { getRankValue } from '../utils/taskUtils';

export const useCreateTask = (listId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (task: NewTask) => {
      const client = await genApiClient();
      return client.tasks_CreateTask({
        ...task,
        rank: getRankValue(task.rank),
        taskListId: listId
      });
    },
    onSuccess: (newTask) => {
        queryClient.setQueryData(['tasks', listId], (oldTasks: Task[] | undefined) => 
          oldTasks ? [...oldTasks, newTask] : [newTask]
        );
      },
  });
};