import { Router } from "express";
import { login, create } from "./controllers/AuthController";
import ValidateAuth from "./services/ValidateAuth";

const routes = Router();

routes.post('/signin', login);
routes.post('/signup', create);

routes.use(ValidateAuth)

routes.get('/', (req, res) => {
  res.send('hello world')
});


export default routes;
