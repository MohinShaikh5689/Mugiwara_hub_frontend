import { useEffect, useState } from 'react';

import AnimeCard from '../components/AnimeCard';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SearchResults = () => {

    const [result, setResult] = useState<any[]>([]);
    const { query } = useParams<{ query: string }>();

    const fetchSearchResults = async () => {
      
        setResult([]); // Reset results before new search
        
        try {
            const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}`);
            const mappedResults = response.data.data.map((item: any) => ({
                id: item.mal_id,
                english_title: item.title,
                japanese_title: item.titles[0].title,
                image_url: item.images.jpg.image_url,
                synopsis: item.synopsis,
                episodes: item.episodes,
                rating: item.score,
            }));
            setResult(mappedResults);
        } catch (error) {
            console.error(error);
        } 
    };

    useEffect(() => {
        fetchSearchResults();
        console.log(query);
    }, [query]); // Only depend on searchQuery

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.h1
                        className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 
                       bg-clip-text text-transparent mb-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Search Results
                    </motion.h1>
                    <motion.p
                        className="text-gray-400 text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Found {result.length} results for "{query}"
                    </motion.p>
                </div>

                {/* Results Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    initial="hidden"
                    animate="show"
                >
                    {result.length > 0 ? (
                        result.map((anime) => (
                            <motion.div
                                key={anime.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 }
                                }}
                            >
                                <AnimeCard anime={anime} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-12">
                            <p className="text-gray-400 text-lg mb-4">No results found</p>
                            <p className="text-gray-500">Try adjusting your search terms</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default SearchResults;