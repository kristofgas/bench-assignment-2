import { useAuth } from '../services/auth/useAuth';

export const useUserRole = () => {
  const { activeUser } = useAuth();

  const isAdmin = activeUser?.roles?.includes('Admin') || false;

  return { isAdmin };
};