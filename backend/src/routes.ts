import { Router } from "express";
import { login, create } from "./controllers/AuthController";
import ValidateAuth from "./services/ValidateAuth";
import usersRouter from "./routes/users.router";

const routes = Router();

routes.post('/signin', login);
routes.post('/signup', create);

routes.use(ValidateAuth)

routes.use('/user', usersRouter);


export default routes;
