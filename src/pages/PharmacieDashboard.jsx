import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function PharmacieDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ordonnances, setOrdonnances] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchOrdonnances();
  }, []);

  const fetchOrdonnances = async () => {
    try {
      const res = await api.get('/ordonnances');
      setOrdonnances(res.data);
    } catch (err) {
      console.error('Erreur chargement ordonnances:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handlePrendreEnCharge = async (id) => {
    try {
      await api.patch(`/ordonnances/${id}/prendre-en-charge`);
      fetchOrdonnances();
    } catch (err) {
      alert('Erreur lors de la prise en charge.');
    }
  };

  const handleValider = async (id) => {
    try {
      await api.patch(`/ordonnances/${id}/valider`, { statut: 'validee' });
      fetchOrdonnances();
    } catch (err) {
      alert('Erreur lors de la validation.');
    }
  };

  const handleRefuser = async (id) => {
    const motif = prompt('Motif du refus :');
    if (!motif) return;
    try {
      await api.patch(`/ordonnances/${id}/valider`, { statut: 'refusee', motif_refus: motif });
      fetchOrdonnances();
    } catch (err) {
      alert('Erreur lors du refus.');
    }
  };

  const enAttente = ordonnances.filter(o => o.statut === 'en_attente').length;
  const validees = ordonnances.filter(o => o.statut === 'validee').length;
  const refusees = ordonnances.filter(o => o.statut === 'refusee').length;

  const getBadgeStyle = (statut) => {
    if (statut === 'validee') return styles.badgeOk;
    if (statut === 'refusee') return styles.badgeAlert;
    if (statut === 'prise_en_charge') return styles.badgePending;
    return styles.badgePending;
  };

  const getStatutLabel = (statut) => {
    if (statut === 'validee') return '✅ Validée';
    if (statut === 'refusee') return '❌ Refusée';
    if (statut === 'prise_en_charge') return '📋 Prise en charge';
    return '⏳ En attente';
  };

  const OrdonnanceTable = ({ data }) => (
    <table style={styles.table}>
      <thead>
        <tr style={styles.tableHead}>
          <th style={styles.th}>Patient</th>
          <th style={styles.th}>Médecin</th>
          <th style={styles.th}>Médicaments</th>
          <th style={styles.th}>Posologie</th>
          <th style={styles.th}>Date</th>
          <th style={styles.th}>Statut</th>
          <th style={styles.th}>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((o) => (
          <tr key={o.id} style={styles.tr}>
            <td style={styles.td}>
              <span style={styles.avatar2}>{o.patient?.user?.prenom?.charAt(0) || 'P'}</span>
              {o.patient?.user?.prenom} {o.patient?.user?.nom}
            </td>
            <td style={styles.td}>Dr. {o.medecin?.user?.prenom} {o.medecin?.user?.nom}</td>
            <td style={styles.td}>
              {o.contenu?.map((c, i) => (
                <span key={i}>{c.medicament}{i < o.contenu.length - 1 ? ', ' : ''}</span>
              ))}
            </td>
            <td style={styles.td}>
              {o.contenu?.map((c, i) => (
                <span key={i}>{c.posologie} ({c.duree}){i < o.contenu.length - 1 ? ' | ' : ''}</span>
              ))}
            </td>
            <td style={styles.td}>{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
            <td style={styles.td}>
              <span style={getBadgeStyle(o.statut)}>{getStatutLabel(o.statut)}</span>
            </td>
            <td style={styles.td}>
              {o.statut === 'en_attente' && (
                <button style={styles.btnValider} onClick={() => handlePrendreEnCharge(o.id)}>📋 Prendre en charge</button>
              )}
              {o.statut === 'prise_en_charge' && (
                <div style={{display: 'flex', gap: '6px'}}>
                  <button style={styles.btnValider} onClick={() => handleValider(o.id)}>✅ Valider</button>
                  <button style={styles.btnRefuser} onClick={() => handleRefuser(o.id)}>❌ Refuser</button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={styles.page}>

      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <img src="/logo.png" alt="logo" style={{height: '40px'}} />
          <span style={styles.sidebarLogoText}>HealthTech</span>
        </div>

        <div style={styles.pharmacieInfo}>
          <div style={styles.avatar}>💊</div>
          <p style={styles.pharmacieName}>{user.nom}</p>
          <p style={styles.pharmacieRole}>Pharmacie</p>
        </div>

        <div style={styles.sidebarNav}>
          <div style={activeTab === 'dashboard' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('dashboard')}>🏠 Tableau de bord</div>
          <div style={activeTab === 'en_attente' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('en_attente')}>⏳ En attente</div>
          <div style={activeTab === 'validees' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('validees')}>✅ Validées</div>
          <div style={activeTab === 'refusees' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('refusees')}>❌ Refusées</div>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>🚪 Déconnexion</button>
      </aside>

      <div style={styles.main}>

        <header style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>
              {activeTab === 'dashboard' && 'Tableau de bord Pharmacie'}
              {activeTab === 'en_attente' && 'Ordonnances en attente'}
              {activeTab === 'validees' && 'Ordonnances validées'}
              {activeTab === 'refusees' && 'Ordonnances refusées'}
            </h1>
            <p style={styles.headerSubtitle}>Espace Pharmacie HealthTech</p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.alertBadge}>
              ⏳ <span style={styles.badgeCount}>{enAttente}</span> en attente
            </div>
            <div style={styles.pharmacieBadge}>💊 {user.nom}</div>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div style={styles.content}>
            <div style={styles.cardsRow}>
              <div style={styles.card}><div style={styles.cardIcon}>📋</div><div><p style={styles.cardLabel}>Total ordonnances</p><p style={styles.cardValue}>{ordonnances.length}</p></div><div style={{...styles.cardBar, backgroundColor: '#1266f7'}} /></div>
              <div style={styles.card}><div style={styles.cardIcon}>⏳</div><div><p style={styles.cardLabel}>En attente</p><p style={{...styles.cardValue, color: '#f39c12'}}>{enAttente}</p></div><div style={{...styles.cardBar, backgroundColor: '#f39c12'}} /></div>
              <div style={styles.card}><div style={styles.cardIcon}>✅</div><div><p style={styles.cardLabel}>Validées</p><p style={{...styles.cardValue, color: '#27ae60'}}>{validees}</p></div><div style={{...styles.cardBar, backgroundColor: '#27ae60'}} /></div>
              <div style={{...styles.card, border: '1px solid #fde8e8'}}><div style={styles.cardIcon}>❌</div><div><p style={styles.cardLabel}>Refusées</p><p style={{...styles.cardValue, color: '#e74c3c'}}>{refusees}</p></div><div style={{...styles.cardBar, backgroundColor: '#e74c3c'}} /></div>
            </div>
            <div style={styles.tableSection}><h2 style={styles.sectionTitle}>Toutes les ordonnances</h2><OrdonnanceTable data={ordonnances} /></div>
          </div>
        )}

        {activeTab === 'en_attente' && (
          <div style={styles.content}><div style={styles.tableSection}><h2 style={styles.sectionTitle}>Ordonnances en attente</h2><OrdonnanceTable data={ordonnances.filter(o => o.statut === 'en_attente')} /></div></div>
        )}
        {activeTab === 'validees' && (
          <div style={styles.content}><div style={styles.tableSection}><h2 style={styles.sectionTitle}>Ordonnances validées</h2><OrdonnanceTable data={ordonnances.filter(o => o.statut === 'validee')} /></div></div>
        )}
        {activeTab === 'refusees' && (
          <div style={styles.content}><div style={styles.tableSection}><h2 style={styles.sectionTitle}>Ordonnances refusées</h2><OrdonnanceTable data={ordonnances.filter(o => o.statut === 'refusee')} /></div></div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', height: '100vh', backgroundColor: '#f0f2f5', overflow: 'hidden', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 },
  sidebar: { width: '240px', backgroundColor: '#0a1f5c', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0 },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  sidebarLogoText: { color: 'white', fontWeight: 'bold', fontSize: '18px' },
  pharmacieInfo: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  avatar: { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1266f7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '10px' },
  avatar2: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1266f7', color: 'white', fontSize: '14px', fontWeight: 'bold', marginRight: '10px' },
  pharmacieName: { color: 'white', fontWeight: '600', fontSize: '14px', margin: 0, textAlign: 'center' },
  pharmacieRole: { color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: '4px 0 0' },
  sidebarNav: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '20px 12px', flexGrow: 1 },
  navItem: { padding: '12px 16px', borderRadius: '10px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '14px' },
  navItemActive: { padding: '12px 16px', borderRadius: '10px', color: 'white', backgroundColor: '#1266f7', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  logoutBtn: { margin: '0 12px', padding: '12px 16px', borderRadius: '10px', border: 'none', backgroundColor: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c', cursor: 'pointer', fontSize: '14px', fontWeight: '600', textAlign: 'left' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 30px', backgroundColor: 'white', borderBottom: '1px solid #e8ecf0' },
  headerTitle: { color: '#0a1f5c', margin: 0, fontSize: '22px', fontWeight: 'bold' },
  headerSubtitle: { color: '#7f8c8d', margin: '4px 0 0', fontSize: '13px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  alertBadge: { backgroundColor: '#fff8e8', color: '#f39c12', padding: '8px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' },
  badgeCount: { backgroundColor: '#f39c12', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' },
  pharmacieBadge: { backgroundColor: '#0a1f5c', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  content: { flex: 1, padding: '24px 30px', overflowY: 'auto' },
  cardsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' },
  card: { backgroundColor: 'white', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' },
  cardIcon: { fontSize: '28px' },
  cardLabel: { color: '#7f8c8d', fontSize: '12px', margin: '0 0 4px' },
  cardValue: { color: '#0a1f5c', fontSize: '28px', fontWeight: 'bold', margin: 0 },
  cardBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px' },
  tableSection: { backgroundColor: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' },
  sectionTitle: { color: '#0a1f5c', margin: '0 0 16px', fontSize: '16px', fontWeight: '700' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { backgroundColor: '#f8faff' },
  th: { padding: '12px 14px', textAlign: 'left', color: '#7f8c8d', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', borderBottom: '1px solid #e8ecf0' },
  tr: { borderBottom: '1px solid #f0f2f5' },
  td: { padding: '14px', fontSize: '14px', color: '#2c3e50' },
  badgeOk: { backgroundColor: '#e8f8f0', color: '#27ae60', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  badgeAlert: { backgroundColor: '#fde8e8', color: '#e74c3c', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  badgePending: { backgroundColor: '#fff8e8', color: '#f39c12', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  btnValider: { backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  btnRefuser: { backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
};