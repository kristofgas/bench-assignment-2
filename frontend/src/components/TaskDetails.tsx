import React, { useCallback, useState, useEffect } from 'react';
import { Task, UpdateTaskDetails } from '../types/task';
import { priorityOptions, colorOptions, getPriorityFromRank, getRankValue, Color, Priority } from '../utils/taskUtils';

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onUpdate: (updatedTask: UpdateTaskDetails) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    rank: getPriorityFromRank(task.rank),
    color: task.color,
    isFavorite: task.isFavorite
  });

  useEffect(() => {
    setFormData({
      title: task.title,
      description: task.description,
      rank: getPriorityFromRank(task.rank),
      color: task.color,
      isFavorite: task.isFavorite
    });
  }, [task]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  }, []);
  
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      id: task.id,
      ...formData,
      rank: getRankValue(formData.rank as Priority),
    });
  }, [formData, task.id, onUpdate]);

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
      <div>
        <p>Created by: {task.createdBy}</p>
        <p>Last modified: {task.lastModified}</p>
        <p>Last modified by: {task.lastModifiedBy}</p>
      </div>
    </div>
  );
};

export default TaskDetails;