import { Router } from "express";

import DriverController from "../controllers/DriverController";

const driverRouter = Router();
const driverController = new DriverController();

driverRouter.get('/', driverController.all);
driverRouter.post('/', driverController.create);
driverRouter.get('/:id', driverController.findById);
driverRouter.patch('/:id', driverController.update);
driverRouter.delete('/:id', driverController.delete);

export default driverRouter;
