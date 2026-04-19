import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";


export default function Login() {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Role, setRole] = useState('patient'); // valeur par défaut
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!Email.trim() || !Password.trim()) {
      alert('Merci de renseigner un email et un mot de passe.');
      return;
    }

    // Exemple de validation simple à améliorer côté API

    if (!/[^a-zA-Z0-9]/.test(Password)) {
        alert('Le mot de passe doit contenir au moins 1 caractère spécial');
        return;
    }

    if (Password.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (!/[A-Z]/.test(Password)){
        alert('Le mot de passe doit contenir au moins une lettre majuscule.');
        return;
    }

     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(Email)) {
    alert('Votre email doit être au format user@email.com.');
    return;
}


    alert(`Connexion réussie en tant que ${Role}`);

    if (Role === 'patient') {
      navigate('/patient-dashboard');
    } else if (Role === 'medecin') {
      navigate('/medecin-dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div style={styles.container}>
      <BackButton />


      {/* --- CORPS DE LA PAGE --- */}
      <main style={styles.main}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>Connexion</h1>
          <p style={styles.subtitle}>Espace Utilisateur</p>
          
          <form style={styles.form}>
            <div style={styles.inputGroup}>
              <label className="email">Email</label>
              <input 
                type="email" required
                placeholder="ex: user@gmail.com" 
                style={styles.input}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label className="password">Mot de passe</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                style={styles.input} 
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* --- CHOIX DU RÔLE --- */}
            <div style={styles.inputGroup}>
              <label className="youare">Vous êtes :</label>
              <select 
                style={styles.select} 
                value={Role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="medecin">Médecin</option>
                <option value="patient">Patient</option>
              </select>
            </div>

            <button 
              type="button" 
              style={styles.btnLogin} 
              onClick={handleLogin}
            >
              Se connecter
            </button>
          </form>

          <p style={styles.footerText}>
            Pas encore de compte ? <span onClick={() => navigate("/register")} style={{color: '#3498db', cursor: 'pointer'}}>S'inscrire</span>
          </p>
        </div>
      </main>

      {/* --- PIED DE PAGE --- */}
      <footer style={styles.footer}>
        &copy; 2026 - Projet de Télésurveillance par Martine & Maissaratou
      </footer>
    </div>
  )
}

// --- STYLE ---
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 50px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'relative',
    zIndex: 10,
  },
  logo: { color: '#2c3e50', margin: 0, fontSize: '28px', fontWeight: 'bold' },
  btnNav: { padding: '10px 18px', borderRadius: '25px', border: '2px solid #3498db', background: 'none', color: '#3498db', cursor: 'pointer', marginRight: '15px', fontWeight: 'bold', transition: 'all 0.3s ease' },
  btnContact: { padding: '10px 18px', borderRadius: '25px', border: '2px solid #3498db', background: 'none', color: '#3498db', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s ease' },
  main: { display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, padding: '20px' },
  loginCard: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
    animation: 'slideIn 0.5s ease-out',
  },
  title: { color: '#2c3e50', marginBottom: '10px', fontSize: '32px', fontWeight: 'bold' },
  subtitle: { color: '#1266f7', marginBottom: '35px', fontSize: '16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '25px' },
  inputGroup: { textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' },
  input: {
    padding: '15px 20px',
    borderRadius: '12px',
    border: '2px solid #e1e8ed',
    fontSize: '16px',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  select: {
    padding: '15px 20px',
    borderRadius: '12px',
    border: '2px solid #e1e8ed',
    fontSize: '16px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'border-color 0.3s ease',
  },
  btnLogin: {
    padding: '15px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #1266f7, #1266f7)',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '15px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  footerText: { marginTop: '25px', fontSize: '14px', color: '#7f8c8d' },
  footer: { textAlign: 'center', padding: '25px', color: '#bdc3c7', fontSize: '12px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }
};
