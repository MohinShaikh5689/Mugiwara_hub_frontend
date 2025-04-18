import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface AnimeCardProps {
    id: number;
    english_title: string;
    japanese_title: string;
    image_url: string;
    synopsis: string;
}

const AnimeCard1 = ({ id, english_title, japanese_title, image_url, synopsis }: AnimeCardProps) => {
    return (
        <motion.div
            className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/10 
                      w-[45vw] sm:w-full mx-auto" // Slightly increased width for mobile
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Link 
                to={`/anime/${id}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <div className="relative group">
                    {/* Image Container - Reduced height */}
                    <div className="h-[250px] sm:h-[300px] overflow-hidden"> 
                        <img
                            src={image_url}
                            alt={english_title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                    </div>
                    
                    {/* Content Container - Reduced padding */}
                    <div className="p-2 sm:p-4">
                        <h2 className="text-base sm:text-lg font-semibold text-white mb-1 truncate">
                            {english_title}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2 truncate">
                            {japanese_title}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                            {synopsis}
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default AnimeCard1;