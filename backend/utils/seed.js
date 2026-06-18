import 'dotenv/config';
import fs from 'fs';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import YahooFinance from 'yahoo-finance2';
import axios from 'axios';
import { Stock } from '../models/Stock.js';
import { Crypto } from '../models/Crypto.js';

const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });


// pause between api executions
const pause = (duration) => {
    return new Promise(resolve => setTimeout(resolve, duration));
};

// stock seeding
async function handleStockSeeding() {
    // break an array into smaller chunks
    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };
    try {
        // await mongoose.connect(process.env.MONGO_URI);
        // console.log('Connected to MongoDB for seeding data');
        const stockSymbols = [];
        fs.createReadStream('./assets/stocks_symbols.csv')
            .pipe(csv())
            .on('data', (item) => {
                if (item['Symbol']) {
                    stockSymbols.push(item['Symbol'].toUpperCase());
                }
            })
            .on('end', async () => {
                console.log(`Fetched ${stockSymbols.length} stock symbols from CSV file.`);

                // chunk symbols into batches to avoid yahoo-finance api limits
                const symbolChunks = chunkArray(stockSymbols, 100);
                for (let i = 0; i < symbolChunks.length; i++) {
                    const currentBatch = symbolChunks[i];
                    console.log(`Processing batch ${i + 1}/${symbolChunks.length} (${currentBatch.length} symbols)...`);
                    try {
                        const result = await yahooFinance.quote(currentBatch);
                        const resultArray = Array.isArray(result) ? result : [result];

                        // transform payload to match Stock model schema
                        const formattedData = resultArray.map(stock => {
                            if (!stock || !stock.symbol) return null;
                            return {
                                updateOne: {
                                    filter: { symbol: stock.symbol.toUpperCase() },
                                    update: {
                                        $set: {
                                            symbol: stock.symbol,
                                            name: stock.shortName || stock.longName || stock.symbol,
                                            price: stock.regularMarketPrice,
                                            change: stock.regularMarketChangePercent,
                                            marketCap: stock.marketCap,
                                            volume: stock.regularMarketVolume,
                                            details: stock, // store entire payload for future reference
                                        }
                                    },
                                    upsert: true
                                }
                            };
                        }).filter(item => item !== null); // filter out any null entries due to missing symbols
                        if (formattedData.length > 0) {
                            await Stock.bulkWrite(formattedData, { ordered: false });
                        }
                    } catch (error) {
                        console.error('Skipping due to an error:', error);
                    }
                    await pause(2000);
                }
                console.log('Stock data seeding completed');
            })
    } catch (error) {
        console.error('Failure! Error in stock seeding process:', error);
    }
}

// crypto seeding
async function handleCryptoSeeding() {
    // timeframe
    const timeFrame_map = {
        '1h': '1h',
        '1d': '24h',
        '1w': '7d',
        '1mo': '30d',
        '1y': '1y'
    };
    const extractTimeFrameData = (coinData) => {
        return {
            '1h': coinData.price_change_percentage_1h_in_currency,
            '1d': coinData.price_change_percentage_24h_in_currency,
            '1w': coinData.price_change_percentage_7d_in_currency,
            '1mo': coinData.price_change_percentage_30d_in_currency,
            '1y': coinData.price_change_percentage_1y_in_currency,
        };
    };

    console.log('Fetching crypto data');
    console.log('Validationg regional currencies...');
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/supported_vs_currencies?x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`);
    const currency_resp = response.data;
    const targetedCurrency = ['usd', 'inr'];
    console.log('Validation successful. Proceeding to fetch coins market data');

    // format timeframe strings
    const coinsIntervalStrings = Object.values(timeFrame_map).join(',');
    // execute parallel queries
    const [resp_usd, resp_inr] = await Promise.all([
        axios.get(`${process.env.COINGECKO_API_URL}/markets?vs_currency=usd&price_change_percentage=${coinsIntervalStrings}&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`),
        axios.get(`${process.env.COINGECKO_API_URL}/markets?vs_currency=inr&price_change_percentage=${coinsIntervalStrings}&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`)
    ]);

    const usd_coins = resp_usd.data;
    const inr_coins = resp_inr.data;

    // unified document batch trabsactions
    const formattedCoins = [];
    const inrMap = new Map(inr_coins.map(coin => [coin.id, coin]));
    for (const usdCoin of usd_coins) {
        const inrCoin = inrMap.get(usdCoin.id);
        if (!inrCoin) continue;

        // ohlc
        const timePerios = [1, 7, 30, 180, 365];
        let formattedOhlc = {};
        for (const day of timePerios) {
            try {
                const ohlc_resp = await axios.get(`https://api.coingecko.com/api/v3/coins/${usdCoin.id}/ohlc?precision=3&days=${day}&vs_currency=usd&x_cg_demo_api_key=${process.env.COINGECKO_API_KEY}`);
                formattedOhlc[`${day}d`] = ohlc_resp.data.map(candle => ({
                    timestamp: new Date(candle[0]),
                    open: candle[1],
                    high: candle[2],
                    low: candle[3],
                    close: candle[4],
                }));
            } catch (error) {
                console.error(`Couldn't fetch ${day}d OHLC data for ${usdCoin.id}`, error);
            }
        }
        console.log(`Processing crypto symbol ${usdCoin.id}...`);
        console.log('before push');
        formattedCoins.push({
            updateOne: {
                filter: { coin_id: usdCoin.id },
                update: {
                    $set: {
                        coin_id: usdCoin.id,
                        symbol: usdCoin.symbol.toUpperCase(),
                        name: usdCoin.name,
                        image: usdCoin.image,
                        current_price: usdCoin.current_price,
                        market_cap: usdCoin.market_cap,
                        market_cap_rank: usdCoin.market_cap_rank,
                        market_cap_change_24h: usdCoin.market_cap_change_24h,
                        fully_diluted_valuation: usdCoin.fully_diluted_valuation,
                        price_change_timeline: extractTimeFrameData(usdCoin),
                        price_change_24h: usdCoin.price_change_24h,
                        price_change_percentage_24h: usdCoin.price_change_percentage_24h,
                        atl: usdCoin.atl,
                        ath_change: usdCoin.ath_change,
                        ath_change_percentage: usdCoin.ath_change_percentage,
                        last_updated: new Date(usdCoin.last_updated),
                        ohlc_history: formattedOhlc
                    }
                },
                upsert: true
            }
        });
        console.log('current operations', formattedCoins.length);
        console.log('after push');
        await pause(2000);
        console.log('Crypto data seeding completed');
    }
    if (formattedCoins.length > 0) {
        try {
            console.log('starting bulkwrite..');
            const result = await Crypto.bulkWrite(formattedCoins, { ordered: false });
            console.log(`Successfully completed processing! Actions processed: ${result.upsertedCount + result.modifiedCount}`);
        } catch (error) {
            console.error('bulkwrite failed', error);
        }
    }
}

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connedted to mongodb for seeding data');

        await handleStockSeeding();
        await handleCryptoSeeding();
        console.log('Seeding completed successfully.')
    } catch (error) {
        console.error('Failure while seeding data:', error);
    } finally {
        mongoose.connection.close();
        console.log('MongoDB Connection closed');
    }
};

seedData();