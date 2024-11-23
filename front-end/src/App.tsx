import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ResidentialDashboard from "./pages/ResidentialDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setRole={setCurrentUserRole} />} />
        <Route
          path="/residential-dashboard"
          element={
            <ProtectedRoute userRole={currentUserRole} allowedRoles={["residential"]}>
              <ResidentialDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business-dashboard"
          element={
            <ProtectedRoute userRole={currentUserRole} allowedRoles={["business"]}>
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />
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
