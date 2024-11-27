import React, { useState } from "react";
import HttpConnect from "../services/HttpConnect";

const RideHistory: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [rides, setRides] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchRides = async () => {
    setError(null);

    try {
      const response = await HttpConnect.get(`/ride/${customerId}`, {
        params: { driver_id: driverId || undefined },
      });
      setRides(response.data.rides);
    } catch (err: any) {
      setError(err.response?.data?.error_description || "An unexpected error occurred.");
    }
  };

  return (
    <div>
      <h1>Histórico de Viagens</h1>
      <div>
        <label>ID do Usuário:</label>
        <input
          type="text"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
      </div>
      <div>
        <label>ID do Motorista (Opcional):</label>
        <input
          type="text"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
        />
      </div>
      <button onClick={fetchRides}>Filtrar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        {rides.map((ride) => (
          <div key={ride.id}>
            <p>Data: {new Date(ride.date).toLocaleString()}</p>
            <p>Motorista: {ride.driver.name}</p>
            <p>Origem: {ride.origin}</p>
            <p>Destino: {ride.destination}</p>
            <p>Distância: {ride.distance} km</p>
            <p>Tempo: {ride.duration}</p>
            <p>Valor: {ride.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RideHistory;
