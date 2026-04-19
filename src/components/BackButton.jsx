import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      className="back-arrow"
      onClick={() => navigate(-1)}
      title="Retour"
    >
      ←
    </button>
  );
}