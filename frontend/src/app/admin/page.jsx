'use client';
import Footer from '@/components/layouts/Footer';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const Page = () => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [userActionId, setUserActionId] = useState(null);

    const fetchAdminData = useCallback(async () => {
        setLoading(true);
        try {
            const [userResp, analyticsResp, currentResp] = await Promise.all([
                api.get(`/api/admin/users`),
                api.get(`/api/admin/analytics`),
                api.get(`/api/auth/me`),
            ]);
            // console.log(currentResp.data.id);
            // console.log(userResp.data.users[0]._id);
            console.log(analyticsResp.data.analytics);
            setUsers(userResp.data.users);
            setAnalytics(analyticsResp.data.analytics);
            setCurrentUser(currentResp.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        (() => {
            fetchAdminData();
        })();
    }, [fetchAdminData]);

    // cards
    const cardsData = useMemo(() => {
        if (!analytics) return [];
        // const todaySignups = analytics.recentSignUps?.length
        //     ? analytics.recentSignups[analytics.recentSignups.length - 1].count
        //     : 0;
        return [
            { title: "Total users", value: analytics.totalUsers, stats: `${analytics.recentSignups?.reduce((s, d) => s + d.count, 0) || 0} this week` },
            { title: "Total orders", value: analytics.totalOrders, stats: "+1 today" },
            { title: "Active alerts", value: analytics.totalAlerts, stats: "all users" },
            { title: "Admins", value: analytics.adminCount, stats: `of ${analytics.totalUsers}` },
            { title: "New today", value: analytics.newToday, stats: "registrations" },
        ];
    }, [analytics]);

    // filter & search users
    const filteredUsers = useMemo(() => {
        try {
            // setLoading(true);
            return users.filter(u => {
                const matchedRole = roleFilter === 'All Roles' ||
                    (roleFilter === 'Admin' && u.role === 'admin') ||
                    (roleFilter === 'User' && u.role === 'user');
                const matchedSearch = !search ||
                    u.fullname?.toLowerCase().includes(search.toLowerCase()) ||
                    u.email?.toLowerCase().includes(search.toLowerCase());

                return matchedRole && matchedSearch;
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [users, roleFilter, search]);

    // role -  promote / demote
    const handleRoleToggle = async (user_id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        setUserActionId(user_id);

        try {
            console.log(user_id, currentRole);
            await api.patch(`/api/admin/users/${user_id}/role`, { role: newRole });
            setUsers(prev => prev.filter(u => u._id === user_id ? { ...u, role: newRole } : u));

            fetchAdminData();
        } catch (error) {
            alert(error.message || 'Failed to update role.');
        } finally {
            setUserActionId(null);
        }
    };

    // delete user handler
    const handleDelete = async (user_id) => {
        setUserActionId(user_id);

        try {
            if (!confirm('User will be deleted permanently.')) return;
            await api.delete(`/api/admin/users/${user_id}`);
            setUsers(prev => prev.filter(u => u._id !== user_id));

            fetchAdminData();
        } catch (error) {
            alert(error.message || 'Falied to remove user!');
        } finally {
            setUserActionId(null);
        }
    };

    const handleLogout = () => {
        alert('Logout');
        Cookies.remove('token', { path: '/' });
        router.push('/login');
    };

    return (
        <div className="backdrop-blur-sm min-h-screen w-full flex flex-col items-stretch justify-start gap-2 border-0 text-gray-300 overflow-y-auto custom-root-scrollbar">
            <div className="w-full flex flex-col items-stretch justify-start gap-2 border-0 p-1">
                {/* navbar */}
                <div className="w-full border h-12 flex items-center justify-start gap-2 px-2 py-4 border-[#2a2a2a] rounded-md bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] shadow-[0_0_25px_rgba(0,0,0,0.45)]">
                    <p className="uppercase text-[#cca629] hover:cursor-pointer">Admin Pannel</p>
                    <div className="flex items-center justify-center gap-2 ml-auto cursor-default">
                        <svg className="w-6 h-6 text-gray-800 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20a16.405 16.405 0 0 1-5.092-5.804A16.694 16.694 0 0 1 5 6.666L12 4l7 2.667a16.695 16.695 0 0 1-1.908 7.529A16.406 16.406 0 0 1 12 20Z" />
                        </svg>

                        <p className="capitalize text-gray-300">Namaste Admin</p>
                    </div>
                    <button onClick={() => setIsOpen(!isOpen)} className='border-0 cursor-pointer'>
                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 6h.01M12 12h.01M12 18h.01" />
                        </svg>
                    </button>
                    {isOpen && (
                        <div className='z-99 absolute right-0 mt-36 mr-2 md:mr-5 lg:mr-5 w-45 bg-[#05070b] rounded-md shadow-2xl border-0 opacity-100 visible transition-all duration-300 ease-in-out flex flex-col items-center justify-center gap-3 p-2'>
                            <button className='w-full border border-gray-700 px-2 py-1 rounded-md shadow-2xs text-center bg-[#51515148] cursor-pointer' onClick={() => router.push('/dashboard')}>
                                Go to Dashboard
                            </button>
                            <button onClick={handleLogout}
                                className='w-full flex items-center justify-center gap-1 border-0 px-2 py-1 rounded-md shadow-2xs bg-red-700 hover:bg-red-600'
                            >
                                <svg className="w-6 h-6 text-gray-800 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* cards */}
                <div className="border-0 grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 place-items-center gap-3 p-1 cursor-default">
                    {cardsData.map((item, index) => (
                        <div key={index} className="w-full md:w-[80%] lg:w-[80%] border-0 rounded-md px-2 py-5 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.05]">
                            <p className="whitespace-nowrap">{item.title}</p>
                            <p className="whitespace-nowrap text-2xl">{item.value}</p>
                            <p className={`whitespace-nowrap ${item.stats.startsWith('+') ? 'text-green-500' : item.stats === 'registrations' ? 'text-green-500' : 'text-gray-200'}`}>{item.stats}</p>
                        </div>
                    ))}
                </div>

                <div className='border-0 grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-2 h-auto p-2'>
                    {/* new registration chart */}
                    {/* <div className='border-0 shadow-2xl cursor-default md:col-start-1 md:col-end-4 lg:col-start-1 lg:col-end-4 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] flex flex-col items-start justify-start rounded-md p-2 h-75 overflow-y-auto custom-scrollbar'>
                        <p className='mb-2'>New signups - Last 15 days</p>
                    </div> */}
                    <div className='border-0 shadow-2xl cursor-default md:col-start-1 md:col-end-4 lg:col-start-1 lg:col-end-4 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] flex flex-col items-start justify-start rounded-md p-2 h-75 overflow-y-auto custom-scrollbar'>
                        <p className='mb-2'>New signups - Last 30 days</p>
                        {!loading && analytics?.recentSignups?.length > 0 ? (
                            <div className="w-full flex items-end justify-between gap-2 h-40 px-2">
                                {analytics.recentSignups.map((d, i) => {
                                    const max = Math.max(...analytics.recentSignups.map(s => s.count), 1);
                                    const heightPct = (d.count / max) * 100;
                                    return (
                                        <div key={i} className="flex flex-col items-center gap-1 flex-1">
                                            <div
                                                className="w-full bg-[#cca629]/70 rounded-t-sm transition-all"
                                                style={{ height: `${heightPct}%`, minHeight: d.count > 0 ? '4px' : '0px' }}
                                            />
                                            <p className="text-[10px] text-gray-500 whitespace-nowrap">
                                                {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </p>
                                            <p className="text-[10px] text-gray-400">{d.count}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            !loading && <p className="text-gray-500 text-xs">No signups in the last 30 days.</p>
                        )}
                    </div>

                    {/* recent activity */}
                    {/* <div className='border-0 shadow-2xl cursor-default md:col-start-4 md:col-end-6 lg:col-start-4 lg:col-end-6 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] flex flex-col items-start justify-start rounded-md p-2 h-75 overflow-y-auto custom-scrollbar'>
                        <p className='mb-2'>Recent activitites</p>
                        <div className="w-full border-b border-gray-700 bg-transparent p-2 flex items-center justify-start gap-2">
                            <svg className="p-1 bg-[#51515148] rounded-full w-6 h-6 animate-pulse text-gray-800 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11.209 3.816a1 1 0 0 0-1.966.368l.325 1.74a5.338 5.338 0 0 0-2.8 5.762l.276 1.473.055.296c.258 1.374-.228 2.262-.63 2.998-.285.52-.527.964-.437 1.449.11.586.22 1.173.75 1.074l12.7-2.377c.528-.1.418-.685.308-1.27-.103-.564-.636-1.123-1.195-1.711-.606-.636-1.243-1.306-1.404-2.051-.233-1.085-.275-1.387-.303-1.587-.009-.063-.016-.117-.028-.182a5.338 5.338 0 0 0-5.353-4.39l-.298-1.592Z" />
                                <path fillRule="evenodd" d="M6.539 4.278a1 1 0 0 1 .07 1.412c-1.115 1.23-1.705 2.605-1.83 4.26a1 1 0 0 1-1.995-.15c.16-2.099.929-3.893 2.342-5.453a1 1 0 0 1 1.413-.069Z" clipRule="evenodd" />
                                <path d="M8.95 19.7c.7.8 1.7 1.3 2.8 1.3 1.6 0 2.9-1.1 3.3-2.5l-6.1 1.2Z" />
                            </svg>

                            <p className="font-normal">Arjun Kumar registered</p>
                            <p className="border-0 px-2 py-1 rounded-md text-xs bg-gray-500/30 ml-auto whitespace-nowrap">2 mins ago</p>
                        </div>
                    </div> */}
                    <div className='border-0 shadow-2xl cursor-default md:col-start-4 md:col-end-6 lg:col-start-4 lg:col-end-6 bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] flex flex-col items-start justify-start rounded-md p-2 h-75 overflow-y-auto custom-scrollbar'>
                        <p className='mb-2'>Recent Activities</p>
                        {!loading && analytics?.recentUsers?.length > 0 ? (
                            analytics.recentUsers.map((u) => (
                                <div key={u._id} className="w-full border-b border-gray-700 bg-transparent p-2 flex items-center justify-start gap-2">
                                    <svg className="p-1 bg-[#51515148] rounded-full w-6 h-6 text-gray-800 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M11.209 3.816a1 1 0 0 0-1.966.368l.325 1.74a5.338 5.338 0 0 0-2.8 5.762l.276 1.473.055.296c.258 1.374-.228 2.262-.63 2.998-.285.52-.527.964-.437 1.449.11.586.22 1.173.75 1.074l12.7-2.377c.528-.1.418-.685.308-1.27-.103-.564-.636-1.123-1.195-1.711-.606-.636-1.243-1.306-1.404-2.051-.233-1.085-.275-1.387-.303-1.587-.009-.063-.016-.117-.028-.182a5.338 5.338 0 0 0-5.353-4.39l-.298-1.592Z" />
                                        <path fillRule="evenodd" d="M6.539 4.278a1 1 0 0 1 .07 1.412c-1.115 1.23-1.705 2.605-1.83 4.26a1 1 0 0 1-1.995-.15c.16-2.099.929-3.893 2.342-5.453a1 1 0 0 1 1.413-.069Z" clipRule="evenodd" />
                                        <path d="M8.95 19.7c.7.8 1.7 1.3 2.8 1.3 1.6 0 2.9-1.1 3.3-2.5l-6.1 1.2Z" />
                                    </svg>
                                    <p className="font-normal">{u.fullname || u.name} registered</p>
                                    <p className="border-0 px-2 py-1 rounded-md text-xs bg-gray-500/30 ml-auto whitespace-nowrap">
                                        {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                            ))
                        ) : (
                            !loading && <p className="text-gray-500 text-xs">No recent activity.</p>
                        )}
                    </div>
                </div>

                {/* users */}
                <div className="w-full flex flex-col items-start justify-center gap-2 text-gray-300 border-0 m-0 md:m-1 lg:m-0 p-1">
                    {/* heading & dropdown */}
                    <div className="border-0 whitespace-nowrap flex w-full items-center justify-between">
                        <p className="flex gap-2 items-center justify-start">
                            User Management
                        </p>

                        <div className="border-0 flex w-full items-center justify-start gap-3">
                            <div className="flex items-center justify-center gap-2 ml-auto">
                                <input type="search" placeholder="search by name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="hidden md:flex lg:flex border border-gray-500 p-2 rounded-md outline-none bg-[#51515148] focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500"
                                />
                            </div>
                            <select tabIndex={0}
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="border border-gray-500 p-2 rounded-md bg-[#51515148] outline-none focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500"
                            >
                                <option>All Roles</option>
                                <option>Admin</option>
                                <option>User</option>
                            </select>
                        </div>
                    </div>

                    {/* quotes-table */}
                    <div className="relative max-h-80 overflow-y-auto custom-scrollbar bg-neutral-primary-soft shadow-xs rounded-md p-1 w-full bg-linear-to-br from-[#0f1720f2] via-[#0a0f16f2] to-[#05070bf2] border-0 border-gray-700">
                        <table className="w-full text-sm text-center text-body whitespace-nowrap min-w-150">
                            <thead className="sticky top-0 z-10 bg-[#0f172095] border-b border-gray-700 uppercase focus-within:ring-1 focus-within:ring-gray-500 focus-within:border-gray-500 outline-none px-2 rounded-md py-1">
                                <tr>
                                    <th className="py-3 px-4">User</th>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Orders</th>
                                    <th className="py-3 px-4">Alert</th>
                                    <th className="py-3 px-4">Role</th>
                                    <th className="py-3 px-4 w-10">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className='py-4 text-center'>Loading...</td>
                                    </tr>
                                ) : (
                                    filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className='py-4 text-center'>No users match this filter.</td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user?._id} className="transition-all duration-300 hover:bg-[#51515148] cursor-default">
                                                <td className="py-2 px-2">{user?.fullname}</td>
                                                <td className="py-2 px-2">{user?.email}</td>
                                                <td className="py-2 px-2">18</td>
                                                <td className="py-2 px-2">4</td>
                                                <td className={`py-2 px-2`}>{user?.role}</td>
                                                <td className={`py-2 px-2 ${user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? 'hidden' : 'flex items-center justify-center gap-2'}`}>
                                                    <p className={`border px-2 rounded-md shadow-2xl ${user._id === currentUser.id ? 'text-gray-500 cursor-not-allowed' : 'text-gray-400 hover:text-[#cca649] hover:cursor-pointer'}`}
                                                        onClick={() => user._id === currentUser.id ? '' : handleRoleToggle(user._id, user.role)}
                                                    // onClick={() => userActionId !== user._id && handleRoleToggle(user._id, user.role)}
                                                    >
                                                        {user.role === 'admin' ? 'Demote' : 'Promote'}

                                                    </p>
                                                    <p className={`border px-2 rounded-md shadow-2xl ${user._id === currentUser.id ? 'text-gray-500 cursor-not-allowed' : 'text-gray-400 hover:text-[#cca649] hover:cursor-pointer'}`}
                                                        onClick={() => user._id === currentUser.id ? '' : handleDelete(user._id)}
                                                    // onClick={() => userActionId !== user._id && handleDelete(user._id)}
                                                    >Delete</p>
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

            {/* footer */}
            <div className="border-0 w-full col-start-1 col-end-6 mt-5 p-0 bg-black bg-[url('/assets/stock-market-footer-background.webp')] bg-center bg-cover bg-no-repeat">
                <div className="border-0 h-full w-full p-0 bg-transparent backdrop-blur-[2px]">
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default Page