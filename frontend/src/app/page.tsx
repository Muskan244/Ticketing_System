'use client';

import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { motion } from 'framer-motion';

export default function Home() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <motion.h1
          initial={{ y: -250 }}
          animate={{ y: -10 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          className="text-5xl md:text-6xl font-bold mb-4"
        >
          Welcome to the Ticketing System
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg md:text-xl mb-8 max-w-2xl"
        >
          Your one-stop solution for managing and tracking your support tickets.
        </motion.p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          {user ? (
            <>
              <p className="text-center text-gray-400">Welcome, {user.username}!</p>
              <Link href="/dashboard" className="px-8 py-3 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105">
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="px-8 py-3 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105">
                Login
              </Link>
              <Link href="/register" className="px-8 py-3 font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-transform transform hover:scale-105">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
