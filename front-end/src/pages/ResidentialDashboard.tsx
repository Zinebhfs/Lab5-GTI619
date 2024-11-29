import React, { useEffect, useState } from "react";
import { getUsersByRole } from "../services/authService";
import LogoutButton from "../components/LogoutButton";
import { useNavigate } from "react-router-dom";

type User = {
  username: string;
};

const ResidentialDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer le nom d'utilisateur depuis le localStorage au chargement

    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);

    const fetchUsers = async () => {
      try {
        const residentialUsers = await getUsersByRole("residential");
        setUsers(residentialUsers);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);


  const handleChangePassword = () => {
    if (username) {
      console.log("Navigating to change-password page with username:", username);
      navigate("/change-password", { state: { username } });
    } else {
      console.error("Username is null. Cannot navigate to change-password.");
    }
  };

  return (
    <div className="container">
      {/* Barre supérieure */}
      <div className="d-flex justify-content-between align-items-center py-3">
        <h1>Bienvenue, {username || "Utilisateur"} 👋</h1>
        <div>
            <button className="btn btn-secondary me-2" onClick={handleChangePassword}>
            Changer mon mot de passe
            </button>
            <LogoutButton />
        </div>
        </div>

      {/* Liste des utilisateurs */}
      <div className="mt-4">
        <h2>Liste des clients Résidentiels</h2>
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

export default ResidentialDashboard;
