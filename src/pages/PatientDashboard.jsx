import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function PatientDashboard() {
  const navigate = useNavigate();

  const consultData = [
    { date: '28/03/2026', tension: '12/7', poids: '72 kg', status: 'Stable' },
    { date: '21/03/2026', tension: '13/8', poids: '72.5 kg', status: 'Léger +', },
    { date: '14/03/2026', tension: '12/8', poids: '73 kg', status: 'OK' },
  ];

  return (
    <main className="dashboard-wrapper">
      <BackButton />
      <section className="dashboard-header">
        <h1>Tableau de bord Patient</h1>
        <p>Suivi santé, mesures et alertes en temps réel.</p>
      </section>

      <section className="dashboard-cards">
        <article className="card">
          <h3>Dernière tension</h3>
          <strong>12/7</strong>
        </article>
        <article className="card">
          <h3>Poids</h3>
          <strong>72 kg</strong>
        </article>
        <article className="card card-alert">
          <h3>Prochaine visite</h3>
          <strong>05/04/2026</strong>
        </article>
      </section>

      <section className="dashboard-table-section">
        <h2>Historique des consultations</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Tension</th>
              <th>Poids</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {consultData.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.tension}</td>
                <td>{item.poids}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <button className="btnSecondary" onClick={() => navigate('/')}>Déconnexion</button>
    </main>
  );
}
