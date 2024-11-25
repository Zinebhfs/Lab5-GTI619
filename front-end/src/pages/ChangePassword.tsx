import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { changePassword } from "../services/authService";

const ChangePassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username; // Récupère le nom d'utilisateur depuis la navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      // Appelle le service pour changer le mot de passe
      await changePassword(username, newPassword);
      setSuccess("Mot de passe changé avec succès. Vous allez être redirigé vers la connexion.");
      setTimeout(() => navigate("/"), 3000); // Redirige vers la page de connexion après 3 secondes
    } catch (error: any) {
      setError(error.response?.data?.error || "Une erreur s'est produite.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h3 className="text-center mb-4">Changer votre mot de passe</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                id="newPassword"
                className="form-control"
                placeholder="Entrez votre nouveau mot de passe"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmez le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control"
                placeholder="Confirmez votre nouveau mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Changer le mot de passe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
