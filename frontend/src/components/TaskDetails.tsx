import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { genApiClient } from '../services/backend/genApiClient';
import { TaskDto, UpdateTaskDetailsCommand } from '../services/backend/types';

interface TaskDetailsProps {
  task: TaskDto;
  onClose: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onClose }) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [rank, setRank] = useState(task.rank || 0);
  const [color, setColor] = useState(task.color || '');
  const [isFavorite, setIsFavorite] = useState(task.isFavorite || false);

  const updateTaskMutation = useMutation({
    mutationFn: async (updatedTask: UpdateTaskDetailsCommand) => {
      const client = await genApiClient();
      return client.tasks_UpdateTaskDetails(task.id!, updatedTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', task.taskListId] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTaskMutation.mutate({
      id: task.id,
      rank,
      color,
      isFavorite,
    });
  };

  return (
    <div className="task-details">
      <h3>Task Details</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="rank">Rank:</label>
          <input
            id="rank"
            type="number"
            value={rank}
            onChange={(e) => setRank(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="color">Color:</label>
          <input
            id="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="favorite">Favorite:</label>
          <input
            id="favorite"
            type="checkbox"
            checked={isFavorite}
            onChange={(e) => setIsFavorite(e.target.checked)}
          />
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
};

export default TaskDetails;