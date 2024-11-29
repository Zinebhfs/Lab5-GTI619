import React, { createContext, useContext, useState, useEffect } from "react";

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
    const role = localStorage.getItem("userRole");
    const storedUsername = localStorage.getItem("username");

    if (token && role && storedUsername) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUsername(storedUsername);
    }
  }, []);

  const login = (token: string, role: string, username: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("username", username);
    setIsAuthenticated(true);
    setUserRole(role);
    setUsername(username);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserRole(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
