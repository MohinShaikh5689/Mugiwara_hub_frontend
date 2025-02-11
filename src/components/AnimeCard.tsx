import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Anime {
    id: number;
    image_url: string;
    english_title: string;
    japanese_title: string;
    synopsis: string;
    episodes: number; 
    rating: number;
}

const AnimeCard = ({ anime }: { anime: Anime }) => {
    const [isHovered, setIsHovered] = useState(false);

    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/anime/${anime.id}`);
    }

    return (
        <div 
            className="relative bg-gray-900/90 rounded-xl shadow-lg overflow-hidden transition-all duration-300 
                       transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/30 
                       hover:bg-gray-800/90 w-full sm:max-w-[240px] md:max-w-[260px] lg:max-w-[280px] 
                       border border-gray-800/50 backdrop-blur-sm"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
        >
            {/* Image Container */}
            <div className="relative h-[200px] sm:h-[260px] md:h-[280px] lg:h-[320px] overflow-hidden group">
                <img 
                    src={anime.image_url} 
                    alt={anime.english_title} 
                    className="w-full h-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"/>
                
                {/* Rating Badge - Responsive positioning and size */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-1.5 sm:px-2 py-0.5 sm:py-1 
                              bg-purple-500/80 backdrop-blur-sm rounded-lg">
                    <span className="text-white text-xs sm:text-sm font-medium flex items-center">
                        <span className="mr-1 animate-pulse">★</span> {anime.rating}
                    </span>
                </div>

                {/* Japanese Title - Responsive text size */}
                <div className={`absolute left-2 sm:left-3 bottom-2 sm:bottom-3 transition-all duration-300 transform
                                ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <span className="text-xs sm:text-sm text-gray-400 font-medium">
                        {anime.japanese_title}
                    </span>
                </div>
            </div>
            
            {/* Content Section */}
            <div className="p-3 sm:p-4">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-1">
                    {anime.english_title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
                    {anime.synopsis}
                </p>
                
                {/* Like Button - Responsive sizing */}
                <div className="flex justify-end mt-2 sm:mt-4">
                    <button className="p-1.5 sm:p-2 text-purple-400 hover:text-purple-300 rounded-full 
                                     hover:bg-purple-600/10 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                             className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" 
                             fill="none" 
                             viewBox="0 0 24 24" 
                             stroke="currentColor">
                            <path strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Episodes Badge - Responsive positioning and size */}
            <div className="absolute top-2 sm:top-3 right-2 sm:right-3 px-1.5 sm:px-2 py-0.5 sm:py-1 
                          bg-gray-900/80 backdrop-blur-sm rounded-lg">
                <span className="text-xs sm:text-sm text-gray-300">
                    {anime.episodes ? `${anime.episodes} EP` : 'N/A'}
                </span>
            </div>
        </div>
    );
};

export default AnimeCard;