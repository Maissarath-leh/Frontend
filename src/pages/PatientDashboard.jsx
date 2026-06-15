import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function PatientDashboard() {
  const [showVideo, setShowVideo] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mesures, setMesures] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [consultationEnCours, setConsultationEnCours] = useState(null);
  const [demandeEnvoyee, setDemandeEnvoyee] = useState(false);
  const [consultationAcceptee, setConsultationAcceptee] = useState(false);
  const [demandeEnAttente, setDemandeEnAttente] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
  fetchMesures();
  fetchAlertes();
  verifierConsultationActive();
}, []);

useEffect(() => {
  let interval;
  if (demandeEnvoyee && !consultationAcceptee) {
    interval = setInterval(verifierStatutConsultation, 5000);
  }
  return () => clearInterval(interval);
}, [demandeEnvoyee, consultationAcceptee]);

// ⬇️ NOUVEAU - À AJOUTER ⬇️
useEffect(() => {
  let interval;
  if (!demandeEnvoyee && !consultationAcceptee && !demandeEnAttente) {
    interval = setInterval(() => {
      verifierConsultationActive();
    }, 5000);
  }
  return () => clearInterval(interval);
}, [demandeEnvoyee, consultationAcceptee, demandeEnAttente]);
  const fetchMesures = async () => {
    try {
      const res = await api.get('/patient/mes-mesures');
      setMesures(res.data);
    } catch (err) { console.error('Erreur mesures:', err); }
  };

  const fetchAlertes = async () => {
    try {
      const res = await api.get('/patient/mes-alertes');
      setAlertes(res.data);
    } catch (err) { console.error('Erreur alertes:', err); }
  };

 const verifierConsultationActive = async () => {
  try {
    if (!user.patient?.id) {
      console.log('Patient non identifié');
      return;
    }
    const res = await api.get(`/consultations/patient/${user.patient.id}/actives`);
    
    // 1. Chercher une consultation acceptée
    let consultationTrouvee = res.data.find(c => c.status === 'acceptee');
    
    // 2. Si pas de consultation acceptée, chercher un appel du médecin en attente
    if (!consultationTrouvee) {
      consultationTrouvee = res.data.find(c => c.status === 'en_attente' && c.initiated_by === 'medecin');
    }
    
    if (consultationTrouvee) {
      const consultationData = {
        roomName: consultationTrouvee.room_name,
        consultationId: consultationTrouvee.id,
        initiatedBy: consultationTrouvee.initiated_by
      };
      
      setConsultationAcceptee(true);
      setConsultationEnCours(consultationData);
      localStorage.setItem('consultationEnCours', JSON.stringify(consultationData));
      
      // Notification uniquement si le médecin appelle
      if (consultationTrouvee.status === 'en_attente' && consultationTrouvee.initiated_by === 'medecin') {
        if (!localStorage.getItem('alert_shown')) {
          localStorage.setItem('alert_shown', 'true');
          alert('📞 Le médecin vous appelle ! Cliquez sur "Rejoindre la consultation".');
        }
      }
    } else {
      localStorage.removeItem('consultationEnCours');
      localStorage.removeItem('alert_shown');
      setConsultationAcceptee(false);
      setConsultationEnCours(null);
    }
  } catch (err) { console.error('Erreur vérification consultation:', err); }
};
  const verifierStatutConsultation = async () => {
    try {
      if (!user.patient?.id) {
        console.log('Patient non identifié');
        return;
      }
      const res = await api.get(`/consultations/patient/${user.patient.id}/actives`);
      
      // 1. On cherche d'abord s'il y a une consultation acceptée
      const acceptee = res.data.find(c => c.status === 'acceptee');
      if (acceptee) {
        // CORRECTION IMMÉDIATE : On change les états d'abord pour tuer l'intervalle
        setConsultationAcceptee(true);
        setDemandeEnvoyee(false);
        setConsultationEnCours({
          roomName: acceptee.room_name,
          consultationId: acceptee.id
        });

        // On retarde légèrement l'affichage pour laisser React couper le useEffect
        setTimeout(() => {
          alert('🎉 Le médecin a accepté votre consultation ! Cliquez sur "Rejoindre la consultation".');
        }, 50);
        return;
      }
      
      // 2. On vérifie s'il reste une demande en cours de traitement
      const aUneDemandeEnAttente = res.data.some(c => c.status === 'en_attente' || c.status === 'pending');
      
      // 3. On ne valide le refus que si plus aucune demande n'est en attente
      if (!aUneDemandeEnAttente && demandeEnvoyee) {
        const refusee = res.data.find(c => c.status === 'rejetee' || c.status === 'refusee');
        if (refusee) {
          setDemandeEnvoyee(false);
          setDemandeEnAttente(false);
          
          setTimeout(() => {
            alert('❌ Le médecin a refusé votre consultation. Veuillez réessayer plus tard.');
          }, 50);
        }
      }
    } catch (err) { console.error('Erreur vérification statut:', err); }
  };

  const demanderConsultation = async () => {
    if (!user.patient?.id) {
      alert('❌ Patient non identifié. Veuillez vous reconnecter.');
      return;
    }

    if (!user.patient?.medecin_id) {
      alert('❌ Aucun médecin assigné. Veuillez contacter l\'administrateur.');
      return;
    }

    try {
      const res = await api.post('/consultations/demander', {
  medecin_id: user.patient.medecin_id,
  patient_id: user.patient.id,
  initiated_by: 'patient'  // ← Ajoute cette ligne
});
      
      if (res.data.success) {
        setDemandeEnvoyee(true);
        setDemandeEnAttente(true);
        alert('✅ Demande de consultation envoyée au médecin. Veuillez patienter...');
      }
    } catch (err) {
      console.error('Erreur demande consultation:', err);
      alert('❌ Erreur lors de la demande. Veuillez réessayer.');
    }
  };

  const handleRejoindreConsultation = () => {
    if (consultationEnCours?.roomName) {
      setShowVideo(true);
    }
  };

  const terminerConsultation = async () => {
    let currentConsultation = consultationEnCours;
    if (!currentConsultation?.consultationId) {
      const saved = localStorage.getItem('consultationEnCours');
      if (saved) {
        currentConsultation = JSON.parse(saved);
        console.log('Récupéré depuis localStorage:', currentConsultation);
      }
    }
    
    if (!currentConsultation?.consultationId) {
      alert('❌ Aucune consultation active');
      return;
    }
    
    if (!window.confirm('Voulez-vous vraiment terminer cette consultation ?')) return;
    
    try {
      await api.put(`/consultations/${currentConsultation.consultationId}/terminer`);
      
      localStorage.removeItem('consultationEnCours');
      setConsultationAcceptee(false);
      setConsultationEnCours(null);
      setDemandeEnAttente(false);
      setDemandeEnvoyee(false);
      setShowVideo(false);
      
      window.location.reload();
    } catch (err) {
      console.error('Erreur terminaison:', err);
      alert('❌ Erreur lors de la terminaison');
    }
  };
const refuserConsultation = async () => {
  if (!consultationEnCours?.consultationId) {
    alert('❌ Aucune consultation active');
    return;
  }
  
  if (window.confirm('Confirmez-vous que vous n\'êtes pas disponible ?')) {
    try {
      await api.post(`/consultations/${consultationEnCours.consultationId}/rejeter`);
      
      localStorage.removeItem('consultationEnCours');
      setConsultationAcceptee(false);
      setConsultationEnCours(null);
      setDemandeEnAttente(false);
      setDemandeEnvoyee(false);
      setShowVideo(false);
      
      alert('✅ Consultation refusée. Le médecin en sera informé.');
    } catch (err) {
      console.error('Erreur refus consultation:', err);
      alert('❌ Erreur lors du refus');
    }
  }
};
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const derniereMesure = mesures[0] || {};
  const nbAlertes = alertes.filter(a => !a.vue).length;

  return (
    <div style={styles.page}>
      {/* OVERLAY VIDEO */}
      {showVideo && consultationEnCours && (
        <div style={styles.videoOverlay}>
          <div style={styles.videoContainer}>
            <div style={styles.videoHeader}>
              <h3 style={styles.videoTitle}>📹 Téléconsultation en cours</h3>
              <button style={styles.videoClose} onClick={() => setShowVideo(false)}>✕ Terminer</button>
            </div>
            <iframe
              src={`https://meet.jit.si/${consultationEnCours.roomName}`}
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
            🏠 Tableau de bord
          </div>
          <div style={activeTab === 'mesures' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('mesures')}>
            📊 Mes mesures
          </div>
          <div style={activeTab === 'alertes' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('alertes')}>
            🔔 Alertes
          </div>
          <div style={activeTab === 'historique' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('historique')}>
            📋 Historique
          </div>
          <div style={activeTab === 'profil' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('profil')}>
            👤 Mon profil
          </div>

         {consultationAcceptee ? (
  <div>
    <div style={styles.btnAppelActive} onClick={handleRejoindreConsultation}>
      🎥 Rejoindre la consultation
    </div>
    <div style={styles.btnTerminer} onClick={terminerConsultation}>
      🛑 Terminer la consultation
    </div>
    {/* Afficher "Indisponible" SEULEMENT si c'est le médecin qui a appelé */}
    {consultationEnCours?.initiatedBy === 'medecin' && (
      <div style={styles.btnIndisponible} onClick={refuserConsultation}>
        ❌ Je ne suis pas disponible
      </div>
    )}
  </div>
) : demandeEnAttente ? (
            <div style={styles.btnAppelWaiting}>
              ⏳ Demande en attente...
            </div>
          ) : (
            <div style={styles.btnAppel} onClick={demanderConsultation}>
              📹 Appeler mon médecin
            </div>
          )}
        </div>

        <div style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Déconnexion
        </div>
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
              🔔 <span style={styles.badgeCount}>{nbAlertes}</span> alerte{nbAlertes > 1 ? 's' : ''}
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
                  <p style={styles.cardValue}>{derniereMesure.tension_systolique ? derniereMesure.tension_systolique + '/' + derniereMesure.tension_diastolique : '—'}</p>
                </div>
                <div style={{...styles.cardBar, backgroundColor: '#1266f7'}} />
              </div>
              <div style={styles.card}>
                <div style={styles.cardIcon}>🌡️</div>
                <div>
                  <p style={styles.cardLabel}>Température</p>
                  <p style={styles.cardValue}>{derniereMesure.temperature ? derniereMesure.temperature + ' °C' : '—'}</p>
                </div>
                <div style={{...styles.cardBar, backgroundColor: '#0a1f5c'}} />
              </div>
              <div style={styles.card}>
                <div style={styles.cardIcon}>💓</div>
                <div>
                  <p style={styles.cardLabel}>Fréquence cardiaque</p>
                  <p style={styles.cardValue}>{derniereMesure.frequence_cardiaque ? derniereMesure.frequence_cardiaque + ' bpm' : '—'}</p>
                </div>
                <div style={{...styles.cardBar, backgroundColor: '#27ae60'}} />
              </div>
              <div style={{...styles.card, border: '1px solid #fde8e8'}}>
                <div style={styles.cardIcon}>🫁</div>
                <div>
                  <p style={styles.cardLabel}>SpO₂</p>
                  <p style={{...styles.cardValue, color: '#e74c3c'}}>{derniereMesure.saturation_oxygene ? derniereMesure.saturation_oxygene + ' %' : '—'}</p>
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
                      <th style={styles.th}>FC</th>
                      <th style={styles.th}>Temp.</th>
                      <th style={styles.th}>SpO₂</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mesures.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{...styles.td, textAlign: 'center', color: '#7f8c8d'}}>Aucune mesure pour le moment.</td>
                      </tr>
                    ) : (
                      mesures.slice(0, 5).map((m, i) => (
                        <tr key={i} style={styles.tr}>
                          <td style={styles.td}>{new Date(m.date_heure).toLocaleString('fr-FR')}</td>
                          <td style={styles.td}>{m.tension_systolique}/{m.tension_diastolique}</td>
                          <td style={styles.td}>{m.frequence_cardiaque} bpm</td>
                          <td style={styles.td}>{m.temperature} °C</td>
                          <td style={styles.td}>{m.saturation_oxygene} %</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </section>

              <section style={styles.alertPanel}>
                <h2 style={styles.sectionTitle}>Mes alertes</h2>
                {alertes.length === 0 ? (
                  <p style={{color: '#7f8c8d', fontSize: '13px'}}>Aucune alerte pour le moment.</p>
                ) : (
                  alertes.slice(0, 5).map((a, i) => (
                    <div key={i} style={styles.alertItem}>
                      <div style={{...styles.alertDot, backgroundColor: '#e74c3c'}} />
                      <div>
                        <p style={styles.alertMsg}>{a.message}</p>
                        <p style={styles.alertTime}>{new Date(a.created_at).toLocaleString('fr-FR')}</p>
                      </div>
                    </div>
                  ))
                )}
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
                    <th style={styles.th}>FC</th>
                    <th style={styles.th}>Temp.</th>
                    <th style={styles.th}>SpO₂</th>
                  </tr>
                </thead>
                <tbody>
                  {mesures.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{...styles.td, textAlign: 'center', color: '#7f8c8d'}}>Aucune mesure pour le moment.</td>
                    </tr>
                  ) : (
                    mesures.map((m, i) => (
                      <tr key={i} style={styles.tr}>
                        <td style={styles.td}>{new Date(m.date_heure).toLocaleString('fr-FR')}</td>
                        <td style={styles.td}>{m.tension_systolique}/{m.tension_diastolique}</td>
                        <td style={styles.td}>{m.frequence_cardiaque} bpm</td>
                        <td style={styles.td}>{m.temperature} °C</td>
                        <td style={styles.td}>{m.saturation_oxygene} %</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'alertes' && (
          <div style={styles.content}>
            <div style={styles.tableSection}>
              <h2 style={styles.sectionTitle}>Toutes mes alertes</h2>
              {alertes.length === 0 ? (
                <p style={{color: '#7f8c8d', fontSize: '14px'}}>Aucune alerte pour le moment.</p>
              ) : (
                alertes.map((a, i) => (
                  <div key={i} style={styles.alertItemFull}>
                    <div style={{...styles.alertDot, backgroundColor: '#e74c3c'}} />
                    <div>
                      <p style={styles.alertMsg}>{a.message}</p>
                      <p style={styles.alertTime}>{new Date(a.created_at).toLocaleString('fr-FR')}</p>
                    </div>
                  </div>
                ))
              )}
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
                    <th style={styles.th}>FC</th>
                    <th style={styles.th}>Temp.</th>
                    <th style={styles.th}>SpO₂</th>
                  </tr>
                </thead>
                <tbody>
                  {mesures.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{...styles.td, textAlign: 'center', color: '#7f8c8d'}}>Aucune mesure pour le moment.</td>
                    </tr>
                  ) : (
                    mesures.map((m, i) => (
                      <tr key={i} style={styles.tr}>
                        <td style={styles.td}>{new Date(m.date_heure).toLocaleString('fr-FR')}</td>
                        <td style={styles.td}>{m.tension_systolique}/{m.tension_diastolique}</td>
                        <td style={styles.td}>{m.frequence_cardiaque} bpm</td>
                        <td style={styles.td}>{m.temperature} °C</td>
                        <td style={styles.td}>{m.saturation_oxygene} %</td>
                      </tr>
                    ))
                  )}
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
  sidebar: { width: '240px', backgroundColor: '#0a1f5c', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0 },
  sidebarLogo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  sidebarLogoText: { color: 'white', fontWeight: 'bold', fontSize: '18px' },
  patientInfo: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  avatar: { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1266f7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' },
  patientName: { color: 'white', fontWeight: '600', fontSize: '14px', margin: 0 },
  patientRole: { color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: '4px 0 0' },
  sidebarNav: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '20px 12px', flexGrow: 1 },
  navItem: { padding: '12px 16px', borderRadius: '10px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '14px' },
  navItemActive: { padding: '12px 16px', borderRadius: '10px', color: 'white', backgroundColor: '#1266f7', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  btnAppel: { margin: '8px 4px 0', padding: '12px 16px', borderRadius: '10px', backgroundColor: '#27ae60', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600', textAlign: 'center' },
  btnAppelActive: { margin: '8px 4px 0', padding: '12px 16px', borderRadius: '10px', backgroundColor: '#1266f7', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600', textAlign: 'center', animation: 'pulse 1.5s infinite' },
btnTerminer: { margin: '8px 4px 0', padding: '12px 16px', borderRadius: '10px', backgroundColor: '#80a8c9', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600', textAlign: 'center' },
btnIndisponible: { margin: '8px 4px 0', padding: '12px 16px', borderRadius: '10px', backgroundColor: '#e74c3c', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '600', textAlign: 'center' },  // ← Ajoute ici
btnAppelWaiting: { margin: '8px 4px 0', padding: '12px 16px', borderRadius: '10px', backgroundColor: '#f39c12', color: 'white', fontSize: '13px', fontWeight: '600', textAlign: 'center', opacity: 0.7 },  btnAppelWaiting: { margin: '8px 4px 0', padding: '12px 16px', borderRadius: '10px', backgroundColor: '#f39c12', color: 'white', fontSize: '13px', fontWeight: '600', textAlign: 'center', opacity: 0.7 },
  logoutBtn: { margin: '0 12px', padding: '12px 16px', borderRadius: '10px', color: '#e74c3c', backgroundColor: 'rgba(231, 76, 60, 0.2)', cursor: 'pointer', fontSize: '14px', fontWeight: '600', textAlign: 'left' },
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