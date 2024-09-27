import { useEffect, useState } from 'react';
import { getRoleFromToken } from '../utils/authUtils';

export const useUserRole = (token: string | null) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      const role = getRoleFromToken(token);
      setIsAdmin(role === 'Admin');
    }
  }, [token]);

  return { isAdmin };
};