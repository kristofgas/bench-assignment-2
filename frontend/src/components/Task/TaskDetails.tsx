import React, { useCallback, useState, useEffect } from 'react';
import { Task, UpdateTaskDetails } from '../../types/task';
import { priorityOptions, colorOptions, getPriorityFromRank, getRankValue, Color, Priority } from '../../utils/taskUtils';
import { FaUser, FaClock, FaStar } from 'react-icons/fa';

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-semibold mb-6">Edit Task</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="rank" className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              id="rank"
              name="rank"
              value={formData.rank}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
            <input
              id="color"
              name="color"
              type="color"
              value={formData.color}
              onChange={handleInputChange}
              className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div className="flex items-center">
          <input
            id="isFavorite"
            name="isFavorite"
            type="checkbox"
            checked={formData.isFavorite}
            onChange={handleInputChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isFavorite" className="ml-2 block text-sm text-gray-900">
            Mark as favorite
          </label>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-medium mb-2">Task Information</h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <FaUser className="mr-2 text-blue-500" />
            <span>Created by: {task.createdBy}</span>
          </div>
          <div className="flex items-center">
            <FaClock className="mr-2 text-green-500" />
            <span>Last modified: {formatDate(task.lastModified)}</span>
          </div>
          <div className="flex items-center">
            <FaUser className="mr-2 text-purple-500" />
            <span>Last modified by: {task.lastModifiedBy}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;