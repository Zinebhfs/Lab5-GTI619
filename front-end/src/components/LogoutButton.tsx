import React from "react";
import { useAuth } from "../contexts/AuthContext";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // Déclenche la déconnexion
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Se déconnecter
    </button>
  );
};

export default LogoutButton;
