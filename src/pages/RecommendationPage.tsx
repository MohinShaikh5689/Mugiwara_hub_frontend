import { useState, useEffect } from 'react';
import axios from 'axios';
import AnimeCard1 from '../components/AnimeCard1';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '../components/Corousal';

const quotes = [
  { quote: "I'm not a pervert, I'm a super pervert!", anime: "Excel Saga" },
  { quote: "People’s lives don’t end when they die, it ends when they lose faith.", anime: "Naruto" },
  { quote: "If you don’t take risks, you can’t create a future!", anime: "Attack on Titan" },
  { quote: "Sometimes you must hurt in order to know, fall in order to grow, lose in order to gain.", anime: "Fullmetal Alchemist" },
  { quote: "It’s not the face that makes someone a monster, it’s the choices they make with their lives.", anime: "Naruto" },
  { quote: "The world’s not perfect, but it’s there for us trying the best it can. That’s what makes it so damn beautiful.", anime: "Roy Mustang" },
    { quote: "The world is full of nice people. If you can’t find one, be one.", anime: "Haikyuu" },
    { quote: "If you have time to think of a beautiful end, then live beautifully until the end.", anime: "Gintama" },
    { quote: "The only way to deal with fear is to face it head on.", anime: "One Piece" },
    { quote: "The world is not beautiful, therefore it is.", anime: "Kino's Journey" },
    { quote: "The world is full of things that don’t go as you wish. The longer you live, the more you realize reality is just made of pain, suffering, and emptiness.", anime: "Naruto" },
    { quote: "Pirates are evil? The Marines are righteous? These terms have always changed throughout the course of history! Kids who have never seen peace and kids who have never seen war have different values! Those who stand at the top determine what's wrong and what's right!", anime: "One Piece" }
];



const RecommendationPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [trending, setTrending] = useState<any[]>([]);
    const [airing, setAiring] = useState<any[]>([]);
    const [topMovies, setTopMovies] = useState<any[]>([]);
    const [randomQuote, setRandomQuote] = useState<{ quote: string; anime: string }>({ quote: '', anime: '' });
    const token = localStorage.getItem('token');

    function getCurrentSeason() {
        const month = new Date().getMonth() + 1; // Get current month (1-12)
        let season;
    
        if (month >= 1 && month <= 3) {
            season = "winter";
        } else if (month >= 4 && month <= 6) {
            season = "spring";
        } else if (month >= 7 && month <= 9) {
            season = "summer";
        } else {
            season = "fall";
        }
    
        return season;
    }
    
    const fetchRecommendations = async () => {
        console.log(token);
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await axios.get('http://localhost:3000/api/watchlist/recommendation', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            console.log('Recommendations:', response.data);
            setRecommendations(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setIsLoading(false);
        }
    };

    const seasonal = async () => {
        const year = new Date().getFullYear(); // Get current year
        const season = getCurrentSeason(); // Get current season dynamically
        try {
            const response = await axios.get<any>(`https://api.jikan.moe/v4/seasons/${year}/${season}`);

            console.log('Trending:', response.data.data);
            setTrending(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching trending:', error);
            setError('Failed to load trending');
            setIsLoading(false);
        }
    };

    const fetchAring = async () => {
        try {
            const response = await axios.get('https://api.jikan.moe/v4/top/anime?filter=airing&limit=10');

            console.log('Airing:', response.data.data);
            setAiring(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching airing:', error);
            setError('Failed to load airing');
            setIsLoading(false);
        }
    };

    const fetchTopMovies = async () => {
        try {
            const response = await axios.get('https://api.jikan.moe/v4/top/anime?type=movie&page=2&limit=10');

            console.log('Top Movies:', response.data.data);
            setTopMovies(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching top movies:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        seasonal();
        fetchAring();
        fetchRecommendations();
        fetchTopMovies();
        // Set a random quote from our static list
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setRandomQuote(quotes[randomIndex]);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] pt-20 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Existing sections */}
                <h1 className="text-3xl font-bold text-white mb-8">Recommended for You</h1>
                {recommendations.length === 0 ? (
                    <p className="text-white">Loading.......</p>
                ) : (
                    <Carousel 
                        className="w-full"
                        opts={{
                            align: 'start',
                            containScroll: 'trimSnaps',
                            dragFree: true,
                            skipSnaps: false
                        }}
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {recommendations.map((item, index) => (
                                <CarouselItem
                                    className="pl-2 md:pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6"
                                    key={index}
                                >
                                    <div className="w-full h-[350px] sm:h-[400px] md:h-[450px]">
                                        <AnimeCard1
                                            id={index}
                                            english_title={item.English_Title}
                                            image_url={item.Image_url}
                                            synopsis={item.synopsis}
                                            japanese_title={item.Japanese_Title}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex" > </CarouselPrevious>
                        <CarouselNext className="hidden md:flex" > </CarouselNext>
                    </Carousel>
                )}

                <h1 className="text-3xl font-bold text-white mt-12 mb-8">Airing</h1>
                <Carousel 
                    className="w-full"
                    opts={{
                        align: 'start',
                        containScroll: 'trimSnaps',
                        dragFree: true,
                        skipSnaps: false
                    }}
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {airing.map((item) => (
                            <CarouselItem
                                className="pl-2 md:pl-4 basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                                key={item.id}
                            >
                                <div className="w-full h-[350px] sm:h-[400px] md:h-[450px]">
                                    <AnimeCard1
                                        id={item.mal_id}
                                        english_title={item.title_english}
                                        image_url={item.images.jpg.image_url}
                                        synopsis={item.synopsis}
                                        japanese_title={item.title}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" > </CarouselPrevious>
                    <CarouselNext className="hidden md:flex" > </CarouselNext>
                </Carousel>

                <h1 className="text-3xl font-bold text-white mt-12 mb-8">Seasonal</h1>
                <Carousel 
                    className="w-full"
                    opts={{
                        align: 'start',
                        containScroll: 'trimSnaps',
                        dragFree: true,
                        skipSnaps: false
                    }}
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {trending.map((item) => (
                            <CarouselItem
                                className="pl-2 md:pl-4 basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                                key={item.id}
                            >
                                <div className="w-full h-[350px] sm:h-[400px] md:h-[450px]">
                                    <AnimeCard1
                                        id={item.mal_id}
                                        english_title={item.title_english}
                                        image_url={item.images.jpg.image_url}
                                        synopsis={item.synopsis}
                                        japanese_title={item.title}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" > </CarouselPrevious>
                    <CarouselNext className="hidden md:flex" > </CarouselNext>
                </Carousel>

                <h1 className="text-3xl font-bold text-white mt-12 mb-8">Top Movies</h1>
                <Carousel 
                    className="w-full"
                    opts={{
                        align: 'start',
                        containScroll: 'trimSnaps',
                        dragFree: true,
                        skipSnaps: false
                    }}
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {topMovies.map((item) => (
                            <CarouselItem
                                className="pl-2 md:pl-4 basis-1/3 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                                key={item.id}
                            >
                                <div className="w-full h-[350px] sm:h-[400px] md:h-[450px]">
                                    <AnimeCard1
                                        id={item.mal_id}
                                        english_title={item.title_english}
                                        image_url={item.images.jpg.image_url}
                                        synopsis={item.synopsis}
                                        japanese_title={item.title}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" > </CarouselPrevious>
                    <CarouselNext className="hidden md:flex" > </CarouselNext>
                </Carousel>

                {/* New Fun Section: Quote of the Day */}
                <h1 className="text-3xl font-bold text-white mt-12 mb-8">Quote of the Day</h1>
                <div className="bg-purple-600 p-6 rounded-lg mb-12">
                    <p className="text-white italic text-xl">"{randomQuote.quote}"</p>
                    <p className="text-right text-white mt-4">- {randomQuote.anime}</p>
                </div>
            </div>
        </div>
    );
}

export default RecommendationPage;
