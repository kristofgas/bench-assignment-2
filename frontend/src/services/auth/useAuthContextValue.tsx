import { useCallback, useEffect, useState } from "react";
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
  token: string | null; // Add this line
};

export const useAuthContextValue = (): AuthHook => {
  const [authStage, setAuthStage] = useState<AuthStage>(AuthStage.UNAUTHENTICATED);
  const [activeUser, setActiveUser] = useState<LoginResult | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    setAuthStage(AuthStage.CHECKING);
    const storedToken = sessionStorage.getItem('jwtToken');
    if (storedToken) {
      setToken(storedToken);
      setTokenState(storedToken);
      setAuthStage(AuthStage.AUTHENTICATED);
    } else {
      setAuthStage(AuthStage.UNAUTHENTICATED);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (username: string, password: string) => {
    const client = await genApiClient();
    try {
      const response = await client.users_Login({ username, password });
      if (response && response.token) {
        setToken(response.token);
        setTokenState(response.token);
        setActiveUser(response);
        setAuthStage(AuthStage.AUTHENTICATED);
        sessionStorage.setItem('jwtToken', response.token);
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
    sessionStorage.removeItem('jwtToken');
    setActiveUser(null);
    setAuthStage(AuthStage.UNAUTHENTICATED);
  }, []);

  return { authStage, login, register, logout, activeUser, checkAuth, token };
};