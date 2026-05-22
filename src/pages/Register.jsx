import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { apiPublic } from "../api";

export default function Register() {
  const [etape, setEtape] = useState(1);
  const [formData, setFormData] = useState({
    nom: '', prenom: '', email: '', telephone: '',
    password: '', password_confirmation: '',
    date_naissance: '', sexe: '', adresse: '',
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleEtapeSuivante = () => {
    setErreur('');
    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.email.trim() ||
        !formData.date_naissance.trim() || !formData.sexe.trim()) {
      setErreur('Merci de remplir tous les champs obligatoires.');
      return;
    }
    setEtape(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErreur('');
    if (!formData.telephone.trim() || !formData.password.trim() || !formData.password_confirmation.trim()) {
      setErreur('Merci de remplir tous les champs obligatoires.');
      return;
    }
    if (formData.password.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setErreur('Le mot de passe doit contenir au moins une lettre majuscule.');
      return;
    }
    if (!/[^a-zA-Z0-9]/.test(formData.password)) {
      setErreur('Le mot de passe doit contenir au moins un caractère spécial.');
      return;
    }
    if (formData.password !== formData.password_confirmation) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      setChargement(true);
      const response = await apiPublic.post('/register', formData);
      const { user, access_token } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/patient-dashboard');
    } catch (err) {
      if (err.response?.status === 422) {
        setErreur(Object.values(err.response.data.errors)[0][0]);
      } else if (err.response?.data?.message) {
        setErreur(err.response.data.message);
      } else if (err.code === 'ERR_NETWORK') {
        setErreur('Le serveur ne répond pas.');
      } else {
        setErreur('Une erreur est survenue.');
      }
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <img src="/doctor.jpg" alt="Médecin" style={styles.doctorImg} />
      </div>

      <div style={styles.rightPanel}>
        <BackButton />
        <div style={styles.formWrapper}>
          
          <div style={styles.logoContainer}>
            <img src="/logo.png" alt="HealthTech Logo" style={styles.logo} />
          </div>

          <div style={styles.stepsIndicator}>
            <div style={{...styles.step, backgroundColor: etape >= 1 ? '#1266f7' : '#e8ecf0', color: etape >= 1 ? 'white' : '#7f8c8d'}}>1</div>
            <div style={{...styles.stepLine, backgroundColor: etape >= 2 ? '#1266f7' : '#e8ecf0'}} />
            <div style={{...styles.step, backgroundColor: etape >= 2 ? '#1266f7' : '#e8ecf0', color: etape >= 2 ? 'white' : '#7f8c8d'}}>2</div>
          </div>

          <h1 style={styles.title}>Inscription</h1>
          <p style={styles.subtitle}>{etape === 1 ? 'Informations personnelles' : 'Coordonnées et sécurité'}</p>

          {erreur && <div style={styles.erreurBox}>{erreur}</div>}

          <form style={styles.form} onSubmit={etape === 1 ? (e) => { e.preventDefault(); handleEtapeSuivante(); } : handleRegister}>

            {etape === 1 && (
              <>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nom *</label>
                  <input type="text" name="nom" placeholder="Votre nom" style={styles.input} value={formData.nom} onChange={handleChange} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Prénom *</label>
                  <input type="text" name="prenom" placeholder="Votre prénom" style={styles.input} value={formData.prenom} onChange={handleChange} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email *</label>
                  <input type="email" name="email" placeholder="ex: utilisateur@email.com" style={styles.input} value={formData.email} onChange={handleChange} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Date de naissance *</label>
                  <input type="date" name="date_naissance" style={{...styles.input, colorScheme: 'light'}} value={formData.date_naissance} onChange={handleChange} onClick={(e) => e.target.showPicker?.()} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Sexe *</label>
                  <select name="sexe" style={styles.input} value={formData.sexe} onChange={handleChange}>
                    <option value="">Sélectionner</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>
                </div>
              </>
            )}

            {etape === 2 && (
              <>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Téléphone *</label>
                  <input type="text" name="telephone" placeholder="ex: +229 01 23 45 67" style={styles.input} value={formData.telephone} onChange={handleChange} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Adresse</label>
                  <input type="text" name="adresse" placeholder="Votre adresse" style={styles.input} value={formData.adresse} onChange={handleChange} />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Mot de passe *</label>
                  <input type="password" name="password" placeholder="••••••••" style={styles.input} value={formData.password} onChange={handleChange} />
                  <small style={styles.hint}>Min. 6 caractères, 1 majuscule, 1 spécial</small>
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Confirmer mot de passe *</label>
                  <input type="password" name="password_confirmation" placeholder="••••••••" style={styles.input} value={formData.password_confirmation} onChange={handleChange} />
                </div>
              </>
            )}

            <div style={styles.btnRow}>
              {etape === 2 && (
                <button type="button" style={styles.btnSecondary} onClick={() => setEtape(1)}>← Retour</button>
              )}
              <button type="submit" style={styles.btnPrimary} disabled={chargement}>
                {chargement ? 'Inscription...' : etape === 1 ? 'Continuer' : "S'inscrire"}
              </button>
            </div>

            <p style={styles.footerText}>
              Déjà un compte ?{' '}
              <span onClick={() => navigate("/login")} style={{color: '#1266f7', cursor: 'pointer', fontWeight: '600'}}>
                Se connecter
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', height: 'calc(100vh - 65px)', overflow: 'hidden' },
  leftPanel: { flex: 1, position: 'relative', overflow: 'hidden' },
  doctorImg: { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' },
  rightPanel: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: '#f0f2f5', padding: '30px 40px', overflowY: 'auto' },
  formWrapper: { maxWidth: '440px', width: '100%', margin: '0 auto', backgroundColor: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(0,0,0,0.08)' },
  logoContainer: { textAlign: 'center', marginBottom: '20px' },
  logo: { width: '120px', height: '120px', borderRadius: '20px' },
  stepsIndicator: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', gap: 0 },
  step: { width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '15px' },
  stepLine: { width: '50px', height: '3px' },
  title: { color: '#2c3e50', marginBottom: '6px', fontSize: '28px', fontWeight: 'bold', textAlign: 'center' },
  subtitle: { color: '#1266f7', marginBottom: '20px', fontSize: '15px', textAlign: 'center' },
  erreurBox: { backgroundColor: '#fde8e8', color: '#c0392b', padding: '12px', borderRadius: '8px', marginBottom: '14px', fontSize: '14px' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  inputGroup: { textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#1a1a2e', fontWeight: '600', fontSize: '13px' },
  input: { padding: '13px 16px', borderRadius: '10px', border: '2px solid #e8ecf0', fontSize: '14px', color: '#1a1a2e', backgroundColor: '#f8faff', outline: 'none', width: '100%', boxSizing: 'border-box' },
  hint: { color: '#95a5a6', fontSize: '11px' },
  btnRow: { display: 'flex', gap: '12px', marginTop: '8px' },
  btnPrimary: { padding: '14px', borderRadius: '10px', border: 'none', background: '#1266f7', color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', flex: 1 },
  btnSecondary: { padding: '14px', borderRadius: '10px', border: '2px solid #1266f7', background: 'transparent', color: '#1266f7', fontSize: '14px', fontWeight: '600', cursor: 'pointer' },
  footerText: { marginTop: '20px', fontSize: '14px', color: '#7f8c8d', textAlign: 'center' },
};