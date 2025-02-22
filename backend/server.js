import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import stockRoute from './routes/stockRoute.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/static', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/stock', stockRoute);
app.use('/api/auth', authRoute);

export default app;

