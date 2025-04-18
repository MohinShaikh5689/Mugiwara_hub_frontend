import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaFilm, FaUserFriends, FaTrash, FaSpinner } from 'react-icons/fa';
import AnimeCard1 from '../components/AnimeCard1';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    profile: string;
    createdAt: string;
}

interface WatchlistItem {
    id: number;
    English_Title: string;
    Japanese_Title: string;
    Image_url: string;
    synopsis: string;
    AnimeId: number;
}

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const token = localStorage.getItem('token');

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProfile(response.data);
            console.log(response.data);
            console.log(token);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchWatchlist = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/watchlist', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            setWatchlist(response.data);
        } catch (error) {
            console.error('Error fetching watchlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteFromWatchlist = async (id: number) => {
        setDeletingId(id);
        setDeleteError(null);
        
        try {
            await axios.delete('http://localhost:3000/api/watchlist/delete', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    AnimeId: id
                }
            });
            
            // Remove the item from the state
            setWatchlist(current => current.filter(item => item.id !== id));
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            setDeleteError('Failed to remove from watchlist. Please try again.');
            
            // Clear error after 3 seconds
            setTimeout(() => setDeleteError(null), 3000);
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchProfile();
        fetchWatchlist();
    }, [token, navigate, deletingId]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-16">
            {/* Hero Section with Gradient */}
            <div className="relative min-h-[50vh] sm:h-[40vh] bg-gradient-to-b from-purple-600/20 to-[var(--bg-primary)]">
                <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
                        {/* Profile Image */}
                        <div className="flex justify-center sm:justify-start">
                            <img
                                src={`${profile?.profile}` || '/default-avatar.png'}
                                alt={profile?.name}
                                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-purple-500/50 object-cover"
                            />
                        </div>

                        {/* Welcome Message */}
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                                Welcome back, {profile?.name}!
                            </h1>
                            <div className="flex flex-col sm:flex-row gap-2 text-gray-300 text-sm sm:text-base">
                                <span>{profile?.email}</span>
                                <span className="hidden sm:inline">•</span>
                                <span>Member since {new Date(profile?.createdAt || '').toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => navigate('/friends')}
                                className="w-full sm:w-auto px-6 py-3 bg-purple-500 text-white rounded-lg 
                                     hover:bg-purple-600 transition-colors duration-300 flex items-center 
                                     justify-center gap-2 order-1 sm:order-none"
                            >
                                <FaUserFriends />
                                <span>Friends</span>
                            </button>

                            <button
                                onClick={() => navigate('settings')}
                                className="w-full sm:w-auto px-6 py-3 bg-purple-500/20 text-purple-400 rounded-lg 
                                     hover:bg-purple-500/30 transition-colors duration-300 flex items-center 
                                     justify-center gap-2"
                            >
                                <FaEdit />
                                <span>Edit Profile</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Watchlist Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">My Watchlist</h2>
                </div>

                {deleteError && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
                        {deleteError}
                    </div>
                )}

                {watchlist.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {watchlist.map((item) => (
                            <div key={item.id} className="relative group">
                                <AnimeCard1
                                    id={item.AnimeId}
                                    english_title={item.English_Title}
                                    japanese_title={item.Japanese_Title}
                                    image_url={item.Image_url}
                                    synopsis={item.synopsis}
                                />
                                
                                {/* Delete Button */}
                                <button
                                    onClick={() => deleteFromWatchlist(item.AnimeId)}
                                    disabled={deletingId === item.AnimeId}
                                    className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full 
                                             opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                             hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                                             disabled:bg-gray-500 disabled:cursor-not-allowed z-10"
                                    aria-label="Remove from watchlist"
                                >
                                    {deletingId === item.id ? (
                                        <FaSpinner className="animate-spin w-4 h-4" />
                                    ) : (
                                        <FaTrash className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="bg-purple-500/10 rounded-full p-6 inline-block mb-4">
                            <FaFilm className="text-4xl text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Your Watchlist is Empty
                        </h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            Start adding anime to your watchlist to keep track of what you want to watch!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;