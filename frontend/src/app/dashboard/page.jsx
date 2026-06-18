'use client';
import CandleStick from '@/components/layouts/charts/StockCandleStick';
import { api } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stocksPannel, setStocksPannel] = useState([]);
    const [cryptoPannel, setCryptoPannel] = useState([]);
    const [nftPannel, setNFTPannel] = useState([]);
    const symbol = 'AAPL';

    const cardsData = [
        {
            title: "Portfolio value",
            value: "$12,480",
        },
        {
            title: "Today's P&L",
            value: "+$340",
        },
        {
            title: "Open orders",
            value: 7,
        },
        {
            title: "Active alerts",
            value: 4,
        },
    ];

    // news api
    useEffect(() => {
        // show stock-details
        const showDetails = async (symbol) => {
            try {
                // setLoading(true);
                const response = await api.get(`/api/stocks/stock-details`);
                const result = response?.data;
                // console.log('stock details response ==>', result);
                setStocksPannel(result?.data);
                const response1 = await api.get(`/api/crypto`);
                const result1 = response1?.data;
                // console.log('stock details response ==>', result1);
                setCryptoPannel(result1?.data);
                const response2 = await api.get(`/api/nfts/details`);
                const result2 = response2?.data;
                // console.log('stock details response ==>', result2);
                setNFTPannel(result2?.data);
            } catch (error) {
                console.error('Error fetching stock details:', error);
            } finally {
                setLoading(false);
            }
        };
        showDetails();

        const fetchNews = async () => {
            try {
                const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`);
                // console.log('news data---', response.data.articles);
                setNews(response.data.articles);
            } catch (error) {
                console.log('Erro fetching news', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);
    const getPreview = (content) => {
        if (!content) return "No content available";

        return content
            .replace(/\[\+\d+\schars\]/, "")
            .replace(/<[^>]*>/g, "")
            .trim()
            .slice(0, 100);
    };

    return (
        <div className="grid grid-cols-1 gap-5 border-0 p-1 text-gray-300 cursor-default">
            {/* cards */}
            <div className="border-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 p-1">
                {cardsData.map((item, index) => (
                    <div key={index} className="w-full md:w-[80%] lg:w-[80%] border-0 rounded-md px-2 py-5 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.05]">
                        <p className="whitespace-nowrap">{item.title}</p>
                        <p className="whitespace-nowrap">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-5 p-1 border-0">
                {/* stocks-pannel */}
                <div className="border-0 flex flex-col gap-3 p-1 w-full h-50 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] rounded-md overflow-y-auto no-scrollbar">
                    <p className="flex gap-1 border-b pb-1">
                        <svg className="w-6 h-6 text-gray-800 dark:text-[#cca629]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.6 16.733c.234.269.548.456.895.534a1.4 1.4 0 0 0 1.75-.762c.172-.615-.446-1.287-1.242-1.481-.796-.194-1.41-.861-1.241-1.481a1.4 1.4 0 0 1 1.75-.762c.343.077.654.26.888.524m-1.358 4.017v.617m0-5.939v.725M4 15v4m3-6v6M6 8.5 10.5 5 14 7.5 18 4m0 0h-3.5M18 4v3m2 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" />
                        </svg>
                        Stocks
                    </p>
                    {stocksPannel?.slice(0, 5).map((item, index) => (
                        <div key={index} className="border-0 rounded-md px-2 py-1 text-gray-300 flex flex-col items-start justify-center">
                            <Link href={'/dashboard/stocks'} className='flex items-center justify-between w-full'>
                                <p className="whitespace-nowrap">{item.symbol}</p>
                                <p className={`py-2 px-2 ${item.change > 0 ? 'text-green-500' : item.change < 0 ? 'text-red-500' : 'text-gray-500'}`}>{item.change.toFixed(2)}%</p>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* crypto pannel */}
                <div className="border-0 flex flex-col gap-3 p-1 w-full h-50 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] rounded-md overflow-y-auto no-scrollbar">
                    <p className="flex gap-1 border-b pb-1">
                        <svg className="w-6 h-6 text-gray-800 dark:text-[#cca629]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M10.7367 14.5876c.895.2365 2.8528.754 3.1643-.4966.3179-1.2781-1.5795-1.7039-2.5053-1.9117-.1034-.0232-.1947-.0437-.2694-.0623l-.6025 2.4153c.0611.0152.1328.0341.2129.0553Zm.8452-3.5291c.7468.1993 2.3746.6335 2.6581-.5025.2899-1.16213-1.2929-1.5124-2.066-1.68348-.0869-.01923-.1635-.03619-.2262-.0518l-.5462 2.19058c.0517.0129.1123.0291.1803.0472Z" />
                            <path fill="currentColor" fillRule="evenodd" d="M9.57909 21.7008c5.35781 1.3356 10.78401-1.9244 12.11971-7.2816 1.3356-5.35745-1.9247-10.78433-7.2822-12.11995C9.06034.963624 3.6344 4.22425 2.2994 9.58206.963461 14.9389 4.22377 20.3652 9.57909 21.7008ZM14.2085 8.0526c1.3853.47719 2.3984 1.1925 2.1997 2.5231-.1441.9741-.6844 1.4456-1.4013 1.6116.9844.5128 1.485 1.2987 1.0078 2.6612-.5915 1.6919-1.9987 1.8347-3.8697 1.4807l-.454 1.8196-1.0972-.2734.4481-1.7953c-.2844-.0706-.575-.1456-.8741-.2269l-.44996 1.8038-1.09594-.2735.45407-1.8234c-.10059-.0258-.20185-.0522-.30385-.0788-.15753-.0411-.3168-.0827-.47803-.1231l-1.42812-.3559.54468-1.2563s.80844.215.7975.1991c.31063.0769.44844-.1256.50282-.2606l.71781-2.8766.11562.0288c-.04375-.0175-.08343-.0288-.11406-.0366l.51188-2.05344c.01375-.23312-.06688-.52719-.51125-.63812.01718-.01157-.79688-.19813-.79688-.19813l.29188-1.17187 1.51313.37781-.0013.00562c.2275.05657.4619.11032.7007.16469l.4497-1.80187 1.0965.27343-.4406 1.76657c.2944.06718.5906.135.8787.20687l.4375-1.755 1.0975.27344-.4493 1.8025Z" clipRule="evenodd" />
                        </svg>
                        Crypto
                    </p>
                    {cryptoPannel?.slice(0, 5).map((item, index) => (
                        <div key={index} className="border-0 rounded-md px-2 py-1 text-gray-300 flex flex-col items-start justify-center">
                            <Link href={'/dashboard/crypto'} className='flex items-center justify-between w-full'>
                                <p className="whitespace-nowrap">{item.symbol}</p>
                                <p className={`py-2 px-2 ${item.price_change_percentage_24h > 0 ? 'text-green-500' : item.price_change_percentage_24h < 0 ? 'text-red-500' : 'text-gray-500'}`}>{item.price_change_percentage_24h.toFixed(2)}%</p>
                            </Link>
                        </div>
                    ))}
                </div>

                {/* nft pannel */}
                <div className="border-0 flex flex-col gap-3 p-1 w-full h-50 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] rounded-md overflow-y-auto no-scrollbar">
                    <p className="flex gap-1 border-b pb-1">
                        <svg className="w-6 h-6 text-gray-800 dark:text-[#cca629]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m4 10v-2m3 2v-6m3 6v-3m4-11v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z" />
                        </svg>
                        NFTs
                    </p>
                    {nftPannel?.slice(0, 5).map((item, index) => (
                        <div key={index} className="border-0 rounded-md px-2 py-1 text-gray-300 flex flex-col items-start justify-center">
                            <Link href={'/dashboard/nfts'} className='flex items-center justify-between w-full'>
                                <p className="whitespace-nowrap">{item.name}</p>
                                <p className="whitespace-nowrap">{item.value}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2">
                {/* candlestick chart */}
                <div>
                    <p>AAPL Price Chart</p>
                    <CandleStick symbol={symbol} heading='hidden' isZoomed={true} isShow={false}/>
                </div>
                {/* ai-picks widget */}
                <div>
                    <p>
                        AI suggestons
                    </p>
                </div>
            </div>

            {/* news section */}
            <p className='border-b pb-2'>News</p>
            <div className='border-0 px-1 py-2 rounded-md h-100 overflow-y-auto custom-scrollbar'>
                {
                    news.length === 0 ? (
                        <p>Nothing to display</p>
                    ) : (
                        loading ? (
                            <p>Loading news...</p>
                        ) : (
                            news.map((article, index) => (
                                <div key={index} className='w-full h-auto  border-0 my-2 p-2 rounded-md flex flex-col md:flex-row lg:flex-row items-start justify-center lg:justify-start gap-2 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2]'>
                                    {article.urlToImage ? (
                                        <Image
                                            loading='eager'
                                            src={article.urlToImage}
                                            width={50}
                                            height={50}
                                            alt={article.title || `img-${index}`}
                                            unoptimized
                                            className='h-50 w-60 rounded-md'
                                        />
                                    ) : (
                                        <div>No image available</div>
                                    )}
                                    <div className='w-full border-0 flex flex-col items-center justify-center gap-20'>
                                        <div className='w-full border-0 flex flex-col items-start justify-center gap-2'>
                                            <Link href={article.url} target='_blank' className='w-full border-0 flex items-center justify-start gap-1 group transition duration-300'>
                                                <p className='border-0 group-hover:text-blue-500'>{article.title}</p>
                                                <svg href={article.url} className="ml-auto hidden md:flex lg:flex w-6 h-6 text-gray-800 dark:text-gray-300 group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 14v4.833A1.166 1.166 0 0 1 16.833 20H5.167A1.167 1.167 0 0 1 4 18.833V7.167A1.166 1.166 0 0 1 5.167 6h4.618m4.447-2H20v5.768m-7.889 2.121 7.778-7.778" />
                                                </svg>
                                            </Link>
                                            <p className='border-0'>{getPreview(article.content)}...</p>
                                        </div>
                                        <div className='w-full flex flex-col md:flex-col lg:flex-row items-center justify-between'>
                                            <p className=''>Published On: {new Date(article.publishedAt).toDateString()}</p>
                                            <p className=''>-by {article.author}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    )
                }
            </div>
        </div>
    );
}