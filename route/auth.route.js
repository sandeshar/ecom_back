import { Router } from "express";
import { adminLogin } from "../controller/AdminController.js";

const AuthRouter = Router();

// Use the new admin login system
AuthRouter.post("/login", adminLogin);

export default AuthRouter;
