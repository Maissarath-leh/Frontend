import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    alert('Message envoy�, merci !');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="page contact-page">
      <BackButton />
      <main className="contact-hero">
        <section className="contact-info">
          <h1>Nous contacter</h1>
          <p>Notre équipe MediConnect est à votre écoute 7j/7 pour répondre à vos besoins.</p>
          <div className="contact-details">
            <p><strong>Email :</strong> support@mediconnect.fr</p>
            <p><strong>Téléphone :</strong> +33 1 23 45 67 89</p>
            <p><strong>Adresse :</strong> 38 rue de l'Innovation, 75000 Paris</p>
          </div>
        </section>

        <section className="contact-form-wrapper">
          <div className="contact-card">
            <h2>Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="form-card">
              <label>Nom</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <label>Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} />
              <div className="action-group">
                <button type="submit" className="btn primary">Envoyer</button>
                <button type="button" className="btn outline" onClick={() => navigate('/')}>Annuler</button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
