import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function MedecinDashboard() {
  const navigate = useNavigate();

  const patients = [
    { nom: 'Julien Martin', age: 55, dernierRDV: '27/03/2026', alerte: false },
    { nom: 'Sandrine Dupont', age: 42, dernierRDV: '25/03/2026', alerte: true },
    { nom: 'Karim D.,', age: 63, dernierRDV: '22/03/2026', alerte: false },
  ];

  return (
    <main className="dashboard-wrapper">
      <BackButton />
      <section className="dashboard-header">
        <h1>Tableau de bord Médecin</h1>
        <p>Vue globale des patients et des alertes en cours.</p>
      </section>

      <section className="dashboard-cards">
        <article className="card">
          <h3>Patients suivis</h3>
          <strong>78</strong>
        </article>
        <article className="card">
          <h3>Rdv cette semaine</h3>
          <strong>12</strong>
        </article>
        <article className="card card-alert">
          <h3>Alertes critiques</h3>
          <strong>3</strong>
        </article>
      </section>

      <section className="dashboard-table-section">
        <h2>Patients à examiner</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Âge</th>
              <th>Dernier RDV</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p, i) => (
              <tr key={i} className={p.alerte ? 'tr-alert' : ''}>
                <td>{p.nom}</td>
                <td>{p.age}</td>
                <td>{p.dernierRDV}</td>
                <td>{p.alerte ? 'Alerte' : 'OK'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <button className="btnSecondary" onClick={() => navigate('/')}>Déconnexion</button>
    </main>
  );
}
