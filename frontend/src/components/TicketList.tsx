'use client';

import { useEffect, useState } from 'react';
import { getTickets } from '@/lib/api';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TicketList() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        subject: '',
        status: '',
        priority: '',
    });

    useEffect(() => {
        async function fetchTickets() {
            setLoading(true);
            try {
                const ticketsData = await getTickets(filters);
                setTickets(ticketsData);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        }

        fetchTickets();
    }, [filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    return (
        <div>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg backdrop-blur-md mb-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                        type="text"
                        name="subject"
                        placeholder="Search by subject..."
                        value={filters.subject}
                        onChange={handleFilterChange}
                        className="p-2 border rounded-md bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="p-2 border rounded-md bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                    <select
                        name="priority"
                        value={filters.priority}
                        onChange={handleFilterChange}
                        className="p-2 border rounded-md bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                    </select>
                </div>
            </motion.div>

            {loading ? (
                <div className="text-center text-white">Loading tickets...</div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="overflow-x-auto rounded-lg shadow-lg"
                >
                    <table className="min-w-full bg-gray-800 bg-opacity-50 border border-gray-700">
                        <thead>
                            <tr className="bg-gray-900">
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">ID</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Subject</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Priority</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Status</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Requester</th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {tickets.map((ticket: any) => (
                                <motion.tr 
                                    key={ticket.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="hover:bg-gray-700"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{ticket.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{ticket.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{ticket.priority}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{ticket.status}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{ticket.requester.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link href={`/tickets/${ticket.id}`} className="text-indigo-400 hover:text-indigo-300">View</Link>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}
        </div>
    );
}
