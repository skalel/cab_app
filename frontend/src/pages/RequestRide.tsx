import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!formData) {
      navigate("/");
      return;
    }

    const fetchEstimate = async () => {
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

        const drivers = options[0];

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
        setDrivers(drivers);
      } catch (error) {
        console.error("Error fetching estimate:", error);
      }
    };

    fetchEstimate();
  }, [formData, navigate]);

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
      console.error("Error confirming ride:", error);
    }
  };

  if (!routeData)
    return (
      <div className="flex items-center justify-center text-center">
        <p>Carregando...</p>
      </div>
    );

  return (
    <div className="flex h-screen">
      {/* Map Section */}
      <div className="w-1/2 h-full bg-gray-200">
        <Maps
          origin={routeData.origin}
          destination={routeData.destination}
          path={routeData.polylinePath}
        />
      </div>

      {/* Drivers Section */}
      <div className="w-1/2 h-full bg-gray-900 p-8 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-200">
          Motoristas Disponíveis
        </h2>
        <div className="space-y-4">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className="p-4 border rounded flex items-center justify-between bg-gray-200"
            >
              <div>
                <h3 className="font-semibold">{driver.name}</h3>
                <p className="text-sm text-gray-600">{driver.description}</p>
                <p className="text-sm text-gray-600">{driver.car}</p>
                <div className="flex flex-row">
                  <div className="text-sm text-gray-600 px-2 shrink items-center text-center flex flex-row">
                    Nota {driver.review.rating}
                  </div>
                  <div className="text-sm text-gray-600 border border-gray-800 p-2 m-2 rounded">
                    {driver.review.comment}
                  </div>
                </div>
                <p className="text-md text-gray-600">R$ {driver.value}</p>
              </div>
              <button
                onClick={() => handleChooseDriver(driver.id)}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
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
