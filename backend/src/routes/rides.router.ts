import { Router } from "express";

import RideController from "../controllers/RideController";

const rideRouter = Router();
const rideController = new RideController();

rideRouter.post('/estimate', rideController.estimate);

export default rideRouter;
