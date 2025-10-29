import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
        description: { type: String, required: true },
        heroImage: { type: String },
        galleryImages: { type: [String], default: [] },
        highlights: { type: [String], default: [] },
        price: { type: Number, required: true, min: 0 },
        categories: { type: [String], default: [] },
        licenseTiers: { type: [String], default: [] },
        tags: { type: [String], default: [] },
        badge: { type: String },
        sku: { type: String, trim: true },
        inventory: {
            type: Number,
            default: 0,
            min: 0,
        },
        digitalAssetUrl: { type: String },
        published: { type: Boolean, required: true, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

ProductSchema.index({ name: "text", description: "text", tags: "text" });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ price: 1 });

const Product = mongoose.model("Product", ProductSchema);
export default Product;
