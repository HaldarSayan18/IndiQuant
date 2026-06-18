'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const NFTs = () => {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [nftData, setNftData] = useState([]);

    useEffect(() => {
        const fectchNFTs = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/api/nfts/details`);
                // console.log(response.data.data[0]);
                setNftData(response.data.data);
            } catch (error) {
                console.log('Failed to fetch nfts', error);
            } finally {
                setLoading(false);
            }
        };
        fectchNFTs();
    }, []);

    const cardsData = [
        {
            title: "Total market volume",
            value: '$2.41T',
            status: "+2.8% today"
        },
        {
            title: "24h volume",
            value: '$98.4B',
            status: "+11% vs yesterday"
        },
        {
            title: "Collectios tracked",
            value: nftData.length,
            status: "via Coingecko API"
        },
        {
            title: "Active nfts",
            value: nftData.length,
            status: ""
        },
    ];

    const filteredNfts = nftData.filter(nft => nft.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    // nft details handler
    const showNFTDetails = async (e) => {
        e.preventDefault();
    }

    return (
        <div className="grid grid-cols-1 gap-3 border-0 p-0 text-gray-300">
            <div className="w-full flex items-center justify-between p-1">
                <p className="text-lg flex items-center justify-center gap-1">
                    <svg className="w-6 h-6 text-gray-800 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m4 10v-2m3 2v-6m3 6v-3m4-11v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z" />
                    </svg>
                    NFTs
                </p>
                <div className="flex items-center justify-center gap-2 ml-auto">
                    <input type="search" placeholder="search nfts..." className="hidden md:flex lg:flex border border-gray-500 p-2 rounded-md outline-none bg-[#51515148] focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500" onChange={handleSearch} />
                    <button className="border flex px-3 py-2 rounded-md transition-all duration-100 group hover:text-[#cca649]">
                        <svg className="w-6 h-6 group-hover:text-[#cca649] dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4" />
                        </svg>
                        Refresh
                    </button>
                </div>
            </div>

            {/* cards */}
            <div className="border-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 p-1">
                {cardsData.map((item, index) => (
                    <div key={index} className="w-full md:w-[80%] lg:w-[90%] border-0 rounded-md px-1 py-4 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-[1.05] cursor-default text-sm md:text-md lg:text-[16px]">
                        <div className="whitespace-nowrap">{item.title}</div>
                        <p className="whitespace-nowrap">{item.value}</p>
                        <p className={`whitespace-nowrap ${item.status.startsWith('+') ? 'text-green-500' : item.status.startsWith('-') ? 'text-red-500' : 'text-gray-500'}`}>{item.status}</p>
                    </div>
                ))}
            </div>

            {/* nft-table */}
            <div className="relative max-h-80 overflow-y-auto custom-scrollbar bg-neutral-primary-soft shadow-xs rounded-md px-1 w-full bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] border-0 border-gray-700">
                <table className="w-full text-sm text-center text-body whitespace-nowrap min-w-150">
                    <thead className="sticky top-0 z-10 bg-[#0f1720f7] border-b border-gray-700 uppercase focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 outline-none px-2 rounded-md py-0 cursor-default">
                        <tr>
                            <th className="py-3 px-4 w-10 text-gray-500">Sl. No.</th>
                            <th className="py-3 px-4">Collection</th>
                            <th className="py-3 px-4">Floor</th>
                            <th className="py-3 px-4">24h Change</th>
                            <th className="py-3 px-4">Volume</th>
                            <th className="py-3 px-4">Market Cap</th>
                            <th className="py-3 px-4 w-10"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                            <tr>
                                <td colSpan="7" className="py-4 text-center text-gray-500">Loading data...</td>
                            </tr>
                        ) : (
                            filteredNfts.length > 0 ? (
                                filteredNfts.map((nft, index) => (
                                    <tr key={index} className="transition-all duration-300 hover:bg-[#51515148] cursor-default">
                                        <td className="py-2 px-2 w-10 text-gray-500">{index + 1}</td>
                                        <td className="flex items-center justify-start gap-2 py-2 px-2 w-80 whitespace-normal">
                                            {/* {nft?.image?.small ? (
                                                <Image src={nft.image.small} alt="nft" width={20} height={20} className="border shrink-0" />
                                            ) : (
                                                <div className="w-5 h-5 bg-gray-200 border rounded shrink-0 animate-pulse" />
                                            )} */}
                                            {nft.name}
                                        </td>
                                        <td className="py-2 px-2 font-mono">${nft.floor_price.usd}</td>
                                        <td className={`py-2 px-2 ${nft.floor_price_in_usd_24h_percentage_change > 0 ? 'text-green-500' : nft.floor_price_in_usd_24h_percentage_change < 0 ? 'text-red-500' : 'text-gray-500'}`}>{nft.floor_price_in_usd_24h_percentage_change.toFixed(2)}%</td>
                                        <td className="py-2 px-2">{nft.volume_24h.usd?.toFixed(1)}</td>
                                        <td className="py-2 px-2">${nft.market_cap.usd}</td>
                                        <td className="py-2 px-2 flex items-center justify-center gap-2">
                                            <button type="button" className="border px-2 rounded-md shadow-2xl text-gray-400 hover:text-[#cca649] hover:cursor-pointer"
                                            // onClick={() => showStockDetails(nft.symbol)}
                                            >
                                                Details
                                            </button>
                                            <button type="button" className="border px-2 rounded-md shadow-2xl text-gray-400 hover:text-[#cca649] hover:cursor-pointer"
                                                onClick={() => showNFTDetails(nft.id)}
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
        </div>
    )
}

export default NFTs