import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        subtotal: { type: Number, required: true },
        heroImage: { type: String },
    },
    { _id: false }
);

const AddressSchema = new mongoose.Schema(
    {
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        state: { type: String },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    { _id: false }
);

const CustomerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
    },
    { _id: false }
);

const OrderSchema = new mongoose.Schema(
    {
        orderNumber: { type: String, required: true, unique: true },
        status: {
            type: String,
            enum: ["Processing", "Fulfilled", "Awaiting pickup", "Refund requested", "Cancelled"],
            default: "Processing",
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed", "Refunded"],
            default: "Pending",
        },
        items: { type: [OrderItemSchema], required: true },
        customer: { type: CustomerSchema, required: true },
        billingAddress: { type: AddressSchema, required: true },
        subtotal: { type: Number, required: true },
        tax: { type: Number, required: true, default: 0 },
        shipping: { type: Number, default: 0 },
        total: { type: Number, required: true },
        notes: { type: String },
        metadata: { type: Map, of: String },
    },
    { timestamps: true }
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ "customer.email": 1 });

export default mongoose.model("Order", OrderSchema);
