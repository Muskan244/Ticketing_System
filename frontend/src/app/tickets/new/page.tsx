'use client';

import { useState } from 'react';
import { createTicket } from '@/lib/api';
import { motion } from 'framer-motion';

export default function NewTicketPage() {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('LOW');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await createTicket({ subject, description, priority, status: 'OPEN' });
            window.location.href = '/dashboard';
        } catch (error) {
            setError('Failed to create ticket');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <div className="py-10">
                <motion.header 
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight text-white">Create New Ticket</h1>
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
                            <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg backdrop-blur-md">
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="subject" className="text-sm font-medium text-gray-300">Subject</label>
                                        <input
                                            id="subject"
                                            type="text"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="description" className="text-sm font-medium text-gray-300">Description</label>
                                        <textarea
                                            id="description"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            rows={4}
                                            required
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label htmlFor="priority" className="text-sm font-medium text-gray-300">Priority</label>
                                        <select
                                            id="priority"
                                            value={priority}
                                            onChange={(e) => setPriority(e.target.value)}
                                            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                            <option value="URGENT">Urgent</option>
                                        </select>
                                    </div>
                                    {error && <p className="text-sm text-red-500">{error}</p>}
                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                                        >
                                            Create Ticket
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
