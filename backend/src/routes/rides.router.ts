import { Router } from "express";

import RideController from "../controllers/RideController";

const rideRouter = Router();
const rideController = new RideController();

rideRouter.post('/estimate', rideController.estimate);
rideRouter.patch('/confirm', rideController.confirm);
rideRouter.get('/', rideController.get);
rideRouter.get('/:customer_id', rideController.getRides);

export default rideRouter;
