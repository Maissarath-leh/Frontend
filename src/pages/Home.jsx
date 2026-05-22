import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t, ready } = useTranslation();
  const navigate = useNavigate();
  const [sloganIndex, setSloganIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  if (!ready) {
    return <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>Chargement...</div>;
  }

  const slogans = [
    "Votre santé, notre priorité.",
    "Connectez-vous à vos médecins en temps réel.",
    "La télésurveillance au service de votre bien-être.",
  ];

  const carouselItems = [
    {
      icon: "📡",
      titre: "Collecte des données",
      description: "Des capteurs connectés mesurent en temps réel vos constantes vitales : tension artérielle, pouls, poids et température. Les données sont transmises automatiquement à la plateforme.",
      couleur: "#1266f7",
    },
    {
      icon: "🏥",
      titre: "Suivi médical",
      description: "Votre médecin accède à votre dossier médical complet depuis son tableau de bord. Il peut consulter l'historique de vos mesures et suivre l'évolution de votre état de santé.",
      couleur: "#0a1f5c",
    },
    {
      icon: "🤖",
      titre: "Intelligence Artificielle",
      description: "Notre module IA analyse en permanence vos données médicales. Dès qu'une anomalie est détectée (tension trop élevée, pouls anormal), une alerte est envoyée automatiquement.",
      couleur: "#27ae60",
    },
    {
      icon: "🔔",
      titre: "Alertes automatiques",
      description: "En cas de situation critique, le patient et le médecin reçoivent une notification immédiate. Le médecin peut agir rapidement sans attendre la prochaine consultation.",
      couleur: "#e74c3c",
    },
    {
      icon: "💊",
      titre: "Lien avec la pharmacie",
      description: "Les ordonnances validées par le médecin sont transmises directement à la pharmacie partenaire. Le patient peut récupérer ses médicaments sans délai.",
      couleur: "#8e44ad",
    },
    {
      icon: "🔒",
      titre: "Sécurité des données",
      description: "Toutes vos données médicales sont chiffrées et protégées. L'accès est contrôlé par rôle : seuls les professionnels autorisés peuvent consulter votre dossier.",
      couleur: "#f39c12",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setSloganIndex((prev) => (prev + 1) % slogans.length);
        setVisible(true);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
<div id="home-page" style={styles.page}>
      {/* SECTION HERO */}
      <section style={styles.hero}>
        <div style={styles.leftGradient} />
        <div style={styles.heroContent}>
          <div style={styles.leftSection}>
            <h1 style={styles.title}>{t('home.title')}</h1>
            <p style={{
              ...styles.slogan,
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}>
              {slogans[sloganIndex]}
            </p>
            <p style={styles.subtitle}>{t('home.subtitle')}</p>
            <div style={styles.stats}>
              <div style={styles.statItem}>
                <span style={styles.statNumber}>1000+</span>
                <span style={styles.statLabel}>{t('home.stats_patients')}</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <span style={styles.statNumber}>50+</span>
                <span style={styles.statLabel}>{t('home.stats_doctors')}</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <span style={styles.statNumber}>24/7</span>
                <span style={styles.statLabel}>{t('home.stats_available')}</span>
              </div>
            </div>
            <div style={styles.buttons}>
              <button style={styles.btnPrimary} onClick={() => navigate('/login')}>
                {t('home.btn_login')}
              </button>
              <button style={styles.btnOutline} onClick={() => navigate('/register')}>
                {t('home.btn_register')}
              </button>
            </div>
          </div>

          <div style={styles.rightSection}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Suivi en temps réel</h3>
              <p style={styles.cardText}>Visualisez vos constantes en un coup d'œil.</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Partage sécurisé</h3>
              <p style={styles.cardText}>Accès contrôlé pour médecins et pharmacies.</p>
            </div>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Alerte IA</h3>
              <p style={styles.cardText}>Notifications intelligentes des anomalies détectées.</p>
            </div>
          </div>
        </div>

        <div style={styles.scrollIndicator} onClick={() => document.getElementById('about').scrollIntoView({behavior: 'smooth'})}>
          <span style={styles.scrollText}>{t('home.scroll')}</span>
          <span style={styles.scrollArrow}>↓</span>
        </div>
      </section>

      {/* SECTION À PROPOS — CAROUSEL */}
      <section id="about" style={styles.aboutSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{t('home.about_title')}</h2>
          <p style={styles.sectionSubtitle}>{t('home.about_subtitle')}</p>
        </div>

        <div style={styles.carouselContainer}>
          <div style={{
            ...styles.carouselCard,
            borderTop: `4px solid ${carouselItems[carouselIndex].couleur}`,
          }}>
            <div style={{...styles.carouselIcon, color: carouselItems[carouselIndex].couleur}}>
              {carouselItems[carouselIndex].icon}
            </div>
            <h3 style={{...styles.carouselTitle, color: carouselItems[carouselIndex].couleur}}>
              {carouselItems[carouselIndex].titre}
            </h3>
            <p style={styles.carouselText}>
              {carouselItems[carouselIndex].description}
            </p>
          </div>

          <div style={styles.carouselDots}>
            {carouselItems.map((_, i) => (
              <div
                key={i}
                style={{
                  ...styles.dot,
                  backgroundColor: i === carouselIndex ? carouselItems[carouselIndex].couleur : '#ddd',
                  width: i === carouselIndex ? '24px' : '10px',
                }}
                onClick={() => setCarouselIndex(i)}
              />
            ))}
          </div>

          <div style={styles.carouselNav}>
            <button
              style={styles.navBtn}
              onClick={() => setCarouselIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)}
            >
              ←
            </button>
            <span style={styles.carouselCounter}>
              {carouselIndex + 1} / {carouselItems.length}
            </span>
            <button
              style={styles.navBtn}
              onClick={() => setCarouselIndex((prev) => (prev + 1) % carouselItems.length)}
            >
              →
            </button>
          </div>
        </div>

        {/* GRILLE DES FONCTIONNALITÉS */}
        <div style={styles.featuresGrid}>
          {carouselItems.map((item, i) => (
            <div
              key={i}
              style={{
                ...styles.featureCard,
                borderTop: `3px solid ${item.couleur}`,
                transform: i === carouselIndex ? 'scale(1.03)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
              onClick={() => setCarouselIndex(i)}
            >
              <span style={{fontSize: '28px'}}>{item.icon}</span>
              <h4 style={{...styles.featureTitle, color: item.couleur}}>{item.titre}</h4>
            </div>
          ))}
        </div>
      </section>
{/* SECTION CONTACT */}
<section id="contact" style={styles.contactSection}>
  <h2 style={{color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '0 0 12px'}}>
    {t('home.contact_title')}
  </h2>
  <p style={{color: 'rgba(255,255,255,0.8)', fontSize: '16px', margin: '0 0 32px'}}>
    {t('home.contact_subtitle')}
  </p>
  <button style={styles.btnPrimary} onClick={() => navigate('/contact')}>
    {t('home.contact_btn')}
  </button>
</section>
     <footer style={styles.footer}>
  <p style={styles.footerCopy}>{t('home.footer')}</p>
</footer>

    </div>
  );
}

const styles = {
  page: {
    width: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '100vh',
  },
  hero: {
    height: '100vh',
    backgroundImage: "url('/fond2.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
  },
  leftGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '55%',
    height: '100%',
    background: 'linear-gradient(to right, rgba(5, 20, 60, 0.75), transparent)',
    zIndex: 1,
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    padding: '0 60px',
    boxSizing: 'border-box',
    zIndex: 2,
    gap: '40px',
  },
  leftSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '14px',
    maxWidth: '420px',
  },
  title: {
    color: 'white',
    fontSize: '52px',
    fontWeight: 'bold',
    margin: 0,
    textShadow: '0 2px 8px rgba(0,0,0,0.4)',
  },
  slogan: {
    color: '#a8d4ff',
    fontSize: '16px',
    margin: 0,
    fontStyle: 'italic',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '16px',
    margin: 0,
    lineHeight: '1.5',
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNumber: {
    color: 'white',
    fontSize: '22px',
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '12px',
  },
  statDivider: {
    width: '1px',
    height: '36px',
    background: 'rgba(255,255,255,0.3)',
  },
  buttons: {
    display: 'flex',
    gap: '16px',
  },
  btnPrimary: {
    padding: '14px 32px',
    borderRadius: '35px',
    border: 'none',
    background: '#1266f7',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(18, 102, 247, 0.4)',
  },
  btnOutline: {
    padding: '14px 32px',
    borderRadius: '35px',
    border: '2px solid white',
    background: 'rgba(255,255,255,0.15)',
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  rightSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minWidth: '280px',
    maxWidth: '380px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '16px',
    padding: '20px 24px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    backdropFilter: 'blur(8px)',
  },
  cardTitle: {
    color: '#0a1f5c',
    margin: '0 0 6px 0',
    fontSize: '16px',
    fontWeight: '700',
  },
  cardText: {
    color: '#3b4e7a',
    margin: 0,
    fontSize: '14px',
  },
  scrollIndicator: {
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    animation: 'bounce 2s infinite',
  },
  scrollText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '13px',
    marginBottom: '4px',
  },
  scrollArrow: {
    color: 'white',
    fontSize: '20px',
  },
  aboutSection: {
    backgroundColor: '#f8faff',
    padding: '80px 60px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  sectionTitle: {
    color: '#0a1f5c',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 12px',
  },
  sectionSubtitle: {
    color: '#7f8c8d',
    fontSize: '16px',
    margin: 0,
  },
  carouselContainer: {
    width: '100%',
    maxWidth: '700px',
    marginBottom: '48px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  carouselCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '48px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'all 0.4s ease',
  },
  carouselIcon: {
    fontSize: '60px',
    marginBottom: '20px',
  },
  carouselTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 16px',
  },
  carouselText: {
    color: '#555',
    fontSize: '16px',
    lineHeight: '1.7',
    margin: 0,
  },
  carouselDots: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  dot: {
    height: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  carouselNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  navBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid #1266f7',
    background: 'transparent',
    color: '#1266f7',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselCounter: {
    color: '#7f8c8d',
    fontSize: '14px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    width: '100%',
    maxWidth: '700px',
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  featureTitle: {
    fontSize: '13px',
    fontWeight: '600',
    margin: 0,
  },
 contactSection: {
  backgroundColor: '#0a1f5c',
  padding: '80px 60px',
  minHeight: '30vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
},
  contactGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '48px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    justifyContent: 'center',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  contactIcon: {
    fontSize: '28px',
  },
  contactLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '12px',
    margin: '0 0 4px',
  },
  contactValue: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
  },
  contactForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  contactInput: {
    padding: '14px 16px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
  },
  footer: {
    backgroundColor: '#060f2e',
    padding: '30px 60px',
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  footerLogoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  footerLinks: {
    display: 'flex',
    gap: '24px',
  },
  footerLink: {
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    fontSize: '14px',
  },
  footerCopy: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '12px',
    textAlign: 'center',
    margin: 0,
  },
};