import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    try {
      await api.post('/contact', { nom: name, email, message });
      setEnvoye(true);
      setTimeout(() => {
        setEnvoye(false);
        setName('');
        setEmail('');
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.leftOverlay} />
        <div style={styles.leftContent}>
          <div style={styles.badge}>Support 24/7</div>
          <h1 style={styles.leftTitle}>Nous contacter</h1>
          <p style={styles.leftSubtitle}>
            Notre équipe HealthTech est à votre écoute 7j/7 pour répondre à vos besoins.
          </p>

          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <div style={styles.infoIcon}>📧</div>
              <div>
                <p style={styles.infoLabel}>Email</p>
                <p style={styles.infoValue}>support@healthtech.com</p>
              </div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoIcon}>📞</div>
              <div>
                <p style={styles.infoLabel}>Téléphone</p>
                <p style={styles.infoValue}>+229 01 62 12 90 47</p>
              </div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoIcon}>📍</div>
              <div>
                <p style={styles.infoLabel}>Adresse</p>
                <p style={styles.infoValue}>Cotonou, Bénin</p>
              </div>
            </div>
            <div style={styles.infoItem}>
              <div style={styles.infoIcon}>🕐</div>
              <div>
                <p style={styles.infoLabel}>Disponibilité</p>
                <p style={styles.infoValue}>Lundi – Dimanche, 24h/24</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          ← Retour
        </button>

        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Envoyez-nous un message</h2>
            <p style={styles.formSubtitle}>Nous vous répondrons dans les plus brefs délais.</p>
          </div>

          {envoye && (
            <div style={styles.successBox}>
              ✅ Message envoyé avec succès ! Nous vous répondrons bientôt.
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nom complet</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <div style={styles.inputGroup}>
              <label style={styles.label}>Message</label>
              <textarea
                style={{...styles.input, ...styles.textarea}}
                placeholder="Décrivez votre besoin ou votre question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
              />
            </div>

            <div style={styles.actions}>
              <button type="submit" style={styles.btnPrimary}>
                📨 Envoyer le message
              </button>
              <button type="button" style={styles.btnSecondary} onClick={() => navigate('/')}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  leftPanel: {
    flex: 1,
    backgroundColor: '#0a1f5c',
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
  badge: {
    display: 'inline-block',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '20px',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  leftTitle: {
    color: 'white',
    fontSize: '40px',
    fontWeight: 'bold',
    margin: '0 0 16px',
    lineHeight: '1.2',
  },
  leftSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '15px',
    lineHeight: '1.7',
    margin: '0 0 40px',
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  infoIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 2px',
  },
  infoValue: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    margin: 0,
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
  formHeader: {
    marginBottom: '28px',
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
    margin: 0,
  },
  successBox: {
    backgroundColor: '#e8f8f0',
    color: '#27ae60',
    padding: '14px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid #b7e4c7',
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
    transition: 'border-color 0.2s ease',
    fontFamily: 'inherit',
  },
  textarea: {
    resize: 'vertical',
    minHeight: '120px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  btnPrimary: {
    flex: 1,
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
    padding: '14px 24px',
    borderRadius: '10px',
    border: '2px solid #e8ecf0',
    background: 'transparent',
    color: '#7f8c8d',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};  