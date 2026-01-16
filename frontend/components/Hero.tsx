
'use client';

import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Hero = () => {
    const router = useRouter();
    const [search, setSearch] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search) router.push(`/gigs?keyword=${search}`);
    }

    return (
        <div className="relative bg-green-900 h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Overlay / Image */}
            <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center opacity-40">
                {/* You would usually put an image here */}
            </div>
            <div className="absolute inset-0 bg-black opacity-30"></div>

            <div className="relative container mx-auto px-6 z-10 flex flex-col md:flex-row items-center">

                <div className="flex-1 text-white max-w-2xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-6xl font-bold leading-tight mb-6"
                    >
                        Find the perfect <i className="font-serif italic font-thin">freelance</i> services for your business
                    </motion.h1>

                    <motion.form
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        onSubmit={handleSearch}
                        className="flex bg-white rounded-md overflow-hidden h-12 w-full max-w-lg shadow-lg"
                    >
                        <div className="flex items-center pl-4 text-gray-400">
                            <FaSearch />
                        </div>
                        <input
                            type="text"
                            placeholder='Try "building mobile app"'
                            className="flex-1 p-3 text-gray-700 outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="bg-brand-green hover:bg-brand-green-dark text-white px-8 font-bold transition">
                            Search
                        </button>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex items-center gap-4 mt-6 text-sm font-semibold"
                    >
                        <span className="opacity-70">Popular:</span>
                        <button onClick={() => router.push('/gigs?keyword=Web%20Design')} className="border border-white hover:bg-white hover:text-brand-green rounded-full px-3 py-1 transition">Web Design</button>
                        <button onClick={() => router.push('/gigs?keyword=WordPress')} className="border border-white hover:bg-white hover:text-brand-green rounded-full px-3 py-1 transition">WordPress</button>
                        <button onClick={() => router.push('/gigs?keyword=Logo%20Design')} className="border border-white hover:bg-white hover:text-brand-green rounded-full px-3 py-1 transition">Logo Design</button>
                        <button onClick={() => router.push('/gigs?keyword=AI%20Services')} className="border border-white hover:bg-white hover:text-brand-green rounded-full px-3 py-1 transition">AI Services</button>
                    </motion.div>
                </div>

                <div className="hidden md:block flex-1">
                    {/* Hero Image / Graphic can go here */}
                    {/* For now, just a placeholder or leaving it empty as per typical clean design */}
                </div>

            </div>
        </div>
    );
};

export default Hero;
