import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MedecinDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showVideo, setShowVideo] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const patients = [
    { nom: 'Julien Martin', age: 55, dernierRDV: '27/03/2026', tension: '12/7', statut: 'Stable', alerte: false },
    { nom: 'Sandrine Dupont', age: 42, dernierRDV: '25/03/2026', tension: '16/9', statut: 'Critique', alerte: true },
    { nom: 'Karim D.', age: 63, dernierRDV: '22/03/2026', tension: '13/8', statut: 'Surveillance', alerte: false },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={styles.page}>
      {showVideo && selectedPatient && (
  <div style={styles.videoOverlay}>
    <div style={styles.videoContainer}>
      <div style={styles.videoHeader}>
        <h3 style={styles.videoTitle}>📹 Consultation — {selectedPatient.nom}</h3>
        <button style={styles.videoClose} onClick={() => setShowVideo(false)}>✕ Terminer</button>
      </div>
      <iframe
        src={`https://meet.jit.si/HealthTech-${selectedPatient.nom.replace(/\s+/g, '-')}`}
        style={styles.videoFrame}
        allow="camera; microphone; fullscreen; display-capture"
        title="Téléconsultation"
      />
    </div>
  </div>
)}

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <img src="/logo.png" alt="logo" style={{height: '40px'}} />
          <span style={styles.sidebarLogoText}>HealthTech</span>
        </div>

        <div style={styles.doctorInfo}>
          <div style={styles.avatar}>
            {user.nom ? user.nom.charAt(0) : 'M'}
          </div>
          <p style={styles.doctorName}>Dr. {user.prenom} {user.nom}</p>
          <p style={styles.doctorRole}>Médecin</p>
        </div>

        <div style={styles.sidebarNav}>
          <div
            style={activeTab === 'dashboard' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('dashboard')}
          >
            🏠 Tableau de bord
          </div>
          <div
            style={activeTab === 'patients' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('patients')}
          >
            👥 Mes patients
          </div>
          <div
            style={activeTab === 'alertes' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('alertes')}
          >
             Alertes
          </div>
          <div
            style={activeTab === 'rdv' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('rdv')}
          >
             Rendez-vous
          </div>
          <div
            style={activeTab === 'dossiers' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('dossiers')}
          >
             Dossiers
          </div>
          <div
            style={activeTab === 'messagerie' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveTab('messagerie')}
          >
             Messagerie
          </div>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
           Déconnexion
        </button>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div style={styles.main}>

        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <button style={styles.backBtn} onClick={() => navigate('/')}>
              ← Retour
            </button>
            <div>
              <h1 style={styles.headerTitle}>
                {activeTab === 'dashboard' && 'Tableau de bord Médecin'}
                {activeTab === 'patients' && 'Mes patients'}
                {activeTab === 'alertes' && 'Alertes'}
                {activeTab === 'rdv' && 'Rendez-vous'}
                {activeTab === 'dossiers' && 'Dossiers'}
                {activeTab === 'messagerie' && 'Messagerie'}
              </h1>
              <p style={styles.headerSubtitle}>Vue globale des patients et alertes en cours</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.alertBadge}>
              🔔 <span style={styles.badgeCount}>3</span> alertes critiques
            </div>
            <div style={styles.doctorBadge}>
              Dr. {user.prenom} {user.nom}
            </div>
          </div>
        </header>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <>
            <section style={styles.cardsRow}>
              <div style={styles.card}>
                <div style={styles.cardIcon}>👥</div>
                <div>
                  <p style={styles.cardLabel}>Patients suivis</p>
                  <p style={styles.cardValue}>78</p>
                </div>
                <div style={{...styles.cardBar, backgroundColor: '#1266f7'}} />
              </div>
              <div style={styles.card}>
                <div style={styles.cardIcon}>📅</div>
                <div>
                  <p style={styles.cardLabel}>RDV cette semaine</p>
                  <p style={styles.cardValue}>12</p>
                </div>
                <div style={{...styles.cardBar, backgroundColor: '#0a1f5c'}} />
              </div>
              <div style={{...styles.card, border: '1px solid #fde8e8'}}>
                <div style={styles.cardIcon}>🚨</div>
                <div>
                  <p style={styles.cardLabel}>Alertes critiques</p>
                  <p style={{...styles.cardValue, color: '#e74c3c'}}>3</p>
                </div>
                <div style={{...styles.cardBar, backgroundColor: '#e74c3c'}} />
              </div>
              <div style={styles.card}>
                <div style={styles.cardIcon}>✅</div>
                <div>
                  <p style={styles.cardLabel}>Consultations aujourd'hui</p>
                  <p style={styles.cardValue}>5</p>
                </div>
                <div style={{...styles.cardBar, backgroundColor: '#27ae60'}} />
              </div>
            </section>

            <div style={styles.bottomRow}>
              <section style={styles.tableSection}>
                <div style={styles.tableSectionHeader}>
                  <h2 style={styles.sectionTitle}>Patients à examiner</h2>
                  <button style={styles.btnPrimary}>+ Nouveau patient</button>
                </div>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHead}>
                      <th style={styles.th}>Patient</th>
                      <th style={styles.th}>Âge</th>
                      <th style={styles.th}>Dernier RDV</th>
                      <th style={styles.th}>Tension</th>
                      <th style={styles.th}>Statut</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((p, i) => (
                      <tr key={i} style={p.alerte ? styles.trAlert : styles.tr}>
                        <td style={styles.td}>
                          <span style={styles.patientAvatar}>{p.nom.charAt(0)}</span>
                          {p.nom}
                        </td>
                        <td style={styles.td}>{p.age} ans</td>
                        <td style={styles.td}>{p.dernierRDV}</td>
                        <td style={styles.td}>{p.tension}</td>
                        <td style={styles.td}>
                          <span style={p.alerte ? styles.badgeAlert : p.statut === 'Surveillance' ? styles.badgeWarning : styles.badgeOk}>
                            {p.statut}
                          </span>
                        </td>
                        <td style={styles.td}>
  <button style={styles.btnView} onClick={() => {}}>Voir dossier</button>
  <button style={styles.btnConsult} onClick={() => { setSelectedPatient(p); setShowVideo(true); }}>
    📹 Consulter
  </button>
</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section style={styles.alertPanel}>
                <h2 style={styles.sectionTitle}>Alertes récentes</h2>
                <div style={styles.alertItem}>
                  <div style={styles.alertDot} />
                  <div>
                    <p style={styles.alertName}>Sandrine Dupont</p>
                    <p style={styles.alertMsg}>FC: 46 bpm — Tension critique 16/9</p>
                    <p style={styles.alertTime}>Il y a 10 min</p>
                  </div>
                </div>
                <div style={styles.alertItem}>
                  <div style={styles.alertDot} />
                  <div>
                    <p style={styles.alertName}>Karim D.</p>
                    <p style={styles.alertMsg}>Poids en hausse — +2kg en 3 jours</p>
                    <p style={styles.alertTime}>Il y a 1h</p>
                  </div>
                </div>
                <div style={styles.alertItem}>
                  <div style={styles.alertDot} />
                  <div>
                    <p style={styles.alertName}>Julien Martin</p>
                    <p style={styles.alertMsg}>Pas de mesure depuis 48h</p>
                    <p style={styles.alertTime}>Il y a 2h</p>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}

        {activeTab !== 'dashboard' && (
          <div style={styles.content}>
            <div style={styles.emptyState}>
              <p style={styles.emptyIcon}>🚧</p>
              <h2 style={styles.emptyTitle}>Section en cours de développement</h2>
              <p style={styles.emptyText}>Cette fonctionnalité sera disponible prochainement.</p>
              <button style={styles.btnPrimary} onClick={() => setActiveTab('dashboard')}>
                ← Retour au tableau de bord
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    overflow: 'hidden',
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 999,
  },
btnConsult: { backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', marginLeft: '6px' },
videoOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
videoContainer: { width: '100%', maxWidth: '900px', height: '600px', backgroundColor: '#1a1a2e', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
videoHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#0a1f5c' },
videoTitle: { color: 'white', margin: 0, fontSize: '16px', fontWeight: '600' },
videoClose: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
videoFrame: { flex: 1, border: 'none', width: '100%' },

  sidebar: {
    width: '240px',
    backgroundColor: '#0a1f5c',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
    flexShrink: 0,
  },
  sidebarLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '0 20px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  sidebarLogoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  doctorInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: '#1266f7',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  doctorName: {
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    margin: 0,
    textAlign: 'center',
  },
  doctorRole: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '12px',
    margin: '4px 0 0',
  },
  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '20px 12px',
    flexGrow: 1,
    opacity: 1,
    transform: 'none',
    position: 'static',
    pointerEvents: 'auto',
  },
  navItem: {
    padding: '12px 16px',
    borderRadius: '10px',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    fontSize: '14px',
    whiteSpace: 'nowrap',
  },
  navItemActive: {
    padding: '12px 16px',
    borderRadius: '10px',
    color: 'white',
    backgroundColor: '#1266f7',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    margin: '0 12px',
    padding: '12px 16px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'left',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 30px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e8ecf0',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  backBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #e8ecf0',
    backgroundColor: 'white',
    color: '#0a1f5c',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  headerTitle: {
    color: '#0a1f5c',
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#7f8c8d',
    margin: '2px 0 0',
    fontSize: '12px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  alertBadge: {
    backgroundColor: '#fde8e8',
    color: '#e74c3c',
    padding: '8px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  badgeCount: {
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  doctorBadge: {
    backgroundColor: '#0a1f5c',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  cardsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    padding: '20px 30px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '14px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardIcon: {
    fontSize: '28px',
  },
  cardLabel: {
    color: '#7f8c8d',
    fontSize: '12px',
    margin: '0 0 4px',
  },
  cardValue: {
    color: '#0a1f5c',
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0,
  },
  cardBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
  },
  bottomRow: {
    display: 'flex',
    gap: '20px',
    padding: '0 30px 20px',
    flex: 1,
    overflow: 'hidden',
  },
  tableSection: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    overflow: 'auto',
  },
  tableSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectionTitle: {
    color: '#0a1f5c',
    margin: 0,
    fontSize: '16px',
    fontWeight: '700',
  },
  btnPrimary: {
    backgroundColor: '#1266f7',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHead: {
    backgroundColor: '#f8faff',
  },
  th: {
    padding: '12px 14px',
    textAlign: 'left',
    color: '#7f8c8d',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e8ecf0',
  },
  tr: {
    borderBottom: '1px solid #f0f2f5',
  },
  trAlert: {
    borderBottom: '1px solid #f0f2f5',
    backgroundColor: '#fff5f5',
  },
  td: {
    padding: '14px',
    fontSize: '14px',
    color: '#2c3e50',
  },
  patientAvatar: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#1266f7',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    marginRight: '10px',
  },
  badgeOk: {
    backgroundColor: '#e8f8f0',
    color: '#27ae60',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeWarning: {
    backgroundColor: '#fff8e8',
    color: '#f39c12',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  badgeAlert: {
    backgroundColor: '#fde8e8',
    color: '#e74c3c',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  btnView: {
    backgroundColor: '#f0f2f5',
    color: '#0a1f5c',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  alertPanel: {
    width: '280px',
    backgroundColor: 'white',
    borderRadius: '14px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    overflow: 'auto',
    flexShrink: 0,
  },
  alertItem: {
    display: 'flex',
    gap: '12px',
    padding: '14px 0',
    borderBottom: '1px solid #f0f2f5',
  },
  alertDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#e74c3c',
    flexShrink: 0,
    marginTop: '4px',
  },
  alertName: {
    color: '#0a1f5c',
    fontWeight: '600',
    fontSize: '13px',
    margin: '0 0 4px',
  },
  alertMsg: {
    color: '#7f8c8d',
    fontSize: '12px',
    margin: '0 0 4px',
  },
  alertTime: {
    color: '#bdc3c7',
    fontSize: '11px',
    margin: 0,
  },
  content: {
    flex: 1,
    padding: '30px',
    overflowY: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '48px',
    margin: '0 0 16px',
  },
  emptyTitle: {
    color: '#0a1f5c',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 8px',
  },
  emptyText: {
    color: '#7f8c8d',
    fontSize: '14px',
    margin: '0 0 20px',
  },
};