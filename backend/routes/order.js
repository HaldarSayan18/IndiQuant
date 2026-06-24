import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../middlewares/auth.js'
import { Orders } from '../models/Order.js';
import { User } from '../models/User.js';
import { sendOrderConfirmation } from '../services/emailService.js';

const router = express.Router();

// place order
router.post('/', auth, async (req, res) => {
    try {
        const { symbol, market, type, quantity, priceAtOrder } = req.body;
        if (!symbol || !market || !type || !quantity || !priceAtOrder)
            return res.status(400).json({ success: false, error: 'All fields are required' });
        if (quantity <= 0 || priceAtOrder <= 0)
            return res.status(400).json({ success: false, error: 'Quantity and price must be positive' });

        const order = await Orders.create({
            userId: req.user.id,
            orderId:`ORDER-${uuidv4()}`,
            symbol: symbol.toUpperCase(),
            market,
            type,
            quantity,
            priceAtOrder,
            status: 'open',
        });

        res.status(201).json({ success: true, message: 'Order created' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// fetch orders
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Orders.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// close an order
router.patch('/:order_id/close', auth, async (req, res) => {
    try {
        const { closedPrice } = req.body;
        if (!closedPrice || closedPrice <= 0)
            return res.status(400).json({ success: false, error: 'Valid exit price required.' });

        const order = await Orders.findOne({ id: req.params.orderId, userId: req.user.id });
        if (!order)
            return res.status(404).json({ success: false, error: "Order not found!" });
        if (order.status === 'closed')
            return res.status(400).json({ success: false, error: 'Order closed already!' });

        order.closedPrice = closedPrice;
        order.status = 'closed';
        order.closedAt = new Date();
        await order.save();

        // send closing confirmation email
        const user = await User.findById(req.user.id);
        await sendOrderConfirmation({ to: user.email, order });

        res.status(200).json({ success: true, message: 'Order saved.' })
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// delete an order
router.delete('/:order_id', auth, async (req, res) => {
    const order = await Orders.findOneAndDelete({ _id: req.params.order_id, userId: req.user.id });
    if (!order)
        return res.status(400).json({ success: false, error: 'Order not found!' });
    res.status(200).json({ success: true, deleted: true });
})

export default router;