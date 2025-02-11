import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import AnimeCard1 from '../components/AnimeCard1';

interface UserProfile {
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

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchProfile();
        fetchWatchlist();
    }, [token, navigate]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Profile Header */}
                <div className="bg-[var(--bg-secondary)] rounded-lg p-6 mb-8 shadow-lg">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Profile Image */}
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500/50">
                            <img
                                src={`http://localhost:3000/assets/${profile?.profile} ` || 'default-avatar.jpg'}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {profile?.name || 'Username'}
                            </h1>
                            <p className="text-gray-400">
                                {profile?.email || 'email@example.com'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Joined {new Date(profile?.createdAt || '').toLocaleDateString()}
                            </p>
                        </div>

                        {/* Edit Button */}
                        <button
                            onClick={() => navigate('/settings')}
                            className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg 
                                         hover:bg-purple-500/30 transition-colors duration-300"
                        >
                            <FaEdit className="inline-block mr-2" />
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Stats/Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Watchlist', value: watchlist.length },
                        { label: 'Completed', value: '0' },
                        { label: 'Favorites', value: '0' }
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="bg-[var(--bg-secondary)] p-4 rounded-lg shadow-lg"
                        >
                            <h3 className="text-gray-400 text-sm mb-1">{stat.label}</h3>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
            {
                watchlist.length > 0 ? (
                    <div className="max-w-7xl mt-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Watchlist</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {watchlist.map((item) => (
                                <AnimeCard1
                                    key={item.id}
                                    id={item.AnimeId}
                                    english_title={item.English_Title}
                                    japanese_title={item.Japanese_Title}
                                    image_url={item.Image_url}
                                    synopsis={item.synopsis}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto text-center text-gray-400">
                        <p>Your watchlist is empty</p>
                    </div>
                )
            }
        </div>
    );

};

export default Profile;