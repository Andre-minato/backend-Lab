import express from "express";
import UserController from "./src/controllers/userController.js";
import UserTypeController from "./src/controllers/user_typeController.js";
import LabController from "./src/controllers/labController.js";
const routes = express.Router();

routes.post("/users", UserController.create);
routes.get("/users", UserController.findAll);
routes.get("/users/:id", UserController.findById);
routes.put("/users/:id", UserController.update);
routes.delete("/users/:id", UserController.deactivate);
routes.put("/activate/users/:id",UserController.activate);

routes.get("/tipos", UserController.getUserType);

routes.post("/type", UserTypeController.create);
routes.get("/type", UserTypeController.findAll);

routes.get("/lab", LabController.findAll);
routes.post("/lab", LabController.create);
routes.get("/lab", LabController.findById);
routes.delete("/lab/:id", LabController.deactivate);
routes.put("/activate/lab/:id", LabController.activate);
routes.put("/laboratorio/:id", LabController.update);

export default routes;

