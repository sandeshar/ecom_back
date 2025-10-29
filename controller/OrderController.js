import Order from "../model/Order.model.js";
import Product from "../model/Product.model.js";

const DEFAULT_TAX_RATE = 0;

const generateOrderNumber = async () => {
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    const candidate = `ORD-${Date.now().toString(36).toUpperCase()}-${randomPart}`;
    const exists = await Order.findOne({ orderNumber: candidate }).select("_id").lean();
    if (exists) {
        return generateOrderNumber();
    }
    return candidate;
};

const buildOrderItems = async (rawItems = []) => {
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
        throw new Error("Order items are required");
    }

    const productIds = rawItems.map((item) => item.productId).filter(Boolean);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((product) => [product.id, product]));

    return rawItems.map((item) => {
        const product = productMap.get(item.productId);
        if (!product) {
            throw new Error("One or more products are no longer available");
        }

        const quantity = Number.parseInt(item.quantity, 10) || 1;
        const subtotal = product.price * quantity;

        return {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity,
            subtotal,
            heroImage: product.heroImage,
        };
    });
};

const computeTotals = (items, taxRate = DEFAULT_TAX_RATE) => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = Math.round(subtotal * taxRate * 100) / 100;
    const total = subtotal + tax;
    return { subtotal, tax, total };
};

export const createOrder = async (req, res) => {
    try {
        const { customer, billingAddress, items: rawItems, taxRate, notes, metadata } = req.body;

        if (!customer || !customer.name || !customer.email) {
            return res.status(400).json({ message: "Customer name and email are required" });
        }

        if (!billingAddress || !billingAddress.line1 || !billingAddress.city || !billingAddress.postalCode || !billingAddress.country) {
            return res.status(400).json({ message: "Billing address is incomplete" });
        }

        const items = await buildOrderItems(rawItems);
        const { subtotal, tax, total } = computeTotals(items, taxRate || DEFAULT_TAX_RATE);

        const order = await Order.create({
            orderNumber: await generateOrderNumber(),
            items,
            customer,
            billingAddress,
            subtotal,
            tax,
            total,
            notes,
            metadata,
            paymentStatus: "Pending",
            status: "Processing",
        });

        return res.status(201).json(order);
    } catch (error) {
        console.error("Create order failed", error);
        return res.status(400).json({ message: error.message || "Unable to create order" });
    }
};

export const getOrders = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, search } = req.query;
        const parsedPage = Number.parseInt(page, 10) || 1;
        const parsedLimit = Number.parseInt(limit, 10) || 20;
        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { orderNumber: { $regex: search, $options: "i" } },
                { "customer.name": { $regex: search, $options: "i" } },
                { "customer.email": { $regex: search, $options: "i" } },
            ];
        }

        const skip = (parsedPage - 1) * parsedLimit;

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parsedLimit),
            Order.countDocuments(filter),
        ]);

        return res.json({
            data: orders,
            pagination: {
                total,
                page: parsedPage,
                limit: parsedLimit,
                totalPages: Math.ceil(total / parsedLimit) || 1,
            },
        });
    } catch (error) {
        console.error("Get orders failed", error);
        return res.status(500).json({ message: "Unable to fetch orders" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("items.product");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.json(order);
    } catch (error) {
        console.error("Get order failed", error);
        return res.status(400).json({ message: "Invalid order id" });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (status) {
            order.status = status;
        }

        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
        }

        await order.save();
        return res.json(order);
    } catch (error) {
        console.error("Update order status failed", error);
        return res.status(400).json({ message: "Unable to update order" });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        await order.deleteOne();
        return res.json({ message: "Order deleted" });
    } catch (error) {
        console.error("Delete order failed", error);
        return res.status(400).json({ message: "Unable to delete order" });
    }
};

export const getOrderStats = async (req, res) => {
    try {
        const [totals] = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$total" },
                    totalOrders: { $sum: 1 },
                    avgOrderValue: { $avg: "$total" },
                },
            },
        ]);

        const statusBreakdown = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        return res.json({
            totals: totals || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
            statusBreakdown,
        });
    } catch (error) {
        console.error("Get order stats failed", error);
        return res.status(500).json({ message: "Unable to fetch order stats" });
    }
};
