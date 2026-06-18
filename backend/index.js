import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import connectDB from './utils/db.js';
import alertsRoutes from './routes/alerts.js';
import aiSuggestRoutes from './routes/aiSuggest.js';
import ordersRoutes from './routes/order.js';
import portfolioRoutes from './routes/portfolio.js';
import nftRoutes from './routes/nft.js';
import cryptoRoutes from './routes/crypto.js';
import stockRoutes from './routes/stock.js';
import authRoutes from './routes/auth.js';

const app = express();

// cors permission
app.use(cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
}));

app.use(express.json());

// db connection
connectDB();

// auth
app.use('/api/auth', authRoutes);
// stock
app.use('/api/stocks', stockRoutes);
// crypto
app.use('/api/crypto', cryptoRoutes);
// nft
app.use('/api/nfts', nftRoutes);
// portfolio
app.use('/api/portfolio', portfolioRoutes);
// alerts
app.use('/api/alerts', alertsRoutes);
// orders
app.use('/api/orders', ordersRoutes);
// ai-picks
app.use('/api/ai', aiSuggestRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});