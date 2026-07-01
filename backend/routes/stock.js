import 'dotenv/config';
import express from "express";
import axios from "axios";
import csv from 'csv-parser';
import YahooFinance from 'yahoo-finance2';
import { Stock } from '../models/Stock.js';

const router = express.Router();
const yahooFinance = new YahooFinance();

// get stock-details
router.get('/stock-details', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const skip = (page - 1) * limit;
        const searchQuery = req.query.search || "";

        const stocks = await Stock.find({ symbol: { $regex: searchQuery, $options: 'i' } })
            .select('symbol price change marketCap volume details')
            .skip(skip)
            .limit(limit);
        const totalStocks = await Stock.countDocuments({ symbol: { $regex: searchQuery, $options: 'i' } });
        const hasMore = (skip + stocks.length) < totalStocks;
        res.status(200).json({ success: true, data: stocks, hasMore: hasMore });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stock data', error });
    }
});

// get symbol data from yahoo finance
router.get('/:symbol', async (req, res) => {
    try {
        const stockData = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });
        if (!stockData) {
            return res.status(404).json({ success: false, message: 'Stock data not found' });
        }
        res.status(200).json({ success: true, data: stockData.details || stockData });
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Failed to fetch stock data:', error });
    }
});

// get symbol ohlc-history data from yahoo finance
router.get('/:symbol/history', async (req, res) => {
    try {
        const { symbol } = req.params;
        // console.log('symbol ==>', symbol);
        const range = req.query.range || '1mo';
        const now = new Date();
        let period1 = new Date(now);
        const intervals = {
            '1h': '1h',
            'today': '8h',
            '1d': '1day',
            '1w': '1week',
            '1mo': '1month',
        };
        // switch (range) {
        //     case '1d':
        //         period1 = new Date(Date.now() - 24 * 60 * 60 * 1000);
        //         break;
        //     case '1w':
        //         period1 = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        //         break;
        //     case '1mo':
        //         period1 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        //         break;
        //     case '1y':
        //         period1 = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
        //         break;
        // };

        // const result = await yahooFinance.chart(symbol.toUpperCase(), {
        //     period1: period1,
        //     period2: new Date(),
        //     interval: intervals[range] || '1d',
        // });
        // console.log('result ==>', result);

        const response = await axios.get(`https://api.twelvedata.com/time_series?symbol=${symbol.toUpperCase()}&interval=${intervals[range] || '8h'}&apikey=${process.env.TWELVEDATA_API_KEY}`);

        const result = await response.data;
        if (result.status === 'error') {
            return res.status(404).json({ success: false, message: result.message });
        }

        const data = result.values.map((quote) => ({
            date: quote.date,
            open: quote.open,
            high: quote.high,
            low: quote.low,
            close: quote.close,
            volume: quote.volume
        }));
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Error fetching stock history data:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to fetch stock history data' });
    }
});

export default router;