import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { TaskList } from '../../types/task';
import { UserDto, TaskSummaryDto } from '../../services/backend/types';
import { FaShare, FaPlus, FaTrash, FaClipboardList, FaEllipsisV, FaUserPlus } from 'react-icons/fa';

interface TaskListHeaderProps {
  taskList: TaskList;
  associatedUsers?: UserDto[];
  nonAssociatedUsers?: UserDto[];
  taskSummary?: TaskSummaryDto;
  onClearCompletedTasks: () => void;
  onShare: (selectedUsers: number[]) => void;
  isSharing: boolean;
  onAddNewTask: () => void;
  onCollapse: () => void;
}

const TaskListHeader: React.FC<TaskListHeaderProps> = React.memo(({
  taskList,
  associatedUsers,
  nonAssociatedUsers,
  taskSummary,
  onClearCompletedTasks,
  onShare,
  isSharing,
  onAddNewTask,
  onCollapse
}) => {
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowShareDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleShare = useCallback(() => {
    onShare(selectedUsers);
    setShowShareDropdown(false);
    setSelectedUsers([]);
  }, [onShare, selectedUsers]);

  const toggleUserSelection = useCallback((userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  }, []);

  const memoizedAssociatedUsers = useMemo(() => {
    if (!associatedUsers || associatedUsers.length === 0) return null;

    return (
      <div className="flex items-center">
        <span className="text-sm text-gray-600 mr-2">Shared with:</span>
        <div className="flex -space-x-2">
          {associatedUsers.slice(0, 3).map(user => (
            <img
              key={user.userId}
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
              src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
              alt={user.username}
              title={user.username}
            />
          ))}
          {associatedUsers.length > 3 && (
            <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-xs font-medium text-gray-600">
              +{associatedUsers.length - 3}
            </div>
          )}
        </div>
        <button
          onClick={() => setShowShareDropdown(!showShareDropdown)}
          className="ml-2 text-blue-500 hover:text-blue-600"
          title="Add more users"
        >
          <FaUserPlus size={16} />
        </button>
      </div>
    );
  }, [associatedUsers, showShareDropdown]);

  const memoizedNonAssociatedUsers = useMemo(() => {
    return nonAssociatedUsers?.map((user) => (
      <li key={user.userId} className="flex items-center space-x-2 mb-2">
        <input
          type="checkbox"
          id={`user-${user.userId}`}
          checked={selectedUsers.includes(user.userId)}
          onChange={() => toggleUserSelection(user.userId)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
        <label htmlFor={`user-${user.userId}`} className="text-sm">{user.username}</label>
      </li>
    ));
  }, [nonAssociatedUsers, selectedUsers, toggleUserSelection]);

  return (
    <div className="bg-white rounded-t-lg overflow-visible mb-0 shadow-sm">
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div className="flex-grow w-full sm:w-3/4 pr-4">
  <div 
    onClick={onCollapse}
    className="cursor-pointer hover:opacity-80 transition-opacity duration-200 inline-block"
  >
    <h2 className="text-3xl font-bold text-gray-800 mb-2">{taskList.name}</h2>
    {taskList.description && (
      <p className="text-gray-500 text-sm leading-relaxed break-words">
        {taskList.description}
      </p>
    )}
  </div>
</div>
        <div className="flex-shrink-0 mt-4 sm:mt-0">
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              onClick={() => setShowShareDropdown(!showShareDropdown)}
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
              title="Share Task List"
            >
              <FaShare className="mr-2 inline-block" /> Share
            </button>
            {showShareDropdown && (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
    <div className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Share with:</h3>
        <button
          onClick={() => setShowShareDropdown(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded">
        {memoizedNonAssociatedUsers}
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setShowShareDropdown(false)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleShare}
          disabled={isSharing || selectedUsers.length === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSharing ? 'Sharing...' : 'Share'}
        </button>
      </div>
    </div>
  </div>
)}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={onAddNewTask}
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-200"
            title="Add New Task"
          >
            <FaPlus className="mr-2 inline-block" /> Add Task
          </button>
          {taskSummary && (
            <div className="flex items-center space-x-2">
              <FaClipboardList className="text-gray-600" size={16} />
              <span className="text-sm font-medium">
                {taskSummary.completedTasks} / {taskSummary.totalTasks} completed
              </span>
              {taskSummary.completedTasks > 0 && (
                <button
                  onClick={onClearCompletedTasks}
                  className="text-red-600 hover:text-red-700 text-sm font-medium ml-2"
                  title="Clear Completed Tasks"
                >
                  Clear completed
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {memoizedAssociatedUsers}
        </div>
      </div>
    </div>
  </div>
);
});

export default TaskListHeader;