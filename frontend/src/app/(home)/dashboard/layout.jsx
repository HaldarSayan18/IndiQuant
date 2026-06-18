'use client';
import Image from "next/image";
import logo from '@/../public/assets/logo.png';
import chatbot from '@/../public/assets/chatbot.png';
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/layouts/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Chatbot from "@/components/user_pages/Chatbot";

export default function Page({ children }) {
    const { user, isLoggedIn, loading } = useAuth();
    const router = useRouter();
    const pathName = usePathname();
    const filteredPathName = usePathname().split('/').pop();
    const [isLoading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi, Ask me anything regarding market!' }
    ]);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behaviour: 'smooth' })
    }, [messages]);

    // send message to bot
    async function sendMsg() {
        if (!input.trim() || isLoading) return;
        const userMsg = { role: user, content: input };
        const next = [...messages, userMsg];
        setMessages(next);
        setInput('');
        setLoading(true);

        const res = await axios.get(``)
    }

    // sidebar items
    const sidebar_items = [
        {
            id: 1,
            title: 'Dashboard',
            icon:
                <svg className="w-6 h-6 text-gray-800 dark:text-[#cca629]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z" clipRule="evenodd" />
                </svg>,
            path: "/dashboard"
        },
        {
            id: 2,
            title: 'Stocks',
            icon:
                <svg className="w-6 h-6 text-gray-800 dark:text-[#cca629]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.6 16.733c.234.269.548.456.895.534a1.4 1.4 0 0 0 1.75-.762c.172-.615-.446-1.287-1.242-1.481-.796-.194-1.41-.861-1.241-1.481a1.4 1.4 0 0 1 1.75-.762c.343.077.654.26.888.524m-1.358 4.017v.617m0-5.939v.725M4 15v4m3-6v6M6 8.5 10.5 5 14 7.5 18 4m0 0h-3.5M18 4v3m2 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" />
                </svg>,
            path: "/dashboard/stocks"
        },
        {
            id: 3,
            title: 'Crypto',
            icon:
                <svg className="w-6 h-6 text-gray-800 dark:text-[#cca629]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M10.7367 14.5876c.895.2365 2.8528.754 3.1643-.4966.3179-1.2781-1.5795-1.7039-2.5053-1.9117-.1034-.0232-.1947-.0437-.2694-.0623l-.6025 2.4153c.0611.0152.1328.0341.2129.0553Zm.8452-3.5291c.7468.1993 2.3746.6335 2.6581-.5025.2899-1.16213-1.2929-1.5124-2.066-1.68348-.0869-.01923-.1635-.03619-.2262-.0518l-.5462 2.19058c.0517.0129.1123.0291.1803.0472Z" />
                    <path fill="currentColor" fillRule="evenodd" d="M9.57909 21.7008c5.35781 1.3356 10.78401-1.9244 12.11971-7.2816 1.3356-5.35745-1.9247-10.78433-7.2822-12.11995C9.06034.963624 3.6344 4.22425 2.2994 9.58206.963461 14.9389 4.22377 20.3652 9.57909 21.7008ZM14.2085 8.0526c1.3853.47719 2.3984 1.1925 2.1997 2.5231-.1441.9741-.6844 1.4456-1.4013 1.6116.9844.5128 1.485 1.2987 1.0078 2.6612-.5915 1.6919-1.9987 1.8347-3.8697 1.4807l-.454 1.8196-1.0972-.2734.4481-1.7953c-.2844-.0706-.575-.1456-.8741-.2269l-.44996 1.8038-1.09594-.2735.45407-1.8234c-.10059-.0258-.20185-.0522-.30385-.0788-.15753-.0411-.3168-.0827-.47803-.1231l-1.42812-.3559.54468-1.2563s.80844.215.7975.1991c.31063.0769.44844-.1256.50282-.2606l.71781-2.8766.11562.0288c-.04375-.0175-.08343-.0288-.11406-.0366l.51188-2.05344c.01375-.23312-.06688-.52719-.51125-.63812.01718-.01157-.79688-.19813-.79688-.19813l.29188-1.17187 1.51313.37781-.0013.00562c.2275.05657.4619.11032.7007.16469l.4497-1.80187 1.0965.27343-.4406 1.76657c.2944.06718.5906.135.8787.20687l.4375-1.755 1.0975.27344-.4493 1.8025Z" clipRule="evenodd" />
                </svg>,
            path: "/dashboard/crypto"

        },
        {
            id: 4,
            title: 'NFTs',
            icon:
                <svg className="w-6 h-6 text-gray-800 dark:text-[#cca629]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m4 10v-2m3 2v-6m3 6v-3m4-11v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z" />
                </svg>,
            path: "/dashboard/nfts"

        },
        {
            id: 5,
            title: 'Portfolio',
            icon:
                <svg className="w-6 h-6 text-gray-800 dark:text-[#cca629]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M10 2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v2.382l1.447.723.005.003.027.013.12.056c.108.05.272.123.486.212.429.177 1.056.416 1.834.655C7.481 13.524 9.63 14 12 14c2.372 0 4.52-.475 6.08-.956.78-.24 1.406-.478 1.835-.655a14.028 14.028 0 0 0 .606-.268l.027-.013.005-.002L22 11.381V9a3 3 0 0 0-3-3h-2V5a3 3 0 0 0-3-3h-4Zm5 4V5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1h6Zm6.447 7.894.553-.276V19a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-5.382l.553.276.002.002.004.002.013.006.041.02.151.07c.13.06.318.144.557.242.478.198 1.163.46 2.01.72C7.019 15.476 9.37 16 12 16c2.628 0 4.98-.525 6.67-1.044a22.95 22.95 0 0 0 2.01-.72 15.994 15.994 0 0 0 .707-.312l.041-.02.013-.006.004-.002.001-.001-.431-.866.432.865ZM12 10a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z" clipRule="evenodd" />
                </svg>,
            path: "/dashboard/portfolio"

        },
        {
            id: 6,
            title: 'Alerts',
            icon:
                <svg className="w-6 h-6 text-gray-800 dark:text-[#cca629]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.133 12.632v-1.8a5.407 5.407 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.933.933 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175Zm-13.267-.8a1 1 0 0 1-1-1 9.424 9.424 0 0 1 2.517-6.391A1.001 1.001 0 1 1 6.854 5.8a7.43 7.43 0 0 0-1.988 5.037 1 1 0 0 1-1 .995Zm16.268 0a1 1 0 0 1-1-1A7.431 7.431 0 0 0 17.146 5.8a1 1 0 0 1 1.471-1.354 9.424 9.424 0 0 1 2.517 6.391 1 1 0 0 1-1 .995ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
                </svg>,
            path: "/dashboard/alerts"

        },
        {
            id: 7,
            title: 'Orders',
            icon:
                <svg className="w-6 h-6 text-gray-800 dark:text-[#cca629]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.268 6A2 2 0 0 0 14 9h1v1a2 2 0 0 0 3.04 1.708l-.311 1.496a1 1 0 0 1-.979.796H8.605l.208 1H16a3 3 0 1 1-2.83 2h-2.34a3 3 0 1 1-4.009-1.76L4.686 5H4a1 1 0 0 1 0-2h1.5a1 1 0 0 1 .979.796L6.939 6h5.329Z" />
                    <path d="M18 4a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0V8h2a1 1 0 1 0 0-2h-2V4Z" />
                </svg>
            ,
            path: "/dashboard/orders"

        },
        {
            id: 8,
            title: 'AI Picks',
            icon:
                <svg className="w-6 h-6 text-gray-800 dark:text-[#cca629]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18.5A2.493 2.493 0 0 1 7.51 20H7.5a2.468 2.468 0 0 1-2.4-3.154 2.98 2.98 0 0 1-.85-5.274 2.468 2.468 0 0 1 .92-3.182 2.477 2.477 0 0 1 1.876-3.344 2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 12 5.5m0 13v-13m0 13a2.493 2.493 0 0 0 4.49 1.5h.01a2.468 2.468 0 0 0 2.403-3.154 2.98 2.98 0 0 0 .847-5.274 2.468 2.468 0 0 0-.921-3.182 2.477 2.477 0 0 0-1.875-3.344A2.5 2.5 0 0 0 14.5 3 2.5 2.5 0 0 0 12 5.5m-8 5a2.5 2.5 0 0 1 3.48-2.3m-.28 8.551a3 3 0 0 1-2.953-5.185M20 10.5a2.5 2.5 0 0 0-3.481-2.3m.28 8.551a3 3 0 0 0 2.954-5.185" />
                </svg>,
            path: "/dashboard/ai-picks"

        },
    ];

    if (loading) return null;

    return (
        <div className='backdrop-blur-sm flex flex-col items-stretch justify-start overflow-y-auto custom-root-scrollbar w-full h-screen'>
            <div className="grid grid-cols-5 gap-0 min-h-screen p-2">
                {/* sidebar */}
                <div className="col-start-1 col-end-2 border border-[#2a2a2a] rounded-xl bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] p-2 h-full flex flex-col items-center md:items-stretch lg:items-stretch justify-start gap-0 text-gray-700">
                    {/* heading */}
                    <div className="flex items-center justify-center p-1">
                        <Image src={logo.src} alt="logo" height={90} width={90} loading='eager' className="w-auto h-auto" />
                        {/* <h1>IndiQuants</h1> */}
                    </div>
                    <hr className="mx-auto border-slate-500 w-1/2" />

                    {/* sidebar-items */}
                    <div className="h-auto border-0 flex flex-col items-center justify-start py-4 px-2 gap-3 whitespace-normal">
                        {sidebar_items.map((item) => {
                            const isActive = pathName == item.path;
                            return (
                                <Link href={item.path} key={item.id} className={`border-0 border[#1f2937] bg-[#111827cc] rounded w-full flex items-center justify-start gap-2 p-1 pl-0 md:pl-[25%] lg:pl-[25%] shadow-xl hover:bg-[#172033] hover:text-[#cca629] cursor-default ${isActive ? 'bg-[#172033] text-[#cca629]' : ''}`}>
                                    <div className="p-1 flex items-center justify-center">{item.icon}</div>
                                    <p className="hidden lg:flex">{item.title}</p>
                                </Link>
                            )
                        })}
                    </div>
                    <hr className="mt-auto mx-auto my-5 border-slate-500 w-1/2" />

                    <div className={`flex flex-col items-center justify-center gap-2 px-0`}>
                        {isLoggedIn ? (
                            <>
                                {/* admin */}
                                <button onClick={() => router.push('/admin')}
                                    className="border-0 border[#1f2937] bg-[#111827cc] rounded w-full flex items-center justify-start gap-2 p-1 px-2 pl-0 md:pl-[25%] lg:pl-[25%] shadow-xl hover:bg-[#172033] hover:text-[#facc15] cursor-default"
                                >
                                    <svg className="w-6 h-6 text-gray-800 dark:text-[#cca629]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20a16.405 16.405 0 0 1-5.092-5.804A16.694 16.694 0 0 1 5 6.666L12 4l7 2.667a16.695 16.695 0 0 1-1.908 7.529A16.406 16.406 0 0 1 12 20Z" />
                                    </svg>
                                    <p className="hidden lg:flex">Admin</p>
                                </button>

                                {/* settings */}
                                <button onClick={() => router.push('/dashboard/settings')} className="border-0 border[#1f2937] bg-[#111827cc] rounded w-full flex items-center justify-start gap-2 p-1 pl-0 md:pl-[25%] lg:pl-[25%] shadow-xl hover:bg-[#172033] hover:text-[#facc15] cursor-default">
                                    <svg className="w-6 h-6 text-gray-800 dark:text-[#cca629]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M20 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6h-2m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4m16 6H10m0 0a2 2 0 1 0-4 0m4 0a2 2 0 1 1-4 0m0 0H4" />
                                    </svg>

                                    <p className="hidden lg:flex">Settings</p>
                                </button>
                            </>
                        ) : (
                            <button onClick={() => router.push('/')}
                                className="border-0 border[#1f2937] bg-[#111827cc] rounded w-full flex items-center justify-start gap-2 p-1 pl-0 md:pl-[25%] lg:pl-[25%] shadow-xl hover:bg-[#172033] hover:text-[#facc15] cursor-default"
                            >
                                <svg className="w-6 h-6 text-gray-800 dark:text-[#cca629]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20a16.405 16.405 0 0 1-5.092-5.804A16.694 16.694 0 0 1 5 6.666L12 4l7 2.667a16.695 16.695 0 0 1-1.908 7.529A16.406 16.406 0 0 1 12 20Z" />
                                </svg>
                                <p className="hidden lg:flex">Login as Admin?</p>
                            </button>
                        )}
                    </div>
                </div>

                {/* others */}
                <div className="relative flex flex-col h-full overflow-y-auto custom-root-scrollbar col-start-2 col-end-6 border-0 rounded-xl m-0 px-2 text-gray-300">
                    {/* navbar */}
                    <div className="border flex items-center justify-between px-2 py-2 border-[#2a2a2a] rounded-xl bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2]">
                        <p className="uppercase text-[#cca629] hover:cursor-pointer">{filteredPathName}</p>
                        <div className="flex items-center justify-center gap-2 ml-auto">
                            {isLoggedIn ? (
                                <div className="flex items-center justify-center gap-1 border-0 border-gray-600 rounded-md bg-transparent">
                                    <svg className="w-6 h-6 text-gray-800 dark:text-[#cca629]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clipRule="evenodd" />
                                    </svg>
                                    <p className="hidden md:flex lg:flex items-center justify-center">{user.fullname}</p>
                                </div>
                            ) : (
                                <button className="border border-gray-600 rounded-md bg-[#51515148] px-3 py-1 transition-all duration-500 ease-in-out animate-pulse hover:animate-none hover:-translate-y-1" onClick={() => { router.push('/'); }}>Your Demat Account</button>
                            )}
                        </div>
                    </div>

                    {/* content */}
                    <div className="flex flex-col items-stretch justify-between gap-2 mt-1 h-screen bg-transparent border-0 p-0 overflow-y-auto custom-scrollbar">
                        {children}
                    </div>

                    {/* chat-bot */}
                    {/* <div className="fixed w-full top-6/12 md:8/12 lg:top-7/12 ml-auto flex items-center justify-end border-0 pr-8"> */}
                    <div className="absolute bottom-2 right-5 z-50 border-0">
                        <Image src={chatbot.src} alt="chatbot" height={40} width={40}
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-1 bg-[#515148] rounded-full border-2 border-gray-800/70 h-auto w-auto transition ease-in-out hover:scale-110"
                        />
                    </div>
                    <Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>
            </div>


            {/* footer */}
            <div className="border-0 w-full col-start-1 col-end-6 mt-5 p-0 bg-black bg-[url('/assets/stock-market-footer-background.webp')] bg-center bg-cover bg-no-repeat">
                <div className="border-0 h-full w-full p-0 bg-transparent backdrop-blur-[2px]">
                    <Footer />
                </div>
            </div>
        </div>
    );
}