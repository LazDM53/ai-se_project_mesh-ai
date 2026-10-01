import { createContext, useContext, useEffect, useState } from "react";
import type { CurrentUser } from "../types";
import { getCurrentUser } from "../utils/api";

type AuthContextType = {
  currentUser: CurrentUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<CurrentUser | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  login: (token: string, user: CurrentUser) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = (token: string, user: CurrentUser) => {
    localStorage.setItem("auth-token", token);
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");

    if (!token) {
      setIsLoading(false);
      return;
    }

    getCurrentUser()
      .then((res) => {
        if (res.data) {
          setCurrentUser(res.data);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        localStorage.removeItem("auth-token");
        setCurrentUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}