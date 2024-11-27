import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EstimateRide from "../pages/EstimateRide";
import RequestRide from "../pages/RequestRide";
import RideHistory from "../pages/RideHistory";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EstimateRide />} />
        <Route path="/ride" element={<RequestRide />} />
        <Route path="/history" element={<RideHistory />} />
      </Routes>
    </Router>
  );
}
