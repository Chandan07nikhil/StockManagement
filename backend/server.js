import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import stockRoute from './routes/stockRoute.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());


// Routes
app.use('/api/stock', stockRoute);
app.use('/api/auth', authRoute);

export default app;

