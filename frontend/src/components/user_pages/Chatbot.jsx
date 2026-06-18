'use client';
import React, { useEffect, useRef, useState } from 'react';

const Chatbot = ({ isOpen, setIsOpen }) => {
    // const [isOpen, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'Namaste! How can I help you today?' }
    ]);

    const msgEndRef = useRef(null);
    useEffect(() => {
        if (msgEndRef.current)
            msgEndRef.current.scrollIntoView({ behaviour: 'smooth' });
    }, [messages]);

    // sned message handler
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // bot response placeholder
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: 'Analyzing your data...'
            }])
        }, 1000);
    };

    return (
        <>
            {isOpen && (
                <div className={`absolute bottom-20 right-10 z-50 border-2 border-gray-800/70 rounded-lg w-80 md:w-90 lg:w-100 h-112 bg-[#515148] bg-[url('/assets/stock-market-footer-background.webp')] bg-center bg-cover bg-no-repeat`}>
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
                                </div>
                            ))}
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