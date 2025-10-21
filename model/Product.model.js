import mongoose from "mongoose";

const Products = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        highlights: { type: [String], required: true },
        tags: { type: [String], required: true },
        price: { type: Number, required: true },
        imageUrls: { type: [String], required: true },
        category: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
        published: { type: Boolean, required: true, default: false },
        ratings: { type: Number, required: true, default: 0 },
        numOfReviews: { type: Number, required: true, default: 0 },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", Products);
export default Product;
