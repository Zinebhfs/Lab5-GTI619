import React from "react";
import { useAuth } from "../contexts/AuthContext";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Déclenche la déconnexion
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Se déconnecter
    </button>
  );
};

export default LogoutButton;
