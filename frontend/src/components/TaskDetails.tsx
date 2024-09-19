import React, { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { genApiClient } from '../services/backend/genApiClient';
import { Task, UpdateTaskDetails } from '../types/task';
import { priorityOptions, colorOptions, getPriorityFromRank, getRankValue, Color, Priority } from '../utils/taskUtils';

interface TaskDetailsProps {
    task: Task;
    onClose: () => void;
  }

  const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onClose }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
      title: task.title,
      description: task.description,
      rank: getPriorityFromRank(task.rank),
      color: task.color,
      isFavorite: task.isFavorite
    });
  
    const updateTaskMutation = useMutation({
      mutationFn: async (updatedTask: UpdateTaskDetails) => {
        const client = await genApiClient();
        return client.tasks_UpdateTaskDetails(task.id, updatedTask);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks', task.taskListId] });
        onClose();
      },
      onError: (error) => {
        console.error('Failed to update task:', error);
        // You might want to show an error message to the user here
      },
    });
  
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
      }, []);

      const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        updateTaskMutation.mutate({
          id: task.id,
          ...formData,
          rank: getRankValue(formData.rank as Priority),
        });
      }, [formData, task.id, updateTaskMutation]);
  
    return (
      <div className="task-details">
        <h3>Task Details</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="rank">Rank:</label>
            <select
              id="rank"
              name="rank"
              value={formData.rank}
              onChange={handleInputChange}
            >
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="color">Color:</label>
            <input
              id="color"
              name="color"
              type="color"
              value={formData.color}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="isFavorite">Favorite:</label>
            <input
              id="isFavorite"
              name="isFavorite"
              type="checkbox"
              checked={formData.isFavorite}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    );
  };

export default TaskDetails;