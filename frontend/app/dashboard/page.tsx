
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import axios from 'axios';
import Link from 'next/link';
import { motion } from 'framer-motion';

const DashboardPage = () => {
    interface Freelancer {
        _id: string;
        name: string;
        email: string;
    }

    interface Bid {
        _id: string;
        freelancerId: Freelancer;
        message: string;
        price: number;
        status: string;
    }

    interface Gig {
        _id: string;
        title: string;
        createdAt: string;
        status: string;
        budget: number;
    }

    const { userInfo } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const [myGigs, setMyGigs] = useState<Gig[]>([]);
    const [selectedGigBids, setSelectedGigBids] = useState<Bid[]>([]);
    const [selectedGigId, setSelectedGigId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
            return;
        }

        const fetchGigs = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/gigs/my', {
                    withCredentials: true,
                });
                setMyGigs(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGigs();
    }, [userInfo, router]);

    const handleViewBids = async (gigId: string) => {
        if (selectedGigId === gigId) {
            setSelectedGigId(null);
            setSelectedGigBids([]);
            return;
        }

        try {
            const { data } = await axios.get(`http://localhost:5000/api/bids/${gigId}`, {
                withCredentials: true,
            });
            setSelectedGigBids(data);
            setSelectedGigId(gigId);
        } catch (error) {
            console.error(error);
            alert('Failed to load bids');
        }
    };

    const handleHire = async (bidId: string) => {
        if (!confirm('Are you sure you want to hire this freelancer? This action cannot be undone.')) return;

        try {
            await axios.patch(`http://localhost:5000/api/bids/${bidId}/hire`, {}, {
                withCredentials: true,
            });
            alert('Freelancer hired successfully!');
            // Refresh logic (simple reload or state update)
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Failed to hire freelancer');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-brand-black">My Dashboard</h1>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">My Gigs</h2>
                    <Link href="/gigs/create" className="text-sm text-brand-green font-bold hover:underline">+ Post New Gig</Link>
                </div>

                {myGigs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        You haven&apos;t posted any gigs yet.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {myGigs.map((gig) => (
                            <div key={gig._id} className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            <Link href={`/gigs/${gig._id}`} className="hover:text-brand-green">{gig.title}</Link>
                                        </h3>
                                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                                            <span>Posted: {new Date(gig.createdAt).toLocaleDateString()}</span>
                                            <span className={`font-bold px-2 py-0.5 rounded ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {gig.status.toUpperCase()}
                                            </span>
                                            <span>Budget: ${gig.budget}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleViewBids(gig._id)}
                                        className="mt-4 md:mt-0 text-brand-green font-semibold border border-brand-green px-4 py-2 rounded hover:bg-brand-green hover:text-white transition"
                                    >
                                        {selectedGigId === gig._id ? 'Hide Proposals' : `View Proposals`}
                                    </button>
                                </div>

                                {/* Bids Section */}
                                {selectedGigId === gig._id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200"
                                    >
                                        <h4 className="font-bold text-gray-700 mb-4">Received Proposals ({selectedGigBids.length})</h4>

                                        {selectedGigBids.length === 0 ? (
                                            <p className="text-gray-500 italic">No proposals yet.</p>
                                        ) : (
                                            <ul className="space-y-4">
                                                {selectedGigBids.map((bid) => (
                                                    <li key={bid._id} className="bg-white p-4 rounded shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center mb-2">
                                                                <span className="font-bold text-gray-900 mr-2">{bid.freelancerId.name}</span>
                                                                <span className="text-gray-500 text-sm">{bid.freelancerId.email}</span>
                                                            </div>
                                                            <p className="text-gray-700 mb-2">{bid.message}</p>
                                                            <div className="font-bold text-brand-green">${bid.price}</div>
                                                        </div>

                                                        <div className="mt-4 md:mt-0 md:ml-6 flex items-center">
                                                            {bid.status === 'pending' && gig.status === 'open' ? (
                                                                <button
                                                                    onClick={() => handleHire(bid._id)}
                                                                    className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm"
                                                                >
                                                                    Hire
                                                                </button>
                                                            ) : (
                                                                <span className={`px-3 py-1 rounded text-sm font-bold ${bid.status === 'hired' ? 'bg-green-100 text-green-700' :
                                                                    bid.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'
                                                                    }`}>
                                                                    {bid.status.toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
