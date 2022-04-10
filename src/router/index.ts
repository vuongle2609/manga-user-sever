import express from "express";
import controllers from "../controller/index";
import authenToken from "../auth/authenToken";

const routes = express.Router();

routes.post("/register", controllers.createUser);

routes.post("/login", controllers.loginUser);

routes.get("/user", authenToken, controllers.getInfo);

routes.post("/user", authenToken, controllers.changeInfo);

routes.post("/manga", authenToken, controllers.addManga);

export default routes;
