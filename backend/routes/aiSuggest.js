import express from 'express';
import { auth } from '../middlewares/auth.js';
import { getAllCandidates } from '../services/marketService.js';
import getAgent_AISuggestions from '../services/aiService.js';

const router = express.Router();

router.get('/suggestions', auth, async (req, res) => {
    try {
        const candidates = await getAllCandidates();
        const aiPicks = await getAgent_AISuggestions(candidates);
        res.status(200).json({ success: true, aiPicks });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
export default router;