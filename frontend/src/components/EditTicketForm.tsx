'use client';

import { useState, useEffect } from 'react';
import { updateTicket, getUsers } from '@/lib/api';
import { motion } from 'framer-motion';

export default function EditTicketForm({ ticket, onUpdate }) {
    const [subject, setSubject] = useState(ticket.subject);
    const [description, setDescription] = useState(ticket.description);
    const [priority, setPriority] = useState(ticket.priority);
    const [status, setStatus] = useState(ticket.status);
    const [assigneeId, setAssigneeId] = useState(ticket.assignee?.id || '');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchUsers() {
            try {
                const usersData = await getUsers();
                setUsers(usersData);
            } catch (error) {
                console.error(error);
            }
        }

        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const updatedTicket = await updateTicket(ticket.id, { 
                subject, 
                description, 
                priority, 
                status, 
                assignee: assigneeId ? { id: assigneeId } : null 
            });
            onUpdate(updatedTicket);
        } catch (error) {
            setError('Failed to update ticket');
        }
    };

    return (
        <motion.form 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6" 
            onSubmit={handleSubmit}
        >
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
            <div>
                <label htmlFor="status" className="text-sm font-medium text-gray-300">Status</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                </select>
            </div>
            <div>
                <label htmlFor="assignee" className="text-sm font-medium text-gray-300">Assignee</label>
                <select
                    id="assignee"
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="">Unassigned</option>
                    {users.map((user: any) => (
                        <option key={user.id} value={user.id}>{user.username}</option>
                    ))}
                </select>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div>
                <button
                    type="submit"
                    className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                >
                    Update Ticket
                </button>
            </div>
        </motion.form>
    );
}
