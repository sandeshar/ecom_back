import { Router } from "express";
import {
    addProduct,
    deleteProduct,
    getProductById,
    getProductBySlug,
    getProducts,
    togglePublish,
    updateProduct,
} from "../controller/ProductController.js";
import upload from "../helper/multerHelper.js";
import { authenticate } from "../middleware/authMiddleware.js";

const ProductRouter = Router();

ProductRouter.get('/', getProducts);
ProductRouter.get('/slug/:slug', getProductBySlug);
ProductRouter.get('/:id', getProductById);
ProductRouter.post('/', authenticate, upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 5 }]), addProduct);
ProductRouter.put('/:id', authenticate, upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 10 }]), updateProduct);
ProductRouter.patch('/:id/publish', authenticate, togglePublish);
ProductRouter.delete('/:id', authenticate, deleteProduct);

export default ProductRouter;
