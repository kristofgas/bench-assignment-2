import React, { useState } from 'react';
import { UserDto } from '../services/backend/types';

interface TaskListShareProps {
  nonAssociatedUsers: UserDto[];
  onShare: (userIds: number[]) => void;
  isSharing: boolean;
}

const TaskListShare: React.FC<TaskListShareProps> = ({ nonAssociatedUsers, onShare, isSharing }) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const handleUserSelect = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleShareSubmit = () => {
    onShare(selectedUsers);
  };

  return (
    <div>
      <select multiple value={selectedUsers.map(String)} onChange={(e) => setSelectedUsers(Array.from(e.target.selectedOptions, option => Number(option.value)))}>
        {nonAssociatedUsers?.map((user: UserDto) => (
          <option key={user.userId} value={user.userId}>{user.username}</option>
        ))}
      </select>
      <button onClick={handleShareSubmit} disabled={isSharing}>
        {isSharing ? 'Sharing...' : 'Share'}
      </button>
    </div>
  );
};

export default TaskListShare;