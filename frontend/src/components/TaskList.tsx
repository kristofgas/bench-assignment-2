import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { genApiClient } from '../services/backend/genApiClient';
import { TaskDto, TaskListDto } from '../services/backend/types';
import FilterTasks, { TaskFilters } from './FilterTasks';
import TaskDetails from './TaskDetails';

interface TaskListProps {
  listId: number;
}

const TaskList: React.FC<TaskListProps> = ({ listId }) => {
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState({ title: '', description: '', rank: 'Low', color: '#FF0000' });
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [filters, setFilters] = useState<TaskFilters>({ isCompleted: null, isFavorite: null, sortDescending: false });
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

  const { data: taskList, isLoading, error } = useQuery<TaskListDto>({
    queryKey: ['taskList', listId],
    queryFn: async () => {
      const client = await genApiClient();
      return client.tasks_GetTaskList(listId);
    }
  });

  const { data: tasks, isLoading: tasksLoading } = useQuery<TaskDto[]>({
    queryKey: ['tasks', listId, filters],
    queryFn: async () => {
      const client = await genApiClient();
      return client.tasks_GetTasksByState(
        filters.isCompleted,
        filters.isFavorite,
        filters.sortBy,
        filters.sortDescending,
        listId
      );
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: async (task: { title: string; description: string; rank: string; color: string }) => {
      const client = await genApiClient();
      return client.tasks_CreateTask({
        title: task.title,
        description: task.description,
        rank: getRankValue(task.rank),
        color: task.color,
        taskListId: listId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', listId] });
      setNewTask({ title: '', description: '', rank: 'Low', color: '#FF0000' });
      setShowNewTaskForm(false);
    },
  });
  
  const getRankValue = (priority: string): number => {
    switch (priority) {
      case 'Low': return 0;
      case 'Medium': return 1;
      case 'High': return 2;
      case 'Critical': return 3;
      default: return 0;
    }
  };

  const toggleTaskStatus = useMutation({
    mutationFn: async (taskId: number) => {
      const client = await genApiClient();
      const task = tasks?.find(t => t.id === taskId);
      return client.tasks_UpdateTaskStatus(taskId, { id: taskId, isCompleted: !task?.isCompleted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', listId] });
    },
  });

  const handleFilterChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  const handleTaskClick = (task: TaskDto) => {
    setSelectedTask(task);
  };

  if (isLoading || tasksLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;

  return (
    <div>
      <h2>{taskList?.name}</h2>
      <FilterTasks onFilterChange={handleFilterChange} />
      <ul>
        {tasks?.map(task => (
          <li key={task.id} onClick={() => handleTaskClick(task)}>
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => toggleTaskStatus.mutate(task.id)}
              onClick={(e) => e.stopPropagation()}
            />
            {task.title}
            {task.isFavorite && ' ⭐'}
          </li>
        ))}
      </ul>
      {!showNewTaskForm ? (
  <button onClick={() => setShowNewTaskForm(true)}>Add New Task</button>
) : (
  <form onSubmit={(e) => {
    e.preventDefault();
    createTaskMutation.mutate(newTask);
  }}>
    <input
      type="text"
      value={newTask.title}
      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
      placeholder="Task title"
      required
    />
    <textarea
      value={newTask.description}
      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
      placeholder="Task description"
      required
    />
    <select
      value={newTask.rank}
      onChange={(e) => setNewTask({...newTask, rank: e.target.value})}
    >
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
      <option value="Critical">Critical</option>
    </select>
    <select
      value={newTask.color}
      onChange={(e) => setNewTask({...newTask, color: e.target.value})}
    >
      <option value="#FF0000">Red</option>
      <option value="#00FF00">Green</option>
      <option value="#0000FF">Blue</option>
      <option value="#FFFF00">Yellow</option>
    </select>
    <button type="submit">Add Task</button>
    <button type="button" onClick={() => setShowNewTaskForm(false)}>Cancel</button>
  </form>
)}
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default TaskList;