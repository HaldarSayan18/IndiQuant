'use client';

export default function AlertComponent() {

    const cardsData = [
        {
            title: "Total Alerts",
            value: 6,
        },
        {
            title: "Pending",
            value: 4,
        },
        {
            title: "Triggered today",
            value: 2,
        },
        {
            title: "Stop-losses",
            value: 2,
        },
    ];

    return (
        <div className="text-gray-300 flex flex-col items-stretch justify-center gap-3">
            {/* alert cards */}
            <div className="border-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 p-1">
                {cardsData.map((item, index) => (
                    <div key={index} className="w-full md:w-[80%] lg:w-[80%] border-0 rounded-md px-2 py-5 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.05]">
                        <p className="whitespace-nowrap">{item.title}</p>
                        <p className="whitespace-nowrap">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* all alerts */}
            <div className="w-full flex flex-col items-start justify-center gap-2 text-gray-300 border-0 p-1">
                {/* heading & searchbar */}
                <div className="border-0 flex w-full items-center justify-between">
                    <p className="flex gap-2 items-center justify-start">
                        <svg className="w-6 h-6 text-gray-800 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4" />
                        </svg>
                        All Alerts
                    </p>
                    <div>
                        <input type="search" placeholder="search symbol" className="hidden md:flex lg:flex border border-gray-500 p-2 rounded-md outline-none bg-[#51515148] focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500" />
                        <svg className="flex md:hidden lg:hidden border p-1 w-8 h-8 bg-[#51515148] border-none rounded-md text-gray-800 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                </div>

                {/* alert-table */}
                <div className="relative max-h-80 overflow-auto bg-neutral-primary-soft shadow-xs rounded-md p-1 w-full bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] border-0 border-gray-700">
                    <table className="w-full text-sm text-center text-body whitespace-nowrap min-w-150">
                        <thead className="sticky top-0 z-10 bg-[#0f172095] border-b border-gray-700 uppercase focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 outline-none px-2 rounded-md py-1">
                            <tr>
                                <th className="py-3 px-4 w-10">Sl. No.</th>
                                <th className="py-3 px-4">Symbol/market</th>
                                <th className="py-3 px-4">Type</th>
                                <th className="py-3 px-4">Target/current</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 w-10"></th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-800">
                            <tr className="transition-all duration-300 hover:bg-[#51515148] cursor-default">
                                <td className="py-2 px-2 w-10">1</td>
                                <td className="py-2 px-2">AAPL</td>
                                <td className="py-2 px-2">Target Price</td>
                                <td className="py-2 px-2 font-mono text-green-400">$200,000</td>
                                <td className="py-2 px-2">
                                    <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs">pending</span>
                                </td>
                                <td className="py-2 px-2 w-10">
                                    <button className="p-1 hover:bg-red-500/20 rounded-full transition-colors cursor-pointer">
                                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* create & show alert */}
            <div className="border-0 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 p-1">
                {/* create */}
                <div className="w-full flex flex-col gap-3 p-3 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] shadow-2xl rounded-md">
                    <p className="border-b border-gray-700 text-lg pb-1">+ Create new alert</p>
                    {/* alert-form */}
                    <form className="border-0 w-full grid grid-cols-2 gap-2">
                        {/* symbol */}
                        <div className="w-full flex flex-col">
                            <label>Symbol</label>
                            <input type="text" placeholder="e.g. AAPL, BITCOIN" className="uppercase border border-gray-700 focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 outline-none px-2 rounded-md py-1" />
                        </div>
                        {/* alert-type */}
                        <div className="w-full flex flex-col">
                            <label>Alert Type</label>
                            <select tabIndex={0} className="border border-gray-700 focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 outline-none px-2 rounded-md py-1">
                                <option>Target Price</option>
                                <option>Stop-loss</option>
                            </select>
                        </div>
                        {/* target-price */}
                        <div className="w-full flex flex-col">
                            <label>Target Price</label>
                            <input type="number" placeholder="0.00" className="border border-gray-700 focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 outline-none px-2 rounded-md py-1" />
                        </div>
                        {/* market */}
                        <div className="w-full flex flex-col">
                            <label>Market</label>
                            <select tabIndex={0} className="border border-gray-700 focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 outline-none px-2 rounded-md py-1">
                                <option>Stock</option>
                                <option>Crypto</option>
                                <option>NFT</option>
                            </select>
                        </div>
                    </form>
                    <p className="-mt-1 text-sm text-gray-400 flex items-center gap-1">
                        <svg className="border-0 w-6 h-6 rounded-full p-1 bg-[#51515148] text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z" clipRule="evenodd" />
                        </svg>
                        Alert will be sent to your registered email.
                    </p>
                    <button className="w-full border border-gray-500 p-1 rounded-md bg-[#51515148] transition-all duration-300 hover:bg-[#cca629] hover:border-[#cca629] hover:text-black hover:-translate-y-0.5">Set alert</button>
                </div>

                {/* show */}
                <div className="w-full flex flex-col gap-3 px-2 py-3 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] shadow-2xl rounded-md">
                    <p className="border-b border-gray-700 pb-1 cursor-default">Alerts Notified</p>
                    <div className="border-0 max-h-50 overflow-y-auto custom-scrollbar p-1">
                        <div className="border border-gray-700 bg-[#51515125] rounded-md p-2 flex items-center justify-start gap-3 transition-all duration-300 ease-in-out hover:scale-[1.01]">
                            <svg className="border-0 p-1 w-9 h-9 rounded-full bg-[#cca649] text-gray-800 dark:text-[#4f3b09] animate-pulse" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM6 6a1 1 0 0 1-.707-.293l-1-1a1 1 0 0 1 1.414-1.414l1 1A1 1 0 0 1 6 6Zm-2 4H3a1 1 0 0 1 0-2h1a1 1 0 1 1 0 2Zm14-4a1 1 0 0 1-.707-1.707l1-1a1 1 0 1 1 1.414 1.414l-1 1A1 1 0 0 1 18 6Zm3 4h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
                            </svg>
                            <div className="flex flex-col gap-1">
                                <p className="text-lg font-medium">Symbol</p>
                                <p className="border px-1 rounded-2xl flex items-center justify-center text-sm">Market</p>
                            </div>
                            <div className="flex flex-col ml-auto gap-1">
                                <p>alert-type</p>
                                <p className="border-0 px-2 py-1 rounded-2xl text-xs bg-green-300/30 text-green-500">Target-price</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 