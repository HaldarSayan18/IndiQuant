'use client';
import Image from "next/image";
import logo from '@/../public/assets/logo.png';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { saveToken } from "@/lib/auth";

export default function Register() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ fullname: '', email: '', contact: '', password: '' });

    // registration form handler
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            if (form.password.length < 8) {
                setError('Password must contain 8 characters');
                return;
            }
            const { data } = await api.post('/api/auth/register', form);
            console.log('register data ->', data);
            saveToken(data.token);

            router.push('/dashboard');
        } catch (error) {
            setError(error.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="backdrop-blur-xs w-full flex items-center justify-center m-auto min-h-screen">
            <div className="border-0 border-gray-950/20 w-[80%] md:w-[40%] lg:w-[30%] bg-linear-to-tl from-[#000000c5] via-[#131313c5] to-[#13131354] rounded-lg shadow-xs flex flex-col items-center justify-center gap-3 px-3 py-5 md:py-8 lg:py-8 text-gray-300">
                <Image src={logo.src} alt="logo" height={90} width={90} loading='eager' className="w-auto h-auto" />
                <h1>Start tracking markets today</h1>
                <form className="w-full max-w-md px-0 md:px-2 lg:px-2 grid grid-cols-1 place-items-center gap-2 border-0" onSubmit={handleRegister}>
                    {/* error */}
                    {error && (
                        <div className="w-full border text-red-500 flex items-center justify-center">{error}</div>
                    )}

                    {/* name */}
                    <label className="border-0 w-full flex items-center justify-start">Fullname</label>
                    <div className="w-full border border-gray-800 flex items-center justify-start gap-2 px-1 py-2 rounded-md focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500">
                        <svg className="w-6 h-6 text-gray-800 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clipRule="evenodd" />
                        </svg>

                        <input type="text" required value={form.fullname} onChange={e => setForm(f => ({ ...f, fullname: e.target.value }))} placeholder="John Doe" className="border-0 outline-none" />
                    </div>

                    {/* email */}
                    <label className="border-0 w-full flex items-center justify-start">Email</label>
                    <div className="w-full border border-gray-800 flex items-center justify-start gap-2 px-1 py-2 rounded-md focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500">
                        <svg className="w-6 h-6 text-gray-800 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 6h-2V5h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2h-.541A5.965 5.965 0 0 1 14 10v4a1 1 0 1 1-2 0v-4c0-2.206-1.794-4-4-4-.075 0-.148.012-.22.028C7.686 6.022 7.596 6 7.5 6A4.505 4.505 0 0 0 3 10.5V16a1 1 0 0 0 1 1h7v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3h5a1 1 0 0 0 1-1v-6c0-2.206-1.794-4-4-4Zm-9 8.5H7a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2Z" />
                        </svg>
                        <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="example@gmail.com" className="border-0 outline-none" />
                    </div>

                    {/* mobile */}
                    <label className="border-0 w-full flex items-center justify-start">Contact Number</label>
                    <div className="w-full border border-gray-800 flex items-center justify-start gap-2 px-1 py-2 rounded-md focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500">
                        <svg className="w-6 h-6 text-gray-800 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M5 4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4Zm12 12V5H7v11h10Zm-5 1a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H12Z" clipRule="evenodd" />
                        </svg>
                        <input type="tel" required value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="+91-**********" className="border-0 outline-none" />
                    </div>

                    {/* password */}
                    <label className="border-0 w-full flex items-center justify-start">Password</label>
                    <div className="w-full border border-gray-800 flex items-center justify-start gap-2 p-1 rounded-md focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500">
                        <svg className="w-6 h-6 text-gray-800 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z" clipRule="evenodd" />
                        </svg>

                        <input type={showPassword ? "text" : "password"} required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="*******" className="border-0 outline-none" />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-1 focus:outline-none rounded ml-auto"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            <svg
                                className="w-6 h-6 text-gray-800 dark:text-gray-700 hover:text-[#cca629] dark:hover:text-[#cca629] transition-colors cursor-pointer"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                {showPassword ? (
                                    <>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </>
                                ) : (
                                    <>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </>
                                )}
                            </svg>
                        </button>

                    </div>

                    {/* login-btn */}
                    <button type="submit"
                        className={`border-0 border-gray-800 w-full px-2 py-1.5 rounded-md mt-2 bg-linear-to-b from-[#cca629] to-[#a17214] font-medium text-black transition-all hover:scale-[1.03] hover:border-[#cca629] duration-300 ease-in ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {loading ? 'Creating your account...' : 'Create Demat Account'}
                    </button>
                    <div className="flex w-full items-center justify-center -mt-1 gap-1">Already have one? <p className="text-blue-500 hover:cursor-pointer" onClick={() => router.push('/login')}>Signin</p></div>
                </form>
            </div>
        </div>
    );
}