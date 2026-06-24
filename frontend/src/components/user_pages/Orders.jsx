'use client';
import { api } from "@/lib/api";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function OrdersComponent() {
    const today = new Date().toDateString();
    const [orderType, setOrderType] = useState('buy');
    const [quantity, setQuantity] = useState("");
    const [symbol, setSymbol] = useState("");
    const [entryPrice, setEntryPrice] = useState("");
    const [market, setMarket] = useState("stock");
    const [orders, setOrders] = useState([]);
    const [form, setForm] = useState({ symbol: '', market: 'stock', type: 'buy', quantity: '', priceAtOrder: '' })
    const [closeForm, setCloseForm] = useState({ orderId: '', closedPrice: '' });
    const [loading, setLoading] = useState(false);

    const cardsData = [
        {
            title: "Total orders",
            value: 14
        },
        {
            title: "Open",
            value: 5
        },
        {
            title: "Closed",
            value: 9
        },
        {
            title: "Total invested",
            value: '$48,210'
        },
    ];

    // place-order form handler
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const orderForm = {
                symbol,
                market,
                type: orderType,
                quantity: Number(quantity),
                priceAtOrder: Number(entryPrice),
            };
            const resp = await api.post('/api/orders', orderForm);
            // console.log('order details --', resp.data);

            await fetchOrder();

            setQuantity("");
            setSymbol("");
            setEntryPrice("");
        } catch (error) {
            console.log(error.response?.data);
            console.error('Error while placing order', error);
        } finally {
            setLoading(false);
        }
    };

    // fetch order
    const fetchOrder = useCallback(async () => {
        try {
            const resp = await api.get('/api/orders');
            // console.log('orders---', resp.data.orders);
            setOrders(resp.data.orders);
        } catch (error) {
            console.error('Order fetching error', error);
        }
    }, []);
    useEffect(() => {
        (async () => {
            await fetchOrder();
        })();
    }, [fetchOrder]);

    // close an open order
    const handleCloseOrder = async (order_id) => {
        const exitPrice = Number(closeForm.closedPrice);

        if (!order_id || isNaN(exitPrice) || exitPrice <= 0) {
            alert("Please enter a valid exit price.");
            return;
        }

        setLoading(true);
        try {
            await api.patch(`/api/orders/${order_id}/close`, {
                closedPrice: exitPrice,
            });

            console.log('Order closed successfully');
            setCloseForm({ orderId: '', closedPrice: '' });

            fetchOrder();
        } catch (error) {
            console.error('Close order error:', error.response?.data?.error || error.message);
            alert(error.response?.data?.error || 'Failed to close order.');
        } finally {
            setLoading(false);
        }
    };

    // delete an order
    const handleOrderDelete = async (orderId) => {
        setLoading(true);
        try {
            if (!confirm('Remove the order?')) return;
            await api.delete(`/api/orders/${orderId}`);
            console.log('Order removed');

            fetchOrder();
        } catch (error) {
            console.error(error || 'Failed to delete an order');
        } finally {
            setLoading(false);
        }
    };
    const openOrders = orders.filter(o => o.status === 'open');

    return (
        <div className="grid grid-cols-1 gap-5 border-0 p-0 text-gray-300">
            <div className="w-full flex items-center justify-between p-1">
                <p className="text-lg flex items-center justify-center gap-1">
                    <svg className="w-6 h-6 text-gray-800 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
                    </svg>
                    Orders
                </p>
                <div className="flex items-center justify-center ml-auto text-[#cca649]">
                    Today, {today}
                </div>
            </div>

            <div className="border-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3 p-1">
                {cardsData.map((item, index) => (
                    <div key={index} className="w-full md:w-[80%] lg:w-[90%] border-0 rounded-md px-1 py-4 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] flex flex-col items-center justify-center gap-1 transition-all duration-300 hover:scale-[1.05] cursor-default text-sm md:text-md lg:text-[17px]">
                        <p className="whitespace-nowrap">{item.title}</p>
                        <p className="whitespace-nowrap">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* create & show order */}
            <div className="border-0 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 p-1">
                {/* create */}
                <div className="w-full h-80 flex flex-col gap-3 p-3 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] shadow-2xl rounded-md">
                    <p className="border-b border-gray-700 text-lg pb-1">+ Place order</p>
                    {/* order-form */}
                    <form id="order-form" className="border-0 w-full grid grid-cols-2 gap-3" onSubmit={handlePlaceOrder}>
                        {/* order-type */}
                        <div className="w-full flex flex-col">
                            <label>Order Type</label>
                            <div className="flex items-center justify-start gap-5 pl-2">
                                <input type="radio" id="buy" name="orderType" value="buy" checked={orderType === 'buy'} onChange={(e) => setOrderType(e.target.value)} />
                                <label htmlFor="buy" className="-ml-4 border-0">Buy</label>

                                <input type="radio" id="sell" name="orderType" value="sell" checked={orderType === 'sell'} onChange={(e) => setOrderType(e.target.value)} />
                                <label htmlFor="sell" className="-ml-4 border-0">Sell</label>
                            </div>
                        </div>

                        {/* alert-type */}
                        <div className="w-full flex flex-col">
                            <label>Quantity</label>
                            <input type="number" placeholder="0.00"
                                value={quantity} name="quantity" onChange={(e) => setQuantity(e.target.value)}
                                className="border border-gray-700 focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 outline-none px-2 rounded-md py-1"
                            />
                        </div>

                        {/* symbol */}
                        <div className="w-full flex flex-col">
                            <label>Symbol</label>
                            <input type="text" placeholder="e.g. AAPL, BITCOIN"
                                value={symbol} name="symbol" onChange={(e) => setSymbol(e.target.value)}
                                className="uppercase border border-gray-700 focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 outline-none px-2 rounded-md py-1"
                            />
                        </div>

                        {/* target-price */}
                        <div className="w-full flex flex-col">
                            <label>Entry Price</label>
                            <input type="number" placeholder="0.00"
                                value={entryPrice} name="entryPrice" onChange={(e) => setEntryPrice(e.target.value)}
                                className="border border-gray-700 focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 outline-none px-2 rounded-md py-1"
                            />
                        </div>

                        {/* market */}
                        <div className="w-full flex flex-col">
                            <label>Market</label>
                            <select tabIndex={0}
                                value={market} name="market" onChange={(e) => setMarket(e.target.value)}
                                className="border border-gray-700 focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 outline-none px-2 rounded-md py-1"
                            >
                                <option value="stock">Stock</option>
                                <option value="crypto">Crypto</option>
                                <option value="nft">NFT</option>
                            </select>
                        </div>

                        {/* total value */}
                        <div className="border-0 rounded-md flex items-center justify-between px-1 bg-[#51515148] cursor-not-allowed">
                            <p>Total Value</p>
                            <p className="font-mono">
                                ${(Number(quantity || 0) * Number(entryPrice || 0)).toLocaleString()}
                            </p>
                        </div>
                    </form>
                    <button type="submit" form="order-form" disabled={loading}
                        className="w-full border border-gray-500 p-1 rounded-md bg-[#51515148] transition-all duration-300 hover:bg-[#cca629] hover:border-[#cca629] hover:text-black hover:-translate-y-0.5"
                    >
                        {loading ? "Placing order.." : "Place order"}
                    </button>
                </div>

                {/* show */}
                <div className="w-full h-80 flex flex-col gap-3 px-2 py-3 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] shadow-2xl rounded-md overflow-y-auto custom-scrollbar">
                    <p className="border-b border-gray-700 pb-1 cursor-default flex items-center justify-start gap-1">
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Close open order
                    </p>
                    <div className="border-0 max-h-65 flex flex-col items-center justify-start gap-2 overflow-y-auto no-scrollbar p-1">
                        {loading ? (
                            <div>
                                <p>Loading...</p>
                            </div>
                        ) : (
                            openOrders.length === 0 ? (
                                <div>
                                    <p>Place your order first</p>
                                </div>
                            ) : (
                                openOrders.map((order, index) => (
                                    <div key={index} className="w-full border border-gray-700 bg-[#51515125] rounded-md p-2 flex flex-col md:flex-col lg:flex-row items-center justify-start gap-3">
                                        <svg className="hidden md:flex lg:flex border-0 p-1 w-9 h-9 rounded-full bg-[#cca649] text-gray-800 dark:text-[#4f3b09] animate-pulse" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM6 6a1 1 0 0 1-.707-.293l-1-1a1 1 0 0 1 1.414-1.414l1 1A1 1 0 0 1 6 6Zm-2 4H3a1 1 0 0 1 0-2h1a1 1 0 1 1 0 2Zm14-4a1 1 0 0 1-.707-1.707l1-1a1 1 0 1 1 1.414 1.414l-1 1A1 1 0 0 1 18 6Zm3 4h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
                                        </svg>

                                        <div className="w-full flex flex-col gap-2 border-0">
                                            <div className="w-full flex flex-row items-center justify-start md:justify-between lg:justify-between gap-2">
                                                <svg className="flex md:hidden lg:hidden border-0 p-1 w-9 h-9 rounded-full bg-[#cca649] text-gray-800 dark:text-[#4f3b09] animate-pulse" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM6 6a1 1 0 0 1-.707-.293l-1-1a1 1 0 0 1 1.414-1.414l1 1A1 1 0 0 1 6 6Zm-2 4H3a1 1 0 0 1 0-2h1a1 1 0 1 1 0 2Zm14-4a1 1 0 0 1-.707-1.707l1-1a1 1 0 1 1 1.414 1.414l-1 1A1 1 0 0 1 18 6Zm3 4h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
                                                </svg>

                                                <p className="text-lg font-medium">{order.symbol}</p>
                                                <div className="flex items-center justify-center gap-1 ml-auto text-sm">
                                                    <p className="border px-1 rounded-md flex items-center justify-center text-sm capitalize">{order.market}</p>
                                                    <p className={`px-1 rounded-md border ${order.status === 'open' ? 'border-green-500 bg-green-500/20 text-green-500' : 'border-red-500 bg-red-500/20 text-red-500'}`}>{order.status}</p>
                                                </div>
                                            </div>
                                            <input
                                                type="number" step="any" placeholder="Exit price"
                                                value={closeForm.orderId === order._id ? closeForm.closedPrice : ''}
                                                onChange={e => setCloseForm({ orderId: order._id, closedPrice: e.target.value })}
                                                className="border border-gray-500 p-1 rounded-md outline-none"
                                            />
                                            <button type="submit" form="close-order"
                                                disabled={loading || !closeForm.orderId}
                                                onClick={(e) => handleCloseOrder(order.orderId)}
                                                className="w-full border-0 rounded-md px-2 py-1 border-red-400 bg-red-600/30 text-red-400 ml-auto hover:cursor-pointer"
                                            >
                                                {loading && closeForm.orderId === order.orderId ? 'Closing order..' : 'Close order'}
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* all orders */}
            <div className="w-full flex flex-col items-start justify-center gap-2 text-gray-300 border-0 p-1">
                {/* heading & dropdown */}
                <div className="border-0 flex w-full items-center justify-start gap-3">
                    <p className="flex gap-2 items-center justify-start">
                        All Orders
                    </p>
                    <select tabIndex={0} className="border border-gray-500 p-2 rounded-md bg-[#51515148] outline-none focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 ml-auto">
                        <option>All Status</option>
                        <option>Opened</option>
                        <option>Closed</option>
                    </select>
                    <select tabIndex={0} className="border border-gray-500 p-2 rounded-md bg-[#51515148] outline-none focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500">
                        <option>All Markets</option>
                        <option>Crypto</option>
                        <option>Stock</option>
                    </select>
                </div>

                {/* quotes-table */}
                <div className="relative max-h-80 overflow-y-auto custom-scrollbar bg-neutral-primary-soft shadow-xs rounded-md p-0 w-full bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] border-0 border-gray-700">
                    <table className="w-full text-sm text-center text-body whitespace-nowrap min-w-150">
                        <thead className="sticky top-0 z-10 bg-[#0f1720f7] border-b border-gray-700 uppercase focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 outline-none px-2 rounded-md">
                            <tr>
                                <th className="py-3 px-4 w-40">Order-Id</th>
                                <th className="py-3 px-4">Symbol</th>
                                <th className="py-3 px-4">Type</th>
                                <th className="py-3 px-4">Market</th>
                                <th className="py-3 px-4">Qty</th>
                                <th className="py-3 px-4">Entry</th>
                                <th className="py-3 px-4">Exit</th>
                                <th className="py-3 px-4">P&L</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4"></th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td>Loading...</td>
                                </tr>
                            ) : (
                                orders.length === 0 ? (
                                    <tr className="text-center">
                                        <td>Place your order first</td>
                                    </tr>
                                ) : (
                                    orders.map((order, index) => (
                                        <tr key={index} className="border-0 transition-all duration-300 hover:bg-[#51515148] cursor-default">
                                            <td className="py-2 px-2 w-40 whitespace-normal">{order.orderId}</td>
                                            <td className="py-2 px-2 text-center">{order.symbol}</td>
                                            <td className={`py-2 px-2 font-bold`}>
                                                <span className={`px-2 py-1 rounded bg-[#51515148] ${order.type === "buy" ? 'hover:text-green-500' : 'hover:text-red-500'}`}>{order.type}</span>
                                            </td>
                                            <td className="py-2 px-2 capitalize">{order.market}</td>
                                            <td className="py-2 px-2 font-mono">{order.quantity}</td>
                                            <td className="py-2 px-2 font-mono">${order.priceAtOrder}</td>
                                            <td className="py-2 px-2 font-mono">${order.closedPrice}</td>
                                            <td className="py-2 px-2">
                                                <p className={`border-0 ${order.totalValue > 0 ? 'text-green-500' : 'text-red-500'}`}>${order.totalValue}</p>
                                            </td>
                                            <td className="py-2 px-2 text-center">
                                                <span className={`px-2 rounded-md border ${order.status === 'open' ? 'border-green-500 bg-green-500/20 text-green-500' : 'border-red-500 bg-red-500/20 text-red-500'}`}>{order.status}</span>
                                            </td>
                                            <td>
                                                <button type="button" onClick={()=>handleOrderDelete(order.orderId)} className="p-1 hover:bg-red-500/20 rounded-full transition-colors cursor-pointer flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}