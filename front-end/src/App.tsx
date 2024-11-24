import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ResidentialDashboard from "./pages/ResidentialDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";

const App = () => {
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  // Charger le rôle utilisateur depuis le localStorage lors du premier rendu
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      setCurrentUserRole(storedRole);
    }
  }, []);


  return (
    <Router>
      <Routes>
        {/* Page de connexion */}
        <Route path="/" element={<Login setRole={setCurrentUserRole} />} />
        {/* Page d'inscription */}
        <Route path="/signup" element={<Signup />} />
        {/* Dashboard résidentiel */}
        <Route
          path="/residential-dashboard"
          element={
            <ProtectedRoute userRole={currentUserRole} allowedRoles={["residential"]}>
              <ResidentialDashboard/>
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
    </Router>
  );
};

export default App;
