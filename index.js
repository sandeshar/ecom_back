import express from 'express';
import fs from 'fs';
import path from 'path';
import connectDB from './helper/db.js';
import ProductRouter from './route/products.route.js';
import UserRouter from './route/user.route.js';
import AuthRouter from './route/auth.route.js';
import OrderRouter from './route/orders.route.js';
import CustomerRouter from './route/customers.route.js';
import SettingsRouter from './route/settings.route.js';
import AdminRouter from './route/admin.route.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads'));

connectDB();

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/products', ProductRouter);

app.use('/users', UserRouter);

app.use('/auth', AuthRouter);

app.use('/orders', OrderRouter);

app.use('/customers', CustomerRouter);

app.use('/settings', SettingsRouter);

app.use('/admins', AdminRouter);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});