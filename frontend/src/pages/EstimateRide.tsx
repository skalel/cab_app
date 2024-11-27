import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HttpConnect from "../services/HttpConnect";

const EstimateRide: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await HttpConnect.post("/ride/estimate", {
        customer_id: customerId,
        origin,
        destination,
      });
      navigate("/ride", { state: response.data });
    } catch (err: any) {
      setError(err.response?.data?.error_description || "An unexpected error occurred.");
    }
  };

  return (
    <div>
      <h1>Solicitar Viagem</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID do Usuário:</label>
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
        </div>
        <div>
          <label>Endereço de Origem:</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>
        <div>
          <label>Endereço de Destino:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <button type="submit">Estimar Viagem</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default EstimateRide;
