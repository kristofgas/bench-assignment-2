import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { genApiClient } from '../services/backend/genApiClient';
import { TaskDto, TaskListDto } from '../services/backend/types';

interface TaskListProps {
  listId: number;
}

const TaskList: React.FC<TaskListProps> = ({ listId }) => {
  const queryClient = useQueryClient();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const { data: taskList, isLoading, error } = useQuery<TaskListDto>({
    queryKey: ['taskList', listId],
    queryFn: async () => {
      const client = await genApiClient();
      return client.tasks_GetTaskListById(listId); // Ensure this method exists in ApiFetchClient
    }
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery<TaskDto[]>({
    queryKey: ['tasks', listId],
    queryFn: async () => {
      const client = await genApiClient();
      return client.tasks_GetTasksByState(true); // Denne skal kunne tage true og false som argument
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: async (title: string) => {
      const client = await genApiClient();
      return client.tasks_CreateTask({ title, taskListId: listId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', listId] });
      setNewTaskTitle('');
    },
  });

  if (isLoading || tasksLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;

  return (
    <div>
      <h2>{taskList?.name}</h2>
      <ul>
        {tasks?.map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
      <form onSubmit={(e) => {
        e.preventDefault();
        createTaskMutation.mutate(newTaskTitle);
      }}>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task title"
        />
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default TaskList;