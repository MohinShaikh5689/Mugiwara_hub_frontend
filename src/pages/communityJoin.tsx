import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUsers, FaArrowLeft, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

interface Community {
    id: number;
    Name: string;
    description: string;
    CoverImage?: string;
    memberCount?: number;
}

const CommunityJoin = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [community, setCommunity] = useState<Community | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [joining, setJoining] = useState(false);
    const [joined, setJoined] = useState(false);
    const [alreadyMember, setAlreadyMember] = useState(false);
    
    const authToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/api/community/${id}`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                setCommunity(response.data);
                console.log(response.data);
                
                // Check if already a member
                const alreadyMemberResponse = await axios.get(`http://localhost:3000/api/community/members/${id}`, {
                    headers: { 'Authorization': `Bearer ${authToken}` }
                });
                console.log(alreadyMemberResponse.data);
                console.log(userId);
                const mem = alreadyMemberResponse.data.some((member: any) => member.id == userId)
                console.log(mem);

                if (mem) {
                    setAlreadyMember(true);
                }
                
            } catch (error) {
                console.error('Error fetching community:', error);
                setError('Failed to load community details');
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchCommunity();
        } else {
            setError('You must be logged in to join a community');
            setLoading(false);
        }
    }, [id, authToken]);

    const handleJoin = async () => {
        if (!authToken || !userId) {
            navigate('/login');
            return;
        }

        try {
            setJoining(true);
            await axios.post(`http://localhost:3000/api/community/join/`, {
                communityId: id,
            },
                { headers: { 'Authorization': `Bearer ${authToken}` } }
            );
            setJoined(true);
            setTimeout(() => {
                navigate(`/communitydetails/${id}`);
            }, 1500);
        } catch (error) {
            console.error('Failed to join community:', error);
            setError('Failed to join community. The invitation may be invalid or expired.');
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] pt-20 px-4">
                <div className="max-w-lg mx-auto bg-[var(--bg-secondary)] rounded-xl p-8 text-center">
                    <div className="bg-red-500/20 p-4 rounded-lg mb-4">
                        <FaTimes className="text-red-500 text-4xl mx-auto mb-2" />
                        <h2 className="text-xl font-bold text-white mb-2">Error</h2>
                        <p className="text-gray-300">{error}</p>
                    </div>
                    <Link to="/community" className="text-purple-500 hover:underline">
                        Browse Communities
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-20 px-4">
            <div className="max-w-lg mx-auto">
                {/* Back Button */}
                <div className="mb-6">
                    <Link to="/community" className="text-gray-400 hover:text-white inline-flex items-center gap-2">
                        <FaArrowLeft /> 
                        <span>Back to Communities</span>
                    </Link>
                </div>
                
                {/* Join Card */}
                <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-purple-900/30 rounded-xl overflow-hidden shadow-lg">
                    <div className="p-6">
                        {/* Community Info */}
                        <div className="flex flex-col items-center text-center mb-6">
                            {/* Community Avatar */}
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg mb-4">
                                {community?.CoverImage ? (
                                    <img
                                        src={community.CoverImage}
                                        alt={community?.Name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://via.placeholder.com/150?text=Community'; 
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-purple-500 flex items-center justify-center">
                                        <FaUsers className="text-4xl text-white" />
                                    </div>
                                )}
                            </div>
                            
                            <h1 className="text-2xl font-bold text-white mb-2">{community?.Name}</h1>
                            <p className="text-gray-300 mb-3">{community?.description}</p>
                            
                            {community?.memberCount && (
                                <div className="flex items-center text-gray-400 text-sm">
                                    <FaUsers className="mr-1" />
                                    <span>{community.memberCount} members</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Join Status */}
                        {joined ? (
                            <div className="bg-green-500/20 p-4 rounded-lg text-center mb-6">
                                <FaCheck className="text-green-500 text-4xl mx-auto mb-2" />
                                <h2 className="text-xl font-bold text-white mb-2">Success!</h2>
                                <p className="text-gray-300">You have joined the community.</p>
                            </div>
                        ) : alreadyMember ? (
                            <div className="bg-blue-500/20 p-4 rounded-lg text-center mb-6">
                                <FaCheck className="text-blue-500 text-4xl mx-auto mb-2" />
                                <h2 className="text-xl font-bold text-white mb-2">Already a Member</h2>
                                <p className="text-gray-300">You are already a member of this community.</p>
                            </div>
                        ) : (
                            <div className="bg-purple-500/10 p-4 rounded-lg text-center mb-6">
                                <h2 className="text-xl font-bold text-white mb-2">Join Community</h2>
                                <p className="text-gray-300">You've been invited to join this community.</p>
                            </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            {alreadyMember ? (
                                <button 
                                    onClick={() => navigate(`/communitychat/${id}`)} 
                                    className="w-full py-3 px-4 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors shadow-md"
                                >
                                    Open Community Chat
                                </button>
                            ) : joined ? (
                                <button 
                                    onClick={() => navigate(`/communitydetails/${id}`)} 
                                    className="w-full py-3 px-4 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors shadow-md"
                                >
                                    Go to Community
                                </button>
                            ) : (
                                <button 
                                    onClick={handleJoin}
                                    disabled={joining}
                                    className="w-full py-3 px-4 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {joining ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Joining...
                                        </>
                                    ) : (
                                        'Join Community'
                                    )}
                                </button>
                            )}
                            
                            <Link 
                                to="/community"
                                className="w-full py-3 px-4 bg-[var(--bg-primary)] text-gray-300 rounded-full font-semibold hover:bg-[var(--bg-primary)]/80 transition-colors text-center"
                            >
                                Browse Other Communities
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityJoin;