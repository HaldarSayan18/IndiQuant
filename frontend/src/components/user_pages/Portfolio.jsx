'use client';
import React, { useEffect, useState } from 'react'
import DonutChart from '../layouts/charts/AllocationDonut';
import { api } from '@/lib/api';

const Portfolio = () => {
    const today = new Date().toDateString();
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [status, setStatus] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [orders, setOrders] = useState([]);
    const [total, setTotal] = useState([]);

    useEffect(() => {
        api.get('/api/portfolio/pl').then(r => {
            setOrders(r.data.orders);
            setTotal(r.data.total);
        })
    }, []);

    const cardsData = [
        {
            title: "Total invested",
            value: '$2.41T',
        },
        {
            title: "Realized P&L",
            value: '$98.4B',
        },
        {
            title: "Unrealized P&L",
            value: 12,
        },
        {
            title: "Win rate",
            value: '13,210',
        },
        {
            title: "Best trade",
            value: '13,210',
        },
    ];

    // sort according to %
    const assets = [
        { name: 'Stock', percent_val: 38, color: '#721717', bgColor: 'bg-[#721717]' },
        { name: 'Crypto', percent_val: 49, color: '#d7970c', bgColor: 'bg-[#d7970c]' },
        { name: 'NFT', percent_val: 13, color: '#0bac96', bgColor: 'bg-[#0bac96]' },
    ];
    const sortedAssets = [...assets].sort((a, b) => b.percent_val - a.percent_val);

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const MARKET_BADGE = {
        stock: { label: 'Stock', bg: '#E6F1FB', color: '#0C447C' },
        crypto: { label: 'Crypto', bg: '#EEEDFE', color: '#3C3489' },
        nft: { label: 'NFT', bg: '#FBEAF0', color: '#72243E' },
    };

    const displayedData = orders
        .filter(o => filter === 'all' || o.market === filter)
        .filter(o => status === 'all' || o.status === status)
        .sort((a, b) => {
            if (sortBy === 'pl') return (b.realisedPL ?? b.unrealisedPL ?? 0) - (a.realisedPL ?? a.unrealisedPL ?? 0)
            if (sortBy === 'returnPct') return (b.returnPct ?? 0) - (a.returnPct ?? 0)
            return new Date(b.createdAt) - new Date(a.createdAt)
        })

    return (
        <div className="grid grid-cols-1 gap-2 border-0 p-0 text-gray-300">
            <div className="w-full flex items-center justify-between p-1 border-0 border-b-gray-700">
                <p className="text-lg flex items-center justify-center gap-1">
                    <svg className="w-6 h-6 text-gray-800 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M10 2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v2.382l1.447.723.005.003.027.013.12.056c.108.05.272.123.486.212.429.177 1.056.416 1.834.655C7.481 13.524 9.63 14 12 14c2.372 0 4.52-.475 6.08-.956.78-.24 1.406-.478 1.835-.655a14.028 14.028 0 0 0 .606-.268l.027-.013.005-.002L22 11.381V9a3 3 0 0 0-3-3h-2V5a3 3 0 0 0-3-3h-4Zm5 4V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1h6Zm6.447 7.894.553-.276V19a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-5.382l.553.276.002.002.004.002.013.006.041.02.151.07c.13.06.318.144.557.242.478.198 1.163.46 2.01.72C7.019 15.476 9.37 16 12 16c2.628 0 4.98-.525 6.67-1.044a22.95 22.95 0 0 0 2.01-.72 15.994 15.994 0 0 0 .707-.312l.041-.02.013-.006.004-.002.001-.001-.431-.866.432.865ZM12 10a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z" clipRule="evenodd" />
                    </svg>
                    Portfolio
                </p>
                <div className="flex items-center justify-center ml-auto text-[#cca649]">
                    Today, {today}
                </div>
            </div>

            {/* cards data */}
            <div className="border-0 grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-3 p-1">
                {cardsData.map((item, index) => (
                    <div key={index} className="w-full md:w-[80%] lg:w-[90%] border-0 rounded-md px-1 py-4 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-[1.05] cursor-default text-smmd:text-md lg:text-[16px]">
                        <p className="whitespace-nowrap">{item.title}</p>
                        <p className="whitespace-nowrap">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className='w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3'>
                {/* daily P&L */}
                <div className='border-0 rounded-md px-2 py-2 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] md:col-start-1 md:col-end-3 lg:col-start-1 lg:col-end-3'>
                    <p>Daily P&L</p>
                </div>

                {/* market allocation */}
                <div className='border-0 rounded-md px-2 py-2 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] md:col-start-3 md:col-end-4 lg:col-start-3 lg:col-end-4 flex flex-col justify-center items-start'>
                    <p>Allocation by Market</p>
                    <div className='border-0 w-full flex items-center justify-center'>
                        <DonutChart assets={sortedAssets} />
                    </div>

                    {/* assets */}
                    <div className='border-0 flex flex-col w-full items-center justify-center gap-1 text-sm'>
                        {sortedAssets.map((asset, index) => (
                            <div key={index} className={`border-0 flex w-full items-center justify-center gap-1 px-2`}>
                                <div className={`${asset.bgColor} h-3.5 w-3.5 rounded`}></div>
                                <p>{asset.name}</p>
                                <p className='ml-auto'>{asset.percent_val}%</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* P&L breakdown */}
            <div className='border-0 w-full flex flex-col items-start justify-center py-2 gap-2'>
                <div className="w-full border-0 flex items-center justify-start gap-2">
                    <p className='text-md'>P&L Breakdown</p>
                    <select className='ml-auto outline-none border-0 bg-[#51515148] p-2.5 rounded-md'>
                        <option value='all'>All Markets</option>
                        <option value='Stocks'>Stocks</option>
                        <option value='Crypto'>Crypto</option>
                        <option value='NFTs'>NFTs</option>
                    </select>
                    <input type="search" placeholder="search by symbol..." className="hidden md:flex lg:flex border border-gray-500 p-2 rounded-md outline-none bg-[#51515148] focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500" onChange={handleSearch} />
                </div>

                {/* table */}
                <div className="relative max-h-80 overflow-y-auto custom-scrollbar bg-neutral-primary-soft shadow-xs rounded-md px-1 w-full bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] border-0 border-gray-700">
                    <table className="w-full text-sm text-center whitespace-nowrap min-w-150">
                        <thead className="sticky top-0 z-10 bg-[#0f1720f7] border-b border-gray-700 uppercase focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 outline-none px-2 rounded-md py-0 cursor-default">
                            <tr>
                                <th className="py-3 px-4 w-10 text-gray-500">Sl. No.</th>
                                <th className="py-3 px-4">Symbol</th>
                                <th className="py-3 px-4">Type</th>
                                <th className="py-3 px-4">Qty.</th>
                                <th className="py-3 px-4">Entry</th>
                                <th className="py-3 px-4">Exit</th>
                                <th className="py-3 px-4">Total Value</th>
                                <th className="py-3 px-4 w-10">P&L</th>
                            </tr>
                        </thead>

                        {/* <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-4 text-center text-gray-500">Loading data...</td>
                                </tr>
                            ) : (
                                filteredNfts.length > 0 ? (
                                    filteredNfts.map((nft, index) => (
                                        <tr key={index} className="transition-all duration-300 hover:bg-[#51515148] cursor-default">
                                            <td className="py-2 px-2 w-10 text-gray-500">{index + 1}</td>
                                            <td className="py-2 px-2">{nft.name}</td>
                                            <td className="py-2 px-2 font-mono">${nft.floor_price.usd}</td>
                                            <td className={`py-2 px-2 ${nft.floor_price_in_usd_24h_percentage_change > 0 ? 'text-green-500' : nft.floor_price_in_usd_24h_percentage_change < 0 ? 'text-red-500' : 'text-gray-500'}`}>{nft.floor_price_in_usd_24h_percentage_change.toFixed(2)}%</td>
                                            <td className="py-2 px-2">{nft.volume_24h.usd?.toFixed(1)}</td>
                                            <td className="py-2 px-2">${nft.market_cap.usd}</td>
                                            <td className="py-2 px-2 flex items-center justify-center gap-2">
                                                <button type="button" className="border px-2 rounded-md shadow-2xl text-gray-400 hover:text-[#cca649] hover:cursor-pointer"
                                                    onClick={() => showStockDetails(nft.symbol)}
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
                        </tbody> */}
                        <tbody>
                            {displayedData.map(o => {
                                const mb = MARKET_BADGE[o.market]
                                const pl = o.realisedPL ?? o.unrealisedPL
                                const plColor = pl > 0 ? '#1D9E75' : pl < 0 ? '#E24B4A' : 'inherit'
                                return (
                                    <tr key={o.id}>
                                        <td><div style={{ fontWeight: 500 }}>{o.symbol}</div><div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{o.name}</div></td>
                                        <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: mb.bg, color: mb.color }}>{mb.label}</span></td>
                                        <td>{o.type}</td>
                                        <td>{o.quantity}</td>
                                        <td>${o.entryPrice?.toLocaleString()}</td>
                                        <td>{o.exitPrice ? `$${o.exitPrice.toLocaleString()}` : '—'}</td>
                                        <td>${o.invested?.toLocaleString()}</td>
                                        <td style={{ color: plColor, fontWeight: 500 }}>{o.realisedPL !== null ? `${o.realisedPL > 0 ? '+' : ''}$${o.realisedPL}` : '—'}</td>
                                        <td style={{ color: plColor, fontWeight: 500 }}>{o.unrealisedPL !== null ? `${o.unrealisedPL > 0 ? '+' : ''}$${o.unrealisedPL}` : '—'}</td>
                                        <td style={{ color: plColor }}>{o.returnPct !== null ? `${o.returnPct > 0 ? '+' : ''}${o.returnPct}%` : '—'}</td>
                                        <td>{o.heldDays}d</td>
                                        <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: o.status === 'open' ? '#E6F1FB' : '#F1EFE8', color: o.status === 'open' ? '#0C447C' : '#5F5E5A' }}>{o.status}</span></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                        {/* Totals footer */}
                        <tfoot>
                            <tr>
                                <td colSpan={6} style={{ padding: '8px', fontSize: 12 }}>Totals</td>
                                <td>${total.totalInvested?.toLocaleString()}</td>
                                <td style={{ color: total.totalRealised >= 0 ? '#1D9E75' : '#E24B4A' }}>{total.totalRealised > 0 ? '+' : ''}${total.totalRealised}</td>
                                <td style={{ color: total.totalUnrealised >= 0 ? '#1D9E75' : '#E24B4A' }}>{total.totalUnrealised > 0 ? '+' : ''}${total.totalUnrealised}</td>
                                <td colSpan={3} style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{total.closedCount} closed · {total.openCount} open</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Portfolio