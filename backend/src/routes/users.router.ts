import { Router } from "express";

import UserController from "../controllers/UserController";

const usersRouter = Router();
const usersController = new UserController();

usersRouter.get('/', usersController.all);
usersRouter.get('/:id', usersController.findById);
usersRouter.patch('/:id', usersController.update);
usersRouter.delete('/:id', usersController.delete);

export default usersRouter;
