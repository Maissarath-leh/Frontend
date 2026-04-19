import { useEffect, useState } from "react";
import axios from "axios";

export default function Vitals({ patientId, token }) {
  const [vitals, setVitals] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/patients/${patientId}/vitals`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setVitals(res.data));
  }, [patientId, token]);

  return (
    <div>
      <h3>Constantes vitales</h3>
      {vitals.length === 0 ? (
        <p>Aucune donnée disponible.</p>
      ) : (
        vitals.map(v => (
          <p key={v.id}>
            {v.type}: {v.value} {v.unit} (le {v.recorded_at})
          </p>
        ))
      )}
    </div>
  );
}
