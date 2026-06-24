'use client';
import { api } from '@/lib/api';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const Chatbot = ({ isOpen, setIsOpen }) => {
    // const [isOpen, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [step, setStep] = useState('market');
    const [selectedMarket, setSelectedMarket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'Namaste! How can I help you today?' },
        { id: 2, sender: 'bot', text: 'Which market would you like to know about?' },
    ]);

    const MARKET_OPTIONS = ['Stocks', 'Crypto', 'NFTs'];
    const TOPIC_OPTIONS = ['Current news', 'Market condition'];

    // automatically scroll down to the current message
    const msgEndRef = useRef(null);
    useEffect(() => {
        if (msgEndRef.current)
            msgEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const pushBotMsg = (text, extra = {}) => {
        setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'bot', text, ...extra }]);
    };
    const pushUserMsg = (text) => {
        setMessages(prev => [...prev, { id: Date.now() + Math.random(), sender: 'user', text }]);
    };

    // user select market
    function handleMarketSelection(market) {
        pushUserMsg(market);
        setSelectedMarket(market);
        setStep('topic');
        setTimeout(() => {
            pushBotMsg(`Got your choice - ${market}. Now, what you like to know?`, {
                options: TOPIC_OPTIONS,
                optionType: 'topic',
            })
        }, 500);
    };

    // user pick topic
    async function handleTopicSelection(topic) {
        pushUserMsg(topic);
        setStep('free');
        setLoading(true);

        try {
            const prompt = `Give me a quick ${topic.toLowerCase()} update for ${selectedMarket.toLowerCase()}.`;
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/bot/chat`, {
                messages: prompt,
                history: []
            });
            pushBotMsg(response.data);
            pushBotMsg('Ask anything else, or pick another market.', {
                options: MARKET_OPTIONS,
                optionType: 'market'
            });
        } catch (error) {
            pushBotMsg(error.message || 'Something went wrong - Try again!');
        } finally {
            setLoading(false);
        }
    }

    // send message handler
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        // const userMsg = { id: Date.now(), sender: 'user', text: input };
        // setMessages(prev => [...prev, userMsg]);
        pushUserMsg(input);
        setInput('');
        setLoading(true);
        setStep('free');

        const history = messages.filter(m => !m.options).slice(-6).map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant', content: m.text
        }));

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/api/bot/chat`, { message: input, history });
            pushBotMsg(response.data.reply);
        } catch (error) {
            pushBotMsg(error.message || 'Something went wrong - Try again!');
        } finally {
            setLoading(false);
        }

        // bot response placeholder
        // setTimeout(() => {
        //     setMessages(prev => [...prev, {
        //         id: Date.now() + 1,
        //         sender: 'bot',
        //         text: 'Analyzing your data...'
        //     }])
        // }, 1000);
    };

    // option selection handler
    function handleOptionClick(option, type) {
        if (type === 'market') handleMarketSelection(option);
        if (type === 'topic') handleTopicSelection(option);
    }

    return (
        <>
            {isOpen && (
                <div className={`absolute bottom-18 md:bottom-20 lg:bottom-20 right-0 md:right-10 lg:right-10 z-50 border-2 border-gray-800/70 rounded-lg w-full md:w-90 lg:w-100 h-100 md:h-112 lg:h-115 bg-[#515148] bg-[url('/assets/stock-market-footer-background.webp')] bg-center bg-cover bg-no-repeat`}>
                    <div className='w-full h-full flex flex-col items-end justify-start border-0 border-gray-700 rounded-lg'>
                        <div className="w-full bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] border-b border-gray-800 px-4 py-3 flex items-center justify-between rounded-t-lg">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-sm font-semibold text-gray-200">IndiQuant AI Assistant</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="text-red-700 hover:text-red-500 text-2xl font-bold leading-none cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="backdrop-blur-xs w-full flex-1 overflow-y-auto p-4 flex flex-col gap-3 text-xs no-scrollbar">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[75%] px-3 py-2 rounded-lg leading-relaxed border
                                    ${msg.sender === 'user'
                                            ? 'bg-[#0b71ac5d] text-gray-100 border-[#0b71ac7e] rounded-br-none'
                                            : 'bg-neutral-800/60 text-gray-300 border-gray-700/50 rounded-bl-none'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>

                                    {/* option buttons */}
                                    {msg.options && messages[messages.length - 1].id === msg.id && (
                                        <div className='flex flex-wrap gap-2 justify-start pl-1'>
                                            {msg.options.map(opt => (
                                                <button key={opt}
                                                    onClick={() => handleOptionClick(opt, msg.optionType)}
                                                    disabled={loading}
                                                    className="border border-gray-600 rounded-full bg-[#51515148] px-3 py-1 text-xs hover:border-[#cca649] hover:text-[#cca649] transition-all disabled:opacity-50"
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex w-full justify-start">
                                    <div className="max-w-[75%] px-3 py-2 rounded-lg bg-neutral-800/60 text-gray-500 border border-gray-700/50 rounded-bl-none">
                                        Thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={msgEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="mt-auto w-full p-3 border-t border-gray-800/80 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] flex gap-2 rounded-b-lg">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your text here..."
                                className="flex-1 bg-transparent border border-gray-700 rounded-md px-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                            />
                            <button
                                type="submit"
                                className="bg-[#a57f21] hover:bg-[#cca649]/80 text-white text-xs px-3 py-1.5 rounded-md font-medium transition-all shadow-md hover:cursor-pointer"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default Chatbot