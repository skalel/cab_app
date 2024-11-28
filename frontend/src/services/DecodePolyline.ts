import polyline from "@mapbox/polyline";

export const decodePolyline = (polylineString: string) => {
  return polyline
    .decode(polylineString)
    .map(([lat, lng]) => ({ lat, lng }));
};