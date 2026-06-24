import express from 'express';
import { adminOnly, auth } from '../middlewares/auth.js';
import { User } from '../models/User.js';
import { Orders } from '../models/Order.js';
import { Alert } from '../models/Alert.js';


const router = express.Router();

// all orders
router.get('/orders', auth, adminOnly, async (req, res) => {
    try {
        const orders = await Orders.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// all alerts
router.get('/alerts', auth, adminOnly, async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, alerts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// users list
router.get('/users', auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// total stats
router.get('/analytics', auth, adminOnly, async (req, res) => {
    try {
        const [totalUsers, totalOrders, totalAlerts, adminCount] = await Promise.all([
            User.countDocuments(),
            Orders.countDocuments(),
            Alert.countDocuments(),
            User.countDocuments({ role: 'admin' }),
        ]);

        // today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const newToday = await User.countDocuments({ createdAt: { $gte: startOfToday } });

        // signups - group by month
        const oneMonth = new Date();
        oneMonth.setDate(oneMonth.getDate() - 30);

        const signUps = await User.aggregate([
            { $match: { createdAt: { $gte: oneMonth } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const recentSignUps = signUps.map(s => ({ date: s._id, count: s.count }));
        const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);
        res.status(200).json({ success: true, analytics: { totalUsers, totalOrders, totalAlerts, adminCount, newToday, recentSignUps } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// user role - promote or demote
router.patch('/users/:user_id/role', auth, adminOnly, async (req, res) => {
    try {
        const { role } = req.body;
        if (req.params.user_id === req.user.user_id && role !== 'admin')
            return res.status(200).json({ success: false, message: "You can't demote an Admin." });

        const user = await User.findByIdAndUpdate(
            req.params.user_id,
            { role },
            // { new: true }
            { returnDocument: 'after' }
        ).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        res.status(200).json({ success: true, message: 'Role updated successfully.' });
    } catch (error) {
        console.error('user role-', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// delete user
router.delete('/users/:user_id', auth, adminOnly, async (req, res) => {
    try {
        if (req.params.user_id === req.user.user_id)
            return res.status(400).json({ success: false, message: "You can't delete your own account!" });

        const user = await User.findByIdAndDelete(req.params.user_id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        res.status(200).json({ success: true, message: 'User deleted.', delete: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})

export default router;