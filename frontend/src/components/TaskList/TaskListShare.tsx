import React, { useState } from 'react';
import { UserDto } from '../../services/backend/types';

interface TaskListShareProps {
  nonAssociatedUsers: UserDto[];
  onShare: () => void;
  isSharing: boolean;
  onUserSelect: (userId: number) => void;
  selectedUsers: number[];
}

const TaskListShare: React.FC<TaskListShareProps> = ({ nonAssociatedUsers, onShare, isSharing, onUserSelect, selectedUsers }) => {
  return (
    <div>
      <select multiple value={selectedUsers.map(String)} onChange={(e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
        selectedOptions.forEach(userId => onUserSelect(userId));
      }}>
        {nonAssociatedUsers?.map((user: UserDto) => (
          <option key={user.userId} value={user.userId}>{user.username}</option>
        ))}
      </select>
      <button onClick={onShare} disabled={isSharing}>
        {isSharing ? 'Sharing...' : 'Share'}
      </button>
    </div>
  );
};

export default TaskListShare;