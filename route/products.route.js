import { Router } from "express";
import { addProduct } from "../controller/ProductController.js";

const ProductRouter = Router();

ProductRouter.get('/', (req, res) => {
    res.send('List of products');
});

ProductRouter.post('/', addProduct);

export default ProductRouter;
