

const Login = () => {
  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 bg-light"
      style={{ padding: "20px" }}
    >
      <div className="card shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h3 className="text-center mb-4">Connexion</h3>
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

            {/* Bouton Se connecter */}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Se connecter
              </button>
            </div>
          </form>

          <hr className="my-4" />

          {/* Lien pour s'inscrire */}
          <p className="text-center">
            Pas encore de compte ?{" "}
            <a href="#" className="text-decoration-none text-primary">
              Inscrivez-vous ici
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
