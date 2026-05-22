import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Help() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "Comment créer un compte patient ?",
      reponse: "Cliquez sur 'Inscription' depuis la page d'accueil, remplissez vos informations personnelles (nom, prénom, email, téléphone, mot de passe) et validez. Vous serez automatiquement redirigé vers votre tableau de bord."
    },
    {
      question: "Comment me connecter à mon espace ?",
      reponse: "Cliquez sur 'Connexion', entrez votre email et mot de passe. La plateforme détecte automatiquement votre rôle (patient, médecin, pharmacie) et vous redirige vers le bon tableau de bord."
    },
    {
      question: "Comment consulter mes constantes vitales ?",
      reponse: "Une fois connecté en tant que patient, allez dans 'Mes mesures' dans le menu de gauche. Vous verrez l'historique complet de vos données : tension, pouls, poids et statut de santé."
    },
    {
      question: "Que faire en cas d'alerte ?",
      reponse: "En cas d'alerte critique détectée par notre IA, une notification vous est envoyée.Ne vous inquiétez pas le médecin a reçu la meme alerte, donc il devrait réagir immédiatement."    },
    {
      question: "Comment un médecin accède-t-il à la plateforme ?",
      reponse: "Les comptes médecins sont créés par l'administrateur de la plateforme. Le médecin reçoit ses identifiants par email et peut se connecter directement via la page Connexion."
    },
    {
      question: "Mes données médicales sont-elles sécurisées ?",
      reponse: "Oui. Toutes vos données sont chiffrées et stockées de manière sécurisée. L'accès est strictement contrôlé par rôle — seuls vos médecins autorisés peuvent consulter votre dossier."
    },
  ];

  return (
    <div style={styles.page}>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <span style={styles.badge}>Centre d'aide</span>
          <h1 style={styles.heroTitle}>Comment pouvons-nous vous aider ?</h1>
          <p style={styles.heroSubtitle}>Trouvez rapidement les réponses à vos questions.</p>
        </div>
      </section>

      {/* CARTES */}
      <section style={styles.cardsSection}>
        <div style={styles.cardsGrid}>
          <div style={styles.card}>
           
            <h3 style={styles.cardTitle}>Créer un compte</h3>
            <p style={styles.cardText}>Cliquez sur Inscription, remplissez vos informations et accédez à votre espace patient.</p>
            <button style={styles.cardBtn} onClick={() => navigate('/register')}>S'inscrire →</button>
          </div>

          <div style={styles.card}>
           
            <h3 style={styles.cardTitle}>Connexion</h3>
            <p style={styles.cardText}>Renseignez votre email et mot de passe pour accéder à votre tableau de bord.</p>
            <button style={styles.cardBtn} onClick={() => navigate('/login')}>Se connecter →</button>
          </div>

          <div style={styles.card}>
            
            <h3 style={styles.cardTitle}>Tableau de bord</h3>
            <p style={styles.cardText}>Accédez à votre espace personnalisé selon votre rôle : patient, médecin ou pharmacie.</p>
            <button style={styles.cardBtn} onClick={() => navigate('/login')}>Accéder →</button>
          </div>

          <div style={styles.card}>
           
            <h3 style={styles.cardTitle}>Alertes IA</h3>
            <p style={styles.cardText}>Notre IA détecte automatiquement les anomalies et envoie des alertes en temps réel.</p>
            <button style={styles.cardBtn}>En savoir plus →</button>
          </div>

          <div style={styles.card}>
           
            <h3 style={styles.cardTitle}>Pharmacie</h3>
            <p style={styles.cardText}>Les ordonnances validées sont transmises directement à votre pharmacie partenaire.</p>
            <button style={styles.cardBtn}>En savoir plus →</button>
          </div>

          <div style={styles.card}>
           
            <h3 style={styles.cardTitle}>Support</h3>
            <p style={styles.cardText}>Écrivez-nous à support@healthtech.com ou utilisez le formulaire de contact.</p>
            <button style={styles.cardBtn} onClick={() => navigate('/contact')}>Nous contacter →</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={styles.faqSection}>
        <div style={styles.faqHeader}>
          <h2 style={styles.faqTitle}>Questions fréquentes</h2>
          <p style={styles.faqSubtitle}>Tout ce que vous devez savoir sur HealthTech</p>
        </div>

        <div style={styles.faqList}>
          {faqs.map((faq, i) => (
            <div key={i} style={styles.faqItem}>
              <div
                style={styles.faqQuestion}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span style={styles.faqQuestionText}>{faq.question}</span>
                <span style={{
                  ...styles.faqArrow,
                  transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  color: openFaq === i ? '#1266f7' : '#7f8c8d',
                }}>▼</span>
              </div>
              {openFaq === i && (
                <div style={styles.faqAnswer}>
                  {faq.reponse}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT RAPIDE */}
      <section style={styles.contactSection}>
        <h2 style={styles.contactTitle}>Vous n'avez pas trouvé votre réponse ?</h2>
        <p style={styles.contactSubtitle}>Notre équipe est disponible pour vous aider.</p>
        <div style={styles.contactBtns}>
          <button style={styles.btnPrimary} onClick={() => navigate('/contact')}>
            📧 Nous contacter
          </button>
          <button style={styles.btnSecondary} onClick={() => navigate('/')}>
            🏠 Retour à l'accueil
          </button>
        </div>
      </section>

    </div>
  );
}

const styles = {
 page: {
    backgroundColor: '#f8faff',
    overflowY: 'auto',
    height: '100vh',
  },
  hero: {
    backgroundColor: '#0a1f5c',
    padding: '80px 60px',
    position: 'relative',
    textAlign: 'center',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(135deg, #0a1f5c 0%, #1266f7 100%)',
    opacity: 0.9,
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    padding: '6px 18px',
    borderRadius: '20px',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '600',
  },
  heroTitle: {
    color: 'white',
    fontSize: '36px',
    fontWeight: 'bold',
    margin: '20px 0 12px',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '16px',
    margin: 0,
  },
  cardsSection: {
    padding: '60px',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    border: '1px solid #f0f2f5',
  },
  cardIconBox: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: '24px',
  },
  cardTitle: {
    color: '#0a1f5c',
    fontSize: '16px',
    fontWeight: '700',
    margin: 0,
  },
  cardText: {
    color: '#7f8c8d',
    fontSize: '14px',
    margin: 0,
    lineHeight: '1.6',
    flexGrow: 1,
  },
  cardBtn: {
    background: 'none',
    border: 'none',
    color: '#1266f7',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    padding: 0,
    textAlign: 'left',
  },
  faqSection: {
    padding: '60px',
    backgroundColor: 'white',
  },
  faqHeader: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  faqTitle: {
    color: '#0a1f5c',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 10px',
  },
  faqSubtitle: {
    color: '#7f8c8d',
    fontSize: '15px',
    margin: 0,
  },
  faqList: {
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  faqItem: {
    backgroundColor: '#f8faff',
    borderRadius: '12px',
    border: '1px solid #e8ecf0',
    overflow: 'hidden',
  },
  faqQuestion: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 24px',
    cursor: 'pointer',
  },
  faqQuestionText: {
    color: '#0a1f5c',
    fontWeight: '600',
    fontSize: '15px',
  },
  faqArrow: {
    fontSize: '12px',
    transition: 'transform 0.3s ease',
  },
  faqAnswer: {
    padding: '0 24px 18px',
    color: '#555',
    fontSize: '14px',
    lineHeight: '1.7',
    borderTop: '1px solid #e8ecf0',
    paddingTop: '16px',
  },
  contactSection: {
    backgroundColor: '#0a1f5c',
    padding: '60px',
    textAlign: 'center',
  },
  contactTitle: {
    color: 'white',
    fontSize: '26px',
    fontWeight: 'bold',
    margin: '0 0 12px',
  },
  contactSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '15px',
    margin: '0 0 30px',
  },
  contactBtns: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
  },
  btnPrimary: {
    padding: '14px 32px',
    borderRadius: '35px',
    border: 'none',
    background: '#1266f7',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '14px 32px',
    borderRadius: '35px',
    border: '2px solid white',
    background: 'transparent',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};