import mongoose from 'mongoose';

const nftSchema = new mongoose.Schema({
    nft_id: { type: String, required: true, unique: false },
    contract_address: { type: String, required: true },
    name: { type: String, required: true },
    asset_platform_id: { type: String, required: true },
    symbol: { type: String, required: true },
});

export const NFT = mongoose.model('nfts', nftSchema);


const nftDetailsSchema = new mongoose.Schema({
    "id": { type: String, required: true, unique: true },
    "web_slug": { type: String, required: true },
    "contract_address": { type: String, required: true },
    "asset_platform_id": { type: String, required: true },
    "name": { type: String, required: true },
    "symbol": { type: String, required: true },
    "image": {
        "small": { type: String, required: true },
        "small_2x": { type: String, required: true }
    },
    "banner_image": { type: String },
    "description": { type: String, required: true },
    "native_currency": { type: String, required: true },
    "native_currency_symbol": { type: String, required: true },
    "market_cap_rank": { type: String },
    "floor_price": {
        "native_currency": { type: Number, required: true },
        "usd": { type: Number, required: true }
    },
    "market_cap": {
        "native_currency": { type: Number, required: true },
        "usd": { type: Number, required: true }
    },
    "volume_24h": {
        "native_currency": { type: Number, required: true },
        "usd": { type: Number, required: true }
    },
    "floor_price_in_usd_24h_percentage_change": { type: Number, required: true },
    "floor_price_24h_percentage_change": {
        "usd": { type: Number, required: true },
        "native_currency": { type: Number, required: true }
    },
    "market_cap_24h_percentage_change": {
        "usd": { type: Number, required: true },
        "native_currency": { type: Number, required: true }
    },
    "volume_24h_percentage_change": {
        "usd": { type: Number, required: true },
        "native_currency": { type: Number, required: true }
    },
    "number_of_unique_addresses": { type: Number, required: true },
    "number_of_unique_addresses_24h_percentage_change": { type: Number, required: true },
    "volume_in_usd_24h_percentage_change": { type: Number, required: true },
    "total_supply": { type: Number, required: true },
    "one_day_sales": { type: Number, required: true },
    "one_day_sales_24h_percentage_change": { type: Number, required: true },
    "one_day_average_sale_price": { type: String },
    "one_day_average_sale_price_24h_percentage_change": { type: Number, required: true },
    "links": {
        "homepage": { type: String, required: true },
        "twitter": { type: String, required: true },
        "discord": { type: String, required: true }
    },
    "floor_price_7d_percentage_change": {
        "usd": { type: Number, required: true },
        "native_currency": { type: Number, required: true }
    },
    "floor_price_14d_percentage_change": {
        "usd": { type: Number, required: true },
        "native_currency": { type: Number, required: true }
    },
    "floor_price_30d_percentage_change": {
        "usd": { type: Number, required: true },
        "native_currency": { type: Number, required: true }
    },
    "floor_price_60d_percentage_change": {
        "usd": { type: Number, required: true },
        "native_currency": { type: Number, required: true }
    },
    "floor_price_1y_percentage_change": {
        "usd": { type: Number, required: true },
        "native_currency": { type: Number, required: true }
    },
    "explorers": [
        {
            "name": { type: String, required: true },
            "link": { type: String, required: true }
        },
        {
            "name": { type: String, required: true },
            "link": { type: String, required: true }
        },
        {
            "name": { type: String, required: true },
            "link": { type: String, required: true }
        }
    ],
    "user_favorites_count": { type: Number, required: true },
    "ath": {
        "native_currency": { type: Number, required: true },
        "usd": { type: Number, required: true }
    },
    "ath_change_percentage": {
        "native_currency": { type: Number, required: true },
        "usd": { type: Number, required: true }
    },
    "ath_date": {
        "native_currency": { type: String, required: true },
        "usd": { type: String, required: true }
    }
});

export const NFTDetails = mongoose.model('nft-details', nftDetailsSchema);