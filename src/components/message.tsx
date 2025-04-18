import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface Friend {
    id: number;
    name: string;
    profile?: string;
    status: 'online' | 'offline';
    lastMessage?: string;
    lastMessageTime?: string;
}

const MessagesTab = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token');

    const fetchFriends = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/api/friend/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setFriends(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching friends:', error);
            setError('Failed to load friends');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                    onClick={fetchFriends}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {friends.length > 0 ? (
                friends.map((friend) => (
                    <Link to={`/chat/${friend.id}`} key={friend.id}>
                        <div
                            className="bg-[var(--bg-secondary)] p-4 rounded-lg hover:bg-[var(--bg-secondary)]/80 
                                     transition-colors cursor-pointer flex items-center gap-4 mb-2"
                        >
                            <div className="relative">
                                {friend.profile ? (
                                    <img
                                        src={`${friend.profile}`}
                                        alt={friend.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://www.gravatar.com/avatar/default?d=mp';
                                        }}
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <FaUserCircle className="text-3xl text-purple-500" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-white font-medium">{friend.name}</h3>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full 
                                  flex items-center justify-center mx-auto mb-4">
                        <FaUserCircle className="text-3xl text-purple-500" />
                    </div>
                    <h3 className="text-white font-medium mb-2">No Friends Yet</h3>
                    <p className="text-gray-400">
                        Start connecting with other anime enthusiasts!
                    </p>
                </div>
            )}
        </div>
    );
};

export default MessagesTab;