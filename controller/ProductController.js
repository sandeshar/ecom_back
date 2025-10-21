import Product from "../model/Product.model.js";

export const addProduct = async (req, res) => {
    try {
        const product = req.body;
        console.log(product);
        await Product.create(product);
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};