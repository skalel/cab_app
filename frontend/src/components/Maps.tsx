import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, PolylineF } from "@react-google-maps/api";

interface MapsProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  path: { lat: number; lng: number }[];
}

const Maps: React.FC<MapsProps> = ({ path }) => {
  const [center, setCenter] = useState<{ lat: number; lng: number } | undefined>(
    undefined
  );

  useEffect(() => {
    const calculateCenter = () => {
      const totalPoints = path.length;
      const { lat, lng } = path.reduce(
        (acc, point) => ({
          lat: acc.lat + point.lat,
          lng: acc.lng + point.lng,
        }),
        { lat: 0, lng: 0 }
      );

      return { lat: lat / totalPoints, lng: lng / totalPoints };
    };

    setCenter(calculateCenter());

  }, [path]);

  const mapStyles = { height: "100%", width: "100%" };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={12}
        center={center}
      >
        <PolylineF
          path={path}
          options={{
            strokeColor: "#007bff",
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default Maps;
