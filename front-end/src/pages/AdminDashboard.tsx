import LogoutButton from "../components/LogoutButton";

const AdminDashboard = () => {
    return (
      <div className="container mt-4">
        <h1>Tableau de Bord Admin</h1>
        <p>Ceci est une page réservée aux rôles "Administrateur".</p>
        <LogoutButton />
      </div>
    );
  };
  
  export default AdminDashboard;