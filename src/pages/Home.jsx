import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="page home-page">
      <main className="home-hero">
        <section className="hero-text">
          <h1>MediConnect</h1>
          <p>Suivi médical à distance, simple et sécurisé.</p>
          <div className="action-group">
            <button className="btn primary" onClick={() => navigate('/login')}>Connexion</button>
            <button className="btn outline" onClick={() => navigate('/register')}>Inscription</button>
          </div>
        </section>

        <section className="hero-cards">
          <article>
            <h3>Suivi en temps réel</h3>
            <p>Visualisez vos constantes en un coup d’œil.</p>
          </article>
          <article>
            <h3>Partage sécurisé</h3>
            <p>Accès contrôlé pour médecins et pharmacies.</p>
          </article>
          <article>
            <h3>Alerte IA</h3>
            <p>Notifications intelligentes des anomalies détectées.</p>
          </article>
        </section>
      </main>
    </div>
  );
}
