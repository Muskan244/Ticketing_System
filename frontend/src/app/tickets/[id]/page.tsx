'use client';

import { useEffect, useState } from 'react';
import { getTicketById, createComment, uploadFile, rateTicket } from '@/lib/api';
import { useParams } from 'next/navigation';
import EditTicketForm from '@/components/EditTicketForm';
import { useUser } from '@/hooks/useUser';
import { motion } from 'framer-motion';

export default function TicketDetailsPage() {
    const { id } = useParams();
    const { user } = useUser();
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    async function fetchTicket() {
        try {
            const ticketData = await getTicketById(id as string);
            setTicket(ticketData);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (id) {
            fetchTicket();
        }
    }, [id]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment) return;

        try {
            const createdComment = await createComment(id as string, newComment);
            setTicket((prevTicket: any) => ({
                ...prevTicket,
                comments: [...prevTicket.comments, createdComment],
            }));
            setNewComment('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateTicket = (updatedTicket: any) => {
        setTicket(updatedTicket);
        setIsEditing(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;

        try {
            await uploadFile(id as string, selectedFile);
            setSelectedFile(null);
            // Refresh ticket data to show new attachment
            fetchTicket();
        } catch (error) {
            console.error(error);
        }
    };

    const handleRatingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating < 1 || rating > 5) {
            alert('Rating must be between 1 and 5');
            return;
        }

        try {
            const updatedTicket = await rateTicket(id as string, rating, feedback);
            setTicket(updatedTicket);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Loading ticket...</div>;
    }

    if (!ticket) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">Ticket not found</div>;
    }

    const canRateTicket = user && ticket && (ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') && user.id === ticket.requester.id;

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
                            <h1 className="text-3xl font-bold leading-tight text-white">Ticket #{ticket.id}</h1>
                            {(user?.role === 'ADMIN' || user?.role === 'SUPPORT_AGENT') && (
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                                >
                                    {isEditing ? 'Cancel' : 'Edit'}
                                </button>
                            )}
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
                            {isEditing ? (
                                <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg backdrop-blur-md">
                                    <EditTicketForm ticket={ticket} onUpdate={handleUpdateTicket} />
                                </div>
                            ) : (
                                <>
                                    <div className="p-6 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg backdrop-blur-md">
                                        <h2 className="text-2xl font-bold text-white">{ticket.subject}</h2>
                                        <p className="mt-2 text-gray-300">{ticket.description}</p>
                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <p className="text-gray-300"><strong>Priority:</strong> {ticket.priority}</p>
                                            <p className="text-gray-300"><strong>Status:</strong> {ticket.status}</p>
                                            <p className="text-gray-300"><strong>Requester:</strong> {ticket.requester.username}</p>
                                            {ticket.assignee && <p className="text-gray-300"><strong>Assignee:</strong> {ticket.assignee.username}</p>}
                                            {ticket.rating && <p className="text-gray-300"><strong>Rating:</strong> {ticket.rating}/5</p>}
                                            {ticket.feedback && <p className="text-gray-300"><strong>Feedback:</strong> {ticket.feedback}</p>}
                                        </div>
                                    </div>

                                    {canRateTicket && !ticket.rating && (
                                        <div className="mt-8 p-6 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg backdrop-blur-md">
                                            <h3 className="text-xl font-bold text-white">Rate this ticket</h3>
                                            <form onSubmit={handleRatingSubmit} className="mt-4 space-y-4">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    value={rating}
                                                    onChange={(e) => setRating(parseInt(e.target.value))}
                                                    className="w-full p-2 border rounded-md bg-gray-700 text-white border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
                                                    required
                                                />
                                                <textarea
                                                    value={feedback}
                                                    onChange={(e) => setFeedback(e.target.value)}
                                                    className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    rows={3}
                                                    placeholder="Optional feedback"
                                                ></textarea>
                                                <button
                                                    type="submit"
                                                    className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                                                >
                                                    Submit Rating
                                                </button>
                                            </form>
                                        </div>
                                    )}

                                    <div className="mt-8 p-6 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg backdrop-blur-md">
                                        <h3 className="text-xl font-bold text-white">Attachments</h3>
                                        <div className="mt-4 space-y-2">
                                            {ticket.attachments && ticket.attachments.map((attachment: any) => (
                                                <div key={attachment.id} className="p-2 bg-gray-700 rounded-lg">
                                                    <a href={`/api/attachments/${attachment.id}`} download className="text-indigo-400 hover:text-indigo-300">
                                                        {attachment.fileName}
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 flex items-center">
                                            <label className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md cursor-pointer hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105">
                                                <span>Choose File</span>
                                                <input type="file" onChange={handleFileChange} className="hidden"/>
                                            </label>
                                            {selectedFile && <span className="ml-3 text-gray-300">{selectedFile.name}</span>}
                                            <button
                                                onClick={handleFileUpload}
                                                disabled={!selectedFile}
                                                className="px-4 py-2 ml-2 font-medium text-white bg-indigo-600 rounded-md disabled:bg-gray-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                                            >
                                                Upload
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-8 p-6 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg backdrop-blur-md">
                                        <h3 className="text-xl font-bold text-white">Comments</h3>
                                        <div className="mt-4 space-y-4">
                                            {ticket.comments.map((comment: any) => (
                                                <div key={comment.id} className="p-4 bg-gray-700 rounded-lg">
                                                    <p className="text-gray-300">{comment.content}</p>
                                                    <p className="mt-2 text-sm text-gray-400">By {comment.author.username} on {new Date(comment.createdAt).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-8 p-6 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg backdrop-blur-md">
                                        <h3 className="text-xl font-bold text-white">Add a comment</h3>
                                        <form onSubmit={handleCommentSubmit} className="mt-4 space-y-4">
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                className="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                rows={4}
                                                required
                                            ></textarea>
                                            <button
                                                type="submit"
                                                className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                                            >
                                                Add Comment
                                            </button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
