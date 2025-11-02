import { Router } from "express";
import {
    createOrder,
    deleteOrder,
    getOrderById,
    getOrderStats,
    getOrders,
    updateOrderStatus,
} from "../controller/OrderController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateOrderInput } from "../middleware/validation.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";

const OrderRouter = Router();

OrderRouter.get("/", authenticate, checkPermission('canViewOrders'), getOrders);
OrderRouter.get("/stats", authenticate, checkPermission('canViewOrders'), getOrderStats);
OrderRouter.get("/:id", authenticate, checkPermission('canViewOrders'), getOrderById);
OrderRouter.post("/", validateOrderInput, createOrder);
OrderRouter.patch("/:id/status", authenticate, checkPermission('canEditOrders'), updateOrderStatus);
OrderRouter.delete("/:id", authenticate, checkPermission('canDeleteOrders'), deleteOrder);

export default OrderRouter;
