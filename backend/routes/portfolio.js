import express from 'express';
import { Orders } from '../models/Order.js';
import { auth } from '../middlewares/auth.js';
import { fetchStockPrices, fetchCryptoPrices, fetchNFTPrices } from '../services/marketService.js';

const router = express.Router();

router.get('/pl', auth, async (req, res) => {
    const orders = await Orders.find({ userId: req.user.id }).sort({ createdAt: -1 });

    // separate open orders
    const openStocks = [...new Set(orders.filter((o => o.status === 'open' && o.market === 'stock')).map(o => o.symbol.toLowercase()))];
    const openCryptos = [...new Set(orders.filter((o => o.status === 'open' && o.market === 'crypto')).map(o => o.symbol.toLowercase()))];
    const openNFTs = [...new Set(orders.filter((o => o.status === 'open' && o.market === 'nft')).map(o => o.name.toLowercase()))];

    // fetch all prices together parallel
    const [stockPrices, cryptoPrices, nftPrices] = await Promise.all([
        fetchStockPrices(openStocks),
        fetchCryptoPrices(openCryptos),
        fetchNFTPrices(openNFTs),
    ])
    const ethUsd = cryptoPrices['ethereum'] || 1

    const enriched = orders.map(o => {
        let livePrice = null
        if (o.status === 'open') {
            if (o.market === 'stock') livePrice = stockPrices[o.symbol]
            else if (o.market === 'crypto') livePrice = cryptoPrices[o.symbol.toLowerCase()]
            else if (o.market === 'nft') livePrice = nftPrices[o.symbol.toLowerCase()]
                ? +(nftPrices[o.symbol.toLowerCase()] * ethUsd).toFixed(2)
                : null
        }

        const realisedPL = o.closedPrice
            ? o.type === 'buy'
                ? +((o.closedPrice - o.priceAtOrder) * o.quantity).toFixed(2)
                : +((o.priceAtOrder - o.closedPrice) * o.quantity).toFixed(2)
            : null

        const unrealisedPL = (o.status === 'open' && livePrice)
            ? o.type === 'buy'
                ? +((livePrice - o.priceAtOrder) * o.quantity).toFixed(2)
                : +((o.priceAtOrder - livePrice) * o.quantity).toFixed(2)
            : null

        const pl = realisedPL ?? unrealisedPL
        const invested = o.totalValue
        const heldDays = Math.floor(((o.closedAt || new Date()) - o.createdAt) / 86400000)

        return {
            id: o._id,
            market: o.market,
            symbol: o.symbol,
            name: o.name,
            type: o.type,
            quantity: o.quantity,
            entryPrice: o.priceAtOrder,
            exitPrice: o.closedPrice || null,
            livePrice,
            invested,
            realisedPL,
            unrealisedPL,
            returnPct: pl && invested ? +((pl / invested) * 100).toFixed(2) : null,
            heldDays,
            status: o.status,
            createdAt: o.createdAt,
        }
    })

    const total = {
        totalInvested: +enriched.reduce((s, o) => s + (o.invested || 0), 0).toFixed(2),
        totalRealised: +enriched.reduce((s, o) => s + (o.realisedPL || 0), 0).toFixed(2),
        totalUnrealised: +enriched.reduce((s, o) => s + (o.unrealisedPL || 0), 0).toFixed(2),
        openCount: enriched.filter(o => o.status === 'open').length,
        closedCount: enriched.filter(o => o.status === 'closed').length,
    }

    res.json({ orders: enriched, total })
});

export default router;