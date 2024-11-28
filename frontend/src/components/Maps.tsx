import React from "react";
import { GoogleMap, LoadScript, PolylineF } from "@react-google-maps/api";

interface MapsProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  path: { lat: number; lng: number }[];
}

const center = {
  lat: -13.009930,
  lng: -38.531930,
}

const Maps: React.FC<MapsProps> = ({ path }) => {
  const mapStyles = { height: "100%", width: "100%" };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={14}
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
