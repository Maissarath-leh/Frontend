import React from "react";
import PatientsTable from "../components/PatientsTable";

function Dashboard() {
  const patients = [
    { id: 1, nom: "Julien Martin", age: 55, dernierRDV: "27/03/2026", action: "OK" },
    { id: 2, nom: "Sandrine Dupont", age: 42, dernierRDV: "25/03/2026", action: "Alerte" },
    { id: 3, nom: "Karim D.", age: 63, dernierRDV: "22/03/2026", action: "OK" },
  ];

  return (
    <div>
      <h1>Tableau de bord Médecin</h1>
      <PatientsTable patients={patients} />
    </div>
  );
}

export default Dashboard;
