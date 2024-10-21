import React, { useState } from 'react';
import { UserDto } from '../../services/backend/types';

interface TaskListShareProps {
  nonAssociatedUsers: UserDto[];
  onShare: (selectedUsers: number[]) => void;
  isSharing: boolean;
  onClose: () => void;
}

const TaskListShare: React.FC<TaskListShareProps> = ({ nonAssociatedUsers, onShare, isSharing, onClose }) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const handleUserSelect = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleShare = () => {
    onShare(selectedUsers);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Share with:</h3>
        <div className="max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded">
          {nonAssociatedUsers.map((user: UserDto) => (
            <div key={user.userId} className="flex items-center space-x-2 p-2 hover:bg-gray-100">
              <input
                type="checkbox"
                id={`user-${user.userId}`}
                checked={selectedUsers.includes(user.userId)}
                onChange={() => handleUserSelect(user.userId)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <label htmlFor={`user-${user.userId}`} className="text-sm cursor-pointer flex-grow">{user.username}</label>
            </div>
          ))}
        </div>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
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
  );
};

export default TaskListShare;