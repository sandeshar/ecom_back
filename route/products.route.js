import { Router } from "express";
import { addProduct } from "../controller/ProductController.js";
import upload from "../helper/multerHelper.js";

const ProductRouter = Router();

ProductRouter.get('/', (req, res) => {
    res.send('List of products');
});

ProductRouter.post('/', upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 5 }]), addProduct);

export default ProductRouter;
