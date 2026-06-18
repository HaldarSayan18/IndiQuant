'use client';

import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import CandleStick from "../layouts/charts/CryptoCandleStick";

export default function CryptoComponent() {
    const [loading, setLoading] = useState(true);
    const [cryptos, setCryptos] = useState([]);
    const [cryptoOhlc, setCryptoOhlc] = useState([]);
    const [selectedCoinId, setSelectedCoinId] = useState('bitcoin');
    const [searchQuery, setSearchQuery] = useState('');

    const cardsData = [
        {
            title: "Total market cap",
            value: '$2.41T',
            status: "+2.8% today"
        },
        {
            title: "24h volume",
            value: '$98.4B',
            status: "+11% vs yesterday"
        },
        {
            title: "BTC dominance",
            value: '52.4%',
            status: "of total market cap"
        },
        {
            title: "Active coins",
            value: '13,210',
            status: ""
        },
    ];

    // fetch crypto from api
    const fetchCryptoData = useCallback(async () => {
        try {
            // setLoading(true);
            const response = await axios.get('http://localhost:5000/api/crypto');
            const result = response.data;
            setCryptos(result.data);
        } catch (error) {
            console.log('Error whilte fetching crypto data', error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        (async () => {
            await fetchCryptoData();
        })()
    }, [fetchCryptoData]);

    // fetch crypto ohlc data
    const showCryptoDetails = async (coin_id) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/crypto/${coin_id}/history`);
            const result = response.data;
            console.log('coin details---', result.data);
            setSelectedCoinId(coin_id);
            setCryptoOhlc(result.data);
            console.log('coin details selected---', selectedCoinId);
        } catch (error) {
            console.log('Error while fetching crypto ohlc data', error);
        } finally {
            setLoading(false);
        }
    };

    // search handler for stock symbols
    const filteredCryptos = cryptos.filter(coin => {
        return coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    });
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        // setPage(1);
        fetchCryptoData(1, event.target.value, false);
    };

    return (
        <div className="grid grid-cols-1 gap-3 border-0 p-0 text-gray-300">
            <div className="w-full flex items-center justify-between p-1">
                <p className="text-lg flex items-center justify-center gap-1">
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M10.7367 14.5876c.895.2365 2.8528.754 3.1643-.4966.3179-1.2781-1.5795-1.7039-2.5053-1.9117-.1034-.0232-.1947-.0437-.2694-.0623l-.6025 2.4153c.0611.0152.1328.0341.2129.0553Zm.8452-3.5291c.7468.1993 2.3746.6335 2.6581-.5025.2899-1.16213-1.2929-1.5124-2.066-1.68348-.0869-.01923-.1635-.03619-.2262-.0518l-.5462 2.19058c.0517.0129.1123.0291.1803.0472Z" />
                        <path fill="currentColor" fillRule="evenodd" d="M9.57909 21.7008c5.35781 1.3356 10.78401-1.9244 12.11971-7.2816 1.3356-5.35745-1.9247-10.78433-7.2822-12.11995C9.06034.963624 3.6344 4.22425 2.2994 9.58206.963461 14.9389 4.22377 20.3652 9.57909 21.7008ZM14.2085 8.0526c1.3853.47719 2.3984 1.1925 2.1997 2.5231-.1441.9741-.6844 1.4456-1.4013 1.6116.9844.5128 1.485 1.2987 1.0078 2.6612-.5915 1.6919-1.9987 1.8347-3.8697 1.4807l-.454 1.8196-1.0972-.2734.4481-1.7953c-.2844-.0706-.575-.1456-.8741-.2269l-.44996 1.8038-1.09594-.2735.45407-1.8234c-.10059-.0258-.20185-.0522-.30385-.0788-.15753-.0411-.3168-.0827-.47803-.1231l-1.42812-.3559.54468-1.2563s.80844.215.7975.1991c.31063.0769.44844-.1256.50282-.2606l.71781-2.8766.11562.0288c-.04375-.0175-.08343-.0288-.11406-.0366l.51188-2.05344c.01375-.23312-.06688-.52719-.51125-.63812.01718-.01157-.79688-.19813-.79688-.19813l.29188-1.17187 1.51313.37781-.0013.00562c.2275.05657.4619.11032.7007.16469l.4497-1.80187 1.0965.27343-.4406 1.76657c.2944.06718.5906.135.8787.20687l.4375-1.755 1.0975.27344-.4493 1.8025Z" clipRule="evenodd" />
                    </svg>
                    Crypto
                </p>
                <div className="flex items-center justify-center gap-2 ml-auto">
                    <input type="search" placeholder="search coin..." className="hidden md:flex lg:flex border border-gray-500 p-2 rounded-md outline-none bg-[#51515148] focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500" onChange={handleSearch} />
                    <button className="border flex px-3 py-2 rounded-md transition-all duration-100 group hover:text-[#cca649]">
                        <svg className="w-6 h-6 group-hover:text-[#cca649] dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            <div className="border-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 p-1">
                {cardsData.map((item, index) => (
                    <div key={index} className="w-full md:w-[80%] lg:w-[90%] border-0 rounded-md px-1 py-4 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-[1.05] cursor-default text-sm">
                        <p className="whitespace-nowrap">{item.title}</p>
                        <p className="whitespace-nowrap">{item.value}</p>
                        <p className={`whitespace-nowrap ${item.status.startsWith('+') ? 'text-green-500' : item.status.startsWith('-') ? 'text-red-500' : 'text-gray-500'}`}>{item.status}</p>
                    </div>
                ))}
            </div>

            {/* live quotes */}
            <div className="w-full flex flex-col items-start justify-center gap-2 text-gray-300 border-0 p-1">
                {/* heading & dropdown */}
                <div className="border-0 flex w-full items-center justify-between">
                    <p className="flex gap-2 items-center justify-start">
                        Top 100 market cap
                    </p>
                </div>

                {/* quotes-table */}
                <div className="relative max-h-80 overflow-y-auto custom-scrollbar bg-neutral-primary-soft shadow-xs rounded-md p-0 w-full bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] border-0 border-gray-700">
                    <table className="w-full text-sm text-center text-body whitespace-nowrap min-w-150">
                        <thead className="sticky top-0 z-10 bg-[#0f1720f7] border-b border-gray-700 uppercase focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 outline-none px-2 rounded-md py-1">
                            <tr>
                                <th className="py-3 px-4">Rank</th>
                                <th className="py-3 px-4 w-40">Coin</th>
                                <th className="py-3 px-4">Price</th>
                                <th className="py-3 px-4">24h %Change</th>
                                <th className="py-3 px-4">Mkt Cap</th>
                                <th className="py-3 px-4 w-10"></th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-4 text-center text-gray-500">Loading data...</td>
                                </tr>
                            ) : (
                                filteredCryptos.length > 0 ? (
                                    filteredCryptos.map((coin) => (
                                        <tr key={coin._id} className="transition-all duration-300 hover:bg-[#51515148] cursor-default">
                                            <td className="py-2 px-2 font-mono">{coin.market_cap_rank}</td>
                                            <td className="flex items-center justify-start gap-2 py-2 px-2 w-80 whitespace-normal">
                                                <Image src={coin.image} alt="coin" width={20} height={20} className="border" />
                                                <span className="capitalize">{coin.name} ({coin.symbol})</span>
                                            </td>
                                            <td className="py-2 px-2 font-mono">{coin.current_price}</td>
                                            <td className={`py-2 px-2 ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : coin.price_change_percentage_24h < 0 ? 'text-red-500' : 'text-gray-500'}`}>{coin.price_change_percentage_24h}</td>
                                            <td className="py-2 px-2">${coin.market_cap}</td>
                                            <td className="py-2 px-2 flex items-center justify-center gap-2">
                                                <button type="button" className="border px-2 rounded-md shadow-2xl text-gray-400 hover:text-[#cca649] hover:cursor-pointer"
                                                    onClick={() => {showCryptoDetails(coin.coin_id)}}
                                                >
                                                    Details
                                                </button>
                                                <button type="button" className="border px-2 rounded-md shadow-2xl text-gray-400 hover:text-[#cca649] hover:cursor-pointer"
                                                // onClick={() => showCryptoDetails(coin.symbol)}
                                                >
                                                    Order
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="py-2 px-2" colSpan="6">
                                            {searchQuery ? "No coin matched your search." : "No data available."}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {/* coin-details */}
                <div className="border-0 border-gray-700 rounded-md w-full grid grid-cols-1 place-items-center bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2]">
                    {/* {stockDetails && (
                        <>
                            <div className="p-4 cursor-default flex flex-col gap-0.5 border-0">
                                <div className="w-full border-0 flex items-center justify-between text-lg font-bold">
                                    <p>{stockDetails.symbol} {stockDetails.bid}</p>
                                    <p className="ml-auto">{stockDetails.longName}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className='border border-gray-500 px-2 py-0 rounded-md shadow-2xl'>{stockDetails.region}</p>
                                    <p className='border border-gray-500 px-2 py-0 rounded-md shadow-2xl'>{stockDetails.financialCurrency}</p>
                                    <p className='border border-gray-500 px-2 py-0 rounded-md shadow-2xl'>Bid: {stockDetails.bid}</p>
                                    <p className={`border border-gray-500 px-2 py-0 rounded-md shadow-2xl ${stockDetails.tradable ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                                        {stockDetails.tradable ? "Tradable" : "Non-tradable"}
                                    </p>
                                </div>
                                <p>Source: {stockDetails.quoteSourceName}</p>
                                <p>Regular Market Day:
                                    <span>{stockDetails.regularMarketDayRange[0]}</span> - <span>{stockDetails.regularMarketDayRange[1]}</span>
                                </p>
                                <p>Volume: {stockDetails.volume?.toFixed(1)}M</p>
                                <p>Mkt Cap: ${stockDetails.marketCap}</p>
                            </div>

                            </>
                            )} */}
                    {cryptoOhlc && (
                        <div className="border-0 px-4 py-2 w-full">
                            <CandleStick data={cryptoOhlc} coin_id={selectedCoinId} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}