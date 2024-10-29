import React, { useState, useEffect } from 'react';
import { useAuthStatus } from '../hooks/useAuthStatus';
import AuthPage from '../components/Auth/AuthPage';
import TaskLists from '../components/TaskLists/TaskLists';
import Header from '../components/Header/Header';
import AdminPanel from 'components/AdminPanel/AdminPanel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage: React.FC = () => {
  const { isAuthenticated, isAdmin, checkAuthStatus } = useAuthStatus();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const intervalId = setInterval(() => {
        checkAuthStatus();
      }, 60000);
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, checkAuthStatus]);

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {isAuthenticated ? (
        <>
          <Header 
            onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
          />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {isAdmin && (
              <AdminPanel 
                isOpen={isAdminPanelOpen}
                onClose={() => setIsAdminPanelOpen(false)}
              />
            )}
            <TaskLists/>
          </main>
        </>
      ) : (
        <AuthPage />
      )}
    </div>
  );
};

export default HomePage;