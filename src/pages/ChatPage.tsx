import { useParams } from "react-router-dom";
import { useLayout } from "../context/layoutContex";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Message {
    id?: number;
    senderId: number;
    receiverId: number;
    content: string;
    createdAt: string;
}
interface User {
    id: number;
    name: string;
    profile: string;
}

const ChatComponent = () => {
    const { id } = useParams<{ id: string }>();
    const { setShowNavbar, setShowFooter } = useLayout();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [user, setUser] = useState<User>();
    const userId = Number(localStorage.getItem('userId'));
    const token = localStorage.getItem('token');
    const socketRef = useRef<Socket | null>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const fetchMessages = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/chat/',{
                receiverId: id
            } ,{
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessages(response.data);
            console.log('Fetched messages:', response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/users/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setUser(response.data.user);
            console.log('Fetched user:', response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        fetchUser();
        
        // Initialize socket connection
        socketRef.current = io('http://localhost:3000', {
            withCredentials: true
        });

        // Join private room
        socketRef.current.emit('join', userId);

        // Listen for new messages
        socketRef.current.on('new_message', (message: Message) => {
            if ((message.senderId === userId && message.receiverId === Number(id)) ||
                (message.senderId === Number(id) && message.receiverId === userId)) {
                setMessages(prev => [...prev, message]);
                console.log('Received new message:', message);
                scrollToBottom();
            }
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [userId, id]);

    useEffect(() => {
        setShowNavbar(false);
        setShowFooter(false);

        return () => {
            setShowNavbar(true);
            setShowFooter(true);
        };
    }, [setShowNavbar, setShowFooter]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
            const response = await axios.post('http://localhost:3000/api/chat/send', {
                receiverId: Number(id),
                content: newMessage
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // Emit message through socket
            socketRef.current?.emit('private_message', {
                senderId: userId,
                receiverId: Number(id),
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
        <div className="h-screen bg-[var(--bg-primary)] flex flex-col overflow-hidden">
            {/* Chat Header/Navigation */}
            <div className="bg-[var(--bg-secondary)] border-b border-gray-700 z-50" onClick={() => {navigate(`/users/${id}`)}}>
                <div className="max-w-3xl mx-auto p-4 flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                                src={user?.profile}
                                alt={user?.name || 'User'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://www.gravatar.com/avatar/default?d=mp';
                                }}
                            />
                        </div>
                        <div>
                            <h2 className="text-white font-medium text-lg">{user?.name}</h2>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Messages Area - Flexible height */}
            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 pb-6"
            >
                <div className="max-w-3xl mx-auto space-y-4">
                    {isLoadingMessages ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent" />
                        </div>
                    ) : messages.length > 0 ? (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.senderId === userId 
                                    ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] rounded-lg p-3 ${
                                    message.senderId === userId
                                        ? 'bg-purple-500 text-white rounded-tr-none'
                                        : 'bg-[var(--bg-secondary)] text-gray-300 rounded-tl-none'
                                }`}>
                                    <p>{message.content}</p>
                                    <p className="text-xs opacity-75 mt-1">
                                        {new Date(message.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            No messages yet. Start the conversation!
                        </div>
                    )}
                </div>
            </div>

            {/* Message Input - Fixed at bottom */}
            <div className="border-t border-gray-700 bg-[var(--bg-secondary)]">
                <form onSubmit={sendMessage} className="max-w-3xl mx-auto p-4">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 bg-[var(--bg-primary)] text-white px-4 py-3 rounded-lg 
                                    focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg 
                                    hover:bg-purple-600 transition-colors disabled:opacity-50
                                    flex items-center gap-2"
                        >
                            <FaPaperPlane className="text-sm" />
                            <span className="hidden sm:inline">{isLoading ? 'Sending...' : 'Send'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatComponent;
