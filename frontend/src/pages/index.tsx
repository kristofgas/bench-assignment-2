import React, { useState, useEffect } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import { useAuth } from '../services/auth/useAuth';
import { AuthStage } from '../services/auth/useAuthContextValue';
import TaskLists from '../components/TaskLists';
import AdminPanel from '../components/AdminPanel';
import { getRoleFromToken } from '../utils/authUtils';
import { useRouter } from 'next/router';

const HomePage: React.FC = () => {
  const { authStage, token, logout } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      const role = getRoleFromToken(token);
      console.log('User role:', role); // Debugging statement
      setIsAdmin(role === 'Admin');
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };
  
  if (authStage === AuthStage.UNAUTHENTICATED) {
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