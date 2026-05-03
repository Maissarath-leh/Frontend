import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import api from "../api";

export default function Register() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErreur('');

    if (!formData.nom.trim() || !formData.prenom.trim() || !formData.email.trim() || !formData.telephone.trim() || !formData.password.trim()) {
      setErreur('Merci de remplir tous les champs.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErreur('Votre email doit être au format user@email.com.');
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

    try {
      setChargement(true);
      const response = await api.post('/register', {
        ...formData,
        role: 'patient',
      });

      const { user, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/patient-dashboard');

    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const premiereErreur = Object.values(errors)[0][0];
        setErreur(premiereErreur);
      } else if (err.response?.data?.message) {
        setErreur(err.response.data.message);
      } else {
        setErreur('Le serveur ne répond pas. Vérifiez que php artisan serve est lancé.');
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
          <h1 style={styles.title}>Inscription</h1>
          <p style={styles.subtitle}>Créer votre compte patient</p>

          {erreur && <div style={styles.erreurBox}>{erreur}</div>}

          <form style={styles.form} onSubmit={handleRegister}>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Nom</label>
              <input type="text" name="nom" placeholder="Votre nom"
                style={styles.input} value={formData.nom} onChange={handleChange} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Prénom</label>
              <input type="text" name="prenom" placeholder="Votre prénom"
                style={styles.input} value={formData.prenom} onChange={handleChange} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input type="email" name="email" placeholder="ex: utilisateur@email.com"
                style={styles.input} value={formData.email} onChange={handleChange} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Téléphone</label>
              <input type="text" name="telephone" placeholder="ex: +229 01 23 45 67"
                style={styles.input} value={formData.telephone} onChange={handleChange} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Mot de passe</label>
              <input type="password" name="password" placeholder="••••••••"
                style={styles.input} value={formData.password} onChange={handleChange} />
              <small style={styles.hint}>Min. 6 caractères, 1 majuscule, 1 caractère spécial</small>
            </div>

            <button type="submit"
              style={{ ...styles.btnPrimary, opacity: chargement ? 0.7 : 1 }}
              disabled={chargement}>
              {chargement ? 'Inscription...' : "S'inscrire"}
            </button>

            <button type="button" style={styles.btnSecondary}
              onClick={() => navigate('/login')}>
              Déjà un compte ? Se connecter
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
 page: {
  display: 'flex',
  height: 'calc(100vh - 65px)',
  overflow: 'hidden',
},

  leftPanel: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  doctorImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: '30px 40px',
    overflowY: 'auto',
  },
  formWrapper: {
    maxWidth: '420px',
    width: '100%',
    margin: '0 auto',
  },
  title: {
    color: '#1a1a2e',
    fontSize: '26px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '16px',
  },
  erreurBox: {
    backgroundColor: '#fde8e8',
    color: '#c0392b',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '12px',
    fontSize: '13px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    color: '#1a1a2e',
    fontWeight: '600',
    fontSize: '13px',
  },
  input: {
    padding: '10px 16px',
    borderRadius: '10px',
    border: '2px solid #1266f7',
    fontSize: '14px',
    color: '#1a1a2e',
    backgroundColor: '#f8faff',
    outline: 'none',
  },
  hint: {
    color: '#95a5a6',
    fontSize: '11px',
  },
  btnPrimary: {
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    background: '#1266f7',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '6px',
  },
  btnSecondary: {
    padding: '12px',
    borderRadius: '10px',
    border: '2px solid #1266f7',
    background: 'transparent',
    color: '#1266f7',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};