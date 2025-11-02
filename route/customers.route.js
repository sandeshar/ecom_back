import { Router } from "express";
import { getCustomers } from "../controller/CustomerController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";

const CustomerRouter = Router();

CustomerRouter.get("/", authenticate, checkPermission('canViewCustomers'), getCustomers);

export default CustomerRouter;
