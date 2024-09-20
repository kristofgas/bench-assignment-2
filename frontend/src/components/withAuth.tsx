import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../services/auth/useAuth';
import { AuthStage } from '../services/auth/useAuthContextValue';

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const { authStage, checkAuth } = useAuth();
    const router = useRouter();

    useEffect(() => {
      checkAuth();
    }, [checkAuth]);

    if (authStage === AuthStage.CHECKING) {
      return <div>Loading...</div>;
    }

    if (authStage === AuthStage.UNAUTHENTICATED) {
      router.push('/login');
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}