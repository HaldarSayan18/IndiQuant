import express from 'express';
import { auth } from '../middlewares/auth.js';
import { Alert } from '../models/Alert.js';

const router = express.Router();

// create new alert
router.post('/', auth, async (req, res) => {
    try {
        const { symbol, type, targetPrice, market } = req.body

        if (!symbol || !type || !targetPrice)
            return res.status(400).json({ success: false, error: 'Symbol, type and target price are required' })

        if (!['target', 'stop-loss'].includes(type))
            return res.status(400).json({ success: false, error: 'Type must be target or stop-loss' })

        const alert = await Alert.create({
            userId: req.user.id,
            symbol: symbol.toUpperCase(),
            type,
            targetPrice,
            market: market || 'stock',
        })

        res.status(201).json({ success: true, alert });
    } catch (error) {
        res.status(500).json({ success: true, error: error.message });
    }
});

// list all alerts
router.get('/', auth, async (req, res) => {
    const alerts = await Alert.find({ userId: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json({ success: true, message: alerts });
});

// delete an alert
router.delete('/:alert_id', auth, async (req, res) => {
    const alert = await Alert.findOneAndDelete({ _id: req.params.alert_id, userId: req.user.id })
    if (!alert) return res.status(404).json({ error: 'Alert not found' })
    res.status(200).json({ success: true, deleted: true })
});

export default router;