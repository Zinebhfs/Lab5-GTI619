import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../services/authService";

const ChangePassword: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState(""); // État pour le mot de passe actuel
  const [newPassword, setNewPassword] = useState(""); // État pour le nouveau mot de passe
  const [confirmPassword, setConfirmPassword] = useState(""); // État pour confirmer le mot de passe
  const [error, setError] = useState<string | null>(null); // État pour afficher les erreurs
  const [success, setSuccess] = useState<string | null>(null); // État pour afficher les succès

  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer le `username` depuis le stockage local
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      // Redirige l'utilisateur si aucun nom d'utilisateur n'est disponible
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      if (!username) throw new Error("Utilisateur non identifié.");

      // Appelle le service pour changer le mot de passe
      await changePassword(username, currentPassword, newPassword); // Ajout de `currentPassword`
      setSuccess("Mot de passe changé avec succès.");
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
            {/* Champ pour le mot de passe actuel */}
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">
                Mot de passe actuel
              </label>
              <input
                type="password"
                id="currentPassword"
                className="form-control"
                placeholder="Entrez votre mot de passe actuel"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            {/* Champ pour le nouveau mot de passe */}
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

            {/* Champ pour confirmer le nouveau mot de passe */}
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

            {/* Bouton de soumission */}
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
