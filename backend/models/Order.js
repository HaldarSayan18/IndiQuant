import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    orderId: { type: String, required: true, unique: true },
    market: { type: String, required: true, enum: ['stock', 'crypto', 'nft'] },
    symbol: { type: String, required: true },
    name: { type: String },
    type: { type: String, required: true, enum: ['buy', 'sell'] },
    quantity: { type: Number, required: true },
    priceAtOrder: { type: Number, required: true },
    totalValue: { type: Number },
    status: { type: String, default: 'open', enum: ['open', 'closed'] },
    closedPrice: { type: Number },
    closedAt: { type: Date }
}, { timestamps: true });

orderSchema.pre('save', function (next) {
    this.totalValue = Number((this.priceAtOrder * this.quantity).toFixed(2));
});

orderSchema.virtual('profitLoss').get(function () {
    if (this.status !== 'closed' || this.closedPrice == null)
        return null;

    return this.type === 'buy' ? (this.closedPrice - this.priceAtOrder) * this.quantity : (this.priceAtOrder - this.closedPrice) * this.quantity;
});

export const Orders = mongoose.model('orders', orderSchema);