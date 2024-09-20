import React, { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { genApiClient } from '../services/backend/genApiClient';
import { TaskListDto } from '../services/backend/types';
import TaskList from './TaskList';
import { useApi } from '../hooks/useApi';

import { useTaskOperations } from '../hooks/useTaskOperations';


const TaskLists: React.FC = () => {
  const [newList, setNewList] = useState({ name: '', description: '' });
  const queryClient = useQueryClient();
  const { apiCall } = useApi();

  const { data: taskLists, isLoading, error } = useQuery<TaskListDto[]>({
    queryKey: ['taskLists'],
    queryFn: () => apiCall(client => client.tasks_GetUserTaskLists()),
  });

  const createListMutation = useMutation({
    mutationFn: (list: { name: string; description: string }) => 
      apiCall(client => client.tasks_CreateTaskList(list)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskLists'] });
    },
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    createListMutation.mutate(newList, {
      onSuccess: () => {
        setNewList({ name: '', description: '' });
      }
    });
  }, [createListMutation, newList]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;

  return (
    <div>
      <h1>Task Lists</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newList.name}
          onChange={(e) => setNewList({...newList, name: e.target.value})}
          placeholder="New list name"
          required
        />
        <textarea
          value={newList.description}
          onChange={(e) => setNewList({...newList, description: e.target.value})}
          placeholder="New list description"
          required
        />
        <button type="submit">Create New List</button>
      </form>
      {taskLists?.map(list => (
        <TaskList key={list.id} listId={list.id} />
      ))}
    </div>
  );
};

export default TaskLists;