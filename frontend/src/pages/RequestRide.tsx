import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HttpConnect from "../services/HttpConnect";

const RequestRide: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const handleChooseDriver = async (driverId: number) => {
    try {
      await HttpConnect.patch("/ride/confirm", {
        ...state,
        driver: { id: driverId },
      });
      navigate("/history");
    } catch (err: any) {
      alert(err.response?.data?.error_description || "An unexpected error occurred.");
    }
  };

  return (
    <div>
      <h1>Opções de Viagem</h1>
      <div>
        <h2>Mapa</h2>
        {/* Renderizar um mapa estático com a rota (use a API do Google Maps para isso) */}
      </div>
      <div>
        <h2>Motoristas Disponíveis</h2>
        {state?.drivers?.map((driver: any) => (
          <div key={driver.id}>
            <p>Nome: {driver.name}</p>
            <p>Descrição: {driver.description}</p>
            <p>Veículo: {driver.car}</p>
            <p>Avaliação: {driver.rating}</p>
            <p>Valor: {driver.value}</p>
            <button onClick={() => handleChooseDriver(driver.id)}>Escolher</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestRide;
