import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      await api.post('/forgot-password', { email });
      setMessage('Un code a été envoyé à votre adresse email.');
      setStep(2);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Email introuvable.');
    } finally {
      setChargement(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      await api.post('/verify-reset-code', { email, code });
      setMessage('Code vérifié ! Choisissez un nouveau mot de passe.');
      setStep(3);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Code invalide ou expiré.');
    } finally {
      setChargement(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErreur('');

    if (password.length < 6) {
      setErreur('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setErreur('Le mot de passe doit contenir au moins une majuscule.');
      return;
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      setErreur('Le mot de passe doit contenir au moins un caractère spécial.');
      return;
    }

    setChargement(true);
    try {
      await api.post('/reset-password', { email, code, password });
      setMessage('Mot de passe réinitialisé avec succès !');
      setStep(4);
    } catch (err) {
      setErreur(err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.leftOverlay} />
        <div style={styles.leftContent}>
          <h1 style={styles.leftTitle}>Mot de passe oublié ?</h1>
          <p style={styles.leftSubtitle}>
            Pas de panique ! Entrez votre email et nous vous enverrons un code pour réinitialiser votre mot de passe.
          </p>
          <div style={styles.steps}>
            {['Email', 'Code', 'Nouveau mot de passe', 'Terminé'].map((s, i) => (
              <div key={i} style={styles.stepItem}>
                <div style={{
                  ...styles.stepCircle,
                  backgroundColor: step > i ? '#1266f7' : step === i + 1 ? 'white' : 'rgba(255,255,255,0.2)',
                  color: step === i + 1 ? '#0a1f5c' : 'white',
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{
                  ...styles.stepLabel,
                  color: step === i + 1 ? 'white' : 'rgba(255,255,255,0.5)',
                }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <button style={styles.backBtn} onClick={() => navigate('/login')}>
          ← Retour à la connexion
        </button>

        <div style={styles.formCard}>

          {step === 1 && (
            <>
              <h2 style={styles.formTitle}>Entrez votre email</h2>
              <p style={styles.formSubtitle}>Nous vous enverrons un code de vérification.</p>
              {erreur && <div style={styles.erreurBox}>{erreur}</div>}
              <form onSubmit={handleSendCode} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Adresse email</label>
                  <input
                    style={styles.input}
                    type="email"
                    placeholder="vous@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" style={styles.btnPrimary} disabled={chargement}>
                  {chargement ? 'Envoi...' : '📨 Envoyer le code'}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={styles.formTitle}>Entrez le code reçu</h2>
              <p style={styles.formSubtitle}>Vérifiez votre boîte email — le code expire dans 10 minutes.</p>
              {message && <div style={styles.successBox}>{message}</div>}
              {erreur && <div style={styles.erreurBox}>{erreur}</div>}
              <form onSubmit={handleVerifyCode} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Code à 6 chiffres</label>
                  <input
                    style={{...styles.input, textAlign: 'center', fontSize: '24px', letterSpacing: '8px'}}
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" style={styles.btnPrimary} disabled={chargement}>
                  {chargement ? 'Vérification...' : '✅ Vérifier le code'}
                </button>
                <button type="button" style={styles.btnSecondary} onClick={() => { setStep(1); setErreur(''); setMessage(''); }}>
                  ← Changer l'email
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2 style={styles.formTitle}>Nouveau mot de passe</h2>
              <p style={styles.formSubtitle}>Choisissez un mot de passe sécurisé.</p>
              {message && <div style={styles.successBox}>{message}</div>}
              {erreur && <div style={styles.erreurBox}>{erreur}</div>}
              <form onSubmit={handleResetPassword} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Nouveau mot de passe</label>
                  <input
                    style={styles.input}
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <small style={styles.hint}>Min. 6 caractères, 1 majuscule, 1 caractère spécial</small>
                </div>
                <button type="submit" style={styles.btnPrimary} disabled={chargement}>
                  {chargement ? 'Réinitialisation...' : '🔒 Réinitialiser le mot de passe'}
                </button>
              </form>
            </>
          )}

          {step === 4 && (
            <div style={styles.successState}>
              <div style={styles.successIcon}>✅</div>
              <h2 style={styles.formTitle}>Mot de passe réinitialisé !</h2>
              <p style={styles.formSubtitle}>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
              <button style={styles.btnPrimary} onClick={() => navigate('/login')}>
                Se connecter
              </button>
            </div>
          )}

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
    backgroundImage: "url('/fond2.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(10,31,92,0.92), rgba(18,102,247,0.75))',
  },
  leftContent: {
    position: 'relative',
    zIndex: 1,
    padding: '40px',
    maxWidth: '400px',
  },
  leftTitle: {
    color: 'white',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 16px',
  },
  leftSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '15px',
    lineHeight: '1.7',
    margin: '0 0 40px',
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  stepCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  stepLabel: {
    fontSize: '14px',
    fontWeight: '500',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '40px',
    overflowY: 'auto',
  },
  backBtn: {
    alignSelf: 'flex-start',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #e8ecf0',
    backgroundColor: 'white',
    color: '#0a1f5c',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '24px',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    maxWidth: '480px',
    width: '100%',
    margin: '0 auto',
  },
  formTitle: {
    color: '#0a1f5c',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 8px',
  },
  formSubtitle: {
    color: '#7f8c8d',
    fontSize: '14px',
    margin: '0 0 24px',
  },
  successBox: {
    backgroundColor: '#e8f8f0',
    color: '#27ae60',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    fontWeight: '600',
  },
  erreurBox: {
    backgroundColor: '#fde8e8',
    color: '#e74c3c',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
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
    padding: '13px 16px',
    borderRadius: '10px',
    border: '2px solid #e8ecf0',
    fontSize: '14px',
    color: '#2c3e50',
    backgroundColor: '#f8faff',
    outline: 'none',
    fontFamily: 'inherit',
  },
  hint: {
    color: '#95a5a6',
    fontSize: '12px',
  },
  btnPrimary: {
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: '#1266f7',
    color: 'white',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '12px',
    borderRadius: '10px',
    border: '2px solid #e8ecf0',
    background: 'transparent',
    color: '#7f8c8d',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  successState: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: '60px',
  },
};