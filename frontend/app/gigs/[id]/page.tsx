
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import BidModal from '@/components/BidModal';
import { FaUserCircle, FaClock, FaCheckCircle } from 'react-icons/fa';

const GigDetailsPage = () => {
    const params = useParams();
    const { id } = params;
    const { userInfo } = useSelector((state: RootState) => state.auth);

    interface Gig {
        _id: string;
        title: string;
        description: string;
        budget: number;
        status: string;
        createdAt: string;
        ownerId: {
            _id: string;
            name: string;
        };
    }

    const [gig, setGig] = useState<Gig | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBidModalOpen, setIsBidModalOpen] = useState(false);

    useEffect(() => {
        const fetchGig = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8000/api/gigs/${id}`);
                setGig(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchGig();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!gig) return <div className="min-h-screen flex items-center justify-center">Gig not found</div>;

    const isOwner = userInfo?._id === gig.ownerId._id;
    const isAssigned = gig.status === 'assigned';

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>

                    <div className="flex items-center space-x-4 border-b border-gray-200 pb-6">
                        <div className="flex items-center text-gray-600">
                            <FaUserCircle className="text-3xl text-gray-300 mr-2" />
                            <span className="font-semibold text-brand-black">{gig.ownerId.name}</span>
                        </div>
                        <div className="text-gray-400">|</div>
                        <div className="flex items-center text-gray-500 text-sm">
                            <FaClock className="mr-1" />
                            Posted {new Date(gig.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-gray-400">|</div>
                        <div className={`text-sm font-bold uppercase px-2 py-1 rounded ${isAssigned ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {gig.status}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">About This Gig</h3>
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">
                            {gig.description}
                        </p>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="md:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-600 font-semibold">Budget</span>
                            <span className="text-2xl font-bold text-gray-900">${gig.budget}</span>
                        </div>

                        {!isOwner && userInfo && !isAssigned && (
                            <button
                                onClick={() => setIsBidModalOpen(true)}
                                className="w-full bg-brand-black text-white py-3 rounded font-bold hover:bg-gray-800 transition mb-4"
                            >
                                Apply Now / Place Bid
                            </button>
                        )}

                        {!userInfo && !isAssigned && (
                            <div className="text-center text-sm text-gray-500 mb-4">
                                <a href="/login" className="text-brand-green font-bold hover:underline">Log in</a> to place a bid.
                            </div>
                        )}

                        {isOwner && (
                            <div className="bg-brand-green bg-opacity-10 p-4 rounded text-center text-brand-green-dark font-semibold">
                                This is your gig. Check your dashboard to view bids.
                            </div>
                        )}

                        {isAssigned && (
                            <div className="bg-gray-100 p-4 rounded text-center text-gray-500 font-semibold flex items-center justify-center">
                                <FaCheckCircle className="mr-2" /> Gig Assigned
                            </div>
                        )}

                        <div className="mt-6 border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-500">
                            <p className="flex items-center"><FaCheckCircle className="text-brand-green mr-2" /> Payment Protection</p>
                            <p className="flex items-center"><FaCheckCircle className="text-brand-green mr-2" /> Dedicated Support</p>
                        </div>
                    </div>
                </div>
            </div>

            <BidModal
                gigId={id as string}
                isOpen={isBidModalOpen}
                onClose={() => setIsBidModalOpen(false)}
            />
        </div>
    );
};

export default GigDetailsPage;
