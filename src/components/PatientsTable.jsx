import { Link } from "react-router-dom";

function PatientsTable({ patients }) {
  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Âge</th>
          <th>Dernier RDV</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => (
          <tr key={patient.id}>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>
              <Link to={`/patient/${patient.id}`} style={{ color: "blue", textDecoration: "underline" }}>
                {patient.nom}
              </Link>
            </td>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>{patient.age}</td>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>{patient.dernierRDV}</td>
            <td style={{ padding: "8px", border: "1px solid #ccc" }}>{patient.action}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PatientsTable;
