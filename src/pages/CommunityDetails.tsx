import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaUsers, FaCopy, FaLink, FaComment, FaUserPlus, FaCheck, FaShieldAlt, FaEllipsisV, FaSignOutAlt, FaExclamationTriangle, FaUserTimes, FaUserEdit, FaUserMinus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Community {
    id: number;
    Name: string;
    description: string;
    CoverImage?: string;
    createdAt: string;
    creatorId: number;
}

interface Member {
    id: number;
    username: string;
    profile: string;
    role: 'MEMBER' | 'ADMIN';
    isCreator?: boolean;
}

const CommunityDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [community, setCommunity] = useState<Community | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [inviteLink, setInviteLink] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [isLeavingCommunity, setIsLeavingCommunity] = useState(false);
    const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
    const [leaveError, setLeaveError] = useState<string | null>(null);
    const [redirecting, setRedirecting] = useState(false);
    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('userId'));

    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/community/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCommunity(response.data);
                
                // Generate invite link
                const baseUrl = window.location.origin;
                setInviteLink(`${baseUrl}/community/join/${id}`);
            } catch (error) {
                console.error('Error fetching community:', error);
                setError('Failed to load community details');
            }
        };

        const fetchMembers = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/community/members/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                console.log(response.data);
                setMembers(response.data);
            } catch (error) {
                console.error('Error fetching members:', error);
                setError('Failed to load community members');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCommunity();
        fetchMembers();
    }, [id, token]);

    const KickMember = async (memberId: number) => {
        await axios.post ('http://localhost:3000/api/community/kick', {
            communityId: id,
            userId: memberId
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        }
    );
        toast.success('Member kicked successfully!');
        setMembers(members.filter(member => member.id !== memberId));
    };

    const makeAdmin = async (memberId: number) => {
        await axios.post ('http://localhost:3000/api/community/make-admin', {
            communityId: id,
            userId: memberId
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        }
    );
        toast.success('Member made admin successfully!');
        setMembers(members.map(member => member.id === memberId ? {...member, role: 'ADMIN'} : member));
    };

    const removeAdmin = async (memberId: number) => {
        await axios.post ('http://localhost:3000/api/community/remove-admin', {
            communityId: id,
            userId: memberId
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        }
    );
        toast.success('Admin removed successfully!');
        setMembers(members.map(member => member.id === memberId ? {...member, role: 'MEMBER'} : member));
    }

    const copyInviteLink = () => {
        navigator.clipboard.writeText(inviteLink);
        setIsCopied(true);
        toast.success('Invite link copied to clipboard!');
        setTimeout(() => setIsCopied(false), 2000);
    };

    const goToChat = () => {
        navigate(`/communitychat/${id}`);
    };

    const leaveCommunity = async () => {
        setIsLeavingCommunity(true);
        setLeaveError(null);
        
        try {
             await axios.delete(`http://localhost:3000/api/community/leave/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            toast.success('You have left the community');
            setRedirecting(true);
            
            setTimeout(() => {
                navigate('/community', { replace: true });
            }, 800);
        } catch (error: any) {
            console.error('Error leaving community:', error);
            
            if (error.response?.status === 400 && 
                error.response?.data?.message === "You cannot leave the community as the last admin") {
                setLeaveError("You cannot leave as you are the last administrator. Promote another member to admin first.");
            } else {
                setLeaveError("An error occurred while trying to leave the community");
            }
            
            setIsLeavingCommunity(false);
        }
    };

    const isCurrentUserAdmin = members.some(member => member.id === userId && member.role === 'ADMIN');
    
    const adminCount = members.filter(member => member.role === 'ADMIN').length;
    
    const isLastAdmin = isCurrentUserAdmin && adminCount === 1;

    const isCurrentUserCreator = members.some(member => member.id === userId && member.role === 'ADMIN');

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    if(members.filter(member => member.id === userId).length === 0) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] pt-20 px-4">
                <div className="max-w-3xl mx-auto bg-gradient-to-br from-[var(--bg-secondary)] to-purple-900/30 rounded-xl p-8 text-center shadow-lg">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaExclamationTriangle className="text-3xl text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Access Restricted</h2>
                    <p className="text-gray-300 mb-6">
                        You are not a member of {community?.Name || 'this community'}.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link 
                            to="/community" 
                            className="px-6 py-3 bg-[var(--bg-primary)] hover:bg-gray-700 text-white rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                            <FaArrowLeft />
                            <span>Back to Communities</span>
                        </Link>
                   </div>
                </div>
            </div>
        );
    }     


    if (error) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] pt-20 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="text-red-500 mb-4">{error}</div>
                    <Link to="/community" className="text-purple-500 hover:underline">
                        Back to Communities
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-20 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header with Back Button */}
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/community" className="text-gray-400 hover:text-white">
                        <FaArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Community Details</h1>
                </div>

                {/* Community Info Card */}
                <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-purple-900/30 rounded-xl overflow-hidden mb-6 shadow-lg">
                    <div className="p-5">
                        {isCurrentUserCreator && (<div className="flex items-center justify-between mb-4">
                            <h2 className="text-3xl font-bold text-white">{community?.Name}</h2>
                            <Link to={`/community/edit/${id}`} className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
                                <FaUserEdit />
                                <span>Edit Community</span>
                            </Link>
                        </div>)}
                        

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
                            {/* Community Image - Circle */}
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg flex-shrink-0">
                                {community?.CoverImage ? (
                                    <img
                                        src={community.CoverImage}
                                        alt={community.Name}
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
                            
                            {/* Community Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-bold text-white mb-2">{community?.Name}</h2>
                                <p className="text-gray-300 mb-4 max-w-lg">{community?.description}</p>
                                <div className="text-sm text-gray-400 mb-4">
                                    <span>Created on {new Date(community?.createdAt || '').toLocaleDateString()}</span>
                                    <span className="mx-2">•</span>
                                    <span>{members.length} members</span>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <button 
                                        onClick={goToChat}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-md"
                                    >
                                        <FaComment />
                                        <span>Open Chat</span>
                                    </button>
                                    <button 
                                        onClick={copyInviteLink}
                                        className={`flex items-center gap-2 px-5 py-2.5 
                                            ${isCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-[var(--bg-primary)] hover:bg-gray-700'} 
                                            text-white rounded-full transition-colors shadow-md`}
                                    >
                                        {isCopied ? <FaCheck /> : <FaLink />}
                                        <span>{isCopied ? 'Copied!' : 'Invite'}</span>
                                    </button>
                                    
                                    {/* Leave Community Button - Shown to all members */}
                                    <button 
                                        onClick={() => setShowLeaveConfirm(true)}
                                        disabled={redirecting}
                                        className={`flex items-center gap-2 px-5 py-2.5 
                                            ${isLastAdmin 
                                                ? 'bg-gray-600/70 cursor-not-allowed' 
                                                : 'bg-red-600/70 hover:bg-red-700'} 
                                            text-white rounded-full transition-colors shadow-md`}
                                        title={isLastAdmin ? "You cannot leave as the last administrator" : "Leave community"}
                                    >
                                        <FaSignOutAlt />
                                        <span>Leave</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Members Section */}
                <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-secondary)]/70 rounded-xl p-5 mb-6 shadow-lg">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <FaUsers className="text-purple-400" />
                            <span>Members ({members.length})</span>
                        </h3>
                        <button 
                            className="text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                            onClick={copyInviteLink}
                        >
                            <FaUserPlus />
                            <span className="hidden sm:inline">Invite Friends</span>
                        </button>
                    </div>
                    
                    {/* Members List */}
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                        {/* Sort members by role: admins first, then others */}
                        {[...members]
                            .sort((a, b) => {
                                // Sort by ADMIN first, then by user ID if it matches current user
                                if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
                                if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
                                if (a.id === userId) return -1;
                                if (b.id === userId) return 1;
                                return 0;
                            })
                            .map((member) => (
                                <div 
                                    key={member.id} 
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer
                                            ${member.role === 'ADMIN' 
                                                ? 'bg-purple-900/30 hover:bg-purple-900/50' 
                                                : member.id === userId 
                                                    ? 'bg-blue-900/20 hover:bg-blue-900/40' 
                                                    : 'bg-[var(--bg-primary)]/50 hover:bg-[var(--bg-primary)]'}`}
                                    onClick={() => member.id !== userId ? navigate(`/users/${member.id}`): navigate('/profile')}
                                >
                                    {/* User Avatar */}
                                    <div className={`relative w-12 h-12 rounded-full overflow-hidden
                                                ${member.role === 'ADMIN' 
                                                    ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-[var(--bg-secondary)]' 
                                                    : member.id === userId 
                                                        ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-[var(--bg-secondary)]' 
                                                        : ''}`}>
                                        <img 
                                            src={`${member.profile}`} 
                                            alt={member.username}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://www.gravatar.com/avatar/default?d=mp';
                                            }}
                                        />
                                        
                                        {/* Admin Badge */}
                                        {member.role === 'ADMIN' && (
                                            <div className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-1 border-2 border-[var(--bg-secondary)]">
                                                <FaShieldAlt className="text-[10px] text-white" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* User Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            <span className={`font-medium ${
                                                member.role === 'ADMIN' ? 'text-purple-300' : 
                                                member.id === userId ? 'text-blue-300' : 'text-white'
                                            }`}>
                                                {member.username}
                                            </span>
                                            
                                            {/* Role Badge */}
                                            {member.role === 'ADMIN' && (
                                                <span className="ml-2 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full flex items-center">
                                                    <FaShieldAlt className="mr-1" />
                                                    Admin
                                                </span>
                                            )}
                                            
                                            {/* Current User Badge */}
                                            {member.id === userId && member.role !== 'ADMIN' && (
                                                <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                                                    You
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Role Text */}
                                        <p className="text-xs text-gray-400">
                                            {member.role === 'ADMIN' ? 'Community Administrator' : 'Community Member'}
                                        </p>
                                    </div>
                                    
                                    {/* Options Buttons - Only show for admins looking at other members */}
                                    {isCurrentUserCreator && member.id !== userId ? (
                                        <div className="flex">
                                            {/* Toggle Admin Status Buttons */}
                                            {member.role === 'ADMIN' ? (
                                                // Remove Admin Button - For existing admins
                                                <button 
                                                    className="text-orange-400 hover:text-orange-300 p-2 rounded-full hover:bg-[var(--bg-primary)]/50 mr-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeAdmin(member.id);
                                                    }}
                                                    title="Remove Admin Status"
                                                >
                                                    <FaUserMinus size={16} />
                                                </button>
                                            ) : (
                                                // Make Admin Button - For regular members
                                                <button 
                                                    className="text-purple-400 hover:text-purple-300 p-2 rounded-full hover:bg-[var(--bg-primary)]/50 mr-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        makeAdmin(member.id);
                                                    }}
                                                    title="Make Admin"
                                                >
                                                    <FaShieldAlt size={16} />
                                                </button>
                                            )}
                                            
                                            {/* Kick Button - Always show */}
                                            <button 
                                                className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-[var(--bg-primary)]/50"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    KickMember(member.id);
                                                }}
                                                title="Remove from community"
                                            >
                                                <FaUserTimes size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <button className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-[var(--bg-primary)]/50">
                                            <FaEllipsisV size={14} />
                                        </button>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Invitation Link Section */}
                <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-secondary)]/70 rounded-xl p-5 shadow-lg mb-4">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FaLink className="text-purple-400" />
                        <span>Community Invitation Link</span>
                    </h3>
                    <div className="relative mb-3">
                        <input
                            type="text"
                            value={inviteLink}
                            readOnly
                            className="w-full bg-[var(--bg-primary)]/80 text-gray-300 px-4 py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                        <button
                            onClick={copyInviteLink}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                            {isCopied ? <FaCheck className="text-green-500" /> : <FaCopy />}
                        </button>
                    </div>
                    <div className="flex items-center bg-purple-900/20 p-3 rounded-lg">
                        <div className="text-purple-300 mr-3">
                            <FaUserPlus size={18} />
                        </div>
                        <p className="text-gray-300 text-sm">
                            Share this link with friends to invite them to join the <span className="text-purple-300 font-medium">{community?.Name}</span> community. Anyone with this link can join.
                        </p>
                    </div>
                </div>
                
                {/* Leave Community Button for mobile (shown at bottom for better mobile UX) */}
                <div className="md:hidden bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-secondary)]/70 rounded-xl p-5 shadow-lg mb-4">
                    <button 
                        onClick={() => setShowLeaveConfirm(true)}
                        disabled={isLastAdmin || redirecting}
                        className={`w-full flex items-center justify-center gap-2 px-5 py-3 
                            ${isLastAdmin 
                                ? 'bg-gray-600/70 cursor-not-allowed' 
                                : 'bg-red-600/70 hover:bg-red-700'} 
                            text-white rounded-xl transition-colors`}
                        title={isLastAdmin ? "You cannot leave as the last administrator" : "Leave community"}
                    >
                        <FaSignOutAlt />
                        <span>Leave {community?.Name}</span>
                    </button>
                    {isLastAdmin && (
                        <p className="text-yellow-300 text-xs mt-2 text-center">
                            You cannot leave as the last administrator. Promote another member first.
                        </p>
                    )}
                </div>
            </div>
            
            {/* Leave Community Confirmation Modal */}
            {showLeaveConfirm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-6 max-w-md w-full animate-fade-in">
                        <div className="flex items-center gap-3 mb-4 text-red-400">
                            <FaExclamationTriangle className="text-2xl" />
                            <h3 className="text-xl font-bold">Leave Community?</h3>
                        </div>
                        
                        <p className="text-gray-300 mb-3">
                            Are you sure you want to leave <span className="text-purple-300 font-medium">{community?.Name}</span>? You'll need an invitation to rejoin.
                        </p>
                        
                        {/* Special warning for admins/creators */}
                        {isCurrentUserCreator && (
                            <div className="mb-6 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                                <p className="text-yellow-300 font-medium">
                                    Warning: You are an administrator of this community. 
                                    {members.filter(m => m.role === 'ADMIN').length === 1 && 
                                        " You are the only admin. If you leave, this community will have no administrators."}
                                </p>
                            </div>
                        )}
                        
                        {/* Error message */}
                        {leaveError && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                                <p className="text-red-300">{leaveError}</p>
                            </div>
                        )}
                        
                        <div className="flex gap-3 justify-end mt-6">
                            <button
                                onClick={() => {
                                    setShowLeaveConfirm(false);
                                    setLeaveError(null);
                                }}
                                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={leaveCommunity}
                                disabled={isLeavingCommunity || isLastAdmin}
                                className={`px-4 py-2 
                                    ${isLastAdmin 
                                        ? 'bg-gray-600 cursor-not-allowed' 
                                        : 'bg-red-600 hover:bg-red-700'} 
                                    text-white rounded-lg flex items-center gap-2 disabled:opacity-70`}
                            >
                                {isLeavingCommunity ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        <span>Leaving...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSignOutAlt />
                                        <span>Leave Community</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Loading overlay when redirecting */}
            {redirecting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-white">Redirecting to Communities...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityDetails;