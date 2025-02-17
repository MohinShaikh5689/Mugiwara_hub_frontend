import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaUserPlus, FaCheck, FaClock, FaFilm } from 'react-icons/fa';
import AnimeCard1 from '../components/AnimeCard1';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    profile?: string;
    createdAt: string;
    friendStatus?: 'none' | 'pending' | 'accepted';
}

interface WatchlistItem {
    AnimeId: number;
    English_Title: string;
    Japanese_Title: string;
    Image_url: string;
    synopsis: string;
}

const VisitPage = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [friendRequestStatus, setFriendRequestStatus] = useState<'none' | 'pending' | 'accepted'>('none');
    const token = localStorage.getItem('token');

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setProfile(response.data.user);
            setFriendRequestStatus(response.data.isFriend.status.toLowerCase());
            
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const fetchWatchlist = async () => {
        setWatchlist([]);
        try {
            const response = await axios.get(`http://localhost:3000/api/watchlist/${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log(response.data);
            setWatchlist(response.data);
        } catch (error) {
            console.error('Error fetching watchlist:', error);
        }
    };

    const sendFriendRequest = async () => {
        try {
            await axios.post(`http://localhost:3000/api/friend/add`, {
                receiverId: userId
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setFriendRequestStatus('pending');
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchWatchlist();
    }, [userId]);

    if (!profile) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-16">
            {/* Hero Section - Adjusted for mobile */}
            <div className="relative min-h-[50vh] sm:h-[40vh] bg-gradient-to-b from-purple-600/20 to-[var(--bg-primary)]">
                <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
                        {/* Profile Image - Centered on mobile */}
                        <div className="flex justify-center sm:justify-start">
                            <img
                                src={profile.profile ? `http://localhost:3000/assets/${profile.profile}` : '/default-avatar.png'}
                                alt={profile.name}
                                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-purple-500/50 object-cover"
                            />
                        </div>

                        {/* Profile Info - Centered on mobile */}
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                                Hi, I'm {profile.name}!
                            </h1>
                            <p className="text-base sm:text-lg text-gray-300">
                                Joined {new Date(profile.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Friend Button - Full width on mobile */}
                        <button
                            onClick={sendFriendRequest}
                            disabled={friendRequestStatus !== 'none'}
                            className={`w-full sm:w-auto px-6 py-3 rounded-lg flex items-center justify-center gap-2 
                                ${friendRequestStatus === 'none' 
                                    ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                                    : friendRequestStatus === 'pending'
                                    ? 'bg-yellow-500/20 text-yellow-400 cursor-not-allowed'
                                    : 'bg-green-500/20 text-green-400 cursor-not-allowed'}`}
                        >
                            {friendRequestStatus === 'none' && (
                                <>
                                    <FaUserPlus />
                                    <span>Add Friend</span>
                                </>
                            )}
                            {friendRequestStatus === 'pending' && (
                                <>
                                    <FaClock />
                                    <span>Request Pending</span>
                                </>
                            )}
                            {friendRequestStatus === 'accepted' && (
                                <>
                                    <FaCheck />
                                    <span>Friends</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Section - Adjusted grid for mobile */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">
                    Watchlist
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {watchlist.length > 0 ? watchlist.map((item) => (
                        <AnimeCard1 
                            key={item.AnimeId} 
                            id={item.AnimeId}
                            english_title={item.English_Title}
                            japanese_title={item.Japanese_Title}
                            image_url={item.Image_url}
                            synopsis={item.synopsis}
                        />
                    )) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
                            <div className="bg-purple-500/10 rounded-full p-6 mb-4">
                                <FaFilm className="text-4xl text-purple-400" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                                No Anime Added Yet
                            </h3>
                            <p className="text-gray-400 text-center max-w-md">
                                {profile.name} hasn't added any anime to their watchlist yet.
                                Check back later to see what they're watching!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisitPage;