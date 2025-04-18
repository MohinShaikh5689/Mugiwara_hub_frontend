import AnimeCard from "../components/AnimeCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaLessThan, FaGreaterThan } from "react-icons/fa";
import { useParams, useSearchParams } from 'react-router-dom';

interface Anime {
    id: number;
    image_url: string;
    english_title: string;
    japanese_title: string;
    synopsis: string;
    episodes: number;
    rating: number;
}

interface HomeProps {
    filter?: 'trending' | 'popular' | 'upcoming' | 'airing';
}

const Home = ({ filter }: HomeProps) => {    
    const { genreId } = useParams<{ genreId: string }>();
    const [searchParams] = useSearchParams();
    const genreName = searchParams.get('name');
    
    const [anime, setAnime] = useState<Anime[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [showPage, setShowPage] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [hasPrevPage, setHasPrevPage] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const nextPage = () => {
        if (hasNextPage) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
            setHasNextPage(true);
        }
    };
    
    const fetchAnime = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setAnime([]); // Clear previous anime before new fetch
            
            let url = 'https://api.jikan.moe/v4';
            
            if (filter) {
                switch (filter) {
                    case 'trending':
                        url += `/top/anime?page=${page}`;
                        break;
                    case 'popular':
                        url += `/top/anime?filter=bypopularity&page=${page}`;
                        break;
                    case 'upcoming':
                        url += `/seasons/upcoming?page=${page}`;
                        break;
                    case 'airing':
                        url += `/top/anime?filter=airing&page=${page}`;
                        break;
                }
            } else if (genreId) {
                // Changed from genre to genreId
                url += `/anime?genres=${genreId}&page=${page}`;
            } else {
                url += '/top/anime';
            } 
            
            console.log("Fetching URL:", url);
            const response = await axios.get(url);
            const mappedAnime = response.data.data.map((item: any) => ({
                id: item.mal_id,
                image_url: item.images.jpg.image_url,
                english_title: item.title_english || item.title,
                japanese_title: item.titles[0].title,
                synopsis: item.synopsis,
                episodes: item.episodes,
                rating: item.score
            }));
            
            setAnime(mappedAnime);
            setHasNextPage(response.data.pagination.has_next_page);
            setHasPrevPage(page > 1);
            setShowPage(true);
            scrollToTop();

        } catch (error) {
            console.error('Error fetching anime:', error);
            setError('Failed to load anime. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnime();
    }, [filter, genreId, page]); 

    useEffect(() => {
        if (filter) {
            setPage(1); // Reset page to 1 when genreId changes
        }
    }, [filter]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button 
                        onClick={fetchAnime}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {(filter || genreId) && (
                <div className="text-left p-4">
                    <h2 className="text-2xl font-semibold text-white">
                        {filter ? `Showing ${filter} Anime` : 
                         genreName ? `Showing ${genreName} Anime` : 
                         `Showing Genre #${genreId} Anime`}
                    </h2>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6">
                {anime.map((anime: Anime) => (
                    <AnimeCard key={anime.id} anime={anime} />
                ))}

                {showPage && (
                    <div className="col-span-full flex justify-center items-center mt-4 gap-4">
                        <button 
                            onClick={prevPage} 
                            disabled={!hasPrevPage}
                            className={`p-2 rounded-lg transition-all duration-300 ${
                                hasPrevPage 
                                    ? 'bg-[var(--bg-secondary)] hover:bg-purple-500/20 text-gray-400 hover:text-purple-400' 
                                    : 'bg-[var(--bg-secondary)]/50 text-gray-600 cursor-not-allowed'
                            }`}
                        > 
                            <FaLessThan/>
                        </button>
                        <span className="text-gray-400">{page}</span>
                        <button 
                            onClick={nextPage}
                            disabled={!hasNextPage}
                            className={`p-2 rounded-lg transition-all duration-300 ${
                                hasNextPage 
                                    ? 'bg-[var(--bg-secondary)] hover:bg-purple-500/20 text-gray-400 hover:text-purple-400' 
                                    : 'bg-[var(--bg-secondary)]/50 text-gray-600 cursor-not-allowed'
                            }`}
                        > 
                            <FaGreaterThan/>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;