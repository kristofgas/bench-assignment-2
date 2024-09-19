import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import { useAuth } from '../services/auth/useAuth';
import { AuthStage } from '../services/auth/useAuthContextValue';
import TaskLists from '../components/TaskLists';

const HomePage: React.FC = () => {
  const { authStage } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

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
      <TaskLists />
    </div>
  );
};

export default HomePage;