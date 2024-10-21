import { useAuth } from '../services/auth/useAuth';
import { AuthStage } from '../services/auth/useAuthContextValue';

export const useAuthStatus = () => {
  const { authStage, token, logout, activeUser } = useAuth();
  
  const isAuthenticated = authStage === AuthStage.AUTHENTICATED;
  const isAdmin = activeUser?.roles?.includes('Admin') || false;
  const roles = activeUser?.roles || [];

  return { isAuthenticated, isAdmin, token, logout, authStage, roles, activeUser };
};