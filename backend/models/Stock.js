import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    change: { type: Number },
    marketCap: { type: Number },
    volume: { type: Number },
    details: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export const Stock = mongoose.model('stocks', stockSchema);