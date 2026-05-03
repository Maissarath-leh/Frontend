import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ patients: 0, medecins: 0, pharmacies: 0, total: 0 });
  const [users, setUsers] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [formMedecin, setFormMedecin] = useState({
    nom: '', prenom: '', email: '', telephone: '', password: '', specialite: '',
  });
  const [formPharmacie, setFormPharmacie] = useState({
    nom: '', prenom: '', email: '', telephone: '', password: '',
  });
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression.');
    }
  };

  const handleCreateMedecin = async (e) => {
    e.preventDefault();
    setMessage(''); setErreur(''); setChargement(true);
    try {
      await api.post('/register', { ...formMedecin, role: 'medecin' });
      setMessage('Compte médecin créé avec succès !');
      setFormMedecin({ nom: '', prenom: '', email: '', telephone: '', password: '', specialite: '' });
      fetchStats(); fetchUsers();
    } catch (err) {
      if (err.response?.status === 422) {
        setErreur(Object.values(err.response.data.errors)[0][0]);
      } else {
        setErreur('Une erreur est survenue.');
      }
    } finally {
      setChargement(false);
    }
  };

  const handleCreatePharmacie = async (e) => {
    e.preventDefault();
    setMessage(''); setErreur(''); setChargement(true);
    try {
      await api.post('/register', { ...formPharmacie, role: 'pharmacie' });
      setMessage('Compte pharmacie créé avec succès !');
      setFormPharmacie({ nom: '', prenom: '', email: '', telephone: '', password: '' });
      fetchStats(); fetchUsers();
    } catch (err) {
      if (err.response?.status === 422) {
        setErreur(Object.values(err.response.data.errors)[0][0]);
      } else {
        setErreur('Une erreur est survenue.');
      }
    } finally {
      setChargement(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const roleBadge = (role) => {
    const colors = {
      admin: { bg: '#fde8e8', color: '#e74c3c' },
      medecin: { bg: '#e8f0ff', color: '#1266f7' },
      patient: { bg: '#e8f8f0', color: '#27ae60' },
      pharmacie: { bg: '#f0e8ff', color: '#8e44ad' },
    };
    const c = colors[role] || { bg: '#f0f2f5', color: '#7f8c8d' };
    return (
      <span style={{
        backgroundColor: c.bg,
        color: c.color,
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
      }}>
        {role}
      </span>
    );
  };

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <img src="/logo.png" alt="logo" style={{height: '40px'}} />
          <span style={styles.sidebarLogoText}>HealthTech</span>
        </div>

        <div style={styles.adminInfo}>
          <div style={styles.avatar}>A</div>
          <p style={styles.adminName}>{user.prenom} {user.nom}</p>
          <p style={styles.adminRole}>Administrateur</p>
        </div>

        <div style={styles.sidebarNav}>
          {[
            { id: 'dashboard', icon: '🏠', label: 'Tableau de bord' },
            { id: 'utilisateurs', icon: '👥', label: 'Utilisateurs' },
            { id: 'medecins', icon: '👨‍⚕️', label: 'Créer médecin' },
            { id: 'pharmacies', icon: '💊', label: 'Créer pharmacie' },
          ].map(item => (
            <div
              key={item.id}
              style={activeTab === item.id ? styles.navItemActive : styles.navItem}
              onClick={() => { setActiveTab(item.id); setMessage(''); setErreur(''); }}
            >
              {item.icon} {item.label}
            </div>
          ))}
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Déconnexion
        </button>
      </aside>

      {/* CONTENU */}
      <div style={styles.main}>

        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <button style={styles.backBtn} onClick={() => navigate('/')}>← Retour</button>
            <div>
              <h1 style={styles.headerTitle}>
                {activeTab === 'dashboard' && 'Tableau de bord Admin'}
                {activeTab === 'utilisateurs' && 'Gestion des utilisateurs'}
                {activeTab === 'medecins' && 'Créer un compte médecin'}
                {activeTab === 'pharmacies' && 'Créer un compte pharmacie'}
              </h1>
              <p style={styles.headerSubtitle}>Espace administrateur HealthTech</p>
            </div>
          </div>
          <div style={styles.adminBadge}>👤 Admin</div>
        </header>

        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={styles.content}>
            <div style={styles.cardsRow}>
              <div style={styles.card}>
                <div style={styles.cardIcon}>👥</div>
                <div>
                  <p style={styles.cardLabel}>Total patients</p>
                  <p style={styles.cardValue}>{stats.patients}</p>
                </div>
                <div style={{...styles.cardBar, backgroundColor: '#1266f7'}} />
              </div>
              <div style={styles.card}>
                <div style={styles.cardIcon}>👨‍⚕️</div>
                <div>
                  <p style={styles.cardLabel}>Médecins</p>
                  <p style={styles.cardValue}>{stats.medecins}</p>
                </div>
                <div style={{...styles.cardBar, backgroundColor: '#0a1f5c'}} />
              </div>
              <div style={styles.card}>
                <div style={styles.cardIcon}>💊</div>
                <div>
                  <p style={styles.cardLabel}>Pharmacies</p>
                  <p style={styles.cardValue}>{stats.pharmacies}</p>
                </div>
                <div style={{...styles.cardBar, backgroundColor: '#27ae60'}} />
              </div>
              <div style={{...styles.card, border: '1px solid #fde8e8'}}>
                <div style={styles.cardIcon}>👤</div>
                <div>
                  <p style={styles.cardLabel}>Total utilisateurs</p>
                  <p style={{...styles.cardValue, color: '#1266f7'}}>{stats.total}</p>
                </div>
                <div style={{...styles.cardBar, backgroundColor: '#e74c3c'}} />
              </div>
            </div>

            <div style={styles.welcomeBox}>
              <h2 style={styles.welcomeTitle}>Bienvenue sur le panneau d'administration 👋</h2>
              <p style={styles.welcomeText}>
                Gérez les utilisateurs, créez des comptes médecins et pharmacies,
                et surveillez l'activité de la plateforme HealthTech.
              </p>
              <div style={styles.quickActions}>
                <button style={styles.btnPrimary} onClick={() => setActiveTab('medecins')}>
                  👨‍⚕️ Créer un médecin
                </button>
                <button style={styles.btnSecondary} onClick={() => setActiveTab('pharmacies')}>
                  💊 Créer une pharmacie
                </button>
                <button style={{...styles.btnSecondary, borderColor: '#27ae60', color: '#27ae60'}} onClick={() => setActiveTab('utilisateurs')}>
                  👥 Voir les utilisateurs
                </button>
              </div>
            </div>
          </div>
        )}

        {/* UTILISATEURS */}
        {activeTab === 'utilisateurs' && (
          <div style={styles.content}>
            <div style={styles.tableCard}>
              <div style={styles.tableHeader}>
                <h2 style={styles.sectionTitle}>Liste des utilisateurs ({users.length})</h2>
                <button style={styles.btnPrimary} onClick={fetchUsers}>🔄 Actualiser</button>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Nom</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Téléphone</th>
                    <th style={styles.th}>Rôle</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={styles.tr}>
                      <td style={styles.td}>#{u.id}</td>
                      <td style={styles.td}>
                        <div style={styles.userAvatar}>{u.nom?.charAt(0)}</div>
                        {u.prenom} {u.nom}
                      </td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>{u.telephone}</td>
                      <td style={styles.td}>{roleBadge(u.role)}</td>
                      <td style={styles.td}>
                        {u.role !== 'admin' && (
                          <button
                            style={styles.btnDelete}
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            🗑️ Supprimer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FORMULAIRE MÉDECIN */}
        {activeTab === 'medecins' && (
          <div style={styles.content}>
            <div style={styles.formCard}>
              <h2 style={styles.sectionTitle}>Nouveau compte médecin</h2>
              {message && <div style={styles.successBox}>{message}</div>}
              {erreur && <div style={styles.erreurBox}>{erreur}</div>}
              <form style={styles.form} onSubmit={handleCreateMedecin}>
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Nom</label>
                    <input style={styles.input} type="text" placeholder="Nom du médecin"
                      value={formMedecin.nom}
                      onChange={(e) => setFormMedecin({...formMedecin, nom: e.target.value})} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Prénom</label>
                    <input style={styles.input} type="text" placeholder="Prénom du médecin"
                      value={formMedecin.prenom}
                      onChange={(e) => setFormMedecin({...formMedecin, prenom: e.target.value})} />
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Email</label>
                    <input style={styles.input} type="email" placeholder="email@exemple.com"
                      value={formMedecin.email}
                      onChange={(e) => setFormMedecin({...formMedecin, email: e.target.value})} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Téléphone</label>
                    <input style={styles.input} type="text" placeholder="+229 01 23 45 67"
                      value={formMedecin.telephone}
                      onChange={(e) => setFormMedecin({...formMedecin, telephone: e.target.value})} />
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Spécialité</label>
                    <input style={styles.input} type="text" placeholder="ex: Cardiologue"
                      value={formMedecin.specialite}
                      onChange={(e) => setFormMedecin({...formMedecin, specialite: e.target.value})} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Mot de passe temporaire</label>
                    <input style={styles.input} type="password" placeholder="••••••••"
                      value={formMedecin.password}
                      onChange={(e) => setFormMedecin({...formMedecin, password: e.target.value})} />
                  </div>
                </div>
                <button type="submit"
                  style={{...styles.btnPrimary, opacity: chargement ? 0.7 : 1}}
                  disabled={chargement}>
                  {chargement ? 'Création...' : '✅ Créer le compte médecin'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* FORMULAIRE PHARMACIE */}
        {activeTab === 'pharmacies' && (
          <div style={styles.content}>
            <div style={styles.formCard}>
              <h2 style={styles.sectionTitle}>Nouveau compte pharmacie</h2>
              {message && <div style={styles.successBox}>{message}</div>}
              {erreur && <div style={styles.erreurBox}>{erreur}</div>}
              <form style={styles.form} onSubmit={handleCreatePharmacie}>
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Nom de la pharmacie</label>
                    <input style={styles.input} type="text" placeholder="Nom de la pharmacie"
                      value={formPharmacie.nom}
                      onChange={(e) => setFormPharmacie({...formPharmacie, nom: e.target.value})} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Responsable</label>
                    <input style={styles.input} type="text" placeholder="Prénom du responsable"
                      value={formPharmacie.prenom}
                      onChange={(e) => setFormPharmacie({...formPharmacie, prenom: e.target.value})} />
                  </div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Email</label>
                    <input style={styles.input} type="email" placeholder="email@pharmacie.com"
                      value={formPharmacie.email}
                      onChange={(e) => setFormPharmacie({...formPharmacie, email: e.target.value})} />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Téléphone</label>
                    <input style={styles.input} type="text" placeholder="+229 01 23 45 67"
                      value={formPharmacie.telephone}
                      onChange={(e) => setFormPharmacie({...formPharmacie, telephone: e.target.value})} />
                  </div>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Mot de passe temporaire</label>
                  <input style={styles.input} type="password" placeholder="••••••••"
                    value={formPharmacie.password}
                    onChange={(e) => setFormPharmacie({...formPharmacie, password: e.target.value})} />
                </div>
                <button type="submit"
                  style={{...styles.btnPrimary, opacity: chargement ? 0.7 : 1}}
                  disabled={chargement}>
                  {chargement ? 'Création...' : '✅ Créer le compte pharmacie'}
                </button>
              </form>
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
  adminInfo: {
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
    backgroundColor: '#e74c3c',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  adminName: {
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    margin: 0,
    textAlign: 'center',
  },
  adminRole: {
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
  adminBadge: {
    backgroundColor: '#0a1f5c',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: '24px 30px',
    overflowY: 'auto',
  },
  cardsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
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
  cardIcon: { fontSize: '28px' },
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
    bottom: 0, left: 0, right: 0,
    height: '4px',
  },
  welcomeBox: {
    backgroundColor: 'white',
    borderRadius: '14px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  welcomeTitle: {
    color: '#0a1f5c',
    fontSize: '20px',
    margin: '0 0 12px',
  },
  welcomeText: {
    color: '#7f8c8d',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0 0 20px',
  },
  quickActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  tableCard: {
    backgroundColor: 'white',
    borderRadius: '14px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    color: '#0a1f5c',
    margin: 0,
    fontSize: '16px',
    fontWeight: '700',
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
  td: {
    padding: '14px',
    fontSize: '14px',
    color: '#2c3e50',
  },
  userAvatar: {
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
  btnDelete: {
    backgroundColor: '#fde8e8',
    color: '#e74c3c',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '14px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    maxWidth: '700px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#0a1f5c',
    fontWeight: '600',
    fontSize: '13px',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '2px solid #e8ecf0',
    fontSize: '14px',
    color: '#2c3e50',
    backgroundColor: '#f8faff',
    outline: 'none',
  },
  successBox: {
    backgroundColor: '#e8f8f0',
    color: '#27ae60',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
  },
  erreurBox: {
    backgroundColor: '#fde8e8',
    color: '#e74c3c',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  btnPrimary: {
    padding: '12px 20px',
    borderRadius: '10px',
    border: 'none',
    background: '#1266f7',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '12px 20px',
    borderRadius: '10px',
    border: '2px solid #1266f7',
    background: 'transparent',
    color: '#1266f7',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};