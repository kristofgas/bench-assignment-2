import { useMutation, useQuery } from '@tanstack/react-query';
import { useApi } from './useApi';
import { Task, NewTask, UpdateTaskDetails, TaskList } from '../types/task';
import { Color, getRankValue } from '../utils/taskUtils';
import { TaskDto, TaskListDto, TaskSummaryDto, UserDto } from '../services/backend/types';
import { useState, useEffect } from 'react';
import { useSignalRConnection } from '../providers/SignalRProvider';
import { useSignalREvent } from './useSignalREvent';
import { useQueryInvalidation } from './useQueryInvalidation';

export function useTaskListOperations(listId: number) {
  const { apiCall } = useApi();
  const { invalidateQueries } = useQueryInvalidation();
  const [isSharing, setIsSharing] = useState(false);
  const { connection } = useSignalRConnection();

  useEffect(() => {
    if (connection) {
      connection.invoke('JoinTaskList', listId).catch(err => console.error('Error joining task list:', err));
      return () => {
        connection.invoke('LeaveTaskList', listId).catch(err => console.error('Error leaving task list:', err));
      };
    }
  }, [connection, listId]);

  useSignalREvent('TaskCreated', () => {
    invalidateQueries(['tasks', 'taskSummary']);
  });

  useSignalREvent('TaskUpdated', () => {
    invalidateQueries(['tasks', 'taskSummary', 'taskSummaries']);
  });

  useSignalREvent('TaskDeleted', () => {
    invalidateQueries(['tasks', 'taskSummary']);
  });

  useSignalREvent('TaskListShared', (sharedTaskListId: number) => {
    if (sharedTaskListId === listId) {
      invalidateQueries(['taskList', 'associatedUsers', 'nonAssociatedUsers', 'taskSummary']);
    }
  });

  const { data: taskList, isLoading: isTaskListLoading, error: taskListError } = useQuery<TaskListDto, Error, TaskList>({
    queryKey: ['taskList', listId],
    queryFn: () => apiCall(client => client.tasks_GetTaskList(listId)),
    select: (data): TaskList => ({
      id: data.id ?? 0,
      name: data.name ?? '',
      description: data.description ?? '',
      createdBy: data.createdBy ?? null,
    }),
  });

  

  const createTask = useMutation({
    mutationFn: (newTask: NewTask) => 
      apiCall(client => client.tasks_CreateTask({
        ...newTask,
        rank: getRankValue(newTask.rank),
        taskListId: listId
      })),
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
      setIsSharing(false);
    },
    onError: () => {
      setIsSharing(false);
    }
  });

  const { data: taskSummary, isLoading: isTaskSummaryLoading, error: taskSummaryError } = useQuery<TaskSummaryDto, Error>({
    queryKey: ['taskSummary', listId],
    queryFn: () => apiCall(client => client.tasks_GetTaskSummary(listId)),
  });

  const clearCompletedTasks = useMutation({
    mutationFn: () => apiCall(client => client.tasks_ClearCompletedTasks(listId)),
  });

  return {
    taskList,
    isTaskListLoading,
    taskListError,
    createTask,
    updateTaskDetails,
    associatedUsers,
    isAssociatedUsersLoading,
    associatedUsersError,
    nonAssociatedUsers,
    isNonAssociatedUsersLoading,
    nonAssociatedUsersError,
    shareTaskList,
    isSharing,
    taskSummary,
    isTaskSummaryLoading,
    taskSummaryError,
    clearCompletedTasks,
  };
}