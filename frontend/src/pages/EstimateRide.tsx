import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EstimateRide = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_id: "",
    origin: "",
    destination: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.customer_id || !form.origin || !form.destination) {
      alert("Por favor, preencha todos os campos!");
      return;
    }
    navigate("/ride", { state: form });
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
            placeholder="Origem"
            value={form.origin}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="destination"
            placeholder="Destino"
            value={form.destination}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
          >
            Estimar Viagem
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstimateRide;
