'use client';
import { useCallback, useEffect, useState } from "react";
import SimpleAreaChart from "../layouts/charts/AreaChart";
import CandleStick from "../layouts/charts/StockCandleStick";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function StocksComponent() {
    const router = useRouter();
    const { user, isLoggedIn } = useAuth();
    const [stocks, setStocks] = useState([]);
    const [stockDetails, setStockDetails] = useState([]);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // fetch stocks data from api endpoint and set to state
    const fetchStockData = useCallback(async (targetPage, query = "", isAppend = "") => {
        try {
            if (targetPage === 1) setLoading(true);
            else setLoadingMore(true);
            // api call with pagination and search query params
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/stocks/stock-details?page=${targetPage}&limit=100&search=${query}`);
            const result = response.data;
            setStocks(prev => isAppend ? [...prev, ...result.data] : result.data);
            setHasMore(result.hasMore);
        } catch (error) {
            console.error('Error fetching stock data:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);
    useEffect(() => {
        (async () => {
            await fetchStockData();
        })();
    }, [fetchStockData]);


    const cardsData = [
        {
            title: "Total Stocks",
            value: stocks.length,
        },
        {
            title: "Total Price",
            value: `$${stocks.reduce((total, stock) => total + (stock.price || 0), 0).toFixed(2)}`,
        },
        {
            title: isLoggedIn ? user.fullname : "Dow Jones",
            value: 2,
        },
        {
            title: "Market",
            value: "US",
        },
    ];

    // search handler for stock symbols
    const filteredStocks = stocks.filter(stock => stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()));
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        setPage(1);
        fetchStockData(1, event.target.value, false);
    };

    // handle order
    const handleOrder = (stock) => {
        console.log(stock.id);
        const params = new URLSearchParams({
            market: 'stock',
            name: stock.symbol,
        });
        router.push(`/dashboard/orders?${params.toString()}`);
    };

    const handleLoadMore = () => {
        if (loadingMore || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchStockData(nextPage, searchQuery, true);
    };

    // show stock-details
    const showStockDetails = async (symbol) => {
        try {
            // setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/stocks/${symbol}`);
            const result = response.data;
            // console.log('stock details response ==>', result);
            setStockDetails(result.data);
        } catch (error) {
            console.error('Error fetching stock details:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-5 border-0 p-0 text-gray-300">
            <div className="w-full flex items-center justify-between p-1">
                <p className="hidden md:flex lg:flex text-lg items-center justify-center gap-1">
                    <svg className="w-6 h-6 text-gray-800 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M6 4v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2m6-16v2m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v10m6-16v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2" />
                    </svg>
                    Stocks
                </p>
                <div className="flex items-center justify-center gap-2 ml-auto">
                    <input type="search" placeholder="search symbol..." className="w-full flex border border-gray-500 p-2 rounded-md outline-none bg-[#51515100] focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500" onChange={handleSearch} />
                    {/* <button className="border flex px-3 py-2 rounded-md transition-all duration-100 group hover:text-[#cca649]">
                        <svg className="w-6 h-6 group-hover:text-[#cca649] dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4" />
                        </svg>
                        Refresh
                    </button> */}
                </div>
            </div>

            {/* cards-data */}
            <div className="border-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 p-1 text-sm">
                {cardsData.map((item, index) => (
                    <div key={index} className="w-full md:w-[80%] lg:w-[90%] border-0 rounded-md px-1 py-4 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.05] cursor-default">
                        <p className="whitespace-nowrap">{item.title}</p>
                        <p className="whitespace-nowrap">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* live stocks */}
            <div className="w-full flex flex-col items-start justify-center gap-2 text-gray-300 border-0 p-1">
                {/* heading & dropdown */}
                <div className="border-0 flex w-full items-center justify-between gap-2">
                    <p className="flex gap-2 items-center justify-start">
                        Live Stocks
                    </p>
                    <select tabIndex={0} className="hidden md:flex lg:flex border border-gray-500 p-2 rounded-md bg-[#51515148] outline-none focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 ml-auto">
                        <option>All</option>
                    </select>
                    {/* load-more btn */}
                    {hasMore && stocks.length > 0 && (
                        <button onClick={handleLoadMore}
                            disabled={loadingMore}
                            className={`border flex items-center gap-0.5 px-3 py-2 rounded-md transition-all duration-100 group hover:text-[#cca649] whitespace-nowrap ${loadingMore ? 'cursor-not-allowed' : !hasMore ? 'cursor-not-allowed text-gray-500' : 'cursor-default'}`}
                        >
                            <svg className="w-5 h-5 group-hover:text-[#cca649] dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4" />
                            </svg>
                            {loadingMore ? "Loading more stocks..." : !hasMore ? "Completed" : "Load More"}
                        </button>
                    )}
                </div>

                {/* stocks-table */}
                <div className="relative max-h-80 overflow-y-auto custom-scrollbar bg-neutral-primary-soft shadow-xs rounded-md px-1 w-full bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] border-0 border-gray-700">
                    <table className="w-full text-sm text-center text-body whitespace-nowrap min-w-150">
                        <thead className="sticky top-0 z-10 bg-[#0f1720f7] border-b border-gray-700 uppercase focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 outline-none px-2 rounded-md py-1 cursor-default">
                            <tr>
                                <th className="py-3 px-4 w-10 text-gray-500">Sl. No.</th>
                                <th className="py-3 px-4">Symbol</th>
                                <th className="py-3 px-4">Price</th>
                                <th className="py-3 px-4">24h Change</th>
                                <th className="py-3 px-4">Volume</th>
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
                                filteredStocks.length > 0 ? (
                                    filteredStocks.map((stock, index) => (
                                        <tr key={index} className="transition-all duration-300 hover:bg-[#51515148] cursor-default">
                                            <td className="py-2 px-2 w-10 text-gray-500">{index + 1}</td>
                                            <td className="py-2 px-2">{stock.symbol}</td>
                                            <td className="py-2 px-2 font-mono">${stock.price?.toFixed(2)}</td>
                                            <td className={`py-2 px-2 ${stock.change > 0 ? 'text-green-500' : stock.change < 0 ? 'text-red-500' : 'text-gray-500'}`}>{stock.change.toFixed(2)}%</td>
                                            <td className="py-2 px-2">{stock.volume?.toFixed(1)}M</td>
                                            <td className="py-2 px-2">${stock.marketCap}</td>
                                            <td className="py-2 px-2 flex items-center justify-center gap-2">
                                                <button type="button" className="border px-2 rounded-md shadow-2xl text-gray-400 hover:text-[#cca649] hover:cursor-pointer"
                                                    onClick={() => showStockDetails(stock.symbol)}
                                                >
                                                    Details
                                                </button>
                                                <button type="button" className="border px-2 rounded-md shadow-2xl text-gray-400 hover:text-[#cca649] hover:cursor-pointer"
                                                    onClick={() => handleOrder(stock)}
                                                >
                                                    Order
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="py-2 px-2" colSpan="6">
                                            {searchQuery ? "No symbol matched your search." : "No data available."}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {/* stock-details */}
                <div className="border-0 border-gray-700 rounded-md w-full grid grid-cols-1 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2]">
                    {stockDetails.symbol === undefined ? (
                        <div className="border-0 flex items-center justify-center py-3 text-gray-500">Select a stock first</div>
                    )
                        : (stockDetails && (
                            <>
                                <div className={`p-4 cursor-default flex flex-col gap-0.5 border-0`}>
                                    <div className="w-full border-0 flex items-center justify-between text-lg font-bold">
                                        <p>{stockDetails.symbol}</p>
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
                                        {/* <span>{stockDetails.regularMarketDayRange[0]}</span> - <span>{stockDetails.regularMarketDayRange[1]}</span> */}
                                    </p>
                                    <p>Volume: {stockDetails.volume?.toFixed(1)}M</p>
                                    <p>Mkt Cap: ${stockDetails.marketCap}</p>
                                </div>

                                {/* chart */}
                                <div className={`h-full flex flex-col items-center justify-between border-0 px-4 py-2`}>
                                    {/* <SimpleAreaChart symbol={stockDetails.symbol === undefined ? 'A' : stockDetails.symbol} /> */}
                                    <SimpleAreaChart symbol={stockDetails.symbol} />
                                    <CandleStick symbol={stockDetails.symbol} heading='flex' isZoomed={false} isShow={true} />
                                </div>
                            </>
                        ))}
                </div>
            </div >
        </div >
    );
}