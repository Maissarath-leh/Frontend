import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { apiPublic } from "../api";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErreur('');

    if (!email.trim() || !password.trim()) {
      setErreur('Merci de renseigner un email et un mot de passe.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErreur('Votre email doit être au format user@email.com.');
      return;
    }

    if (password.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    try {
      setChargement(true);
      const response = await apiPublic.post('/login', { email, password });
      const { user, access_token } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'patient') {
        navigate('/patient-dashboard');
      } else if (user.role === 'medecin') {
        navigate('/medecin-dashboard');
      } else if (user.role === 'pharmacie') {
        navigate('/pharmacie-dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.log('Erreur login:', error);
      if (error.response?.status === 401) {
        setErreur('Email ou mot de passe incorrect.');
      } else if (error.code === 'ERR_NETWORK') {
        setErreur('Impossible de joindre le serveur. Laravel tourne ?');
      } else {
        setErreur('Une erreur est survenue. Vérifiez votre connexion.');
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
          <h1 style={styles.title}>Connexion</h1>
          <p style={styles.subtitle}>Espace Utilisateur</p>

          {erreur && <div style={styles.erreurBox}>{erreur}</div>}

          <form style={styles.form} onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="ex: user@gmail.com"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              style={{...styles.btnLogin, opacity: chargement ? 0.7 : 1}}
              disabled={chargement}
            >
              {chargement ? 'Connexion...' : 'Se connecter'}
            </button>
            
            <p style={{textAlign: 'center', marginTop: '12px', fontSize: '13px'}}>
              <span 
                onClick={() => navigate('/forgot-password')} 
                style={{color: '#1266f7', cursor: 'pointer', fontWeight: '600'}}
              >
                Mot de passe oublié ?
              </span>
            </p>
          </form>

          <p style={styles.footerText}>
            Pas encore de compte ?{' '}
            <span onClick={() => navigate("/register")} style={{color: '#1266f7', cursor: 'pointer'}}>
              S'inscrire
            </span>
          </p>

          <footer style={styles.footer}>
            &copy; 2026 - Projet de Télésurveillance par Martine & Maissaratou
          </footer>
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
    backgroundColor: '#f0f2f5',
    padding: '30px 40px',
    overflowY: 'auto',
  },
  formWrapper: {
    maxWidth: '420px',
    width: '100%',
    margin: '0 auto',
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  logo: {
  width: '120px',
  height: '120px',
  borderRadius: '20px',
},
  title: {
    color: '#2c3e50',
    marginBottom: '8px',
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#1266f7',
    marginBottom: '24px',
    fontSize: '15px',
    textAlign: 'center',
  },
  erreurBox: {
    backgroundColor: '#fde8e8',
    color: '#c0392b',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#1a1a2e',
    fontWeight: '600',
    fontSize: '13px',
  },
  input: {
    padding: '13px 16px',
    borderRadius: '10px',
    border: '2px solid #1266f7',
    fontSize: '14px',
    color: '#1a1a2e',
    backgroundColor: '#f8faff',
    outline: 'none',
  },
  btnLogin: {
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: '#1266f7',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
  },
  footerText: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#7f8c8d',
    textAlign: 'center',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#bdc3c7',
    fontSize: '11px',
  },
};