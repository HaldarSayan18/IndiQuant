import 'dotenv/config';
import axios from 'axios';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`);
        const data = await response.data;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch news', error: error.message });
    }
});

export default router;