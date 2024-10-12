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
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Share with:</h3>
      <ul className="max-h-48 overflow-y-auto mb-4">
        {nonAssociatedUsers.map((user: UserDto) => (
          <li key={user.userId} className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              id={`user-${user.userId}`}
              checked={selectedUsers.includes(user.userId)}
              onChange={() => handleUserSelect(user.userId)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <label htmlFor={`user-${user.userId}`} className="text-sm">{user.username}</label>
          </li>
        ))}
      </ul>
      <div className="flex justify-end space-x-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
        <button onClick={handleShare} disabled={isSharing || selectedUsers.length === 0} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
          {isSharing ? 'Sharing...' : 'Share'}
        </button>
      </div>
    </div>
  );
};

export default TaskListShare;