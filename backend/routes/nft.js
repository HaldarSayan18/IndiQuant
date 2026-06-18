import 'dotenv/config';
import axios from 'axios';
import express from 'express';
import { NFT, NFTDetails } from '../models/NFTs.js';

const router = express.Router();

router.get('/list', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/nfts/list');
        const nftsData = response.data;

        if (nftsData.length === 0)
            return res.status(400).json({ success: false, message: "No data found" });
        const bulkOps = nftsData.map(nft => ({
            updateOne: {
                filter: { nft_id: nft.id },
                update: {
                    $set: {
                        nft_id: nft.id,
                        contract_address: nft.contract_address,
                        name: nft.name,
                        asset_platform_id: nft.asset_platform_id,
                        symbol: nft.symbol,
                    }
                },
                upsert: true
            }
        }));
        const result = await NFT.bulkWrite(bulkOps);
        res.status(200).json({
            success: true,
            message: 'NFT synced successfully',
            summary: {
                totalProcessed: nftsData.length
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to sync NFT data", error: error.message });
    }
});

// stored details
router.get('/:nft_id/details', async (req, res) => {
    try {

        const listedNFTs = await NFT.find({}, 'nft_id').lean();
        if (listedNFTs.length === 0) {
            return res.status(400).json({
                success: false,
                message: "'nfts' collection is empty."
            });
        }
        console.log(`Processing details for ${listedNFTs.length} items...`);
        for (const nft of listedNFTs) {
            const nft_id = nft.nft_id;
            try {
                const response = await axios.get(`https://api.coingecko.com/api/v3/nfts/${nft_id}`, {
                    headers: { 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY }
                });
                const data = response.data;
                if (!data || !data.id) {
                    return res.status(404).json({ success: false, message: "NFT data not found" });
                }
                const preparedData = {
                    id: nft_id,
                    web_slug: data.web_slug || "",
                    contract_address: data.contract_address || "N/A",
                    asset_platform_id: data.asset_platform_id || "",
                    name: data.name || "",
                    symbol: data.symbol || "",
                    image: {
                        small: data.image?.small || "",
                        small_2x: data.image?.small_2x || ""
                    },
                    banner_image: data.banner_image || null,
                    description: data.description || "No description available.",
                    native_currency: data.native_currency || "",
                    native_currency_symbol: data.native_currency_symbol || "",
                    market_cap_rank: data.market_cap_rank ? String(data.market_cap_rank) : null,
                    floor_price: {
                        native_currency: data.floor_price?.native_currency || 0,
                        usd: data.floor_price?.usd || 0
                    },
                    market_cap: {
                        native_currency: data.market_cap?.native_currency || 0,
                        usd: data.market_cap?.usd || 0
                    },
                    volume_24h: {
                        native_currency: data.volume_24h?.native_currency || 0,
                        usd: data.volume_24h?.usd || 0
                    },
                    floor_price_in_usd_24h_percentage_change: data.floor_price_in_usd_24h_percentage_change || 0,
                    floor_price_24h_percentage_change: {
                        usd: data.floor_price_24h_percentage_change?.usd || 0,
                        native_currency: data.floor_price_24h_percentage_change?.native_currency || 0
                    },
                    market_cap_24h_percentage_change: {
                        usd: data.market_cap_24h_percentage_change?.usd || 0,
                        native_currency: data.market_cap_24h_percentage_change?.native_currency || 0
                    },
                    volume_24h_percentage_change: {
                        usd: data.volume_24h_percentage_change?.usd || 0,
                        native_currency: data.volume_24h_percentage_change?.native_currency || 0
                    },
                    number_of_unique_addresses: data.number_of_unique_addresses || 0,
                    number_of_unique_addresses_24h_percentage_change: data.number_of_unique_addresses_24h_percentage_change || 0,
                    volume_in_usd_24h_percentage_change: data.volume_in_usd_24h_percentage_change || 0,
                    total_supply: data.total_supply || 0,
                    one_day_sales: data.one_day_sales || 0,
                    one_day_sales_24h_percentage_change: data.one_day_sales_24h_percentage_change || 0,
                    one_day_average_sale_price: data.one_day_average_sale_price ? String(data.one_day_average_sale_price) : "0",
                    one_day_average_sale_price_24h_percentage_change: data.one_day_average_sale_price_24h_percentage_change || 0,
                    links: {
                        homepage: data.links?.homepage || "",
                        twitter: data.links?.twitter || "",
                        discord: data.links?.discord || ""
                    },
                    floor_price_7d_percentage_change: {
                        usd: data.floor_price_7d_percentage_change?.usd || 0,
                        native_currency: data.floor_price_7d_percentage_change?.native_currency || 0
                    },
                    floor_price_14d_percentage_change: {
                        usd: data.floor_price_14d_percentage_change?.usd || 0,
                        native_currency: data.floor_price_14d_percentage_change?.native_currency || 0
                    },
                    floor_price_30d_percentage_change: {
                        usd: data.floor_price_30d_percentage_change?.usd || 0,
                        native_currency: data.floor_price_30d_percentage_change?.native_currency || 0
                    },
                    floor_price_60d_percentage_change: {
                        usd: data.floor_price_60d_percentage_change?.usd || 0,
                        native_currency: data.floor_price_60d_percentage_change?.native_currency || 0
                    },
                    floor_price_1y_percentage_change: {
                        usd: data.floor_price_1y_percentage_change?.usd || 0,
                        native_currency: data.floor_price_1y_percentage_change?.native_currency || 0
                    },
                    // Maps the array of items explicitly
                    explorers: Array.isArray(data.explorers)
                        ? data.explorers.map(exp => ({ name: exp.name || "", link: exp.link || "" }))
                        : [],
                    user_favorites_count: data.user_favorites_count || 0,
                    ath: {
                        native_currency: data.ath?.native_currency || 0,
                        usd: data.ath?.usd || 0
                    },
                    ath_change_percentage: {
                        native_currency: data.ath_change_percentage?.native_currency || 0,
                        usd: data.ath_change_percentage?.usd || 0
                    },
                    ath_date: {
                        native_currency: data.ath_date?.native_currency || "",
                        usd: data.ath_date?.usd || ""
                    }
                };

                await NFTDetails.findOneAndUpdate(
                    { id: nft_id },
                    { $set: preparedData },
                    { upsert: true }
                );

                console.log(`Synced: ${nft_id} (${listedNFTs.length})`);
            } catch (error) {
                console.log('Failed', error);
            }
        }
        res.status(200).json({
            success: true,
            message: `NFT details fetched successfully.`
        });
    } catch (error) {
        console.error(`Error syncing details for NFT ${nftId}:`, error.message);
        res.status(500).json({
            success: false,
            message: `Failed to sync details for NFT: ${nftId}`,
            error: error.response?.data || error.message
        });
    }
});

// fetch details
router.get('/details', async (req, res) => {
    try {
        // const page = parseInt(req.query.page) || 1;
        // const limit = parseInt(req.query.limit) || 50;
        // const skip = (page - 1) * limit;

        const items = await NFTDetails.find({});
        // const items = await NFTDetails.find().skip(skip).limit(limit).lean();

        const totalItems = await NFTDetails.countDocuments();
        res.status(200).json({
            success: true,
            data: items,
            // pagination: {
            //     currentPage: page,
            //     totalPages: Math.ceil(totalItems / limit),
            //     totalItems,
            //     hasNextPage: skip + items.length < totalItems
            // }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});



export default router;