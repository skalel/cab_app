import { Router } from "express";
import { login, create } from "./controllers/AuthController";

import ValidateAuth from "./services/ValidateAuth";

import usersRouter from "./routes/users.router";
import driversRouter from "./routes/drivers.router";

const routes = Router();

routes.post('/signin', login);
routes.post('/signup', create);

routes.use(ValidateAuth)

routes.use('/user', usersRouter);
routes.use('/driver', driversRouter);


export default routes;
