import HttpConnect from "./HttpConnect";

interface EstimateRideRequest {
  customer_id: string;
  origin: string;
  destination: string;
}

interface ConfirmRideRequest {
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

interface Ride {
  id: string;
  date: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
}

interface FetchRides {
  customer_id: string;
  rides: Ride[];
}

export const estimateRide = (data: EstimateRideRequest) => HttpConnect.post("/ride/estimate", data);
export const confirmRide = (data: ConfirmRideRequest) => HttpConnect.patch("/ride/confirm", data);
export const fetchRides = (customerId: string, driverId?: string) =>
  HttpConnect.get<FetchRides>(`/ride/${customerId}`, {
    params: driverId ? { driver_id: driverId } : {},
  });
