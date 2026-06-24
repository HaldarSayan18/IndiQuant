'use client';
import React from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const Settings = () => {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    // logout function handler
    const handleLogout = async () => {
        Cookies.remove('token', { path: '/' });
        router.push('/login');
    }
    return (
        <div className='flex flex-col'>
            <div className='w-full flex items-center justify-start gap-2'>
                Settings
                <button className='ml-auto border px-2 py-0.5 rounded-md border-amber-400 bg-amber-600/30 text-amber-400' onClick={handleLogout}>Edit Profile</button>
                <button className='border px-2 py-0.5 rounded-md border-red-400 bg-red-600/30 text-red-400' onClick={handleLogout}>Logout</button>
            </div>

            {/* profile details */}
            <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 mt-10 gap-3'>
                <div className='border-0 flex flex-col gap-1 p-1 cursor-default'>
                    <label className='text-gray-500'>Full Name</label>
                    <p className='border border-gray-500 rounded-md px-2 py-1 bg-[#51515148]'>{user?.fullname}</p>
                </div>
                <div className='border-0 flex flex-col gap-1 p-1 cursor-default'>
                    <label className='text-gray-500'>Email Id.</label>
                    <p className='border border-gray-500 rounded-md px-2 py-1 bg-[#51515148]'>{user?.email}</p>
                </div>
                <div className='border-0 flex flex-col gap-1 p-1 cursor-default'>
                    <label className='text-gray-500'>Contact Number</label>
                    <p className='border border-gray-500 rounded-md px-2 py-1 bg-[#51515148]'>{user?.contact}</p>
                </div>
            </div>
        </div>
    )
}

export default Settings