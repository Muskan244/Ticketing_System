'use client';

import { useUser } from '@/hooks/useUser';
import Link from 'next/link';
import TicketList from '@/components/TicketList';
import { motion } from 'framer-motion';

export default function DashboardPage() {
    const { user, loading } = useUser();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="py-10">
                <motion.header 
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold leading-tight text-white">Dashboard</h1>
                            <Link href="/tickets/new" className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105">
                                Create Ticket
                            </Link>
                        </div>
                    </div>
                </motion.header>
                <main>
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mx-auto max-w-7xl sm:px-6 lg:px-8"
                    >
                        <div className="px-4 py-8 sm:px-0">
                            <TicketList />
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
