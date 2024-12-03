import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HttpConnect from "../services/HttpConnect";

const RideHistory: React.FC = () => {
  const [rides, setRides] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [driverId, setDriverId] = useState<string | undefined>("");
  const [drivers, setDrivers] = useState<any[]>([]);

  const fetchDrivers = async () => {
    try {
      const response = await HttpConnect.get("/ride/drivers");
      setDrivers(response.data.drivers);
    } catch (error) {
      console.error("Erro ao buscar motoristas:", error);
    }
  };

  const fetchRides = async (customerId: string, driverId?: string) => {
    try {
      const response = await HttpConnect.get(`/ride/${customerId}`, {
        params: driverId ? { driver_id: driverId } : {},
      });
      setId(customerId);
      setRides(response.data.rides);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleFilterClick = async () => {
    if (customerId) {
      await fetchRides(customerId, driverId);
    } else {
      alert("Por favor, insira o ID do cliente.");
    }
  };

  const navigate = useNavigate();
  const returnIndex = () => {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-2xl text-gray-200 font-bold mb-4">
        Histórico de Viagens
      </h1>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="ID do Cliente"
          className="p-3 border rounded w-1/4"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />

        <select
          className="p-3 border rounded w-1/4"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
        >
          <option value="">Todos os Motoristas</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleFilterClick}
          className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
        >
          Filtrar
        </button>
        <button
          onClick={returnIndex}
          className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 transition"
        >
          Voltar ao início
        </button>
      </div>
      <table className="w-full bg-gray-800 shadow rounded">
        <thead>
          <tr className="bg-gray-800 text-gray-200">
            <th className="text-left p-4">ID</th>
            <th className="text-left p-4">Cliente</th>
            <th className="text-left p-4">Motorista</th>
            <th className="text-left p-4">Distância</th>
            <th className="text-left p-4">Custo</th>
            <th className="text-left p-4">Data</th>
          </tr>
        </thead>
        <tbody>
          {rides.map((ride) => (
            <tr key={ride.id} className="border-b text-gray-200">
              <td className="p-4">{ride.id}</td>
              <td className="p-4">{id}</td>
              <td className="p-4">{ride.driver.name}</td>
              <td className="p-4">{ride.distance} m</td>
              <td className="p-4">R$ {ride.value}</td>
              <td className="p-4">{new Date(ride.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RideHistory;
