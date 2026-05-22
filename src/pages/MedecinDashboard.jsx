import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function MedecinDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showVideo, setShowVideo] = useState(false);
  const [showOrdonnance, setShowOrdonnance] = useState(false);
  const [formOrdonnance, setFormOrdonnance] = useState({
  medicament: '',
  posologie: '',
  duree: '',
});
const [pharmacies, setPharmacies] = useState([]);
const [selectedPharmacie, setSelectedPharmacie] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDossier, setShowDossier] = useState(false);
  const [dossierSauvegarde, setDossierSauvegarde] = useState(false);

  // Mode: 'create' | 'edit'
  const [dossierMode, setDossierMode] = useState('create');
  const [editingIndex, setEditingIndex] = useState(null);

  const emptyForm = {
    tension: '', pouls: '', poids: '', temperature: '',
    glycemie: '', spo2: '', diagnostic: '', traitement: '',
    observations: '', prochainRDV: '',
  };

  const [dossierForm, setDossierForm] = useState(emptyForm);

  // Liste des dossiers sauvegardés
  const [dossiers, setDossiers] = useState([]);

  // Dossier affiché en mode "vue détail"
  const [viewingDossier, setViewingDossier] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [patients, setPatients] = useState([]);
const [alertes, setAlertes] = useState([]);
  const fetchDossiers = async () => {
  try {
    const res = await api.get('/medical-records');
    const patientsList = patients.length ? patients : [];
    setDossiers(res.data.map(d => {
      const p = patientsList.find(p => p.id === d.patient_id) || {};
      return {
        id: d.id,
        patient: { 
          nom: p.nom || ('Patient #' + d.patient_id), 
          age: p.age || '?', 
          statut: p.statut || 'Stable',
          alerte: p.alerte || false,
          dernierRDV: p.dernierRDV || '—',
        },
        date: new Date(d.created_at).toLocaleDateString('fr-FR'),
        tension: '—',
        pouls: '—',
        temperature: '—',
        spo2: '—',
        diagnostic: d.diagnosis || '—',
        traitement: d.treatment || '—',
        observations: d.notes || '—',
      };
    }));
  } catch (err) {
    console.error('Erreur dossiers:', err);
  }
};
useEffect(() => {
  fetchPatients();
  fetchAlertes();
}, []);

useEffect(() => {
  if (patients.length > 0) {
    fetchDossiers();
  }
}, [patients]);

const handlePrescrire = async () => {
  if (!selectedPatient || !formOrdonnance.medicament || !selectedPharmacie) return;
  try {
    await api.post('/ordonnances', {
      patient_id: selectedPatient.id,
      pharmacie_id: selectedPharmacie,
      contenu: [{
        medicament: formOrdonnance.medicament,
        posologie: formOrdonnance.posologie,
        duree: formOrdonnance.duree,
      }],
    });
    alert('✅ Ordonnance envoyée à la pharmacie !');
    setShowOrdonnance(false);
    setFormOrdonnance({ medicament: '', posologie: '', duree: '' });
    setSelectedPharmacie('');
  } catch (err) {
    alert('❌ Erreur lors de l\'envoi.');
  }
};
    
const handleSimuler = async () => {
  try {
    await api.post('/simulateur/generer');
    alert('✅ Données simulées !');
    fetchPatients();
  } catch (err) {
    alert('❌ Erreur simulation.');
  }
};
const fetchPharmacies = async () => {
  try {
    const res = await api.get('/pharmacies/liste');
    setPharmacies(res.data);
  } catch (err) {
    console.error('Erreur pharmacies:', err);
  }
};
const fetchAlertes = async () => {
  try {
    const res = await api.get('/medecin/mes-alertes');
    setAlertes(res.data);
  } catch (err) { console.error('Erreur alertes:', err); }
};
const fetchPatients = async () => {
  try {
    const res = await api.get('/medecin/mes-patients');
    setPatients(res.data.map(p => ({
      id: p.id,
      user_id: p.user_id,
      nom: (p.user?.prenom || '') + ' ' + (p.user?.nom || ''),
      age: p.user?.date_naissance 
        ? new Date().getFullYear() - new Date(p.user.date_naissance).getFullYear() 
        : '?',
      dernierRDV: '—',
     tension: p.tension || '—',
     frequence_cardiaque: p.frequence_cardiaque || '—',
    temperature: p.temperature || '—',
    saturation_oxygene: p.saturation_oxygene || '—',
statut: (p.alerte || (p.saturation_oxygene && p.saturation_oxygene < 93) || (p.frequence_cardiaque && (p.frequence_cardiaque < 55 || p.frequence_cardiaque > 105))) ? 'Critique' : 'Stable',     
alerte: (p.saturation_oxygene && p.saturation_oxygene < 93) || (p.frequence_cardiaque && (p.frequence_cardiaque < 55 || p.frequence_cardiaque > 105)),    })));
  } catch (err) {
    console.error('Erreur chargement patients:', err);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Ouvrir formulaire en mode création
  const handleOpenCreate = async (patient) => {
  setSelectedPatient(patient);
  try {
    const res = await api.get(`/medical-records?patient_id=${patient.id}`);
    if (res.data && res.data.length > 0) {
      const dossier = res.data[0];
      setDossierForm({
        tension: dossier.tension || '',
        pouls: dossier.pouls || '',
        poids: dossier.poids || '',
        temperature: dossier.temperature || '',
        glycemie: dossier.glycemie || '',
        spo2: dossier.spo2 || '',
        diagnostic: dossier.diagnosis || '',
        traitement: dossier.treatment || '',
        observations: dossier.notes || '',
        prochainRDV: '',
      });
      setDossierMode('edit');
      setEditingIndex(dossier.id);
    } else {
      setDossierForm(emptyForm);
      setDossierMode('create');
      setEditingIndex(null);
    }
    setShowDossier(true);
  } catch (err) {
    setDossierForm(emptyForm);
    setDossierMode('create');
    setEditingIndex(null);
    setShowDossier(true);
  }
};

  // Ouvrir dossier en vue détail
  const handleViewDossier = (dossier, index) => {
    setViewingDossier({ ...dossier, index });
  };

  // Passer en mode édition depuis la vue détail
  const handleEditFromView = () => {
    const d = viewingDossier;
    // Préparer tout l'état AVANT de fermer la vue détail
    const patient = d.patient;
    const form = {
      tension: d.tension, pouls: d.pouls, poids: d.poids,
      temperature: d.temperature, glycemie: d.glycemie, spo2: d.spo2,
      diagnostic: d.diagnostic, traitement: d.traitement,
      observations: d.observations, prochainRDV: d.prochainRDV,
    };
    const idx = d.index;
    // Fermer vue détail puis ouvrir formulaire dans le même cycle
    setViewingDossier(null);
    setSelectedPatient(patient);
    setDossierForm(form);
    setDossierMode('edit');
    setEditingIndex(idx);
    setShowDossier(true);
  };

  // Ouvrir en mode édition directement depuis la liste
  const handleEditDossier = (dossier, index) => {
    setSelectedPatient(dossier.patient);
    setDossierForm({
      tension: dossier.tension, pouls: dossier.pouls, poids: dossier.poids,
      temperature: dossier.temperature, glycemie: dossier.glycemie, spo2: dossier.spo2,
      diagnostic: dossier.diagnostic, traitement: dossier.traitement,
      observations: dossier.observations, prochainRDV: dossier.prochainRDV,
    });
    setDossierMode('edit');
    setEditingIndex(index);
    setShowDossier(true);
  };
const handleSauvegardeDossier = async () => {
  try {
    let patientId = selectedPatient?.id;
    if (!patientId && editingIndex) {
      // Chercher le patient_id dans le dossier existant
      const dossier = dossiers.find(d => d.id === editingIndex);
      // Le patient_id est stocké dans les données du dossier, pas dans l'objet patient
      patientId = dossier?.patient_id;
    }
    
    const data = {
      patient_id: patientId,
      diagnosis: dossierForm.diagnostic,
      treatment: dossierForm.traitement,
      notes: dossierForm.observations,
    };
    
    if (dossierMode === 'edit' && editingIndex) {
      await api.put(`/medical-records/${editingIndex}`, {
        ...data,
        medecin_id: user.medecin?.id || user.id,
      });
    } else {
      await api.post('/medical-records', {
        ...data,
        medecin_id: user.medecin?.id || user.id,
      });
    }
    alert('✅ Dossier sauvegardé dans la base !');
    setShowDossier(false);
    setDossierForm(emptyForm);
    setEditingIndex(null);
    fetchDossiers(); // Recharger les dossiers
  } catch (err) {
    console.error('Erreur sauvegarde dossier:', err);
  }
};
  const getStatutStyle = (statut) => {
    if (statut === 'Critique') return styles.badgeAlert;
    if (statut === 'Surveillance') return styles.badgeWarning;
    return styles.badgeOk;
  };

  return (
    <div style={styles.page}>

{/* ── MODAL ORDONNANCE ── */}
{showOrdonnance && selectedPatient && (
  <div style={styles.videoOverlay}>
    <div style={styles.dossierContainer}>
      <div style={styles.videoHeader}>
        <h3 style={styles.videoTitle}>💊 Nouvelle ordonnance — {selectedPatient.nom}</h3>
        <button style={styles.videoClose} onClick={() => setShowOrdonnance(false)}>✕ Fermer</button>
      </div>
      <div style={styles.dossierBody}>
        <div style={styles.dossierField}>
          <label style={styles.dossierLabel}>Médicament</label>
          <input style={styles.dossierInput} placeholder="Nom du médicament"
            value={formOrdonnance.medicament}
            onChange={(e) => setFormOrdonnance({...formOrdonnance, medicament: e.target.value})} />
        </div>
        <div style={styles.dossierField}>
          <label style={styles.dossierLabel}>Posologie</label>
          <input style={styles.dossierInput} placeholder="Ex: 1 comprimé matin et soir"
            value={formOrdonnance.posologie}
            onChange={(e) => setFormOrdonnance({...formOrdonnance, posologie: e.target.value})} />
        </div>
        <div style={styles.dossierField}>
          <label style={styles.dossierLabel}>Durée</label>
          <input style={styles.dossierInput} placeholder="Ex: 7 jours"
            value={formOrdonnance.duree}
            onChange={(e) => setFormOrdonnance({...formOrdonnance, duree: e.target.value})} />
        </div>
        <div style={styles.dossierField}>
       <label style={styles.dossierLabel}>Pharmacie</label>
       <select style={styles.dossierInput} value={selectedPharmacie} onChange={(e) => setSelectedPharmacie(e.target.value)}>
       <option value="">-- Choisir une pharmacie --</option>
       {pharmacies.map((ph) => (
      <option key={ph.id} value={ph.id}>{ph.user?.nom || ph.nom}</option>
       ))}
     </select>
    </div>
        <div style={styles.dossierActions}>
          <button style={styles.btnAnnuler} onClick={() => setShowOrdonnance(false)}>Annuler</button>
          <button style={styles.btnSauvegarder} onClick={handlePrescrire}>💾 Envoyer l'ordonnance</button>
        </div>
      </div>
    </div>
  </div>
)}
      {/* ── MODAL TÉLÉCONSULTATION ── */}
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

      {/* ── MODAL DOSSIER MÉDICAL (Création / Édition) ── */}
      {showDossier && selectedPatient && (
        <div style={styles.videoOverlay}>
          <div style={styles.dossierContainer}>
            <div style={styles.videoHeader}>
              <h3 style={styles.videoTitle}>
                {dossierMode === 'edit' ? '✏️ Modifier le dossier' : '📋 Nouveau dossier'} — {selectedPatient.nom}
              </h3>
              <button style={styles.videoClose} onClick={() => { setShowDossier(false); setDossierForm(emptyForm); }}>
                ✕ Fermer
              </button>
            </div>

            <div style={styles.dossierBody}>
              {dossierSauvegarde && (
                <div style={styles.successMsg}>
                  ✅ Dossier {dossierMode === 'edit' ? 'mis à jour' : 'sauvegardé'} avec succès !
                </div>
              )}

              <div style={styles.dossierGrid}>
                {/* Constantes */}
                <div style={styles.dossierSection}>
                  <h4 style={styles.dossierSectionTitle}>📊 Constantes vitales</h4>
                  <div style={styles.dossierRow}>
                    <div style={styles.dossierField}>
                      <label style={styles.dossierLabel}>Tension artérielle</label>
                      <input style={styles.dossierInput} type="text" placeholder="ex: 12/7"
                        value={dossierForm.tension}
                        onChange={(e) => setDossierForm({...dossierForm, tension: e.target.value})} />
                    </div>
                    <div style={styles.dossierField}>
                      <label style={styles.dossierLabel}>Pouls (bpm)</label>
                      <input style={styles.dossierInput} type="text" placeholder="ex: 72"
                        value={dossierForm.pouls}
                        onChange={(e) => setDossierForm({...dossierForm, pouls: e.target.value})} />
                    </div>
                  </div>
                  <div style={styles.dossierRow}>
                    <div style={styles.dossierField}>
                      <label style={styles.dossierLabel}>Poids (kg)</label>
                      <input style={styles.dossierInput} type="text" placeholder="ex: 72"
                        value={dossierForm.poids}
                        onChange={(e) => setDossierForm({...dossierForm, poids: e.target.value})} />
                    </div>
                    <div style={styles.dossierField}>
                      <label style={styles.dossierLabel}>Température (°C)</label>
                      <input style={styles.dossierInput} type="text" placeholder="ex: 37.5"
                        value={dossierForm.temperature}
                        onChange={(e) => setDossierForm({...dossierForm, temperature: e.target.value})} />
                    </div>
                  </div>
                  <div style={styles.dossierRow}>
                    <div style={styles.dossierField}>
                      <label style={styles.dossierLabel}>Glycémie (g/L)</label>
                      <input style={styles.dossierInput} type="text" placeholder="ex: 1.2"
                        value={dossierForm.glycemie}
                        onChange={(e) => setDossierForm({...dossierForm, glycemie: e.target.value})} />
                    </div>
                    <div style={styles.dossierField}>
                      <label style={styles.dossierLabel}>SpO2 (%)</label>
                      <input style={styles.dossierInput} type="text" placeholder="ex: 98"
                        value={dossierForm.spo2}
                        onChange={(e) => setDossierForm({...dossierForm, spo2: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Diagnostic */}
                <div style={styles.dossierSection}>
                  <h4 style={styles.dossierSectionTitle}>🩺 Diagnostic et traitement</h4>
                  <div style={styles.dossierField}>
                    <label style={styles.dossierLabel}>Diagnostic</label>
                    <textarea style={{...styles.dossierInput, height: '80px', resize: 'none'}}
                      placeholder="Entrez le diagnostic..."
                      value={dossierForm.diagnostic}
                      onChange={(e) => setDossierForm({...dossierForm, diagnostic: e.target.value})} />
                  </div>
                  <div style={styles.dossierField}>
                    <label style={styles.dossierLabel}>Traitement prescrit</label>
                    <textarea style={{...styles.dossierInput, height: '80px', resize: 'none'}}
                      placeholder="Entrez le traitement..."
                      value={dossierForm.traitement}
                      onChange={(e) => setDossierForm({...dossierForm, traitement: e.target.value})} />
                  </div>
                  <div style={styles.dossierField}>
                    <label style={styles.dossierLabel}>Observations</label>
                    <textarea style={{...styles.dossierInput, height: '80px', resize: 'none'}}
                      placeholder="Observations supplémentaires..."
                      value={dossierForm.observations}
                      onChange={(e) => setDossierForm({...dossierForm, observations: e.target.value})} />
                  </div>
                  <div style={styles.dossierField}>
                    <label style={styles.dossierLabel}>Prochain RDV</label>
                    <input style={styles.dossierInput} type="date"
                      value={dossierForm.prochainRDV}
                      onChange={(e) => setDossierForm({...dossierForm, prochainRDV: e.target.value})} />
                  </div>
                </div>
              </div>

              <div style={styles.dossierActions}>
                <button style={styles.btnAnnuler} onClick={() => { setShowDossier(false); setDossierForm(emptyForm); }}>
                  Annuler
                </button>
                <button style={styles.btnSauvegarder} onClick={handleSauvegardeDossier}>
                  💾 {dossierMode === 'edit' ? 'Mettre à jour' : 'Sauvegarder le dossier'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL VUE DÉTAIL ── */}
      {viewingDossier && viewingDossier.patient && (
        <div style={styles.videoOverlay}>
          <div style={styles.dossierContainer}>
            <div style={styles.videoHeader}>
              <h3 style={styles.videoTitle}>📄 Dossier de {viewingDossier.patient.nom}</h3>
              <button style={styles.videoClose} onClick={() => setViewingDossier(null)}>✕ Fermer</button>
            </div>
            <div style={styles.dossierBody}>

              {/* Bandeau patient */}
              <div style={styles.viewPatientBanner}>
                <div style={styles.viewAvatar}>{viewingDossier.patient.nom.charAt(0)}</div>
                <div style={{flex: 1}}>
                  <p style={styles.viewPatientName}>{viewingDossier.patient.nom}</p>
                  <p style={styles.viewPatientMeta}>
                    {viewingDossier.patient.age} ans · Dernier RDV : {viewingDossier.patient.dernierRDV}
                  </p>
                </div>
                <span style={getStatutStyle(viewingDossier.patient.statut)}>
                  {viewingDossier.patient.statut}
                </span>
                <p style={styles.viewDate}>📅 Enregistré le {viewingDossier.date}</p>
              </div>

              <div style={styles.dossierGrid}>
                {/* Constantes en lecture */}
                <div style={styles.dossierSection}>
                  <h4 style={styles.dossierSectionTitle}>📊 Constantes vitales</h4>
                  <div style={styles.viewGrid}>
                    {[
                      { label: 'Tension', val: viewingDossier.tension },
                      { label: 'Pouls', val: viewingDossier.pouls ? viewingDossier.pouls + ' bpm' : null },
                      { label: 'Poids', val: viewingDossier.poids ? viewingDossier.poids + ' kg' : null },
                      { label: 'Température', val: viewingDossier.temperature ? viewingDossier.temperature + ' °C' : null },
                      { label: 'Glycémie', val: viewingDossier.glycemie ? viewingDossier.glycemie + ' g/L' : null },
                      { label: 'SpO2', val: viewingDossier.spo2 ? viewingDossier.spo2 + ' %' : null },
                    ].map(({ label, val }) => (
                      <div key={label} style={styles.viewCard}>
                        <span style={styles.viewCardLabel}>{label}</span>
                        <span style={styles.viewCardValue}>{val || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Diagnostic en lecture */}
                <div style={styles.dossierSection}>
                  <h4 style={styles.dossierSectionTitle}>🩺 Diagnostic et traitement</h4>
                  {[
                    { label: 'Diagnostic', val: viewingDossier.diagnostic },
                    { label: 'Traitement prescrit', val: viewingDossier.traitement },
                    { label: 'Observations', val: viewingDossier.observations },
                    { label: 'Prochain RDV', val: viewingDossier.prochainRDV },
                  ].map(({ label, val }) => (
                    <div key={label} style={styles.viewTextBlock}>
                      <p style={styles.viewTextLabel}>{label}</p>
                      <p style={styles.viewTextContent}>{val || 'Non renseigné'}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.dossierActions}>
                <button style={styles.btnAnnuler} onClick={() => setViewingDossier(null)}>
                  Fermer
                </button>
                <button style={styles.btnModifier} onClick={handleEditFromView}>
                  ✏️ Modifier ce dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <img src="/logo.png" alt="logo" style={{height: '40px'}} />
          <span style={styles.sidebarLogoText}>HealthTech</span>
        </div>

        <div style={styles.doctorInfo}>
          <div style={styles.avatar}>{user.nom ? user.nom.charAt(0) : 'M'}</div>
          <p style={styles.doctorName}>Dr. {user.prenom} {user.nom}</p>
          <p style={styles.doctorRole}>Médecin</p>
        </div>

        <div style={styles.sidebarNav}>
          {[
            { key: 'dashboard',  label: 'Tableau de bord' },
            { key: 'patients',   label: ' Mes patients' },
            { key: 'alertes',    label: ' Alertes' },
            { key: 'dossiers',   label: ' Dossiers Médicaux', badge: dossiers.length || null },
          ].map(({ key, label, badge }) => (
            <div
              key={key}
              style={activeTab === key ? styles.navItemActive : styles.navItem}
              onClick={() => setActiveTab(key)}
            >
              <span>{label}</span>
              {badge ? <span style={styles.navBadge}>{badge}</span> : null}
            </div>
          ))}
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>🚪 Déconnexion</button>
      </aside>

      {/* ── CONTENU PRINCIPAL ── */}
      <div style={styles.main}>

        {/* HEADER */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <button style={styles.backBtn} onClick={() => navigate('/')}>← Retour</button>
            <div>
              <h1 style={styles.headerTitle}>
                {activeTab === 'dashboard'  && 'Tableau de bord Médecin'}
                {activeTab === 'patients'   && 'Mes patients'}
                {activeTab === 'alertes'    && 'Alertes'}
                {activeTab === 'dossiers'   && 'Dossiers médicaux'}
              </h1>
              <p style={styles.headerSubtitle}>Vue globale des patients et alertes en cours</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <button style={styles.btnSimuler} onClick={handleSimuler}>🧪 Simuler</button>
            <div style={styles.alertBadge}>
<span style={{color: '#1266f7'}}>🔔</span> <span style={styles.badgeCount}>{alertes.length}</span> alertes
            </div>
            <div style={styles.doctorBadge}>Dr. {user.prenom} {user.nom}</div>          </div>
        </header>

        {/* ════════ DASHBOARD ════════ */}
        {activeTab === 'dashboard' && (
          <>
            <section style={styles.cardsRow}>
  <div style={styles.card}>
    <div style={styles.cardIcon}>👥</div>
    <div>
      <p style={styles.cardLabel}>Patients suivis</p>
      <p style={styles.cardValue}>{patients.length}</p>
    </div>
    <div style={{...styles.cardBar, backgroundColor: '#1266f7'}} />
  </div>
    <div style={{...styles.card, border: '1px solid #fde8e8'}}>
    <div style={styles.cardIcon}>🚨</div>
    <div>
      <p style={styles.cardLabel}>Alertes critiques</p>
<p style={{...styles.cardValue, color: '#e74c3c'}}>{alertes.filter(a => a.niveau === 'critique').length}</p>    </div>
    <div style={{...styles.cardBar, backgroundColor: '#e74c3c'}} />
  </div>
  <div style={styles.card}>
    <div style={styles.cardIcon}>✅</div>
    <div>
      <p style={styles.cardLabel}>Consultations aujourd'hui</p>
      <p style={styles.cardValue}>0</p>
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
                      <th style={styles.th}>FC</th>
                      <th style={styles.th}>Temp.</th>
                      <th style={styles.th}>SpO₂</th>
                      <th style={styles.th}>Statut</th>
                      <th style={styles.th}>Actions</th>
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
                        <td style={styles.td}>{p.tension || '—'}</td>
                        <td style={styles.td}>{p.frequence_cardiaque || '—'} bpm</td>
                        <td style={styles.td}>{p.temperature || '—'} °C</td>
                        <td style={styles.td}>{p.saturation_oxygene || '—'} %</td>
                        <td style={styles.td}>
                          <span style={p.alerte ? styles.badgeAlert : p.statut === 'Surveillance' ? styles.badgeWarning : styles.badgeOk}>
                            {p.statut}
                          </span>
                        </td>
                        <td style={styles.td}>
  <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
    <button style={styles.btnDossier} onClick={() => handleOpenCreate(p)}>
      Saisir le Dossier Médical
    </button>
    <button style={styles.btnConsult} onClick={() => { setSelectedPatient(p); setShowVideo(true); }}>
      Consultation vidéo
    </button>
    <button style={styles.btnPrescrire} onClick={() => { setSelectedPatient(p); setShowOrdonnance(true); fetchPharmacies(); }}>
       Prescrire
    </button>
  </div>
</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section style={styles.alertPanel}>
  <h2 style={styles.sectionTitle}>Alertes récentes</h2>
  {alertes.length === 0 ? (
    <p style={{color: '#7f8c8d', fontSize: '13px'}}>Aucune alerte pour le moment.</p>
  ) : (
    alertes.slice(0, 5).map((a, i) => (
      <div key={i} style={styles.alertItem}>
        <div style={styles.alertDot} />
        <div>
          <p style={styles.alertName}>{a.patient?.user?.prenom} {a.patient?.user?.nom}</p>
          <p style={styles.alertMsg}>{a.message}</p>
          <p style={styles.alertTime}>{new Date(a.created_at).toLocaleString('fr-FR')}</p>
        </div>
      </div>
    ))
  )}
</section>
            </div>
          </>
        )}

        {/* ════════ ONGLET DOSSIERS ════════ */}
        {activeTab === 'dossiers' && (
          <div style={styles.content}>
            {dossiers.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyIcon}>📂</p>
                <h2 style={styles.emptyTitle}>Aucun dossier enregistré</h2>
                <p style={styles.emptyText}>
                  Les dossiers médicaux apparaîtront ici après avoir été sauvegardés
                  depuis l'onglet <strong>Tableau de bord</strong>.
                </p>
                <button style={styles.btnPrimary} onClick={() => setActiveTab('dashboard')}>
                  ← Aller au tableau de bord
                </button>
              </div>
            ) : (
              <div style={styles.dossiersPage}>
                <div style={styles.dossiersHeader}>
                  <div>
                    <h2 style={styles.dossiersTitle}>Tous les dossiers médicaux</h2>
                    <p style={styles.dossiersSubtitle}>
                      {dossiers.length} dossier{dossiers.length > 1 ? 's' : ''} enregistré{dossiers.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div style={styles.dossiersList}>
                  {dossiers.map((d, i) => (
                    <div key={i} style={styles.dossierCard}>
                      {/* Barre colorée selon statut */}
                      <div style={{
                        ...styles.dossierCardAccent,
                        backgroundColor:
                          d.patient.alerte ? '#e74c3c' :
                          d.patient.statut === 'Surveillance' ? '#f39c12' : '#27ae60',
                      }} />

                      <div style={styles.dossierCardContent}>
                        {/* Identité patient */}
                        <div style={styles.dossierCardLeft}>
                          <div style={styles.dossierCardAvatar}>{d.patient.nom.charAt(0)}</div>
                          <div>
                            <p style={styles.dossierCardName}>{d.patient.nom}</p>
                            <p style={styles.dossierCardMeta}>{d.patient.age} ans</p>
                            <span style={getStatutStyle(d.patient.statut)}>{d.patient.statut}</span>
                          </div>
                        </div>

                        {/* Constantes résumées */}
                        {/* Résumé dossier */}
<div style={styles.dossierCardCenter}>
  <div style={styles.dossierConstantes}>
    <div style={styles.dossierConstanteItem}>
      <span style={styles.dossierConstanteLabel}>🩺 Diagnostic</span>
      <span style={{...styles.dossierConstanteVal, fontSize: '12px'}}>{d.diagnostic || '—'}</span>
    </div>
    <div style={styles.dossierConstanteItem}>
      <span style={styles.dossierConstanteLabel}>💊 Traitement</span>
      <span style={{...styles.dossierConstanteVal, fontSize: '12px'}}>{d.traitement || '—'}</span>
    </div>
  </div>
                          {d.diagnostic && (
                            <p style={styles.dossierDiagPreview}>
                              🩺 <em>{d.diagnostic.length > 70 ? d.diagnostic.slice(0, 70) + '…' : d.diagnostic}</em>
                            </p>
                          )}
                        </div>

                        {/* Date + Actions */}
                        <div style={styles.dossierCardRight}>
                          <p style={styles.dossierCardDate}>📅 {d.date}</p>
                          {d.prochainRDV && (
                            <p style={styles.dossierCardRdv}>Prochain RDV : {d.prochainRDV}</p>
                          )}
                          <div style={styles.dossierCardActions}>
                            <button style={styles.btnVoir} onClick={() => handleViewDossier(d, i)}>
                              👁️ Consulter
                            </button>
                            <button style={styles.btnModifier} onClick={() => handleEditDossier(d, i)}>
                              ✏️ Modifier
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════ AUTRES ONGLETS ════════ */}
        {activeTab === 'patients' && (
  <div style={styles.content}>
    <div style={styles.tableCard}>
      <div style={styles.tableHeader}>
        <h2 style={styles.sectionTitle}>Mes patients ({patients.length})</h2>
      </div>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHead}>
            <th style={styles.th}>Patient</th>
            <th style={styles.th}>Âge</th>
            <th style={styles.th}>Dernier RDV</th>
            <th style={styles.th}>Tension</th>
            <th style={styles.th}>Statut</th>
            <th style={styles.th}>Actions</th>
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
                <button style={styles.btnDossier} onClick={() => handleOpenCreate(p)}>📋 Dossier</button>
                <button style={styles.btnConsult} onClick={() => { setSelectedPatient(p); setShowVideo(true); }}>📹 Consulter</button>
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
      <h2 style={styles.sectionTitle}>Toutes les alertes ({alertes.length})</h2>
      {alertes.length === 0 ? (
        <p style={{color: '#7f8c8d', fontSize: '14px'}}>Aucune alerte pour le moment.</p>
      ) : (
        alertes.map((a, i) => (
          <div key={i} style={styles.alertItemFull}>
            <div style={{...styles.alertDot, backgroundColor: '#e74c3c'}} />
            <div>
              <p style={styles.alertName}>{a.patient?.user?.prenom} {a.patient?.user?.nom}</p>
              <p style={styles.alertMsg}>{a.message}</p>
              <p style={styles.alertTime}>{new Date(a.created_at).toLocaleString('fr-FR')}</p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}
{activeTab !== 'dashboard' && activeTab !== 'dossiers' && activeTab !== 'patients' && activeTab !== 'alertes' && (
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

/* ══════════════════════════════════════════
   STYLES
══════════════════════════════════════════ */
const styles = {
  page: {
    display: 'flex', height: '100vh', backgroundColor: '#f0f2f5',
    overflow: 'hidden', position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0, zIndex: 999,
  },

  /* Overlay commun */
  videoOverlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 9999, display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '20px',
  },
  videoContainer: {
    width: '100%', maxWidth: '900px', height: '600px',
    backgroundColor: '#1a1a2e', borderRadius: '16px',
    overflow: 'hidden', display: 'flex', flexDirection: 'column',
  },
  dossierContainer: {
    width: '100%', maxWidth: '900px', backgroundColor: 'white',
    borderRadius: '16px', overflow: 'hidden',
    display: 'flex', flexDirection: 'column', maxHeight: '90vh',
  },
  videoHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 24px', backgroundColor: '#0a1f5c',
  },
  videoTitle: { color: 'white', margin: 0, fontSize: '16px', fontWeight: '600' },
  videoClose: {
    backgroundColor: '#e74c3c', color: 'white', border: 'none',
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '600',
  },
  videoFrame: { flex: 1, border: 'none', width: '100%' },

  /* Corps modal */
  dossierBody: { padding: '24px', overflowY: 'auto' },
  successMsg: {
    backgroundColor: '#e8f8f0', color: '#27ae60', padding: '12px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px',
    fontWeight: '600', textAlign: 'center',
  },
  dossierGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
  dossierSection: { display: 'flex', flexDirection: 'column', gap: '12px' },
  dossierSectionTitle: {
    color: '#0a1f5c', fontSize: '15px', fontWeight: '700',
    margin: '0 0 8px', paddingBottom: '8px', borderBottom: '2px solid #1266f7',
  },
  dossierRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  dossierField: { display: 'flex', flexDirection: 'column', gap: '4px' },
  dossierLabel: { color: '#0a1f5c', fontSize: '12px', fontWeight: '600' },
  dossierInput: {
    padding: '10px 14px', borderRadius: '8px', border: '2px solid #e8ecf0',
    fontSize: '14px', color: '#2c3e50', backgroundColor: '#f8faff',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  },
  dossierActions: {
    display: 'flex', justifyContent: 'flex-end', gap: '12px',
    marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e8ecf0',
  },
  btnAnnuler: {
    padding: '10px 24px', borderRadius: '8px', border: '2px solid #e8ecf0',
    backgroundColor: 'white', color: '#7f8c8d', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer',
  },
  btnSauvegarder: {
    padding: '10px 24px', borderRadius: '8px', border: 'none',
    backgroundColor: '#1266f7', color: 'white', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer',
  },
  btnModifier: {
    padding: '10px 20px', borderRadius: '8px', border: 'none',
    backgroundColor: '#f39c12', color: 'white', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer',
  },
  btnVoir: {
    padding: '10px 20px', borderRadius: '8px', border: 'none',
    backgroundColor: '#1266f7', color: 'white', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer',
  },

  /* Vue détail */
  viewPatientBanner: {
    display: 'flex', alignItems: 'center', gap: '16px',
    backgroundColor: '#f8faff', borderRadius: '12px',
    padding: '16px', marginBottom: '20px', flexWrap: 'wrap',
  },
  viewAvatar: {
    width: '48px', height: '48px', borderRadius: '50%',
    backgroundColor: '#1266f7', color: 'white',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '20px', fontWeight: 'bold', flexShrink: 0,
  },
  viewPatientName: { color: '#0a1f5c', fontWeight: '700', fontSize: '16px', margin: 0 },
  viewPatientMeta: { color: '#7f8c8d', fontSize: '12px', margin: '2px 0 6px' },
  viewDate: { color: '#7f8c8d', fontSize: '12px', margin: 0, marginLeft: 'auto' },
  viewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  viewCard: {
    backgroundColor: '#f8faff', borderRadius: '10px', padding: '12px',
    display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid #e8ecf0',
  },
  viewCardLabel: { color: '#7f8c8d', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' },
  viewCardValue: { color: '#0a1f5c', fontSize: '18px', fontWeight: 'bold' },
  viewTextBlock: {
    backgroundColor: '#f8faff', borderRadius: '10px', padding: '12px',
    border: '1px solid #e8ecf0', marginBottom: '8px',
  },
  viewTextLabel: { color: '#7f8c8d', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', margin: '0 0 6px' },
  viewTextContent: { color: '#2c3e50', fontSize: '14px', margin: 0, lineHeight: '1.5' },

  /* Sidebar */
  sidebar: {
    width: '240px', backgroundColor: '#0a1f5c',
    display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0,
  },
  sidebarLogo: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  sidebarLogoText: { color: 'white', fontWeight: 'bold', fontSize: '18px' },
  doctorInfo: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  avatar: {
    width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#1266f7',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '24px', fontWeight: 'bold', marginBottom: '10px',
  },
  doctorName: { color: 'white', fontWeight: '600', fontSize: '14px', margin: 0, textAlign: 'center' },
  doctorRole: { color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: '4px 0 0' },
  sidebarNav: { display: 'flex', flexDirection: 'column', gap: '4px', padding: '20px 12px', flexGrow: 1 },
  navItem: {
    padding: '12px 16px', borderRadius: '10px', color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer', fontSize: '14px', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
  },
  navItemActive: {
    padding: '12px 16px', borderRadius: '10px', color: 'white',
    backgroundColor: '#1266f7', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  navBadge: {
    backgroundColor: '#e74c3c', color: 'white', borderRadius: '10px',
    padding: '2px 7px', fontSize: '11px', fontWeight: 'bold',
  },
  logoutBtn: {
    margin: '0 12px', padding: '12px 16px', borderRadius: '10px', border: 'none',
    backgroundColor: 'rgba(231, 76, 60, 0.2)', color: '#e74c3c',
    cursor: 'pointer', fontSize: '14px', fontWeight: '600', textAlign: 'left',
  },

  /* Main */
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 30px', backgroundColor: 'white', borderBottom: '1px solid #e8ecf0',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
  backBtn: {
    padding: '8px 16px', borderRadius: '8px', border: '1px solid #e8ecf0',
    backgroundColor: 'white', color: '#0a1f5c', cursor: 'pointer',
    fontSize: '13px', fontWeight: '600',
  },
  headerTitle: { color: '#0a1f5c', margin: 0, fontSize: '20px', fontWeight: 'bold' },
  headerSubtitle: { color: '#7f8c8d', margin: '2px 0 0', fontSize: '12px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  alertBadge: {
    backgroundColor: '#fde8e8', color: '#e74c3c', padding: '8px 14px',
    borderRadius: '20px', fontSize: '13px', fontWeight: '600',
    display: 'flex', alignItems: 'center', gap: '6px',
  },

  btnSimuler: { backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  badgeCount: {
    backgroundColor: '#e74c3c', color: 'white', borderRadius: '50%',
    width: '20px', height: '20px', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold',
  },
  doctorBadge: {
    backgroundColor: '#0a1f5c', color: 'white', padding: '8px 16px',
    borderRadius: '20px', fontSize: '13px', fontWeight: '600',
  },

  /* Dashboard */
cardsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '20px 30px' },  card: {
    backgroundColor: 'white', borderRadius: '14px', padding: '20px',
    display: 'flex', alignItems: 'center', gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden',
  },
  cardIcon: { fontSize: '28px' },
  cardLabel: { color: '#7f8c8d', fontSize: '12px', margin: '0 0 4px' },
  cardValue: { color: '#0a1f5c', fontSize: '28px', fontWeight: 'bold', margin: 0 },
  cardBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px' },
  bottomRow: { display: 'flex', gap: '20px', padding: '0 30px 20px', flex: 1, overflow: 'hidden' },
  tableSection: {
    flex: 1, backgroundColor: 'white', borderRadius: '14px', padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'auto',
    tableCard: {
  backgroundColor: 'white',
  borderRadius: '14px',
  padding: '24px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  width: '100%',
},
  },
  tableSectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { color: '#0a1f5c', margin: 0, fontSize: '16px', fontWeight: '700' },
  btnPrimary: {
    backgroundColor: '#1266f7', color: 'white', border: 'none',
    padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '600',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { backgroundColor: '#f8faff' },
  th: {
    padding: '12px 14px', textAlign: 'left', color: '#7f8c8d', fontSize: '12px',
    fontWeight: '600', textTransform: 'uppercase', borderBottom: '1px solid #e8ecf0',
  },
  tr: { borderBottom: '1px solid #f0f2f5' },
  trAlert: { borderBottom: '1px solid #f0f2f5', backgroundColor: '#fff5f5' },
  td: { padding: '14px', fontSize: '14px', color: '#2c3e50' },
  patientAvatar: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1266f7',
    color: 'white', fontSize: '14px', fontWeight: 'bold', marginRight: '10px',
  },
  badgeOk:      { backgroundColor: '#e8f8f0', color: '#27ae60', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  badgeWarning: { backgroundColor: '#fff8e8', color: '#f39c12', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  badgeAlert:   { backgroundColor: '#fde8e8', color: '#e74c3c', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '600' },
  btnDossier: {
    backgroundColor: '#f0f2f5',
    color: '#0a1f5c',
    border: '1px solid #d5d8dc',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
},
btnConsult: {
    backgroundColor: '#e8f8f0',
    color: '#27ae60',
    border: '1px solid #27ae60',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
},
btnPrescrire: {
    backgroundColor: '#fef5e7',
    color: '#f39c12',
    border: '1px solid #f39c12',
    padding: '8px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
},
  alertPanel: {
    width: '280px', backgroundColor: 'white', borderRadius: '14px', padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'auto', flexShrink: 0,
  },
  alertItem: { display: 'flex', gap: '12px', padding: '14px 0', borderBottom: '1px solid #f0f2f5' },
  alertDot: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#e74c3c', flexShrink: 0, marginTop: '4px' },
  alertName: { color: '#0a1f5c', fontWeight: '600', fontSize: '13px', margin: '0 0 4px' },
  alertMsg:  { color: '#7f8c8d', fontSize: '12px', margin: '0 0 4px' },
  alertTime: { color: '#bdc3c7', fontSize: '11px', margin: 0 },

  /* Onglet Dossiers */
  content: {
    flex: 1, padding: '30px', overflowY: 'auto',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
  },
  dossiersPage: { width: '100%', maxWidth: '900px' },
  dossiersHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' },
  dossiersTitle: { color: '#0a1f5c', fontSize: '20px', fontWeight: '700', margin: 0 },
  dossiersSubtitle: { color: '#7f8c8d', fontSize: '13px', margin: '4px 0 0' },
  dossiersList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  dossierCard: { backgroundColor: 'white', borderRadius: '14px', boxShadow: '0 2px 10px rgba(0,0,0,0.07)', display: 'flex', overflow: 'hidden' },
  dossierCardAccent: { width: '5px', flexShrink: 0 },
  dossierCardContent: { flex: 1, display: 'flex', alignItems: 'center', gap: '20px', padding: '18px 20px', flexWrap: 'wrap' },
  dossierCardLeft: { display: 'flex', alignItems: 'center', gap: '14px', minWidth: '160px' },
  dossierCardAvatar: {
    width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#1266f7',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '18px', fontWeight: 'bold', flexShrink: 0,
  },
  dossierCardName: { color: '#0a1f5c', fontWeight: '700', fontSize: '15px', margin: '0 0 2px' },
  dossierCardMeta: { color: '#7f8c8d', fontSize: '12px', margin: '0 0 6px' },
  dossierCardCenter: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  dossierConstantes: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  dossierConstanteItem: {
    display: 'flex', flexDirection: 'column', backgroundColor: '#f8faff',
    borderRadius: '8px', padding: '6px 12px', border: '1px solid #e8ecf0',
  },
  dossierConstanteLabel: { color: '#7f8c8d', fontSize: '10px', fontWeight: '600' },
  dossierConstanteVal: { color: '#0a1f5c', fontSize: '14px', fontWeight: '700' },
  dossierDiagPreview: { color: '#7f8c8d', fontSize: '12px', margin: 0 },
  dossierCardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', minWidth: '170px' },
  dossierCardDate: { color: '#7f8c8d', fontSize: '12px', margin: 0 },
  dossierCardRdv: { color: '#1266f7', fontSize: '12px', fontWeight: '600', margin: 0 },
  dossierCardActions: { display: 'flex', gap: '8px' },

  /* Empty state */
  emptyState: { textAlign: 'center' },
  emptyIcon:  { fontSize: '48px', margin: '0 0 16px' },
  emptyTitle: { color: '#0a1f5c', fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px' },
  emptyText:  { color: '#7f8c8d', fontSize: '14px', margin: '0 0 20px' },
};