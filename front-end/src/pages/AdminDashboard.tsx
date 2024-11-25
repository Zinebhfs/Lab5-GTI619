import React, { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import { getUsersByRole, getSecuritySettings, updateSecuritySettings, SecuritySettings } from "../services/authService";

type User = {
  username: string; // Typage pour les utilisateurs
};

const AdminDashboard: React.FC = () => {
  const [residentialUsers, setResidentialUsers] = useState<User[]>([]); // Liste des clients résidentiels
  const [businessUsers, setBusinessUsers] = useState<User[]>([]); // Liste des clients business
  const [settings, setSettings] = useState<SecuritySettings | null>(null); // Paramètres de sécurité
  const [error, setError] = useState<string | null>(null); // Gestion des erreurs

  // Récupérer les utilisateurs par rôle et les paramètres de sécurité
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupération des utilisateurs
        const residential = await getUsersByRole("residential");
        setResidentialUsers(residential);

        const business = await getUsersByRole("business");
        setBusinessUsers(business);

        // Récupération des paramètres de sécurité
        const securitySettings = await getSecuritySettings();
        setSettings(securitySettings);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  // Gestion de la mise à jour des paramètres de sécurité
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      await updateSecuritySettings(settings);
      alert("Paramètres mis à jour avec succès !");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleInputChange = (field: keyof SecuritySettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  return (
    <div className="container">
      {/* Barre supérieure */}
      <div className="d-flex justify-content-between align-items-center py-3">
        <h1>Tableau de bord Administrateurs</h1>
        <LogoutButton />
      </div>

      {/* Gestion des erreurs */}
      {error && <div className="text-danger">{error}</div>}

      {/* Affichage des listes des utilisateurs */}
      <div className="row mt-4">
        <div className="col-md-6">
          <h2 className="text-center">Clients Business</h2>
          <ul className="list-group">
            {businessUsers.map((user, index) => (
              <li key={index} className="list-group-item">
                {user.username}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-6">
          <h2 className="text-center">Clients Résidentiels</h2>
          <ul className="list-group">
            {residentialUsers.map((user, index) => (
              <li key={index} className="list-group-item">
                {user.username}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Formulaire de mise à jour des paramètres de sécurité */}
      {settings && (
        <form className="mt-5" onSubmit={handleUpdate}>
          <h2>Paramètres de Sécurité</h2>

          {/* Complexité des mots de passe */}
          <div className="mb-3">
            <label>Complexité des mots de passe :</label>
            <select
              className="form-select"
              value={settings.password_complexity}
              onChange={(e) => handleInputChange("password_complexity", e.target.value)}
            >
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Élevée</option>
            </select>
          </div>

          {/* Durée de session */}
          <div className="mb-3">
            <label>Durée de session (minutes) :</label>
            <input
              type="number"
              className="form-control"
              value={settings.session_duration}
              onChange={(e) => handleInputChange("session_duration", parseInt(e.target.value, 10))}
            />
          </div>

          {/* Nombre de tentatives d'authentification */}
          <div className="mb-3">
            <label>Nombre maximal de tentatives d'authentification :</label>
            <input
              type="number"
              className="form-control"
              value={settings.max_login_attempts}
              onChange={(e) => handleInputChange("max_login_attempts", parseInt(e.target.value, 10))}
            />
          </div>

          {/* Durée de blocage */}
          <div className="mb-3">
            <label>Durée de blocage après échec (minutes) :</label>
            <input
              type="number"
              className="form-control"
              value={settings.lockout_duration}
              onChange={(e) => handleInputChange("lockout_duration", parseInt(e.target.value, 10))}
            />
          </div>

          {/* Forcer le changement de mot de passe */}
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="forcePasswordChange"
              checked={settings.force_password_change}
              onChange={(e) => handleInputChange("force_password_change", e.target.checked)}
            />
            <label className="form-check-label" htmlFor="forcePasswordChange">
              Forcer le changement de mot de passe
            </label>
          </div>

          <button type="submit" className="btn btn-primary">
            Mettre à jour
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminDashboard;
