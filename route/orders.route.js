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

const OrderRouter = Router();

OrderRouter.get("/", authenticate, getOrders);
OrderRouter.get("/stats", authenticate, getOrderStats);
OrderRouter.get("/:id", authenticate, getOrderById);
OrderRouter.post("/", createOrder);
OrderRouter.patch("/:id/status", authenticate, updateOrderStatus);
OrderRouter.delete("/:id", authenticate, deleteOrder);

export default OrderRouter;
