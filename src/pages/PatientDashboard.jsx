import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PatientDashboard() {
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const consultData = [
    { date: '28/03/2026', tension: '12/7', poids: '72 kg', pouls: '72 bpm', statut: 'Stable' },
    { date: '21/03/2026', tension: '13/8', poids: '72.5 kg', pouls: '78 bpm', statut: 'Surveillance' },
    { date: '14/03/2026', tension: '12/8', poids: '73 kg', pouls: '70 bpm', statut: 'Stable' },
  ];

  const alertes = [
    { message: 'Tension légèrement élevée', date: '28/03/2026', niveau: 'warning' },
    { message: 'Prochaine visite dans 7 jours', date: '05/04/2026', niveau: 'info' },
  ];

  const roomName = `HealthTech-${(user.nom || 'Patient').replace(/\s+/g, '-')}-${(user.prenom || '').replace(/\s+/g, '-')}`;

  return (
    <div style={styles.page}>

      {/* OVERLAY VIDEO */}
      {showVideo && (
        <div style={styles.videoOverlay}>
          <div style={styles.videoContainer}>
            <div style={styles.videoHeader}>
              <h3 style={styles.videoTitle}>📹 Téléconsultation en cours</h3>
              <button style={styles.videoClose} onClick={() => setShowVideo(false)}>✕ Terminer</button>
            </div>
            <iframe
              src={`https://meet.jit.si/${roomName}`}
              style={styles.videoFrame}
              allow="camera; microphone; fullscreen; display-capture"
              title="Téléconsultation"
            />
          </div>
        </div>
      )}

      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <img src="/logo.png" alt="logo" style={{height: '40px'}} />
          <span style={styles.sidebarLogoText}>HealthTech</span>
        </div>

        <div style={styles.patientInfo}>
          <div style={styles.avatar}>{user.nom ? user.nom.charAt(0) : 'P'}</div>
          <p style={styles.patientName}>{user.prenom} {user.nom}</p>
          <p style={styles.patientRole}>Patient</p>
        </div>

        <div style={styles.sidebarNav}>
          <div style={activeTab === 'dashboard' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('dashboard')}>
             Tableau de bord
          </div>
          <div style={activeTab === 'mesures' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('mesures')}>
             Mes mesures
          </div>
          <div style={activeTab === 'alertes' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('alertes')}>
             Alertes
          </div>
          <div style={activeTab === 'historique' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('historique')}>
             Historique
          </div>
          <div style={activeTab === 'profil' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('profil')}>
            👤 Mon profil
          </div>

          {/* BOUTON APPEL */}
          <div style={styles.btnAppel} onClick={() => setShowVideo(true)}>
             Appeler mon médecin
          </div>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
           Déconnexion
        </button>
      </aside>

      <div style={styles.main}>

        <header style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>
              {activeTab === 'dashboard' && 'Tableau de bord'}
              {activeTab === 'mesures' && 'Mes mesures'}
              {activeTab === 'alertes' && 'Mes alertes'}
              {activeTab === 'historique' && 'Historique'}
              {activeTab === 'profil' && 'Mon profil'}
            </h1>
            <p style={styles.headerSubtitle}>Suivi santé en temps réel</p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.alertBadge}>
              🔔 <span style={styles.badgeCount}>2</span> alertes
            </div>
            <div style={styles.patientBadge}>
              👤 {user.prenom} {user.nom}
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div style={styles.content}>
            <div style={styles.cardsRow}>
              <div style={styles.card}>
                <div style={styles.cardIcon}>❤️</div>
                <div>
                  <p style={styles.cardLabel}>Dernière tension</p>
                  <p style={styles.cardValue}>12/7</p>
                </div>
                <div style={{...styles.cardBar, backgroundColor: '#1266f7'}} />
              </div>
              <div style={styles.card}>
                <div style={styles.cardIcon}>⚖️</div>
                <div>
                  <p style={styles.cardLabel}>Poids</p>
                  <p style={styles.cardValue}>72 kg</p>
                </div>
                <div style={{...styles.cardBar, backgroundColor: '#0a1f5c'}} />
              </div>
              <div style={styles.card}>
                <div style={styles.cardIcon}>💓</div>
                <div>
                  <p style={styles.cardLabel}>Pouls</p>
                  <p style={styles.cardValue}>72 bpm</p>
                </div>
                <div style={{...styles.cardBar, backgroundColor: '#27ae60'}} />
              </div>
              <div style={{...styles.card, border: '1px solid #fde8e8'}}>
                <div style={styles.cardIcon}>📅</div>
                <div>
                  <p style={styles.cardLabel}>Prochaine visite</p>
                  <p style={{...styles.cardValue, fontSize: '18px', color: '#e74c3c'}}>05/04/2026</p>
                </div>
                <div style={{...styles.cardBar, backgroundColor: '#e74c3c'}} />
              </div>
            </div>

            <div style={styles.bottomRow}>
              <section style={styles.tableSection}>
                <h2 style={styles.sectionTitle}>Dernières mesures</h2>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHead}>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Tension</th>
                      <th style={styles.th}>Poids</th>
                      <th style={styles.th}>Pouls</th>
                      <th style={styles.th}>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consultData.map((item, index) => (
                      <tr key={index} style={styles.tr}>
                        <td style={styles.td}>{item.date}</td>
                        <td style={styles.td}>{item.tension}</td>
                        <td style={styles.td}>{item.poids}</td>
                        <td style={styles.td}>{item.pouls}</td>
                        <td style={styles.td}>
                          <span style={item.statut === 'Stable' ? styles.badgeOk : styles.badgeWarning}>
                            {item.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section style={styles.alertPanel}>
                <h2 style={styles.sectionTitle}>Mes alertes</h2>
                {alertes.map((alerte, i) => (
                  <div key={i} style={styles.alertItem}>
                    <div style={{...styles.alertDot, backgroundColor: alerte.niveau === 'warning' ? '#e74c3c' : '#1266f7'}} />
                    <div>
                      <p style={styles.alertMsg}>{alerte.message}</p>
                      <p style={styles.alertTime}>{alerte.date}</p>
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </div>
        )}

        {activeTab === 'mesures' && (
          <div style={styles.content}>
            <div style={styles.tableSection}>
              <h2 style={styles.sectionTitle}>Toutes mes mesures</h2>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Tension</th>
                    <th style={styles.th}>Poids</th>
                    <th style={styles.th}>Pouls</th>
                    <th style={styles.th}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {consultData.map((item, index) => (
                    <tr key={index} style={styles.tr}>
                      <td style={styles.td}>{item.date}</td>
                      <td style={styles.td}>{item.tension}</td>
                      <td style={styles.td}>{item.poids}</td>
                      <td style={styles.td}>{item.pouls}</td>
                      <td style={styles.td}>
                        <span style={item.statut === 'Stable' ? styles.badgeOk : styles.badgeWarning}>{item.statut}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'alertes' && (
          <div style={styles.content}>
            <div style={styles.tableSection}>
              <h2 style={styles.sectionTitle}>Toutes mes alertes</h2>
              {alertes.map((alerte, i) => (
                <div key={i} style={styles.alertItemFull}>
                  <div style={{...styles.alertDot, backgroundColor: alerte.niveau === 'warning' ? '#e74c3c' : '#1266f7'}} />
                  <div>
                    <p style={styles.alertMsg}>{alerte.message}</p>
                    <p style={styles.alertTime}>{alerte.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'historique' && (
          <div style={styles.content}>
            <div style={styles.tableSection}>
              <h2 style={styles.sectionTitle}>Historique complet</h2>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Tension</th>
                    <th style={styles.th}>Poids</th>
                    <th style={styles.th}>Pouls</th>
                    <th style={styles.th}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {consultData.map((item, index) => (
                    <tr key={index} style={styles.tr}>
                      <td style={styles.td}>{item.date}</td>
                      <td style={styles.td}>{item.tension}</td>
                      <td style={styles.td}>{item.poids}</td>
                      <td style={styles.td}>{item.pouls}</td>
                      <td style={styles.td}>
                        <span style={item.statut === 'Stable' ? styles.badgeOk : styles.badgeWarning}>{item.statut}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'profil' && (
          <div style={styles.content}>
            <div style={styles.tableSection}>
              <h2 style={styles.sectionTitle}>Mon profil</h2>
              <div style={styles.profilGrid}>
                <div style={styles.profilItem}><span style={styles.profilLabel}>Nom</span><span style={styles.profilValue}>{user.nom}</span></div>
                <div style={styles.profilItem}><span style={styles.profilLabel}>Prénom</span><span style={styles.profilValue}>{user.prenom}</span></div>
                <div style={styles.profilItem}><span style={styles.profilLabel}>Email</span><span style={styles.profilValue}>{user.email}</span></div>
                <div style={styles.profilItem}><span style={styles.profilLabel}>Téléphone</span><span style={styles.profilValue}>{user.telephone}</span></div>
                <div style={styles.profilItem}><span style={styles.profilLabel}>Rôle</span><span style={styles.profilValue}>Patient</span></div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', height: '100vh', backgroundColor: '#f0f2f5', overflow: 'hidden', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 },
  videoOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  videoContainer: { width: '100%', maxWidth: '900px', height: '600px', backgroundColor: '#1a1a2e', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  videoHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', backgroundColor: '#0a1f5c' },
  videoTitle: { color: 'white', margin: 0, fontSize: '16px', fontWeight: '600' },
  videoClose: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  videoFrame: { flex: 1, border: 'none', width: '100%' },
  sidebar: { width: '240px', backgroundColor: '#0a1f5c', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0, overflow: 'hidden' },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  sidebarLogoText: { color: 'white', fontWeight: 'bold', fontSize: '18px' },
  patientInfo: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  avatar: { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1266f7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' },
  patientName: { color: 'white', fontWeight: '600', fontSize: '14px', margin: 0 },
  patientRole: { color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: '4px 0 0' },
  sidebarNav: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '20px 12px', flexGrow: 1, opacity: 1, transform: 'none', position: 'static', pointerEvents: 'auto' },
  navItem: { padding: '12px 16px', borderRadius: '10px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap' },
  navItemActive: { padding: '12px 16px', borderRadius: '10px', color: 'white', backgroundColor: '#1266f7', cursor: 'pointer', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' },
  btnAppel: { margin: '8px 4px 0', padding: '12px 16px', borderRadius: '10px', backgroundColor: '#27ae60', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600', textAlign: 'center' },
  logoutBtn: { margin: '0 12px', padding: '12px 16px', borderRadius: '10px', border: 'none', backgroundColor: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c', cursor: 'pointer', fontSize: '14px', fontWeight: '600', textAlign: 'left' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 30px', backgroundColor: 'white', borderBottom: '1px solid #e8ecf0' },
  headerTitle: { color: '#0a1f5c', margin: 0, fontSize: '22px', fontWeight: 'bold' },
  headerSubtitle: { color: '#7f8c8d', margin: '4px 0 0', fontSize: '13px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  alertBadge: { backgroundColor: '#fde8e8', color: '#e74c3c', padding: '8px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' },
  badgeCount: { backgroundColor: '#e74c3c', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' },
  patientBadge: { backgroundColor: '#0a1f5c', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  content: { flex: 1, padding: '24px 30px', overflowY: 'auto' },
  cardsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' },
  card: { backgroundColor: 'white', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' },
  cardIcon: { fontSize: '28px' },
  cardLabel: { color: '#7f8c8d', fontSize: '12px', margin: '0 0 4px' },
  cardValue: { color: '#0a1f5c', fontSize: '24px', fontWeight: 'bold', margin: 0 },
  cardBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px' },
  bottomRow: { display: 'flex', gap: '20px', flex: 1 },
  tableSection: { flex: 1, backgroundColor: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' },
  sectionTitle: { color: '#0a1f5c', margin: '0 0 16px', fontSize: '16px', fontWeight: '700' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { backgroundColor: '#f8faff' },
  th: { padding: '12px 14px', textAlign: 'left', color: '#7f8c8d', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', borderBottom: '1px solid #e8ecf0' },
  tr: { borderBottom: '1px solid #f0f2f5' },
  td: { padding: '14px', fontSize: '14px', color: '#2c3e50' },
  badgeOk: { backgroundColor: '#e8f8f0', color: '#27ae60', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  badgeWarning: { backgroundColor: '#fff8e8', color: '#f39c12', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  alertPanel: { width: '280px', backgroundColor: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flexShrink: 0 },
  alertItem: { display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0f2f5' },
  alertItemFull: { display: 'flex', gap: '12px', padding: '16px', borderBottom: '1px solid #f0f2f5', backgroundColor: 'white', borderRadius: '10px', marginBottom: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' },
  alertDot: { width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0, marginTop: '4px' },
  alertMsg: { color: '#2c3e50', fontSize: '13px', fontWeight: '600', margin: '0 0 4px' },
  alertTime: { color: '#bdc3c7', fontSize: '11px', margin: 0 },
  profilGrid: { display: 'flex', flexDirection: 'column', gap: '16px' },
  profilItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0f2f5' },
  profilLabel: { color: '#7f8c8d', fontSize: '14px', fontWeight: '600' },
  profilValue: { color: '#0a1f5c', fontSize: '14px', fontWeight: '600' },
};