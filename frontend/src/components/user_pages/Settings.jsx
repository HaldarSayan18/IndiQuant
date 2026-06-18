'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

const Settings = () => {
    const router = useRouter();


    // logout function handler
    const handleLogout = async () => {
        localStorage.removeItem('token');
        router.push('/');
    }
    return (
        <div className='flex'>
            <div className='w-full flex items-center justify-start gap-2'>
                Settings
                <button className='ml-auto border px-2 py-0.5 rounded-md border-amber-400 bg-amber-600/30 text-amber-400' onClick={handleLogout}>Edit Profile</button>
                <button className='border px-2 py-0.5 rounded-md border-red-400 bg-red-600/30 text-red-400' onClick={handleLogout}>Logout</button>
            </div>

            {/* profile details */}
            <div>
                <div>
                    <label>Name</label>
                    {/* <p>{user}</p> */}
                </div>
            </div>
        </div>
    )
}

export default Settings