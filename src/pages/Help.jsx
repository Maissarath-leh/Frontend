import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function Help() {
  const navigate = useNavigate();
  return (
    <div className="page help-page">
      <BackButton />
      <main className="help-hero">
        <section className="help-header">
          <h1>Centre d’Aide MediConnect</h1>
          <p>Vous êtes au bon endroit pour trouver des réponses claires et rapides.</p>
        </section>

        <section className="faq-grid">
          <article className="faq-card">
            <h3>Créer un compte</h3>
            <p>Cliquez sur Inscription, remplissez vos informations et confirmez votre email.</p>
          </article>
          <article className="faq-card">
            <h3>Connexion</h3>
            <p>Rendez-vous sur Connexion et renseignez votre email et mot de passe.</p>
          </article>
          <article className="faq-card">
            <h3>Tableau de bord</h3>
            <p>Une fois connecté, accédez à votre espace selon votre rôle.</p>
          </article>
          <article className="faq-card">
            <h3>Support</h3>
            <p>Utilisez le formulaire Contact ou écrivez à support@mediconnect.fr.</p>
          </article>
        </section>

        <section className="faq-list">
          <details>
            <summary>Comment mettre à jour mes constantes ?</summary>
            <p>Dans votre tableau de bord patient, cliquez sur “Ajouter mesure”.</p>
          </details>
          <details>
            <summary>Comment inviter un médecin ?</summary>
            <p>Dans “Mes contacts”, cliquez sur “Ajouter un médecin” puis envoyez l’invitation.</p>
          </details>
          <details>
            <summary>Comment gérer les notifications ?</summary>
            <p>Allez dans Paramètres → Notifications pour activer ou désactiver les alertes.</p>
          </details>
        </section>

        <div className="help-actions">
          <button className="btn outline" onClick={() => navigate('/')}>Accueil</button>
          <button className="btn primary" onClick={() => navigate('/contact')}>Contact</button>
        </div>
      </main>
    </div>
  );
}
