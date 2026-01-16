
import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface BidModalProps {
    gigId: string;
    isOpen: boolean;
    onClose: () => void;
}

const BidModal = ({ gigId, isOpen, onClose }: BidModalProps) => {
    const [price, setPrice] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submitBid = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('http://localhost:5000/api/bids',
                { gigId, price, message },
                { withCredentials: true }
            );
            onClose();
            alert('Bid submitted successfully!');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Failed to submit bid');
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Submit a Proposal</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={submitBid} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Your Price ($)</label>
                        <input
                            type="number"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-green focus:border-brand-green"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cover Letter</label>
                        <textarea
                            required
                            rows={4}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-green focus:border-brand-green"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Why are you the best fit for this gig?"
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button type="button" onClick={onClose} className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-brand-green text-white rounded-md hover:bg-brand-green-dark disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Send Proposal'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default BidModal;
