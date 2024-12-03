import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HttpConnect from "../services/HttpConnect";

const EstimateRide = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_id: "",
    origin: "",
    destination: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await HttpConnect.post("/ride/estimate", {
        customer_id: form.customer_id,
        origin: form.origin,
        destination: form.destination,
      });

      if (response.data) {
        navigate("/ride", { state: form });
      } else {
        console.error("Erro na validação: " + response.data.message);
      }
    } catch (error) {
      console.error("Erro ao validar os dados:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 h-full bg-gray-700 flex items-center justify-center">
      </div>

      <div className="w-1/2 h-full flex items-center justify-center bg-gray-800">
        <div className="bg-gray-800 p-8 rounded shadow-md w-3/4 space-y-6">
          <h2 className="text-xl text-gray-200 font-bold text-center">Solicitar Viagem</h2>
          <input
            type="text"
            name="customer_id"
            placeholder="ID do Cliente"
            value={form.customer_id}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="origin"
            placeholder="Origem: 'Av. Antônio Carlos Magalhães, Salvador, Bahia'"
            value={form.origin}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="destination"
            placeholder="Destino: 'BA-099 - Abrantes, Camaçari - BA'"
            value={form.destination}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Estimando..." : "Estimar Viagem"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstimateRide;
