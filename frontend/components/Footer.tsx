
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram, FaPinterest } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">Categories</h3>
                        <ul className="space-y-3 text-gray-500 text-sm">
                            <li>Graphics & Design</li>
                            <li>Digital Marketing</li>
                            <li>Writing & Translation</li>
                            <li>Video & Animation</li>
                            <li>Programming & Tech</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">About</h3>
                        <ul className="space-y-3 text-gray-500 text-sm">
                            <li>Careers</li>
                            <li>Press & News</li>
                            <li>Partnerships</li>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">Support</h3>
                        <ul className="space-y-3 text-gray-500 text-sm">
                            <li>Help & Support</li>
                            <li>Trust & Safety</li>
                            <li>Selling on GigFlow</li>
                            <li>Buying on GigFlow</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">Community</h3>
                        <ul className="space-y-3 text-gray-500 text-sm">
                            <li>Events</li>
                            <li>Blog</li>
                            <li>Forum</li>
                            <li>Community Standards</li>
                            <li>Podcast</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-8">
                    <div className="flex items-center mb-4 md:mb-0">
                        <span className="text-2xl font-bold tracking-tighter text-brand-gray mr-4">
                            Gig<span className="text-brand-black">Flow</span>.
                        </span>
                        <p className="text-gray-400 text-sm">© GigFlow International Ltd. 2024</p>
                    </div>
                    <div className="flex space-x-6 text-gray-500 text-xl">
                        <FaTwitter className="hover:text-brand-green cursor-pointer" />
                        <FaFacebookF className="hover:text-brand-green cursor-pointer" />
                        <FaLinkedinIn className="hover:text-brand-green cursor-pointer" />
                        <FaPinterest className="hover:text-brand-green cursor-pointer" />
                        <FaInstagram className="hover:text-brand-green cursor-pointer" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
