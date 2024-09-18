import { useCallback, useState } from "react";
import { genApiClient, setToken } from "services/backend/genApiClient";
import { LoginResult, RegisterUserCommand } from "../backend/client.generated";

export enum AuthStage {
  CHECKING = "CHECKING",
  AUTHENTICATED = "AUTHENTICATED",
  UNAUTHENTICATED = "UNAUTHENTICATED",
}

type AuthHook = {
  authStage: AuthStage;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  activeUser: LoginResult | null;
  checkAuth: () => Promise<void>;
};

export const useAuthContextValue = (): AuthHook => {
  const [authStage, setAuthStage] = useState<AuthStage>(AuthStage.UNAUTHENTICATED);
  const [activeUser, setActiveUser] = useState<LoginResult | null>(null);

  const checkAuth = useCallback(async () => {
    setAuthStage(AuthStage.CHECKING);
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setToken(token);
      setAuthStage(AuthStage.AUTHENTICATED);
    } else {
      setAuthStage(AuthStage.UNAUTHENTICATED);
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const client = await genApiClient();
    try {
      const response = await client.users_Login({ username, password });
      console.log('Login response:', response);
      if (response && response.token) {
        setToken(response.token);
        setActiveUser(response);
        setAuthStage(AuthStage.AUTHENTICATED);
        return true;
      } else {
        console.error('Login failed: No token received');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    const client = await genApiClient();
    try {
      const command: RegisterUserCommand = { username, password };
      await client.users_Register(command);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setToken("");
    localStorage.removeItem('jwtToken');
    setActiveUser(null);
    setAuthStage(AuthStage.UNAUTHENTICATED);
  }, []);

  return { authStage, login, register, logout, activeUser, checkAuth };
};