import mongoose from "mongoose";

const Products = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        heroImage: { type: String, required: true },
        galleryImages: { type: [String], required: true },
        highlights: { type: [String], required: true },
        price: { type: Number, required: true },
        categories: { type: [String], required: true },
        licenseTiers: { type: [String], required: true },
        tags: { type: [String], required: true },
        badge: { type: String },
        published: { type: Boolean, required: true, default: false },
        // user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", Products);
export default Product;
