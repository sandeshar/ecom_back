import Product from "../model/Product.model.js";

export const addProduct = async (req, res) => {
    try {
        const product = req.body;
        const heroImage = req.files['heroImage']?.[0]?.filename || null;
        const galleryImages = req.files['galleryImages']?.map(file => file.filename) || [];
        await Product.create({ ...product, heroImage, galleryImages });
        res.status(201).json({ ...product, heroImage, galleryImages });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};