import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCog, FaSignOutAlt, FaSearch, FaBell } from 'react-icons/fa';

const menuItems = [
    {
        path: '/anime',
        label: 'Anime',
        submenu: [
            { path: '/anime/trending', label: 'Trending' },
            { path: '/anime/popular', label: 'Popular' },
            { path: '/anime/upcoming', label: 'Upcoming' },
            { path: '/anime/airing', label: 'Currently Airing' }
        ]
    },
    {path: '/genres',label: 'Genres'},
    { path: '/community', label: 'Community' }
];

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profile = localStorage.getItem('profile');

    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    const location = useLocation();

    const fetchSearchResults = async () => {
            navigate('/search/' + searchQuery);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
        navigate('/login');
    };
    
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            fetchSearchResults();
        }
    };

    useEffect(() => {
        console.log(profile);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
                ? 'bg-[var(--bg-secondary)] shadow-lg shadow-purple-500/5'
                : 'bg-gradient-to-b from-[var(--bg-secondary)]/95 to-[var(--bg-secondary)]/75 backdrop-blur-sm'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            <img
                                className="h-10 w-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 rounded-full"
                                src="https://i.pinimg.com/736x/7e/4e/13/7e4e136037f8cd63909a685d814e3049.jpg"
                                alt="Mugiwara Hub"
                            />
                            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-[var(--accent)] via-purple-400 to-[var(--accent)] 
                                           bg-clip-text text-transparent bg-size-200 animate-gradient">
                                Mugiwara Hub
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-4 items-center">
                        <div className="relative flex-grow mr-2">
                            <input
                                type="search"
                                placeholder="Search anime..."
                                className="w-full px-4 py-2 bg-[var(--bg-primary)]/50 text-[var(--text-primary)] rounded-lg 
                                         border border-gray-700/50 focus:outline-none focus:border-[var(--accent)]
                                         transition-all duration-300 placeholder-gray-500
                                         hover:border-[var(--accent)]/50 focus:ring-2 focus:ring-[var(--accent)]/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                            />
                        </div>
                        <button 
                            onClick={fetchSearchResults} 
                            disabled={!searchQuery.trim()}
                            className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 
                                     text-white flex items-center justify-center
                                     transition-all duration-300 disabled:opacity-50 
                                     disabled:cursor-not-allowed disabled:hover:bg-purple-500"
                        >
                            <FaSearch className="text-sm" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {menuItems.map((item) => (
                            <div
                                key={item.path}
                                className="relative group"
                                onMouseEnter={() => setActiveSubmenu(item.submenu ? item.path : null)}
                                onMouseLeave={() => setActiveSubmenu(null)}
                            >
                                <Link
                                    to={item.path}
                                    className={`px-4 py-2 rounded-lg transition-all duration-300 relative overflow-hidden
                    ${isActive(item.path)
                                            ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                                            : 'text-[var(--text-primary)] hover:text-[var(--accent)]'
                                        }`}
                                >
                                    {item.label}
                                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[var(--accent)] transform origin-left
                                transition-transform duration-300 ${isActive(item.path) ? 'scale-x-100' : 'scale-x-0'}`} />
                                </Link>
                                {item.submenu && activeSubmenu === item.path && (
                                    <div className="absolute left-0 mt-2 w-48 bg-[var(--bg-secondary)] rounded-lg shadow-lg z-10">
                                        {item.submenu.map((subitem) => (
                                            <Link
                                                key={subitem.path}
                                                to={subitem.path}
                                                className="block px-4 py-2 text-[var(--text-primary)] hover:bg-[var(--bg-primary)]/50 rounded-lg"
                                            >
                                                {subitem.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center ml-4 space-x-3">
                        {token ? (
                            <>
                                {/* Notification Bell */}
                                <Link 
                                    to="/notifications" 
                                    className={`p-2 rounded-full transition-all duration-300 
                                             hover:bg-purple-500/20 relative
                                             ${isActive('/notifications') ? 'text-purple-400' : 'text-gray-400 hover:text-purple-400'}`}
                                    aria-label="Notifications"
                                >
                                    <FaBell className="text-lg" />
                                </Link>

                                {/* Profile Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center space-x-2 focus:outline-none"
                                    >
                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/50 
                                                    hover:border-purple-500 transition-colors duration-300">
                                                <img
                                                    src={`${profile}`}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                        </div>
                                    </button>

                                    {/* Profile Dropdown */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-secondary)] rounded-lg shadow-lg 
                                                    border border-gray-800/50 overflow-hidden z-50">
                                            <div className="py-1">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-400 hover:text-purple-400 
                                                        hover:bg-purple-500/10 transition-colors duration-200"
                                                >
                                                    <FaUserCircle className="w-4 h-4 mr-2" />
                                                    Profile
                                                </Link>
                                                <Link
                                                    to="/notifications"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-400 hover:text-purple-400 
                                                        hover:bg-purple-500/10 transition-colors duration-200"
                                                >
                                                    <FaBell className="w-4 h-4 mr-2" />
                                                    Notifications
                                                </Link>
                                                <Link
                                                    to="profile/settings"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-400 hover:text-purple-400 
                                                        hover:bg-purple-500/10 transition-colors duration-200"
                                                >
                                                    <FaCog className="w-4 h-4 mr-2" />
                                                    Settings
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:text-red-300 
                                                        hover:bg-red-500/10 transition-colors duration-200"
                                                >
                                                    <FaSignOutAlt className="w-4 h-4 mr-2" />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-4 py-2 bg-purple-500 text-white rounded-lg 
                                             hover:bg-purple-600 transition-all duration-300 
                                             transform hover:-translate-y-0.5 active:translate-y-0
                                             hover:shadow-lg hover:shadow-purple-500/20"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-300"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {/* Mobile Search */}
                        <div className="flex space-x-2 mb-3">
                            <input
                                type="search"
                                placeholder="Search anime..."
                                className="flex-grow px-4 py-2 bg-[var(--bg-primary)]/50 text-[var(--text-primary)]
                                     rounded-lg border border-gray-700/50 focus:outline-none focus:border-[var(--accent)]
                                     transition-all duration-300"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                            />
                            <button 
                                onClick={fetchSearchResults}
                                disabled={!searchQuery.trim()}
                                className="px-3 py-2 bg-purple-500 text-white rounded-lg
                                         disabled:opacity-50 disabled:bg-purple-500"
                            >
                                <FaSearch />
                            </button>
                        </div>
                        
                        {/* Mobile Navigation Items */}
                        {menuItems.map((item) => (
                            <div key={item.path} className="space-y-1">
                                <button
                                    onClick={() => setActiveSubmenu(activeSubmenu === item.path ? null : item.path)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-300
                                        ${isActive(item.path)
                                            ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                                            : 'text-[var(--text-primary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5'
                                        }`}
                                >
                                    <span>{item.label}</span>
                                    {item.submenu && (
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-200 ${activeSubmenu === item.path ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </button>
                                {item.submenu && (
                                    <div className={`pl-4 space-y-1 overflow-hidden transition-all duration-200 ${activeSubmenu === item.path ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}>
                                        {item.submenu.map((subItem) => (
                                            <Link
                                                key={subItem.path}
                                                to={subItem.path}
                                                className="block px-3 py-2 text-sm text-gray-400 hover:text-[var(--accent)] 
                                                         rounded-lg transition-colors duration-300 hover:bg-[var(--accent)]/5"
                                            >
                                                {subItem.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Mobile Notifications Link (only for logged in users) */}
                        {token && (
                            <Link
                                to="/notifications"
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300
                                      ${isActive('/notifications')
                                        ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                                        : 'text-[var(--text-primary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5'
                                    }`}
                            >
                                <FaBell />
                                <span>Notifications</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Login/Signup or Profile Options */}
                    {!token ? (
                        <div className="px-2 pt-4 pb-3 space-y-2 border-t border-gray-800/50">
                            <Link
                                to="/login"
                                className="block w-full px-3 py-2 text-center text-gray-300 
                                         hover:text-purple-400 rounded-lg transition-colors duration-300"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="block w-full px-3 py-2 text-center bg-purple-500 
                                         text-white rounded-lg hover:bg-purple-600 
                                         transition-colors duration-300"
                            >
                                Sign Up
                            </Link>
                        </div>
                    ) : (
                        <div className="px-2 pt-4 pb-3 space-y-2 border-t border-gray-800/50">
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 px-3 py-2 text-gray-300 
                                         hover:text-purple-400 rounded-lg transition-colors duration-300"
                            >
                                <FaUserCircle />
                                <span>Profile</span>
                            </Link>
                            <Link
                                to="/settings"
                                className="flex items-center gap-2 px-3 py-2 text-gray-300 
                                         hover:text-purple-400 rounded-lg transition-colors duration-300"
                            >
                                <FaCog />
                                <span>Settings</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 text-red-400 
                                         hover:text-red-300 rounded-lg transition-colors duration-300"
                            >
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;