
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import axios from 'axios';
import { motion } from 'framer-motion';

const CreateGigPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();
    const { userInfo } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        }
    }, [userInfo, router]);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(
                'http://localhost:5000/api/gigs',
                {
                    title,
                    description,
                    budget,
                },
                {
                    withCredentials: true,
                }
            );
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white shadow sm:rounded-lg overflow-hidden"
                >
                    <div className="px-4 py-5 sm:px-6 bg-brand-black text-white">
                        <h3 className="text-lg leading-6 font-medium">Post a New Gig</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-300">
                            Describe the service you need detailedly.
                        </p>
                    </div>

                    <div className="px-4 py-5 sm:p-6">
                        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                        <form onSubmit={submitHandler} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Gig Title
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        required
                                        maxLength={100}
                                        placeholder="e.g. I need a modern logo design for my startup"
                                        className="shadow-sm focus:ring-brand-green focus:border-brand-green block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">Keep it short and descriptive. Max 100 characters.</p>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <div className="mt-1">
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={6}
                                        required
                                        placeholder="Provide detailed requirements for your project..."
                                        className="shadow-sm focus:ring-brand-green focus:border-brand-green block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                                    Budget ($)
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm w-32">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                    </div>
                                    <input
                                        type="number"
                                        name="budget"
                                        id="budget"
                                        required
                                        min="5"
                                        className="focus:ring-brand-green focus:border-brand-green block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border"
                                        placeholder="0.00"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-5">
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green"
                                    >
                                        Post Gig
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CreateGigPage;
