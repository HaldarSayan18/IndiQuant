'use client';
import { api } from '@/lib/api';
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const AiPicks = () => {
    const [filterType, setFilterType] = useState('All');
    const [sortBy, setSortBy] = useState('Strong');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSuggestions = useCallback(async () => {
        try {
            setLoading(true);
            const resp = await api.get('/api/ai/suggestions');
            // console.log(resp.data);
            const mappedOutput = resp.data.aiPicks.map(item => ({
                symbol: item.symbol,
                name: item.name,
                type: item.market === 'stock' ? 'Stock' : item.market === 'crypto' ? 'Crypto' : 'NFT',
                value: item.price,
                ai_suggest: item.signal,
                percent_chng: item.change24h,
                reason: item.reason,
            }));
            setSuggestions(mappedOutput);
        } catch (error) {
            console.error('Error fetching ai-suggestions', error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        (function () {
            fetchSuggestions();
        })()
    }, [fetchSuggestions]);

    const cardsData = useMemo(() => {
        const strong = suggestions.filter(s => s.ai_suggest === 'Strong buy').length;
        const buy = suggestions.filter(b => b.ai_suggest === 'Buy').length;
        const watch = suggestions.filter(w => w.ai_suggest === 'Watch').length;
        const avoid = suggestions.filter(a => a.ai_suggest === 'Avoid').length;
        return [
            { title: "Signals today", value: suggestions.length },
            { title: "Strong buys", value: strong },
            { title: "Buys", value: buy },
            { title: "Watch", value: watch },
            { title: "Avoid", value: avoid },
        ];
    }, [suggestions]);

    // filter & sort suggestions
    const renewedSuggestions = useMemo(() => {
        // filter
        const filteredSuggestions = suggestions.filter((item) => {
            if (filterType === 'All') return true;
            const target = filterType === 'Stocks' ? 'Stock' : filterType === 'NFTs' ? 'NFT' : filterType;
            return item.type === target;
        });

        // sort
        return filteredSuggestions.sort((a, b) => {
            if (sortBy === 'Strength') {
                const rank = { 'Strong buy': 4, 'Buy': 3, 'Watch': 2, 'Avoid': 1 };
                return (rank[b.ai_suggest] || 0) - (rank[a.ai_suggest] || 0);
            }
            if (sortBy === '% change') {
                const percentA = parseFloat(a.percent_chng) || 0;
                const percentB = parseFloat(b.percent_chng) || 0;
                return percentB - percentA;
            }

            if (sortBy === 'Market cap') {
                return b.value - a.value;
            }
            return 0
        });
    }, [filterType, sortBy, suggestions]);

    return (
        <div className="grid grid-cols-1 gap-5 border-0 p-1 text-gray-300 text-sm">
            {/* heading */}
            <div className="w-full flex items-center justify-between p-1 cursor-default">
                <p className="text-lg flex items-center justify-center gap-1">
                    <svg className="w-6 h-6 text-gray-800 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18.5A2.493 2.493 0 0 1 7.51 20H7.5a2.468 2.468 0 0 1-2.4-3.154 2.98 2.98 0 0 1-.85-5.274 2.468 2.468 0 0 1 .92-3.182 2.477 2.477 0 0 1 1.876-3.344 2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 12 5.5m0 13v-13m0 13a2.493 2.493 0 0 0 4.49 1.5h.01a2.468 2.468 0 0 0 2.403-3.154 2.98 2.98 0 0 0 .847-5.274 2.468 2.468 0 0 0-.921-3.182 2.477 2.477 0 0 0-1.875-3.344A2.5 2.5 0 0 0 14.5 3 2.5 2.5 0 0 0 12 5.5m-8 5a2.5 2.5 0 0 1 3.48-2.3m-.28 8.551a3 3 0 0 1-2.953-5.185M20 10.5a2.5 2.5 0 0 0-3.481-2.3m.28 8.551a3 3 0 0 0 2.954-5.185" />
                    </svg>
                    Suggestions
                </p>
                <div className="flex items-center justify-center gap-2 ml-auto">
                    {/* <input type="search" placeholder="search coin..." className="hidden md:flex lg:flex border border-gray-500 p-2 rounded-md outline-none bg-[#51515148] focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500" onChange={handleSearch} /> */}
                    <button onClick={fetchSuggestions} disabled={loading}
                        className={`border flex px-3 py-2 rounded-md transition-all duration-100 group hover:text-[#cca649] ${loading ? 'cursor-not-allowed' : 'cursor-default'}`}
                    >
                        <svg className="w-6 h-6 group-hover:text-[#cca649] dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.651 7.65a7.131 7.131 0 0 0-12.68 3.15M18.001 4v4h-4m-7.652 8.35a7.13 7.13 0 0 0 12.68-3.15M6 20v-4h4" />
                        </svg>
                        {loading ? 'Refreshing..' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* cards */}
            <div className="border-0 grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-3 p-1 md:text-md lg:text-lg">
                {cardsData.map((item, index) => (
                    <div key={index} className="w-full md:w-[80%] lg:w-[80%] border-0 rounded-md px-2 py-5 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.05]">
                        <p className="whitespace-nowrap">{item.title}</p>
                        <p className="whitespace-nowrap">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* sort */}
            <div className="w-full border-0 flex items-center justify-between gap-2">
                <p className='text-lg'>Sort:</p>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className='ml-auto outline-none border-0 bg-[#51515148] p-2.5 rounded-md'>
                    <option value='All'>All</option>
                    <option value='Stocks'>Stocks</option>
                    <option value='Crypto'>Crypto</option>
                    <option value='NFTs'>NFTs</option>
                </select>

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className='outline-none border-0 bg-[#51515148] p-2.5 rounded-md'>
                    <option value='Strength'>Strength</option>
                    <option value='% change'>% change</option>
                    <option value='Market cap'>Market cap</option>
                </select>
            </div>

            {/* suggestion-card */}
            <div className='h-100 overflow-y-auto custom-scrollbar p-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 place-items-stretch gap-3 '>
                {loading ? (
                    <p className='col-span-full text-center'>Loading...</p>
                ) : (renewedSuggestions.length === 0 ? (
                    <p className='col-span-full text-center'>No suggestions match this filter.</p>
                ) : (
                    renewedSuggestions.map((item, index) => (
                        <div key={index} className={`flex flex-col border-0 w-full h-60 md:h-48 lg:h-60 ${item.ai_suggest === 'Strong buy' ? 'bg-green-300/60' : item.ai_suggest === 'Watch' ? 'bg-amber-300/60' : item.ai_suggest === 'Avoid' ? 'bg-red-300/60' : 'bg-blue-300/60'} rounded-md rounded-b-lg`}>
                            <div className={`w-full h-full border-0 flex flex-col items-stretch justify-start gap-2 rounded-md p-2 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] mt-1`}>
                                <div className='flex items-center justify-between gap-2'>
                                    <div className='w-full flex flex-col gap-0 items-start justify-center'>
                                        <div className='w-full flex gap-0 items-center justify-between'>
                                            <p className='text-lg'>{item.symbol}</p>
                                            <p className={`border-0 px-1 rounded-md ${item.ai_suggest === 'Strong buy' ? 'bg-green-300 text-green-700' : item.ai_suggest === 'Watch' ? 'bg-amber-300 text-amber-700' : item.ai_suggest === 'Avoid' ? 'bg-red-300 text-red-700' : 'bg-blue-300 text-blue-700'}`}>{item.ai_suggest}</p>
                                        </div>
                                        <p className='text-gray-500 font-bold -mt-1'>{item.name} . {item.type}</p>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='flex flex-col gap-0 items-start justify-center'>
                                        <p className='text-lg'>${item.value}</p>
                                        <p className={`${item.percent_chng < 0 ? 'text-red-500' : 'text-green-500'}`}>{item.percent_chng >= 0 ? '+' : ''}{item.percent_chng}% today</p>
                                    </div>
                                    <p>chart</p>
                                </div>
                                <div>{item.reason}</div>
                                <div className='mt-auto py-1 flex items-center justify-end gap-2 white'>
                                    <button className="border border-gray-600 rounded-md bg-[#51515148] px-3 py-1 transition-all duration-300 ease-in-out hover:border-[#cca649] hover:text-[#cca649] hover:-translate-y-1">Set alert</button>
                                    <button className="border border-gray-600 rounded-md bg-[#51515148] px-3 py-1 transition-all duration-300 ease-in-out hover:border-[#cca649] hover:text-[#cca649] hover:-translate-y-1">Place order</button>
                                </div>
                            </div>
                        </div>
                    ))
                ))}
            </div>
        </div>
    )
}

export default AiPicks