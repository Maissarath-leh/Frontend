import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import MedecinDashboard from "./pages/MedecinDashboard";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import PatientDetails from "./pages/PatientDetails";

import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Page d'accueil */}
        <Route path="/" element={<Home />} />

        {/* Page de connexion */}
        <Route path="/login" element={<Login />} />

        {/* Page d'inscription */}
        <Route path="/register" element={<Register />} />

        {/* Dashboards */}
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/medecin-dashboard" element={<MedecinDashboard />} />

        {/* Pages d'aide et contact */}
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />

        {/* Nouveau tableau de bord et dossier patient */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient/:id" element={<PatientDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
