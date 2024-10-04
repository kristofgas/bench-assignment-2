import React from 'react';
import { Task } from '../types/task';

interface TaskListDetailsViewProps {
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
}

const TaskListDetailsView: React.FC<TaskListDetailsViewProps> = ({ selectedTask, setSelectedTask }) => {
  if (!selectedTask) return null;

  return (
    <div>
      <h3>Task Details</h3>
      <p>Title: {selectedTask.title}</p>
      <p>Description: {selectedTask.description}</p>
      <p>Priority: {selectedTask.rank}</p>
      <p>Color: {selectedTask.color}</p>
      <p>Favorite: {selectedTask.isFavorite ? 'Yes' : 'No'}</p>
      <p>Created by: {selectedTask.createdBy}</p>
      <p>Last modified: {selectedTask.lastModified}</p>
      <p>Last modified by: {selectedTask.lastModifiedBy}</p>
      <button onClick={() => setSelectedTask(null)}>Close</button>
    </div>
  );
};

export default TaskListDetailsView;