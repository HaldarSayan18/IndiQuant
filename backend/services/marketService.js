import 'dotenv/config';
import axios from 'axios';
import YahooFinance from 'yahoo-finance2';
import { Stock } from '../models/Stock.js';
import { Crypto } from '../models/Crypto.js';
import { NFT, NFTDetails } from '../models/NFTs.js';

// fetch stock data
const yahooFinance = new YahooFinance();
export async function fetchStockPrices(symbols) {
    if (!symbols.length) return {};
    const quotes = await YahooFinance.quotes(symbols);
    const arr = Array.isArray(quotes) ? quotes : [quotes];
    return Object.fromEntries(arr.map(q => [q.symbol, q.regularMarketPrice]))
};

// fetch crypto data
export async function fetchCryptoPrices(coinIds) {
    if (!coinIds.length) return {}
    const { data } = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: { vs_currency: 'usd', ids: coinIds.join(','), x_cg_demo_api_key: process.env.COINGECKO_API_KEY }
    })
    return Object.fromEntries(data.map(c => [c.id, c.current_price]))
};

// fetch nft data
export async function getNFTCollection(nftId) {
    const nft = await NFTDetails.findOne({ id: nftId }).lean();
    if (!nft) throw new Error(`No details for NFT: ${nftId}`);
    return {
        id: nft.id,
        name: nft.name,
        symbol: nft.symbol,
        floorPrice: nft.floor_price?.usd,
        floorPriceNative: nft.floor_price?.native_currency,
        marketCap: nft.market_cap?.usd,
        volume24h: nft.volume_24h?.usd,
        change24h: nft.floor_price_in_usd_24h_percentage_change,
        owners: nft.number_of_unique_addresses,
        totalSupply: nft.total_supply,
    }
};
export async function fetchNFTPrices(slugs) {
    if (!slugs.length) return {}
    const results = await Promise.allSettled(
        slugs.map(async slug => {
            const collection = await getNFTCollection(slug)
            return [slug, collection.floorPrice]
        })
    )
    return Object.fromEntries(
        results.filter(r => r.status === 'fulfilled').map(r => r.value)
    )
};

// fetch ai-suggestions
async function fetchStockQuotesInBatches(symbols, batchSize = 100) {
    const result = [];
    for (let i = 0; i < symbols.length; i += batchSize) {
        const batch = symbols.slice(i, i + batchSize);
        const quotes = await Promise.allSettled(
            batch.map(symbol => yahooFinance.quote(symbol))
        );
        result.push(...quotes.filter(q => q.status === 'fulfilled').map(q => q.value));
    }
    return result;
}
export async function getAllCandidates() {
    const stockDocs = await Stock.find({}, 'symbol');
    const symbols = stockDocs.map(s => s.symbol);

    const cryptoDocs = await Crypto.find({}, 'coin_id');
    const coinIds = cryptoDocs.map(c => c.coin_id);

    const nftDocs = await NFT.find({}, 'nft_id');
    const nftIds = nftDocs.map(n => n.nft_id);

    const [stockQuotes, cryptoQuotes, nftQuotes] = await Promise.all([
        fetchStockQuotesInBatches,

        await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                ids: coinIds.join(','),
                price_change_percentage: '1h, 24h',
                x_cg_demo_api_key: process.env.COINGECKO_API_KEY
            }
        }),

        Promise.allSettled(nftIds.map(id => getNFTCollection(id)))
    ]);

    const stockArray = Array.isArray(stockQuotes) ? stockQuotes : [stockQuotes];
    const stocks = stockArray.map(s => ({
        symbol: s.symbol,
        name: s.shortName,
        market: 'stock',
        price: s.regularMarketPrice,
        change24h: +s.regularMarketChangePercent?.toFixed(2),
        change1h: null,
        volume: s.regularMarketVolume,
        marketCap: s.marketCap,
    }));

    const crypto = cryptoQuotes.data.map(c => ({
        symbol: c.symbol.toUpperCase(),
        name: c.name,
        market: 'crypto',
        price: c.current_price,
        change24h: +c.price_change_percentage_24h?.toFixed(2),
        change1h: +(c.price_change_percentage_1h_in_currency || 0)?.toFixed(2),
        volume: c.total_volume,
        marketCap: c.market_cap,
    }));

    const nfts = nftQuotes
        .filter(r => r.status === 'fulfilled')
        .map(r => ({
            symbol: r.value.symbol?.toUpperCase() || r.value.id.toUpperCase(),
            name: r.value.name,
            market: 'nft',
            price: r.value.floorPrice,
            change24h: r.value.change24h,
            change1h: null,
            volume: r.value.volume24h,
            marketCap: r.value.marketCap,
        }));

    return [...stocks, ...crypto, ...nfts];
}