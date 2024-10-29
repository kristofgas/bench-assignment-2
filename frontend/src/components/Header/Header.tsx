import React from 'react';
import { useAuthStatus } from '../../hooks/useAuthStatus';
import { toast } from 'react-toastify';
import { FaUserCog, FaFilter, FaTasks, FaUser } from 'react-icons/fa';
import FilterTasks from '../FilterTasks/FilterTasks';

interface HeaderProps {
  onOpenAdminPanel?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAdminPanel}) => {
  const { isAuthenticated, logout, activeUser, isAdmin } = useAuthStatus();
  const [showFilters, setShowFilters] = React.useState(false);

  const handleLogout = () => {
    logout();
    toast.success('You have been logged out successfully');
  };

  return (
    <header className="bg-white shadow fixed top-0 left-0 right-0 z-[100]">
      <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaTasks className="text-blue-500 text-2xl" />
            <span className="text-sm text-gray-500">
              <FaUser className="inline-block mr-1" />
              {activeUser?.username}
            </span>
          </div>
          
          {isAuthenticated && activeUser && (
            <div className="flex items-center space-x-2">
              {isAdmin && (
                <button
                  onClick={onOpenAdminPanel}
                  className="text-indigo-500 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                  title="Admin Panel"
                >
                  <FaUserCog size={20} />
                </button>
              )}
              <button
                onClick={() => setShowFilters(true)}
                className="text-gray-500 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors"
                title="Filters"
              >
                <FaFilter size={20} />
              </button>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <FilterTasks
      isOpen={showFilters}
      onClose={() => setShowFilters(false)}
    />
    </header>
  );
};

export default Header;