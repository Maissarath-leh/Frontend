import { useState } from "react";
import Vitals from "../components/Vitals";
import MedicalRecordForm from "../components/MedicalRecordForm";
import MedicalRecordList from "../components/MedicalRecordList";

export default function PatientDetails({ patientId, doctorId, token, role }) {
  const [tab, setTab] = useState("vitals");

  return (
    <div>
      <h2>Fiche Patient #{patientId}</h2>

      {/* Navigation simple par onglets */}
      <nav style={{ marginBottom: "1rem" }}>
        <button onClick={() => setTab("vitals")}>Constantes</button>
        <button onClick={() => setTab("record")}>Dossier médical</button>
        <button onClick={() => setTab("history")}>Historique</button>
      </nav>

      {/* Onglet Constantes */}
      {tab === "vitals" && <Vitals patientId={patientId} token={token} />}

      {/* Onglet Dossier médical : visible uniquement pour le médecin */}
      {tab === "record" && role === "doctor" && (
        <MedicalRecordForm
          patientId={patientId}
          doctorId={doctorId}
          token={token}
        />
      )}
      {tab === "record" && role === "patient" && (
        <p>Vous ne pouvez pas modifier votre dossier médical.</p>
      )}

      {/* Onglet Historique : visible pour tous */}
      {tab === "history" && (
        <MedicalRecordList patientId={patientId} token={token} />
      )}
    </div>
  );
}

