import { useState, useEffect } from 'react';
import axios from 'axios';

const RecommendationPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token');

    const fetchRecommendations = async () => {
        console.log(token);
        if(!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await axios.get('http://localhost:3000/api/watchlist/recommendation', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            console.log('Recommendations:', response.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            setError('Failed to load recommendations');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
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
                        onClick={fetchRecommendations}
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
                <h1 className="text-3xl font-bold text-white mb-8">
                    Recommended for You
                </h1>
                {/* Content will be added later */}
            </div>
        </div>
    );
};

export default RecommendationPage;     