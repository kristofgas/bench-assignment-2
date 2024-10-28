import { useAdminOperations } from 'hooks/useAdminOperations';
import React, { useState } from 'react';
import { FaUserCog, FaTrash, FaSearch, FaTimes, FaUserShield } from 'react-icons/fa';
import { UserDto } from 'services/backend/types';
import { toast } from 'react-toastify';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { users, isUsersLoading, usersError, deleteUser } = useAdminOperations();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  if (!isOpen) return null;

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUser.mutate(userId, {
        onSuccess: () => {
          toast.success('User deleted successfully');
          setSelectedUsers(prev => prev.filter(id => id !== userId));
        },
        onError: () => {
          toast.error('Failed to delete user');
        }
      });
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`)) {
      for (const userId of selectedUsers) {
        deleteUser.mutate(userId);
      }
      setSelectedUsers([]);
      toast.success('Selected users deleted successfully');
    }
  };

  const filteredUsers = users?.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative mx-auto my-8 max-w-6xl bg-white rounded-lg shadow-xl">
        <div className="absolute top-4 right-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close panel"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-center mb-6">
            <FaUserShield className="text-indigo-600 text-3xl mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
              <p className="text-gray-600">Manage users and system settings</p>
            </div>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-64"
              />
            </div>
            {selectedUsers.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors flex items-center"
              >
                <FaTrash className="mr-2" />
                Delete Selected ({selectedUsers.length})
              </button>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            {isUsersLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              </div>
            ) : usersError ? (
              <div className="p-4 text-red-500">
                Error loading users: {usersError.toString()}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === users?.length}
                        onChange={(e) => {
                          setSelectedUsers(e.target.checked ? (users?.map(u => u.userId!) || []) : []);
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers?.map((user) => (
                    <tr key={user.userId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.userId!)}
                          onChange={(e) => {
                            setSelectedUsers(prev => 
                              e.target.checked 
                                ? [...prev, user.userId!]
                                : prev.filter(id => id !== user.userId)
                            );
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.userId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <FaUserCog className="text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDeleteUser(user.userId!)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;