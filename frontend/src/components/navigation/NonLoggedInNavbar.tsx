import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import Logo from './Logo';
import DesktopMenu from './DesktopMenu';
import SearchBar from './SearchBar';
import NonLoggedInMobileMenu from './NonLoggedInMobileMenu';

const NonLoggedInNavbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

    // Handle scroll event to change navbar appearance
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`sticky top-0 left-0 right-0 bg-white z-30 transition-all duration-300 
            ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between px-4 md:px-6 h-16 md:h-20">
                    <div className="flex-shrink-0 mr-2 md:mr-4">
                        <Logo />
                    </div>
                    
                    <DesktopMenu />
                    
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <div className="hidden md:block">
                            <SearchBar />
                        </div>
                        
                        {/* Mobile search button */}
                        <button
                            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                            aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        
                        {/* Login/Signup buttons for desktop */}
                        <div className="hidden md:flex items-center space-x-3">
                            <Link 
                                to="/login" 
                                className="px-4 py-2 text-orange-500 rounded-md hover:bg-orange-50 transition-colors"
                            >
                                เข้าสู่ระบบ
                            </Link>
                            <Link 
                                to="/signup" 
                                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors shadow-sm"
                            >
                                สมัครสมาชิก
                            </Link>
                        </div>

                        <button
                            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
                
                {/* Mobile search bar that appears below the navbar */}
                {isMobileSearchOpen && (
                    <div className="md:hidden px-4 pb-4 animate-in slide-in-from-top duration-200">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="ค้นหาสูตรอาหาร..."
                                className="w-full px-4 py-2 pl-10 rounded-full bg-gray-100 focus:outline-none focus:ring-2 
                                focus:ring-orange-500 focus:bg-white transition-all"
                            />
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                        </div>
                    </div>
                )}
            </div>

            <NonLoggedInMobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />
        </nav>
    );
};

export default NonLoggedInNavbar;