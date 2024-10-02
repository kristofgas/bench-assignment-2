import React, { useState } from 'react';
import Login from '../components/Auth/Login';
import TaskLists from '../components/TaskLists/TaskLists';
import { useRouter } from 'next/router';
import { useAuthStatus } from '../hooks/useAuthStatus';
import Register from 'components/Auth/Register';
import AdminPanel from 'components/AdminPanel/AdminPanel';

const HomePage: React.FC = () => {
  const { isAuthenticated, isAdmin, logout } = useAuthStatus();
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div>
        {showRegister ? <Register /> : <Login />}
        <button onClick={() => setShowRegister(!showRegister)}>
          {showRegister ? 'Switch to Login' : 'Switch to Register'}
        </button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      {isAdmin && <AdminPanel />}
      <TaskLists />
    </div>
  );
};

export default HomePage;