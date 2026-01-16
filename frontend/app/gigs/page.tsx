
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import GigCard from '@/components/GigCard';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

const GigsPage = () => {
    const [gigs, setGigs] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const keyword = searchParams.get('keyword') || '';

    useEffect(() => {
        const fetchGigs = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`http://localhost:5000/api/gigs?keyword=${keyword}`);
                setGigs(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGigs();
    }, [keyword]);

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    {keyword ? `Results for "${keyword}"` : 'Explore All Gigs'}
                </h1>
                <p className="text-gray-500 mt-2">{gigs.length} services available</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <>
                    {gigs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <h2 className="text-2xl font-bold mb-2">No Gigs Found</h2>
                            <p>Try searching for something else or browse all categories.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {gigs.map((gig: any) => (
                                <motion.div
                                    key={gig._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <GigCard gig={gig} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GigsPage;
