import { Router } from "express";

const ProductRouter = Router();

ProductRouter.get('/', (req, res) => {
    res.send('List of products');
});

ProductRouter.post('/', (req, res) => {
    res.send('Create a new product');
});

export default ProductRouter;
