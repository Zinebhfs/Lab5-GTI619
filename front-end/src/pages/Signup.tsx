
const Signup = () => {
  return (
    <div
      className="signup-page d-flex align-items-center justify-content-center vh-100 bg-light"
      style={{ padding: "20px" }}
    >
      <div className="card shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h3 className="text-center mb-4">Créer un compte</h3>
          <form>
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
                required
              />
            </div>

            {/* Type de client */}
            <div className="mb-3">
              <label htmlFor="clientType" className="form-label">
                Type de client
              </label>
              <select id="clientType" className="form-select" required>
                <option value="residential">Client Résidentiel</option>
                <option value="business">Client Business</option>
              </select>
            </div>

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

          <hr className="my-4" />

          {/* Lien pour retourner à la connexion */}
          <p className="text-center">
            Vous avez déjà un compte ?{" "}
            <a href="/" className="text-decoration-none text-primary">
              Connectez-vous ici
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
