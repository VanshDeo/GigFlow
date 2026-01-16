
'use client';

import Hero from '@/components/Hero';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaRegLightbulb, FaLanguage, FaDatabase } from 'react-icons/fa';

export default function Home() {
  const categories = [
    { name: 'Graphics & Design', icon: <FaRegLightbulb /> },
    { name: 'Digital Marketing', icon: <FaLaptopCode /> },
    { name: 'Writing & Translation', icon: <FaLanguage /> },
    { name: 'Video & Animation', icon: <FaLaptopCode /> }, // Reuse icons for demo
    { name: 'Programming & Tech', icon: <FaDatabase /> },
    { name: 'Business', icon: <FaRegLightbulb /> },
  ];

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Trusted By */}
      <div className="bg-gray-50 py-8 flex justify-center items-center gap-12 overflow-hidden">
        <span className="text-gray-400 font-bold text-xl uppercase tracking-widest">Trusted By:</span>
        {/* Simple logos text for demo */}
        <span className="text-gray-500 font-bold text-2xl">Google</span>
        <span className="text-gray-500 font-bold text-2xl">Netflix</span>
        <span className="text-gray-500 font-bold text-2xl">P&G</span>
        <span className="text-gray-500 font-bold text-2xl">PayPal</span>
      </div>

      {/* Popular Services / Categories */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-12 text-brand-black">Popular Professional Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="p-8 bg-white shadow-sm hover:shadow-xl rounded-lg border border-gray-100 cursor-pointer transition-all flex flex-col items-center text-center group"
            >
              <div className="text-4xl text-gray-400 group-hover:text-brand-green mb-4 transition-colors">
                {cat.icon}
              </div>
              <h3 className="font-bold text-gray-800">{cat.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-green-50 py-20 block">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-8 text-brand-black">A whole world of freelance talent at your fingertips</h2>

            <div className="space-y-6">
              <div>
                <h4 className="flex items-center text-xl font-bold mb-2">
                  The best for every budget
                </h4>
                <p className="text-gray-600 text-lg">Find high-quality services at every price point. No hourly rates, just project-based pricing.</p>
              </div>
              <div>
                <h4 className="flex items-center text-xl font-bold mb-2">
                  Quality work done quickly
                </h4>
                <p className="text-gray-600 text-lg">Find the right freelancer to begin working on your project within minutes.</p>
              </div>
              <div>
                <h4 className="flex items-center text-xl font-bold mb-2">
                  Protected payments, every time
                </h4>
                <p className="text-gray-600 text-lg">Always know what you'll pay upfront. Your payment isn't released until you approve the work.</p>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] w-full bg-gray-200 rounded-lg overflow-hidden shadow-2xl">
            {/* Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
              <span className="text-gray-500 font-bold">Video Placeholder</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
