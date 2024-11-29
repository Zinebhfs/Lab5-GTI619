import React, { createContext, useContext, useEffect, useState } from "react";
import { verifyToken } from "../services/authService";

type AuthContextType = {
  isAuthenticated: boolean;
  userRole: string | null;
  username: string | null;
  login: (token: string, role: string, username: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  username: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      verifyToken(token)
        .then((data) => {
          if (data.valid) {
            setIsAuthenticated(true);
            setUserRole(data.role);
            setUsername(data.username);
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        });
    }
  }, []);

  const login = (token: string, role: string, username: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    setUserRole(role);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername(null);
    window.location.href = "/"; // Force une redirection complète
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
