import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { genApiClient } from '../services/backend/genApiClient';
import { TaskListDto } from '../services/backend/types';
import TaskList from '../components/TaskList';
import Login from '../components/Login';
import Register from '../components/Register';
import { useAuth } from '../services/auth/useAuth';
import { AuthStage } from '../services/auth/useAuthContextValue';

const HomePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [newList, setNewList] = React.useState({ name: '', description: '' });
  const { authStage, activeUser, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  const { data: taskLists, isLoading, error } = useQuery<TaskListDto[]>({
    queryKey: ['taskLists'],
    queryFn: async () => {
      const client = await genApiClient();
      const lists = await client.tasks_GetUserTaskLists();
      console.log('Fetched task lists:', lists);
      return lists;
    },
    enabled: authStage === AuthStage.AUTHENTICATED,
  });

  const createListMutation = useMutation({
    mutationFn: async (list: { name: string; description: string }) => {
      const client = await genApiClient();
      return client.tasks_CreateTaskList(list);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskLists'] });
      setNewList({ name: '', description: '' });
    },
  });

  if (authStage === AuthStage.UNAUTHENTICATED) {
    return (
      <div>
        {showRegister ? <Register /> : <Login />}
        <button onClick={() => setShowRegister(!showRegister)}>
          {showRegister ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </div>
    );
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;

  return (
    <div>
    <h1>Task Lists</h1>
    <form onSubmit={(e) => {
  e.preventDefault();
  createListMutation.mutate(newList);
}}>
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

export default HomePage;