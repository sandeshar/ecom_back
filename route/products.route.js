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
import { validateProductInput } from "../middleware/validation.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";

const ProductRouter = Router();

ProductRouter.get('/', getProducts);
ProductRouter.get('/slug/:slug', getProductBySlug);
ProductRouter.get('/:id', getProductById);
ProductRouter.post('/', authenticate, checkPermission('canCreateProducts'), upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 5 }]), validateProductInput, addProduct);
ProductRouter.put('/:id', authenticate, checkPermission('canEditProducts'), upload.fields([{ name: 'heroImage', maxCount: 1 }, { name: 'galleryImages', maxCount: 10 }]), validateProductInput, updateProduct);
ProductRouter.patch('/:id/publish', authenticate, checkPermission('canEditProducts'), togglePublish);
ProductRouter.delete('/:id', authenticate, checkPermission('canDeleteProducts'), deleteProduct);

export default ProductRouter;
