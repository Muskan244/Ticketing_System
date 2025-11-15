'use client';

import { useState } from 'react';
import { register } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await register(username, password);
            // Redirect to the login page on successful registration
            window.location.href = '/login';
        } catch (error) {
            setError('Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 space-y-6 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg backdrop-blur-md"
            >
                <h1 className="text-3xl font-bold text-center text-white">Register</h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="text-sm font-medium text-gray-300">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-gray-400">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
