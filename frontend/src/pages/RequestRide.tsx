import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HttpConnect from "../services/HttpConnect";
import { decodePolyline } from "../services/DecodePolyline";
import Maps from "../components/Maps";

const RequestRide = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state as {
    customer_id: string;
    origin: string;
    destination: string;
  };

  const [routeData, setRouteData] = useState<any | null>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstimate = async () => {
      if (!formData) {
        setError("Dados inválidos. Por favor, inicie o processo novamente.");
        setLoading(false);
        return;
      }

      try {
        const response = await HttpConnect.post("/ride/estimate", formData);
        const {
          routeResponse,
          origin,
          destination,
          options,
          distance,
          duration,
        } = response.data;

        const decodedPolyline = decodePolyline(
          routeResponse.routes[0].polyline.encodedPolyline
        );

        setRouteData({
          origin: { lat: origin.lat, lng: origin.lng },
          destination: { lat: destination.lat, lng: destination.lng },
          polylinePath: decodedPolyline,
          distance,
          duration,
          options,
        });
        setDrivers(options[0]);
      } catch (error) {
        console.error("Erro ao buscar estimativa:", error);
        setError("Erro ao buscar estimativa. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchEstimate();
  }, [formData]);

  const handleChooseDriver = async (driverId: string) => {
    const selectedDriver = drivers.find(
      (driver) => driver.id === Number(driverId)
    );

    try {
      await HttpConnect.patch("/ride/confirm", {
        customer_id: formData.customer_id,
        origin: formData.origin,
        destination: formData.destination,
        distance: routeData.distance,
        duration: routeData.duration,
        driver: { id: selectedDriver.id, name: "" },
        value: selectedDriver.value,
      });
      alert("Viagem confirmada!");
      navigate("/history");
    } catch (error) {
      console.error("Erro ao confirmar a viagem:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center text-center h-screen bg-gray-900">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full border-t-4 border-blue-500 w-16 h-16"></div>
          <p className="text-white text-xl">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center text-center h-screen bg-gray-900">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.replace("/")}
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/2 h-full bg-gray-200">
        <Maps
          origin={routeData.origin}
          destination={routeData.destination}
          path={routeData.polylinePath}
        />
      </div>

      <div className="w-1/2 h-full bg-gray-900 p-8 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-200">
          Motoristas Disponíveis
        </h2>
        <div className="space-y-4">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="p-4 m-2 border border-gray-300 shadow-md rounded-lg flex items-center justify-between bg-white hover:shadow-lg transition-shadow"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {driver.name}
                </h3>
                <p className="text-sm text-gray-600 italic">
                  {driver.description}
                </p>
                <p className="text-sm text-gray-700 font-medium">
                  {driver.car}
                </p>
                <div className="flex flex-row items-center mt-2 space-x-2">
                  <div className="text-sm text-gray-600 bg-green-100 px-3 py-1 rounded-full">
                    Nota: {driver.review.rating}
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full shrink">
                    {driver.review.comment}
                  </div>
                </div>
                <p className="text-md text-gray-800 font-bold mt-3">
                  R$ {driver.value}
                </p>
              </div>
              <button
                onClick={() => handleChooseDriver(driver.id)}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all"
              >
                Escolher
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestRide;
