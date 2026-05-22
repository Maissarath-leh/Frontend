import './i18n';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import MedecinDashboard from "./pages/MedecinDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Help from "./pages/Help";
import PharmacieDashboard from "./pages/PharmacieDashboard";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import PatientDetails from "./pages/PatientDetails";
import ForgotPassword from "./pages/ForgotPassword";
import './App.css';

function AppContent() {
  const location = useLocation();
  const noNavbar = ['/patient-dashboard', '/medecin-dashboard', '/admin-dashboard'];
  const showNavbar = !noNavbar.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        
        <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/pharmacie-dashboard" element={<PharmacieDashboard />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/medecin-dashboard" element={<MedecinDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patient/:id" element={<PatientDetails />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;