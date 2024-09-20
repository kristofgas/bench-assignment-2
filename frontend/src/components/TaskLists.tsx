import React, { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { genApiClient } from '../services/backend/genApiClient';
import { TaskListDto } from '../services/backend/types';
import { useCreateTaskList } from '../hooks/useCreateTaskList';
import TaskList from './TaskList';

const TaskLists: React.FC = () => {
  const [newList, setNewList] = useState({ name: '', description: '' });

  const { data: taskLists, isLoading, error } = useQuery<TaskListDto[]>({
    queryKey: ['taskLists'],
    queryFn: async () => {
      const client = await genApiClient();
      const lists = await client.tasks_GetUserTaskLists();
      return lists;
    },
  });

  const createListMutation = useCreateTaskList();

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