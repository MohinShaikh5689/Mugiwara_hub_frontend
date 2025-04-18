import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaBookmark, FaCheck } from 'react-icons/fa';
import CommentComponent from "../components/commentComponent";


interface AnimeDetails {
    id: number;
    title: string;
    japanese_title: string;
    synopsis: string;
    episodes: number;
    rating: number;
    genres: string[];
    studio: string;
    image: string;
    duration: string;
    demographics: string[];
    trailer?: string;
}

const AnimeDetailPage = () => {
    const { id } = useParams();
    const [details, setDetails] = useState<AnimeDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const token = localStorage.getItem('token');

    const ScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const checkWatchlist = async () => {
        const isInWatchlist = await axios.post('http://localhost:3000/api/watchlist/check', {
            AnimeId: id
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        });
        console.log(isInWatchlist.data);

        if (isInWatchlist.data === 'True') {
            setIsInWatchlist(true);
        } else {
            setIsInWatchlist(false);
        }
    };

    const fetchAnimeDetails = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`);


            const data = response.data.data;
            console.log(data);

            setDetails({
                id: data.mal_id,
                title: data.title_english || data.title,
                japanese_title: data.titles[0].title,
                synopsis: data.synopsis,
                episodes: data.episodes,
                rating: data.score,
                genres: data.genres.map((g: any) => g.name),
                studio: data.studios[0]?.name || 'Unknown',
                image: data.images.jpg.large_image_url,
                duration: data.duration,
                demographics: data.demographics.map((d: any) => d.name),
                trailer: data.trailer?.embed_url
            });
            
        } catch (error) {
            setError('Failed to load anime details. Please try again later.');
            console.error('Error fetching anime details:', error);
        } finally {
            setIsLoading(false);
            
        }
    };

    const addToWatchlist = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/watchlist/add', {
                AnimeId: details?.id,
                English_Title: details?.title,
                Japanese_Title: details?.japanese_title,
                Image_url: details?.image,
                synopsis: details?.synopsis,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                withCredentials: true
            });
            console.log(response.data);
            setIsInWatchlist(true);
        } catch (error) {
            console.error('Error adding to watchlist:', error);

        }
    };

    useEffect(() => {
        checkWatchlist();
    }, [details]);

    useEffect(() => {
        fetchAnimeDetails();
        ScrollToTop();
    }, [id]);

    const handleWatchlistToggle = () => {
        if (!isInWatchlist) {
            addToWatchlist();
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    if (error || !details) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={fetchAnimeDetails}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg 
                                 hover:bg-purple-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-20">
            {/* Hero Section */}
            <div className="relative h-[58vh] overflow-hidden">
                {/* Background Image with Blur */}
                <div
                    className="absolute inset-0 bg-cover bg-center blur-md opacity-30"
                    style={{ backgroundImage: `url(${details.image})` }}
                />

                {/* Content */}
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end h-full pb-8">
                        {/* Anime Image */}
                        <div className="hidden sm:block w-48 lg:w-64 rounded-lg overflow-hidden shadow-2xl 
                                      transform -translate 0-1/4">
                            <img
                                src={details.image}
                                alt={details.title}
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Title and Basic Info */}
                        <div className="flex-1 ml-0 sm:ml-8">
                            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                                {details.title}
                            </h1>
                            <p className="text-gray-400 text-lg mb-4">
                                {details.japanese_title}
                            </p>
                            <div className="flex items-center gap-4">
                                <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-400">
                                    {details.episodes} Episodes
                                </span>
                                <span className="flex items-center text-yellow-400">
                                    <span className="mr-1">★</span> {details.rating}
                                </span>
                                {/* Add Watchlist Button */}
                                <button
                                    onClick={handleWatchlistToggle}
                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-300
                                        ${isInWatchlist
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'}`}
                                >
                                    {isInWatchlist ? (
                                        <>
                                            <FaCheck className="text-sm" />
                                            <span>Added to Watchlist</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaBookmark className="text-sm" />
                                            <span>Add to Watchlist</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-white mb-4">Synopsis</h2>
                        <p className="text-gray-300 leading-relaxed mb-8">
                            {details.synopsis}
                        </p>

                        {/* Additional Details */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-[var(--bg-secondary)]">
                                <h3 className="text-gray-400 text-sm mb-1">Studio</h3>
                                <p className="text-white">{details.studio}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-[var(--bg-secondary)]">
                                <h3 className="text-gray-400 text-sm mb-1">Duration</h3>
                                <p className="text-white">{details.duration}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-[var(--bg-secondary)]">
                                <h3 className="text-gray-400 text-sm mb-1">Demographics</h3>
                                <p className="text-white">{details.demographics}</p>
                            </div>
                        </div>

                        {details.trailer && (
                            <div className="col-span-full mt-8">
                                <h2 className="text-2xl font-bold text-white mb-4">Trailer</h2>
                                <div className="relative w-full overflow-hidden rounded-lg aspect-video">
                                    <iframe
                                        src={details.trailer}
                                        title={`${details.title} Trailer`}
                                        className="absolute inset-0 w-full h-full"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <h2 className="text-2xl font-bold text-white mb-4">Genres</h2>
                            <div className="flex flex-wrap gap-2">
                                {details.genres.map((genre, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 rounded-full bg-[var(--bg-secondary)] text-gray-300
                                                 hover:bg-purple-500/20 hover:text-purple-400 transition-colors"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Comments Section */}    
            <div className="mb-12"> {/* Added margin-bottom */}
                <CommentComponent animeId={Number(id)} />
            </div>
        </div>
    );
};

export default AnimeDetailPage;