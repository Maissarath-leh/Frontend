import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goHome = () => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      document.getElementById('home-page')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header style={styles.navbar}>
      <div style={styles.inner}>
        <div style={styles.logo}>
          <img src="/logo.png" alt="logo" style={{ height: '45px', width: 'auto' }} />
          <span style={styles.logoText}>HealthTech</span>
        </div>

        <div style={styles.links}>
          <span onClick={goHome} style={styles.link}>Accueil</span>
          <span onClick={() => scrollTo('about')} style={styles.link}>À propos</span>
          <span onClick={() => scrollTo('contact')} style={styles.link}>Contact</span>
          <Link to="/help" style={styles.link}>Aide</Link>
          <Link to="/login" style={styles.btnLogin}>Connexion</Link>
          <Link to="/register" style={styles.btnRegister}>Inscription</Link>
        </div>
      </div>
    </header>
  );
}

const styles = {
  navbar: {
    width: '100%',
    backgroundColor: '#0a1f5c',
    boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxSizing: 'border-box',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 30px',
    height: '65px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '28px',
  },
  link: {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
    cursor: 'pointer',
  },
  btnLogin: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    padding: '8px 18px',
    borderRadius: '20px',
    border: '2px solid rgba(255,255,255,0.5)',
  },
  btnRegister: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    padding: '8px 18px',
    borderRadius: '20px',
    backgroundColor: '#1266f7',
    border: 'none',
  },
};