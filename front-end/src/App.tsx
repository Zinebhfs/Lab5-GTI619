import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import ResidentialDashboard from "./pages/ResidentialDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";
import ChangePassword from "./pages/ChangePassword";

const App = () => {
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  return (
    <Router>
      <RoutesWrapper setCurrentUserRole={setCurrentUserRole} currentUserRole={currentUserRole} />
    </Router>
  );
};

const RoutesWrapper = ({
  setCurrentUserRole,
  currentUserRole,
}: {
  setCurrentUserRole: React.Dispatch<React.SetStateAction<string | null>>;
  currentUserRole: string | null;
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    if (storedRole) {
      setCurrentUserRole(storedRole);
    }

    // Vérifie si la session est expirée
    if (tokenExpiration && new Date(tokenExpiration) < new Date()) {
      localStorage.clear(); // Supprime toutes les données
      alert("Votre session a expiré. Veuillez vous reconnecter.");
      navigate("/"); // Redirige vers la page de connexion
    }
  }, [setCurrentUserRole, navigate]);

  return (
    <Routes>
      {/* Page de connexion */}
      <Route path="/" element={<Login setRole={setCurrentUserRole} />} />
      {/* Page d'inscription */}
      <Route path="/signup" element={<Signup />} />
      {/* Page de changement de mot de passe */}
      <Route path="/change-password" element={<ChangePassword />} />
      {/* Dashboard résidentiel */}
      <Route
        path="/residential-dashboard"
        element={
          <ProtectedRoute userRole={currentUserRole} allowedRoles={["residential"]}>
            <ResidentialDashboard />
          </ProtectedRoute>
        }
      />
      {/* Dashboard business */}
      <Route
        path="/business-dashboard"
        element={
          <ProtectedRoute userRole={currentUserRole} allowedRoles={["business"]}>
            <BusinessDashboard />
          </ProtectedRoute>
        }
      />
      {/* Dashboard admin */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute userRole={currentUserRole} allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
