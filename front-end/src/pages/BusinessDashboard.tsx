import LogoutButton from "../components/LogoutButton";

const BusinessDashboard = () => {
    return (
      <div className="container mt-4">
        <h1>Tableau de Bord des Clients Business</h1>
        <p>Ceci est une page réservée aux rôles "Client Business".</p>
        <LogoutButton />
      </div>
    );
  };
  
  export default BusinessDashboard;