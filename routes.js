import express, { Router } from "express";
import UserController from "./src/controllers/userController.js";
import UserTypeController from "./src/controllers/user_typeController.js";
import LabController from "./src/controllers/labController.js";
import { validateToken, validateTokenAndRole } from "./src/middlewares/auth.js";
import book_labController from "./src/controllers/book_labController.js";
const routes = express.Router();

routes.post("/users/login", UserController.login);//ok
routes.post("/users", UserController.create);//ok
routes.get("/users/:id", validateToken, UserController.findById);// admin / id user ok
routes.put("/users/:id", validateToken, UserController.update);// admin / id user ok
routes.get("/users", validateTokenAndRole(["admin"]), UserController.findAll);// admin ok
routes.delete("/users/disable/:id", validateToken, UserController.disable);// admin / id user ok
routes.put("/users/activate/:id", validateTokenAndRole(["admin"]), UserController.activate);// Apenas Admin ok


routes.post("/type", UserTypeController.create);
routes.get("/type", UserTypeController.findAll);

routes.get("/lab", validateToken, LabController.findAll);
routes.post("/lab", LabController.create);// admin ok
routes.get("/lab/:id", validateToken, LabController.findById); 
routes.delete("/lab/disable/:id", validateTokenAndRole(["admin"]), LabController.disable);// admin ok
routes.put("/lab/activate/:id", validateTokenAndRole(["admin"]), LabController.activate);// admin ok
routes.put("/lab/:id", validateTokenAndRole(["admin"]), LabController.update);// admin ok

routes.get('/reserva', validateTokenAndRole(["admin"]), book_labController.findAll)
routes.post('/reserva/:user_id/reserva', validateToken, book_labController.create)
routes.post('/boleto/:user_id', validateToken, book_labController.preReservation)
routes.get('/codigo_barras', book_labController.codigoBoleto)

export default routes;
