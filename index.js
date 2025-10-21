import express from 'express';
import connectDB from './db/db.js';
import ProductRouter from './route/products.route.js';
import UserRouter from './route/user.route.js';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3003;

connectDB();

app.use('/products', ProductRouter);

app.use('/users', UserRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});