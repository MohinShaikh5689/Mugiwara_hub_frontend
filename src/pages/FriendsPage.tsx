import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserFriends, FaUser } from 'react-icons/fa';

interface Friend {
    id: number;
    name: string;
    profile?: string;
    friendshipCreatedAt: string;
}

const FriendsPage = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token');

    const fetchFriends = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/friend/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setFriends(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
            setError('Failed to load friends list');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
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
                        onClick={fetchFriends}
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
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <FaUserFriends className="text-3xl text-purple-500" />
                    <h1 className="text-3xl font-bold text-white">Friends List</h1>
                </div>

                {friends.length > 0 ? (
                    <div className="space-y-4">
                        {friends.map((friend) => (
                            <Link 
                                key={friend.id}
                                to={`/users/${friend.id}`}
                                className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-lg 
                                         hover:bg-purple-500/10 transition-colors"
                            >
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-purple-500/20 flex-shrink-0">
                                    {friend.profile ? (
                                        <img 
                                            src={`http://localhost:3000/assets/${friend.profile}`}
                                            alt={friend.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FaUser className="text-purple-400 text-2xl" />
                                        </div>
                                    )}
                                </div>
                                
                                <div>
                                    <h2 className="text-xl font-semibold text-white">{friend.name}</h2>
                                    <p className="text-sm text-gray-400">
                                        Friends since {new Date(friend.friendshipCreatedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="bg-purple-500/10 rounded-full p-6 inline-block mb-4">
                            <FaUserFriends className="text-4xl text-purple-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">No Friends Yet</h2>
                        <p className="text-gray-400">
                            Visit the community page to find and add new friends!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FriendsPage;