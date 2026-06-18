import express from 'express';
import { Crypto } from '../models/Crypto.js';

const router = express.Router();

// get crypto list
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        const cryptos = await Crypto.find({
            $or: [
                { symbol: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
            ]
        })
            .select('coin_id symbol name image current_price market_cap market_cap_rank price_change_percentage_24h')
            .sort({ market_cap_rank: 1 })
            .skip(skip)
            .limit(limit)
        const total = await Crypto.countDocuments();
        res.status(200).json({ success: true, data: cryptos, hasMore: (skip + cryptos.length) < total })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:coin/history', async (req, res) => {
    try {
        const { coin } = req.params;
        // const range = req.query.range || '7d';
        const cryptoData = await Crypto.findOne({ coin_id: coin });
        if (!cryptoData) {
            return res.status(404).json({ success: false, message: 'Crypto data not found' });
        }
        res.status(200).json({ success: true, data: cryptoData.ohlc_history});
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error whild feting coin ohlc', error });
    }
});

export default router;