import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const [username, setUsername] = useState(""); // État pour le nom d'utilisateur
  const [password, setPassword] = useState(""); // État pour le mot de passe
  const [error, setError] = useState<string | null>(null); // État pour les erreurs
  const [isLoading, setIsLoading] = useState(false); // État pour le chargement

  const { login: loginContext } = useAuth(); // Utilise le contexte pour gérer l'authentification
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await login(username, password); // Appelle le service d'authentification

      // Stocke les informations utilisateur (token et rôle) dans le contexte
      loginContext(user.token, user.role, username);

      // Navigation selon le rôle
      if (user.role === "business") {
        navigate("/business-dashboard");
      } else if (user.role === "residential") {
        navigate("/residential-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      }
    } catch (error: any) {
      if (error.message === "force_password_change") {
        navigate("/change-password", { state: { username } }); // Redirige si le changement de mot de passe est requis
      } else {
        setError(error.message); // Affiche les autres erreurs
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h3 className="text-center mb-4">Connexion</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="Entrez votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="text-danger mb-3">{error}</div>}
            <div className="d-grid">
              <button
                type="submit"
                className="btn"
                style={{ backgroundColor: "#6a0dad", color: "white", border: "none" }}
                disabled={isLoading} // Désactive le bouton pendant le chargement
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </div>
          </form>
          <hr className="my-4" />
          {/* Lien pour s'inscrire */}
          <p className="text-center">
            Pas encore de compte ?{" "}
            <span
              className="text-primary text-decoration-underline"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/signup")}
            >
              Inscrivez-vous ici
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
