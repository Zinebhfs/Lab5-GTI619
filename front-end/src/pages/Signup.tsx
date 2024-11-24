import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("residential");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await signup(username, password, role);
      console.log("Inscription réussie :", response);
      setSuccess(true);

      // Redirection après un délai (2 secondes) pour afficher le message de succès
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err: any) {
      console.error("Erreur lors de l'inscription :", err.message);
      setError(err.message);
    }
  };

  return (
    <div
      className="signup-page d-flex align-items-center justify-content-center vh-100 bg-light"
      style={{ padding: "20px" }}
    >
      <div className="card shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h3 className="text-center mb-4">Créer un compte</h3>
          {success ? (
            <div className="alert alert-success">
              Compte créé avec succès ! Redirection vers la connexion...
            </div>
          ) : (
            <form onSubmit={handleSignup}>
              {/* Nom d'utilisateur */}
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

              {/* Mot de passe */}
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

              {/* Type de client */}
              <div className="mb-3">
                <label htmlFor="clientType" className="form-label">
                  Type de client
                </label>
                <select
                  id="clientType"
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="residential">Client Résidentiel</option>
                  <option value="business">Client Business</option>
                </select>
              </div>

              {/* Erreur */}
              {error && <div className="text-danger mb-3">{error}</div>}

              {/* Bouton Créer un compte */}
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn"
                  style={{ backgroundColor: "#6a0dad", color: "white", border: "none" }}
                >
                  Créer un compte
                </button>
              </div>
            </form>
          )}

          <hr className="my-4" />

          {/* Bouton pour retourner à la connexion */}
          <p className="text-center">
            Vous avez déjà un compte ?{" "}
            <button
              onClick={() => navigate("/")}
              className="btn btn-link text-decoration-none text-primary p-0"
            >
              Connectez-vous ici
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
