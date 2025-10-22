import express from 'express';
import connectDB from './helper/db.js';
import ProductRouter from './route/products.route.js';
import UserRouter from './route/user.route.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static('uploads'));

connectDB();

app.use('/products', ProductRouter);

app.use('/users', UserRouter);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});