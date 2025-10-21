import mongoose from "mongoose";

const User = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true, default: "user" },
        avatar: { type: String, required: true },
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

const UserModel = mongoose.model("User", User);
export default UserModel;
