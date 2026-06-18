import mongoose from "mongoose";

const priceTimelineSchema = new mongoose.Schema({
    '1h': { type: Number },
    '1d': { type: Number },
    '1w': { type: Number },
    '1mo': { type: Number },
    '1y': { type: Number }
}, { _id: false });

const ohlcSchema = new mongoose.Schema({
    timestamp: { type: Date, required: true },
    open: { type: Number, required: true },
    high: { type: Number, required: true },
    low: { type: Number, required: true },
    close: { type: Number, required: true },
}, { _id: false });

const cryptoSchema = new mongoose.Schema({
    coin_id: { type: String, required: true, unique: true },
    symbol: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    current_price: { type: Number },
    market_cap: { type: Number },
    market_cap_rank: { type: Number },
    market_cap_change_24h: { type: Number },
    fully_diluted_valuation: { type: Number },
    price_change_timeline: priceTimelineSchema,
    price_change_24h: { type: Number },
    price_change_percentage_24h: { type: Number },
    atl: { type: Number },
    ath_change: { type: Number },
    ath_change_percentage: { type: Number },
    last_updated: { type: Date, required: true },
    ohlc_history: {
        '1d':[ohlcSchema],
        '7d':[ohlcSchema],
        '30d':[ohlcSchema],
        '180d':[ohlcSchema],
        '365d':[ohlcSchema],
    }
}, { timestamps: true });

export const Crypto = mongoose.model('cryptos', cryptoSchema);