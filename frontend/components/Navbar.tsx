
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Navbar = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logoutHandler = async () => {
        try {
            // Optional: Call backend logout
            await axios.post('http://localhost:5000/api/auth/logout');
        } catch (err) {
            console.error(err);
        }
        dispatch(logout());
        router.push('/login');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/gigs?keyword=${searchQuery}`);
        }
    }

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link href="/" className={`text-3xl font-bold tracking-tighter ${scrolled ? 'text-brand-black' : 'text-brand-black'} md:text-brand-black`}>
                    Gig<span className="text-brand-green">Flow</span>.
                </Link>

                {/* Search Bar (Hidden on Mobile) */}
                <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white border border-gray-300 rounded-sm overflow-hidden w-96">
                    <div className="pl-3 text-gray-400"><FaSearch /></div>
                    <input
                        type="text"
                        placeholder="What service are you looking for today?"
                        className="p-2 w-full outline-none text-gray-700"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="bg-brand-black text-white px-4 py-2 hover:bg-gray-800 transition">Search</button>
                </form>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-6 font-semibold text-gray-600">
                    <Link href="/gigs" className="hover:text-brand-green transition">Start Selling</Link>
                    <Link href="/gigs" className="hover:text-brand-green transition">Explore</Link>

                    {userInfo ? (
                        <>
                            <Link href="/dashboard" className="hover:text-brand-green transition">Dashboard</Link>
                            <span className="text-brand-green">Hello, {userInfo.name}</span>
                            <button onClick={logoutHandler} className="text-red-500 hover:text-red-700">Logout</button>
                            <Link href="/gigs/create" className="border border-brand-green text-brand-green px-5 py-2 rounded hover:bg-brand-green hover:text-white transition">Post a Gig</Link>

                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-brand-green transition">Sign In</Link>
                            <Link href="/register" className="border border-brand-green text-brand-green px-5 py-2 rounded hover:bg-brand-green hover:text-white transition">Join</Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Icon */}
                <div className="md:hidden text-2xl cursor-pointer text-brand-black" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white shadow-lg overflow-hidden"
                    >
                        <div className="flex flex-col p-6 space-y-4 font-semibold text-gray-600">
                            <form onSubmit={handleSearch} className="flex items-center bg-gray-100 border border-gray-300 rounded overflow-hidden">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="p-2 w-full outline-none bg-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </form>
                            <Link href="/gigs" onClick={() => setMobileMenuOpen(false)}>Explore</Link>
                            {userInfo ? (
                                <>
                                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                                    <Link href="/gigs/create" onClick={() => setMobileMenuOpen(false)}>Post a Gig</Link>
                                    <button onClick={() => { logoutHandler(); setMobileMenuOpen(false); }} className="text-left text-red-500">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-brand-green">Join</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
