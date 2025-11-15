'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/api';

import { usePathname } from 'next/navigation';

export function useUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        async function fetchUser() {
            try {
                const userData = await getCurrentUser();
                setUser(userData);
            } catch (error) {
                if (pathname !== '/login' && pathname !== '/register') {
                    window.location.href = '/login';
                }
            }
            setLoading(false);
        }

        fetchUser();
    }, [pathname]);

    return { user, loading };
}
