import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
            <div className="text-center">
                {/* Glitch Effect Text */}
                <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text 
                             bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600
                             animate-gradient bg-size-200 mb-4">
                    404
                </h1>
                
                {/* Japanese Text */}
                <p className="text-lg md:text-xl text-gray-400 mb-2 font-semibold">
                    ページが見つかりません
                </p>
                
                {/* English Text */}
                <p className="text-xl md:text-2xl text-[var(--text-primary)] mb-8">
                    Looks like this page got isekai'd to another world!
                </p>

                {/* Anime-style Button */}
                <Link 
                    to="/"
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-[var(--accent)] 
                             text-white font-medium transition-all duration-300
                             hover:bg-purple-600 transform hover:-translate-y-1 hover:shadow-lg 
                             hover:shadow-purple-500/25 active:translate-y-0"
                >
                    <svg 
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                        />
                    </svg>
                    Return to Homepage
                </Link>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                              w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                              w-48 h-48 bg-pink-500/10 rounded-full blur-3xl -z-10" />
            </div>
        </div>
    );
};

export default NotFoundPage;