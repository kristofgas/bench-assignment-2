import { useAuth } from '../services/auth/useAuth';
import { AuthStage } from '../services/auth/useAuthContextValue';
import { showSessionExpirationNotification } from '../components/SessionExpirationNotification';

export const useAuthStatus = () => {
  const { authStage, token, logout, activeUser, checkTokenValidity } = useAuth();
  
  const isAuthenticated = authStage === AuthStage.AUTHENTICATED;
  const isAdmin = activeUser?.roles?.includes('Admin') || false;
  const roles = activeUser?.roles || [];

  const checkAuthStatus = async () => {
    const isValid = await checkTokenValidity();
    if (!isValid) {
      showSessionExpirationNotification();
    }
  };

  return { isAuthenticated, isAdmin, token, logout, authStage, roles, activeUser, checkAuthStatus };
};