import { useCallback, useState } from "react";
import { genApiClient, setToken } from "services/backend/genApiClient";

export enum AuthStage {
  CHECKING,
  AUTHENTICATED,
  UNAUTHENTICATED,
}

type AuthHook<T> = {
  authStage: AuthStage;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
  activeUser: T | null;
  checkAuth: () => Promise<void>;
};

// TODO this is a dummy model, implement the correct DTO when auth has been set up
type User = { id: string } | null;

export const useAuthContextValue = (initialUser?: User): AuthHook<User> => {
  const [authStage, setAuthStage] = useState(
    initialUser ? AuthStage.AUTHENTICATED : AuthStage.CHECKING
  );
  const [activeUser, setActiveUser] = useState<User>(initialUser);

  /**
   * This method should fetch the user from the authorization server. The issuer of the token essentially.
   */
  const checkAuth = useCallback(async () => {
    setAuthStage(AuthStage.CHECKING);

    const authClient = await genApiClient();
    // const user: User = await authClient.auth_GetUser().catch(() => null);
    // setActiveUser(user);
    // setAuthStage(user ? AuthStage.AUTHENTICATED : AuthStage.UNAUTHENTICATED);
  }, []);

  const login = useCallback(async (idToken: string) => {
    setToken(idToken);
    return true;
  }, []);

  const logout = useCallback(() => {
    setToken("");
    setActiveUser(null);
    setAuthStage(AuthStage.UNAUTHENTICATED);
  }, []);

  return { authStage, login, logout, activeUser, checkAuth };
};
