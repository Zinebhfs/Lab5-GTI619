import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ResidentialDashboard from "./pages/ResidentialDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";
import ChangePassword from "./pages/ChangePassword";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <RoutesWrapper />
      </Router>
    </AuthProvider>
  );
};

const RoutesWrapper = () => {
  const { isAuthenticated, userRole } = useAuth();

  // Détermine le tableau de bord en fonction du rôle utilisateur
  const getDashboardRoute = (role: string | null) => {
    switch (role) {
      case "residential":
        return "/residential-dashboard";
      case "business":
        return "/business-dashboard";
      case "admin":
        return "/admin-dashboard";
      default:
        return "/";
    }
  };

  return (
    <Routes>
      {/* Pages publiques */}
      {!isAuthenticated ? (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </>
      ) : (
        <>
          {/* Redirige les utilisateurs authentifiés accédant aux pages publiques */}
          <Route path="/" element={<Navigate to={getDashboardRoute(userRole)} replace />} />
          <Route path="/signup" element={<Navigate to={getDashboardRoute(userRole)} replace />} />
          <Route path="/change-password" element={<Navigate to={getDashboardRoute(userRole)} replace />} />

          {/* Pages protégées */}
          <Route
            path="/residential-dashboard"
            element={
              <ProtectedRoute allowedRoles={["residential"]}>
                <ResidentialDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/business-dashboard"
            element={
              <ProtectedRoute allowedRoles={["business"]}>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirection par défaut pour les utilisateurs authentifiés */}
          <Route path="*" element={<Navigate to={getDashboardRoute(userRole)} replace />} />
        </>
      )}

      {/* Gestion des routes non trouvées */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
