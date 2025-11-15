'use client';

import { useEffect, useState } from 'react';
import { getUsers, deleteUser, updateUserRole } from '@/lib/api';
import { useUser } from '@/hooks/useUser';
import { motion } from 'framer-motion';

export default function AdminUsersPage() {
    const { user: adminUser, loading: adminLoading } = useUser();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const usersData = await getUsers();
                setUsers(usersData);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        }

        if (adminUser?.role === 'ADMIN') {
            fetchUsers();
        }
    }, [adminUser]);

    const handleDeleteUser = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                setUsers(users.filter((user: any) => user.id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleRoleChange = async (id: string, role: string) => {
        try {
            const updatedUser = await updateUserRole(id, role);
            setUsers(users.map((user: any) => (user.id === id ? updatedUser : user)));
        } catch (error) {
            console.error(error);
        }
    };

    if (adminLoading || loading) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading...</div>;
    }

    if (adminUser?.role !== 'ADMIN') {
        return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">You are not authorized to view this page.</div>;
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
                        <h1 className="text-3xl font-bold leading-tight text-white">Admin: User Management</h1>
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
                            <div className="overflow-x-auto rounded-lg shadow-lg">
                                <table className="min-w-full bg-gray-800 bg-opacity-50 border border-gray-700">
                                    <thead>
                                        <tr className="bg-gray-900">
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">ID</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Username</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Role</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-300 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                                        {users.map((user: any) => (
                                            <motion.tr 
                                                key={user.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="hover:bg-gray-700"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{user.username}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                        className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    >
                                                        <option value="USER">User</option>
                                                        <option value="SUPPORT_AGENT">Support Agent</option>
                                                        <option value="ADMIN">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-transform transform hover:scale-105"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
