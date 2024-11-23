import LogoutButton from "../components/LogoutButton";

const ResidentialDashboard = () => {
  // Simuler une liste de clients résidentiels
  const clients = [
    { id: 1, name: "XXXX" },
    { id: 2, name: "XXXXX" },
    { id: 3, name: "XXXX" },
  ];

  return (
    <div className="container mt-4">
      <h1>Tableau de Bord des Clients Résidentiels</h1>
      <ul className="list-group mt-3">
        {clients.map((client) => (
          <li key={client.id} className="list-group-item">
            {client.name}
          </li>
        ))}
      </ul>
      <h1 />
      <LogoutButton />
    </div>
  );
};

export default ResidentialDashboard;
