import { useEffect, useState } from "react";
import axios from "axios";

export default function MedicalRecordList({ patientId, token }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/patients/${patientId}/medical-records`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setRecords(res.data));
  }, [patientId, token]);

  return (
    <div>
      <h3>Historique du dossier médical</h3>
      {records.length === 0 ? (
        <p>Aucun dossier enregistré.</p>
      ) : (
        records.map(r => (
          <div key={r.id}>
            <p><b>Diagnostic:</b> {r.diagnosis}</p>
            <p><b>Traitement:</b> {r.treatment}</p>
            <p><b>Prescriptions:</b> {r.prescriptions}</p>
            <p><b>Hospitalisations:</b> {r.hospitalizations}</p>
            <p><b>Notes:</b> {r.notes}</p>
            <hr/>
          </div>
        ))
      )}
    </div>
  );
}
