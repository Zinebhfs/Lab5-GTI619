import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Supprime le rôle utilisateur
    navigate("/"); // Redirige vers la page de co
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Se déconnecter
    </button>
  );
};

export default LogoutButton;
