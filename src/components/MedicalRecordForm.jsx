import { useState } from "react";
import axios from "axios";

export default function MedicalRecordForm({ patientId, doctorId, token }) {
  const [form, setForm] = useState({
    blood_type: "",
    allergies: "",
    antecedents: "",
    diagnosis: "",
    treatment: "",
    prescriptions: "",
    hospitalizations: "",
    notes: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/medical-records", {
      patient_id: patientId,
      doctor_id: doctorId,
      ...form
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Dossier médical enregistré !");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Groupe sanguin</label>
      <input name="blood_type" value={form.blood_type} onChange={handleChange} />

      <label>Allergies</label>
      <textarea name="allergies" value={form.allergies} onChange={handleChange} />

      <label>Antécédents</label>
      <textarea name="antecedents" value={form.antecedents} onChange={handleChange} />

      <label>Diagnostic</label>
      <textarea name="diagnosis" value={form.diagnosis} onChange={handleChange} />

      <label>Traitement</label>
      <textarea name="treatment" value={form.treatment} onChange={handleChange} />

      <label>Prescriptions</label>
      <textarea name="prescriptions" value={form.prescriptions} onChange={handleChange} />

      <label>Hospitalisations</label>
      <textarea name="hospitalizations" value={form.hospitalizations} onChange={handleChange} />

      <label>Notes</label>
      <textarea name="notes" value={form.notes} onChange={handleChange} />

      <button type="submit">Enregistrer</button>
    </form>
  );
}
