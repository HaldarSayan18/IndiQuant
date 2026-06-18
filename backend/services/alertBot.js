import { Alert } from "../models/Alert.js";
import { sendAlertEmail } from "./emailService.js";
import { fetchCryptoPrices, fetchNFTPrices, fetchStockPrices } from "./marketService.js";

async function getPriceAlert(alert) {
    try {
        if (alert.market === 'stock') {
            const s = await fetchStockPrices(alert.symbol.toLowerCase());
            return s.price;
        }
        if (alert.market === 'stock') {
            const c = await fetchCryptoPrices(alert.symbol.toLowerCase());
            return c.price;
        }
        if (alert.market === 'stock') {
            const n = await fetchNFTPrices(alert.name.toLowerCase());
            return n.price;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export default async function runAlertBot() {
    const alerts = await Alert.find({ triggered: false }).populate('userId', 'email');

    for (const a of alerts) {
        const currentPrice = await getPriceAlert(alert);
        if (!currentPrice) continue;

        const hit = a.type === 'target' ? currentPrice >= a.targetPrice : currentPrice <= a.targetPrice;
        if (hit) {
            a.triggered = true
            a.triggeredAt = new Date()
            await a.save();

            await sendAlertEmail({
                to: a.userId.email,
                symbol: a.symbol,
                type: a.type,
                target: a.targetPrice,
                current: currentPrice
            })
        }
    };
};