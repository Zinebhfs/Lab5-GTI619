import React, { useEffect, useState } from "react";
import { getUsersByRole } from "../services/authService";
import LogoutButton from "../components/LogoutButton";

type User = {
  username: string;
};

const BusinessDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Récupération du nom d'utilisateur connecté depuis localStorage
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsersByRole("business");
        setUsers(users); // Définit la liste des utilisateurs
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container">
      {/* Barre supérieure */}
      <div className="d-flex justify-content-between align-items-center py-3">
        <h1>Bienvenue, {username} 👋</h1>
        <LogoutButton />
      </div>

      {/* Liste des utilisateurs */}
      <div className="mt-4">
        <h2>Liste des clients Business</h2>
        {error && <div className="text-danger">{error}</div>}
        <ul className="list-group mt-4">
          {users.map((user, index) => (
            <li key={index} className="list-group-item">
              {user.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BusinessDashboard;
