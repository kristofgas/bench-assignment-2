import React, { useState } from 'react';
import { useAdminOperations } from '../hooks/useAdminOperations';

const AdminPanel: React.FC = () => {
  const { users, isUsersLoading, usersError, deleteUser } = useAdminOperations();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleDeleteUser = () => {
    if (selectedUserId !== null) {
      deleteUser.mutate(selectedUserId);
    }
  };

  if (isUsersLoading) return <div>Loading users...</div>;
  if (usersError) return <div>Error loading users: {usersError.toString()}</div>;

  return (
    <div>
      <h2>Admin Panel</h2>
      <select onChange={(e) => setSelectedUserId(Number(e.target.value))} value={selectedUserId ?? ''}>
        <option value="" disabled>Select a user to delete</option>
        {users?.map(user => (
          <option key={user.userId} value={user.userId}>{user.username}</option>
        ))}
      </select>
      <button onClick={handleDeleteUser} disabled={selectedUserId === null}>
        Delete User
      </button>
    </div>
  );
};

export default AdminPanel;