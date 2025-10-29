import Order from "../model/Order.model.js";

export const getCustomers = async (req, res) => {
    try {
        const aggregate = await Order.aggregate([
            {
                $group: {
                    _id: "$customer.email",
                    name: { $last: "$customer.name" },
                    email: { $last: "$customer.email" },
                    phone: { $last: "$customer.phone" },
                    orders: { $sum: 1 },
                    totalSpend: { $sum: "$total" },
                    lastOrderAt: { $max: "$createdAt" },
                },
            },
            { $sort: { lastOrderAt: -1 } },
        ]);

        return res.json(aggregate.map((customer) => ({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            orders: customer.orders,
            totalSpend: customer.totalSpend,
            lastOrderAt: customer.lastOrderAt,
        })));
    } catch (error) {
        console.error("Get customers failed", error);
        return res.status(500).json({ message: "Unable to fetch customers" });
    }
};
