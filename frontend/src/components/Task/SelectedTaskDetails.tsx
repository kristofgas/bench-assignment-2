import React from 'react';
import { Task } from '../../types/task';

interface SelectedTaskDetailsProps {
  task: Task;
  onClose: () => void;
}

const SelectedTaskDetails: React.FC<SelectedTaskDetailsProps> = ({ task, onClose }) => {
  return (
    <div>
      <h3>Task Details</h3>
      <p>Title: {task.title}</p>
      <p>Description: {task.description}</p>
      <p>Priority: {task.rank}</p>
      <p>Color: {task.color}</p>
      <p>Favorite: {task.isFavorite ? 'Yes' : 'No'}</p>
      <p>Created by: {task.createdBy}</p>
      <p>Last modified: {task.lastModified}</p>
      <p>Last modified by: {task.lastModifiedBy}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default SelectedTaskDetails;