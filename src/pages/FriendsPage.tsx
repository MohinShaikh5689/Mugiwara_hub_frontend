import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserFriends, FaUser, FaUserPlus, FaCheck, FaTimes, FaSpinner, FaPlus } from 'react-icons/fa';

interface Friend {
    id: number;
    name: string;
    profile?: string;
    friendshipCreatedAt: string;
}

interface FriendRequest {
    id: number;
    status: string;
    createdAt: string;
    senderId: number;
    sender:{
        name: string;
        profile?: string;
    }
}

const FriendsPage = () => {
    const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
    const [friends, setFriends] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const fetchFriends = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/friend/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setFriends(response.data);
            console.log('Friends:', response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
            setError('Failed to load friends list');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRequests = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://localhost:3000/api/friend/requests', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRequests(response.data);
            console.log('Requests:', response.data);
        } catch (error) {
            console.error('Error fetching friend requests:', error);
            setError('Failed to load friend requests');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'friends') {
            fetchFriends();
        } else {
            fetchRequests();
        }
    }, [activeTab]);

    const handleRequest = async (requestId: number, status:String) => {
        setActionLoading(requestId);
        try {
            await axios.post(`http://localhost:3000/api/friend/request/`, {
                friendId: requestId,
                status: status
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Update requests list
            setRequests(prev => prev.filter(request => request.id !== requestId));
            
            // Refresh friends list
            fetchFriends();
        } catch (error) {
            console.error('Error accepting friend request:', error);
        } finally {
            setActionLoading(null);
        }
    };

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
                        onClick={() => activeTab === 'friends' ? fetchFriends() : fetchRequests()}
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
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <FaUserFriends className="text-3xl text-purple-500" />
                        <h1 className="text-3xl font-bold text-white">Friends</h1>
                    </div>
                    
                    {/* Add Friend Button */}
                    <button
                        onClick={() => navigate('/addfriends')}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg 
                                 hover:bg-purple-600 transition-colors"
                    >
                        <FaPlus size={14} />
                        <span>Add Friend</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-700 mb-6">
                    <button
                        className={`px-4 py-2 font-medium text-sm transition-colors relative ${
                            activeTab === 'friends' 
                                ? 'text-purple-500' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                        onClick={() => setActiveTab('friends')}
                    >
                        <div className="flex items-center gap-2">
                            <FaUserFriends />
                            <span>Friends List</span>
                        </div>
                        {activeTab === 'friends' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500"></div>
                        )}
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm transition-colors relative flex items-center gap-2 ${
                            activeTab === 'requests' 
                                ? 'text-purple-500' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                        onClick={() => setActiveTab('requests')}
                    >
                        <div className="flex items-center gap-2">
                            <FaUserPlus />
                            <span>Friend Requests</span>
                        </div>
                        {requests.length > 0 && (
                            <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                                {requests.length}
                            </span>
                        )}
                        {activeTab === 'requests' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500"></div>
                        )}
                    </button>
                </div>

                {/* Friends List Tab */}
                {activeTab === 'friends' && (
                    <>
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
                                                    src={`${friend.profile}`}
                                                    alt={friend.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = 'https://www.gravatar.com/avatar/default?d=mp';
                                                    }}
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
                                <p className="text-gray-400 mb-6">
                                    Visit the community page to find and add new friends!
                                </p>
                                <button
                                    onClick={() => navigate('/addfriends')}
                                    className="px-6 py-3 bg-purple-500 text-white rounded-lg 
                                           hover:bg-purple-600 transition-colors inline-flex items-center gap-2"
                                >
                                    <FaUserPlus />
                                    <span>Find Friends</span>
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Friend Requests Tab */}
                {activeTab === 'requests' && (
                    <>
                        {requests.length > 0 ? (
                            <div className="space-y-4">
                                {requests.map((request) => (
                                    <div 
                                        key={request.id}
                                        className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-lg"
                                    >
                                        <Link to={`/users/${request.senderId}`} className="flex items-center gap-4 flex-1">
                                            <div className="w-16 h-16 rounded-full overflow-hidden bg-purple-500/20 flex-shrink-0">
                                                {request.sender.profile ? (
                                                    <img 
                                                        src={`${request.sender.profile}`}
                                                        alt={request.sender.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = 'https://www.gravatar.com/avatar/default?d=mp';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <FaUser className="text-purple-400 text-2xl" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <h2 className="text-xl font-semibold text-white">{request.sender.name}</h2>
                                                <p className="text-sm text-gray-400">
                                                    Sent request on {new Date(request.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </Link>
                                        
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleRequest(request.senderId, "ACCEPTED")}
                                                disabled={actionLoading === request.senderId}
                                                className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                                            >
                                                {actionLoading === request.id ? 
                                                    <FaSpinner className="animate-spin" /> : 
                                                    <FaCheck />
                                                }
                                            </button>
                                            <button 
                                                onClick={() => handleRequest(request.senderId, "REJECTED")}
                                                disabled={actionLoading === request.senderId}
                                                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                            >
                                                {actionLoading === request.id ? 
                                                    <FaSpinner className="animate-spin" /> : 
                                                    <FaTimes />
                                                }
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="bg-purple-500/10 rounded-full p-6 inline-block mb-4">
                                    <FaUserPlus className="text-4xl text-purple-400" />
                                </div>
                                <h2 className="text-xl font-semibold text-white mb-2">No Pending Requests</h2>
                                <p className="text-gray-400">
                                    You don't have any pending friend requests at the moment.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FriendsPage;