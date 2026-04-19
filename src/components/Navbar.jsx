import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="logo">MediConnect</div>

        <button className={`burger ${open ? 'open' : ''}`} onClick={() => setOpen((v) => !v)} aria-label="Menu" aria-expanded={open}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-links ${open ? 'active' : ''}`}>
          <Link to="/" onClick={() => setOpen(false)}>Accueil</Link>
          <Link to="/login" onClick={() => setOpen(false)}>Connexion</Link>
          <Link to="/register" onClick={() => setOpen(false)}>Inscription</Link>
          <Link to="/help" onClick={() => setOpen(false)}>Aide</Link>
          <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}
