import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPlay, FaDiscord, FaHeart } from 'react-icons/fa';

const LandingPage = () => {

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                <motion.div 
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"
                    animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Hero Section */}
            <div className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        {/* Text Content */}
                        <motion.div 
                            className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1>
                                <motion.span 
                                    className="block text-sm font-semibold text-purple-400 tracking-wide uppercase"
                                    animate={{ 
                                        y: [0, -5, 0],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{ 
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    Welcome to
                                </motion.span>
                                <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                                    <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 
                                                   bg-clip-text text-transparent bg-size-200 animate-gradient">
                                        Mugiwara Hub
                                    </span>
                                </span>
                            </h1>
                            <p className="mt-3 text-base text-gray-400 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                Dive into the world of anime with our extensive collection. Watch, share, and connect with 
                                fellow otaku in our vibrant community!
                            </p>
                            
                            {/* CTA Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link 
                                        to="/signup"
                                        className="group flex items-center px-8 py-3 text-base font-medium rounded-lg
                                                 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white
                                                 transition-all duration-300 transform hover:shadow-lg hover:shadow-purple-500/25"
                                    >
                                        <FaPlay className="mr-2 group-hover:animate-pulse" />
                                        Start Watching
                                    </Link>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link 
                                        to="/community"
                                        className="group flex items-center px-8 py-3 text-base font-medium rounded-lg
                                                 border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10
                                                 transition-all duration-300"
                                    >
                                        <FaDiscord className="mr-2 group-hover:animate-bounce" />
                                        Join Community
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Hero Image */}
                        <motion.div 
                            className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 
                                     lg:col-span-6 lg:flex lg:items-center"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className="relative mx-auto w-full">
                                <motion.div
                                    className="relative rounded-lg overflow-hidden shadow-2xl"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img
                                        className="w-full"
                                        src="/assets/anw-min.webp"
                                        alt="Anime Collection"
                                    />
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                                                 mix-blend-overlay"
                                        animate={{ opacity: [0.5, 0.7, 0.5] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Features Grid */}
                <motion.div 
                    className="max-w-7xl mx-auto mt-24 px-4 sm:mt-32"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                icon: <FaPlay className="text-purple-400" />,
                                title: "Vast Collection",
                                description: "Stream thousands of anime titles from classics to latest releases."
                            },
                            {
                                icon: <FaHeart className="text-purple-400" />,
                                title: "Personalized",
                                description: "Get custom recommendations based on your watching history."
                            },
                            {
                                icon: <FaDiscord className="text-purple-400" />,
                                title: "Active Community",
                                description: "Connect with fellow anime fans and join discussions."
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="relative rounded-2xl border border-gray-800 bg-[var(--bg-secondary)]/30 
                                         p-6 backdrop-blur-sm group hover:border-purple-500/50"
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-2xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-medium text-purple-400 mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;