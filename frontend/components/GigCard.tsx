
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaHeart } from 'react-icons/fa';

interface GigProps {
    gig: {
        _id: string;
        title: string;
        description: string;
        budget: number;
        ownerId: {
            name: string;
            email: string;
        };
        createdAt: string;
    }
}

const GigCard = ({ gig }: GigProps) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
        >
            {/* Image Placeholder */}
            <div className="h-48 bg-gray-200 w-full relative group">
                {/* Replace with actual image if available */}
                <div className="absolute top-2 right-2 bg-white bg-opacity-80 p-2 rounded-full cursor-pointer hover:bg-white transition text-gray-500 hover:text-red-500">
                    <FaHeart />
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-center mb-2">
                    {/* Avatar Placeholder */}
                    <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
                    <h4 className="font-bold text-sm text-gray-800">{gig.ownerId?.name || 'Seller'}</h4>
                    <div className="ml-auto flex items-center text-yellow-500 text-xs font-bold">
                        <FaStar className="mr-1" />
                        <span>5.0</span>
                        <span className="text-gray-400 font-normal ml-1">(24)</span>
                    </div>
                </div>

                <Link href={`/gigs/${gig._id}`} className="block mb-2 hover:text-brand-green transition">
                    <h3 className="text-gray-700 leading-tight line-clamp-2 h-10">
                        {gig.title}
                    </h3>
                </Link>

                <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-3">
                    <div className="text-gray-400 text-xs font-bold uppercase">Starting at</div>
                    <div className="text-gray-800 font-bold text-lg">${gig.budget}</div>
                </div>
            </div>
        </motion.div>
    );
};

export default GigCard;
