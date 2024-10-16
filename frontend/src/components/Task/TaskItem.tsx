import React from 'react';
import { Task } from '../../types/task';
import { FaStar, FaEdit, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getPriorityFromRank } from 'utils/taskUtils';
import SelectedTaskDetails from './SelectedTaskDetails';

interface TaskItemProps {
  task: Task;
  onStatusChange: () => void;
  onEdit: () => void;
  onSelect: () => void;
  isExpanded: boolean;
  onExpand: () => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Low':
      return 'bg-blue-100 text-blue-800';
    case 'Medium':
      return 'bg-green-100 text-green-800';
    case 'High':
      return 'bg-orange-100 text-orange-800';
    case 'Critical':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusChange, onEdit, onSelect, isExpanded, onExpand }) => {
  const priority = getPriorityFromRank(task.rank);
  const priorityColor = getPriorityColor(priority);

  const getSubtleBackgroundColor = (color: string, isCompleted: boolean) => {
    const opacity = isCompleted ? 0.05 : 0.14;
    return `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`;
  };

  const subtleBackgroundColor = getSubtleBackgroundColor(task.color, task.isCompleted);

  return (
    <div className="mb-2 last:mb-0">
      <div 
        className={`rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ease-in-out ${
          task.isCompleted ? 'opacity-60' : ''
        } ${isExpanded ? 'rounded-b-none' : ''}`}
        style={{ backgroundColor: subtleBackgroundColor }}
      >
        <div 
          className="flex items-center p-4 cursor-pointer"
          onClick={onExpand}
        >
          <label className="inline-flex items-center mr-4 cursor-pointer">
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={(e) => { e.stopPropagation(); onStatusChange(); }}
              className="hidden"
            />
            <span className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-colors duration-200 ease-in-out ${
              task.isCompleted 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-300 hover:border-green-500'
            }`}>
              {task.isCompleted && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
          </label>
          <div className="flex-grow">
            <div className="flex items-center">
              <span className={`mr-2 font-medium ${task.isCompleted ? 'text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${priorityColor}`}>
                {priority}
              </span>
              {task.isFavorite && <FaStar className="text-yellow-400 ml-2" size={16} />}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors duration-200"
            >
              <FaEdit size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onExpand(); }}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              {isExpanded ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
            </button>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="rounded-b-lg shadow-sm" style={{ backgroundColor: subtleBackgroundColor }}>
          <SelectedTaskDetails task={task} onClose={onExpand} onEdit={onEdit} />
        </div>
      )}
    </div>
  );
};

export default TaskItem;