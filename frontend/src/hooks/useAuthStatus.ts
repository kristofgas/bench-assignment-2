import { useEffect, useState } from 'react';
import { useAuth } from '../services/auth/useAuth';
import { AuthStage } from '../services/auth/useAuthContextValue';

export const useAuthStatus = () => {
  const { authStage, token, logout } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authStage !== AuthStage.UNAUTHENTICATED);
  }, [authStage]);

  return { isAuthenticated, token, logout, authStage };
};