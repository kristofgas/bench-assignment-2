import React from 'react';
import { Task } from '../../types/task';
import { FaUser, FaClock } from 'react-icons/fa';

interface SelectedTaskDetailsProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
}

const SelectedTaskDetails: React.FC<SelectedTaskDetailsProps> = ({ task, onClose, onEdit }) => {
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{task.title}</h3>
        <button
          onClick={onEdit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit Task
        </button>
      </div>
      
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-2">Description</h4>
        <p className="text-gray-700 whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
      </div>
      
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
      
      <button
        onClick={onClose}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Close
      </button>
    </div>
  );
};

export default SelectedTaskDetails;