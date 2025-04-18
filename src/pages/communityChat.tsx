import { useParams, Link } from "react-router-dom";
import { useLayout } from "../context/layoutContex";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { FaPaperPlane, FaArrowLeft, FaUsers } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Message {
    id?: number;
    communityId: number;
    content: string;
    createdAt: string;
    userId: number;
    user: {
        name: string;
        profile: string;
    }
}

interface Community {
    id: number;
    Name: string;
    description: string;
    CoverImage?: string;
}

const CommunityChat = () => {
    const { id } = useParams<{ id: string }>();
    const { setShowNavbar, setShowFooter } = useLayout();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [community, setCommunity] = useState<Community | null>(null);
    const [members, setMembers] = useState<any[]>([]);
    const userId = Number(localStorage.getItem('userId'));
    const username = localStorage.getItem('username');
    const userProfile = localStorage.getItem('userProfile');
    const token = localStorage.getItem('token');
    const socketRef = useRef<Socket | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/community/chat/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessages(response.data);
            console.log('Fetched community messages:', response.data);
        } catch (error) {
            console.error('Error fetching community messages:', error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const fetchCommunity = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/community/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCommunity(response.data);
            console.log('Fetched community:', response.data);
        } catch (error) {
            console.error('Error fetching community:', error);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/community/members/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMembers(response.data);
            console.log('Fetched community members:', response.data);
        }
        catch (error) {
            console.error('Error fetching community members:', error);
        }
    }

    useEffect(() => {
        fetchMessages();
        fetchCommunity();
        fetchMembers();
        
        // Initialize socket connection
        socketRef.current = io('http://localhost:3000', {
            withCredentials: true
        });

        // Join community room
        socketRef.current.emit('joinCommunity', id);

        // Listen for new messages
        socketRef.current.on('community_message', (message: Message) => {
            if (message.communityId === Number(id)) {
                setMessages(prev => [...prev, message]);
                console.log('Received new message:', message);
                scrollToBottom();
            }
        });

        return () => {
            socketRef.current?.emit('leaveCommunity', id);
            socketRef.current?.disconnect();
        };
    }, [id]);

    useEffect(() => {
        setShowNavbar(false);
        setShowFooter(false);

        return () => {
            setShowNavbar(true);
            setShowFooter(true);
        };
    }, [setShowNavbar, setShowFooter]);

    const scrollToBottom = () => {
        setTimeout(() => {
            if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
        }, 100);
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setIsLoading(true);
        try {
            // Save message to database
            const response = await axios.post(`http://localhost:3000/api/community/chat`, {
                message: newMessage,
                communityId: Number(id)
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Emit message through socket
            socketRef.current?.emit('community_message', {
                communityId: Number(id),
                userId: userId,
                username: username,
                userProfile: userProfile,
                content: newMessage,
                id: response.data.id,
                createdAt: response.data.createdAt
            });
            
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
            {/* Community Chat Header */}
            <div className="bg-[var(--bg-secondary)] border-b border-gray-700 fixed top-0 left-0 right-0 z-50">
                <div className="max-w-3xl mx-auto p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link to="/community" className="text-gray-400 hover:text-white">
                            <FaArrowLeft />
                        </Link>
                        <div className="flex items-center gap-3" onClick={()=> navigate(`/communitydetails/${id}`)}>
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-purple-500/20 
                                         flex items-center justify-center">
                                {community?.CoverImage ? (
                                    <img
                                        src={community.CoverImage}
                                        alt={community?.Name || 'Community'}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = 'https://via.placeholder.com/150?text=Community';
                                        }}
                                    />
                                ) : (
                                    <FaUsers className="text-xl text-purple-500" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-white font-medium text-lg">{community?.Name}</h2>
                                <p className="text-gray-400 text-sm">{community?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add padding to account for fixed header */}
            <div className="pt-20 pb-20 flex-1 overflow-y-auto">
                {/* Chat Messages */}
                <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4"
                >
                    <div className="max-w-3xl mx-auto space-y-4">
                        {isLoadingMessages ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                            </div>
                        ) : messages.length > 0 ? (
                            messages.map((message, index) => (
                                <div
                                    key={`${message.id}-${index}`}
                                    className={`flex ${message.userId === userId 
                                        ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] rounded-lg ${
                                        message.userId === userId
                                            ? 'bg-purple-500 text-white rounded-tr-none'
                                            : 'bg-[var(--bg-secondary)] text-gray-300 rounded-tl-none'
                                    }`}>
                                        {message.userId !== userId && (
                                            <div className="flex items-center gap-2 px-3 pt-2">
                                                <div className="w-6 h-6 rounded-full overflow-hidden" onClick={()=> navigate(`/users/${message.userId}`)}>
                                                    {members.find(member => member.id === message.userId) ? (
                                                        <img
                                                            src={`${members.find(member => member.id === message.userId)?.profile}`}
                                                            alt={members.find(member => member.id === message.userId)?.username}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = 'https://www.gravatar.com/avatar/default?d=mp';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-purple-500/20 flex items-center justify-center">
                                                            <span className="text-xs text-white">
                                                                {members.find((member: { id: number; name: string }) => member.id === message.userId)?.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-xs font-medium text-gray-300">
                                                    {members.find(member => member.id === message.userId)?.username}
                                                </span>
                                            </div>
                                        )}
                                        <div className="p-3 pt-1">
                                            <p>{message.content}</p>
                                            <p className="text-xs opacity-75 mt-1 text-right">
                                                {new Date(message.createdAt).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 py-8">
                                <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full 
                                             flex items-center justify-center mb-4">
                                    <FaUsers className="text-2xl text-purple-500" />
                                </div>
                                <p>Be the first to send a message in this community!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-700 bg-[var(--bg-secondary)] fixed bottom-0 left-0 right-0">
                <form onSubmit={sendMessage} className="max-w-3xl mx-auto p-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-[var(--bg-primary)] text-white px-4 py-2 rounded-lg 
                                     focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg 
                                     hover:bg-purple-600 transition-colors disabled:opacity-50
                                     flex items-center gap-2"
                        >
                            <FaPaperPlane className="text-sm" />
                            <span>{isLoading ? 'Sending...' : 'Send'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommunityChat;