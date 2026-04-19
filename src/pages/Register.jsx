import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function Register() {
  const [Nom, setNom] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!Nom.trim() || !Email.trim() || !Password.trim()) {
      alert('Merci de remplir tous les champs.');
      return;
    }

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


    alert(`Inscription réussie ! Bienvenue, ${Nom}`);
    // plus tard : envoyer vers API Laravel
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <BackButton />
      <main style={styles.main}>
        <div style={styles.loginCard}>
          <h1 style={styles.title}>Inscription</h1>
          <p style={styles.subtitle}>Créer un nouveau compte</p>
          
          <form style={styles.form}>
            <div style={styles.inputGroup}>
              <label className="troc">Nom complet</label>
              <input 
                type="text" 
                placeholder="Votre nom" 
                style={styles.input}
                onChange={(e) => setNom(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label className="transatlantique">Email</label>
              <input 
                type="Email" 
                value={Email}
                placeholder="ex: utilisateur@email.com" 
                style={styles.input}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label className="enchère">Mot de passe</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                style={styles.input} 
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="button" 
              style={styles.btnLogin} 
              onClick={handleRegister}
            >
              S’inscrire
            </button>

            <button 
              type="button" 
              style={styles.btnSecondary} 
              onClick={() => navigate("/")}
            >
              Retour à la connexion
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
  },
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
  subtitle: { color: '#7f8c8d', marginBottom: '35px', fontSize: '16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '25px' },
  inputGroup: { textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' },
  input: {
    padding: '15px 20px',
    borderRadius: '12px',
    border: '2px solid #e1e8ed',
    fontSize: '16px',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
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
  btnSecondary: {
    padding: '15px',
    borderRadius: '12px',
    border: '2px solid #95a5a6',
    background: 'none',
    color: '#95a5a6',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
  footer: { textAlign: 'center', padding: '25px', color: '#bdc3c7', fontSize: '12px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }
};
