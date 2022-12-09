import { Router } from 'express';

const routes = Router();;
const userController = require("../controllers/UserControllers")

routes.post("/login", userController.loginUser);

export default routes;
