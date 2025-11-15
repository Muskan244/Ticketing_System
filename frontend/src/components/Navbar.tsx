'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { logout } from '@/lib/api';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { user } = useUser();

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    return (
        <nav className="bg-gray-800 bg-opacity-50 shadow-lg backdrop-blur-md">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold text-white">Ticketing System</Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700">Home</Link>
                        {user ? (
                            <>
                                <Link href="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700">Dashboard</Link>
                                {user.role === 'ADMIN' && (
                                    <Link href="/admin/users" className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700">Users</Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-transform transform hover:scale-105"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700">Login</Link>
                                <Link href="/register" className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-transform transform hover:scale-105">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
