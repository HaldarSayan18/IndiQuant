import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
    userId: { type: String, ref: 'User', required: true },
    symbol: { type: String, required: true, uppercase: true },
    type: { type: String, enum: ['target', 'stop-loss'], required: true },
    targetPrice: { type: Number, required: true },
    market: { type: String, enum: ['stock', 'crypto', 'nft'], default: 'stock' },
    triggered: { type: Boolean, default: false },
    triggeredAt: Date,
}, { timestamps: true });

export const Alert = mongoose.model('alerts', alertSchema);