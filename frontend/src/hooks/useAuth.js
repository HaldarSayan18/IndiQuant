'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const token = Cookies.get('token');
                // console.log('cookie token---',token);
                if (!token) {
                    setUser(null);
                    return;
                }
                // get user details
                const res = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // console.log('user found---', res.data);
                setUser(res.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    return {
        user, isLoggedIn: !!user, loading
    }
}