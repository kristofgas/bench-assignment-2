import React from 'react';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { toast } from 'react-toastify';
import { FaUserCog } from 'react-icons/fa';

interface HeaderProps {
  onOpenAdminPanel?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAdminPanel }) => {
  const { isAuthenticated, logout, activeUser, isAdmin } = useAuthStatus();

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out successfully');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Task Management App</h1>
        {isAuthenticated && activeUser && (
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <button
                onClick={onOpenAdminPanel}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
              >
                <FaUserCog />
                <span>Admin Panel</span>
              </button>
            )}
            <p className="text-gray-600">Welcome, {activeUser.username}!</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;