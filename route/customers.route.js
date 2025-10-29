import { Router } from "express";
import { getCustomers } from "../controller/CustomerController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const CustomerRouter = Router();

CustomerRouter.get("/", authenticate, getCustomers);

export default CustomerRouter;
