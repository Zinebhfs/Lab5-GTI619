import React from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  userRole: string | null;
  allowedRoles: string[];
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ userRole, allowedRoles, children }) => {
  if (!userRole) {
    // Si aucun rôle n'est défini, redirige vers la connexion
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Si le rôle n'est pas autorisé, redirige vers la connexion
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
