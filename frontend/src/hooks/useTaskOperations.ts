import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from './useApi';
import { TaskListDto } from '../services/backend/types';
import { useSignalREvent } from './useSignalREvent';
import { useQueryInvalidation } from './useQueryInvalidation';

export function useTaskOperations() {
  const { apiCall } = useApi();
  const { invalidateQueries } = useQueryInvalidation();
  const queryClient = useQueryClient();

  useSignalREvent('TaskListCreated', () => {
    invalidateQueries(['taskLists']);
  });

  useSignalREvent('TaskListShared', (sharedTaskListId: number) => {
    invalidateQueries(['taskLists']);
    apiCall(client => client.tasks_GetTaskList(sharedTaskListId))
      .then((newTaskList) => {
        queryClient.setQueryData(['taskLists'], (oldData: TaskListDto[] | undefined) => {
          if (oldData) {
            const existingIndex = oldData.findIndex(list => list.id === newTaskList.id);
            if (existingIndex !== -1) {
              // Replace the existing task list
              const updatedData = [...oldData];
              updatedData[existingIndex] = newTaskList;
              return updatedData;
            } else {
              // Add the new task list
              return [...oldData, newTaskList];
            }
          }
          return [newTaskList];
        });
      });
  });

  const { data: taskLists, isLoading: isTaskListsLoading, error: taskListsError } = useQuery<TaskListDto[]>({
    queryKey: ['taskLists'],
    queryFn: () => apiCall(client => client.tasks_GetUserTaskLists()),
  });

  const createTaskList = useMutation({
    mutationFn: (list: { name: string; description: string }) => 
      apiCall(client => client.tasks_CreateTaskList(list)),
    onSuccess: (newTaskList) => {
      queryClient.setQueryData(['taskLists'], (oldData: TaskListDto[] | undefined) => {
        return oldData ? [...oldData, newTaskList] : [newTaskList];
      });
    },
  });

  

  return {
    taskLists,
    isTaskListsLoading,
    taskListsError,
    createTaskList,
  };
}