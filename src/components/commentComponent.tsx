import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Update the Comment interface
interface Comment {
    id: number;
    userId: number;
    AnimeId: number;
    content: string;
    createdAt: string;
    user: {
        name: string;
        profile: string;
    };
}

interface CommentComponentProps {
    animeId: number;
}

const CommentComponent = ({ animeId }: CommentComponentProps) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/anime/comment/${animeId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // Ensure we're setting an array to the state
            setComments(Array.isArray(response.data.comments) ? response.data.comments : []);
            console.log('Fetched comments:', response.data.comments); // Debug log
        } catch (error) {
            console.error('Error fetching comments:', error);
            setComments([]); // Set empty array on error
            setError('Failed to fetch comments. Please try again later.');
        }
    };

    const postComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsLoading(true);
        try {
            await axios.post('http://localhost:3000/api/anime/comment', 
                { comment: newComment, animeId },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setNewComment('');
            fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setIsLoading(false);
        }
    };


    const deleteComment = async (commentId: number) => {
        try {
            await axios.delete(`http://localhost:3000/api/anime/comment/${commentId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchComments(); // Refresh comments
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [animeId]);

    return (
        <div className="w-full px-4 pl-8"> {/* Added pl-8 for left padding */}
            {/* Comment Form */}
            <div className="ml-4"> {/* Added margin-left to the content */}
                <form onSubmit={postComment} className="mb-8">
                    <div className="flex gap-4">
                        <FaUserCircle className="w-10 h-10 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 max-w-2xl"> {/* Added max-width constraint */}
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="w-full px-4 py-2 bg-[var(--bg-secondary)] text-white rounded-lg 
                                         border border-gray-700 focus:outline-none focus:border-purple-500
                                         transition-all duration-300 placeholder-gray-500 min-h-[100px]"
                            />
                            <div className="flex justify-end mt-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-purple-500 text-white rounded-lg 
                                             hover:bg-purple-600 transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Posting...' : 'Post Comment'}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Comments List */}
                <div className="space-y-6 max-w-2xl"> 
                    {error ? (
                        <div className="text-red-400 py-4 ml-4">
                            {error}
                        </div>
                    ) : Array.isArray(comments) && comments.length > 0 ? (
                        comments.map((comment) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, x: -20 }} 
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-[var(--bg-secondary)]/50 rounded-lg p-6 backdrop-blur-sm ml-4" // Added ml-4 and increased padding
                            >
                                <div className="flex gap-4">
                                    {comment.user.profile ? (
                                        <img
                                            src={`http://localhost:3000/assets/${comment.user.profile}`}
                                            alt={comment.user.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-10 h-10 text-gray-400" />
                                    )}
                                    <div className="flex-1">
                                       
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h4 className="text-white font-medium">{comment.user.name}</h4>
                                                    <p className="text-sm text-gray-400">
                                                        {new Date(comment.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                {Number(userId) === comment.userId ? (
                                                <button
                                                    onClick={() => deleteComment(comment.id)}
                                                    className="text-gray-400 hover:text-red-400 transition-colors"
                                                >
                                                    <FaTrash />
                                                </button>
                                        ) : null}
                                            </div>
                                        <p className="text-gray-300">{comment.content}</p>
                                    </div>
                                </div>
                                
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-left py-8 ml-4">
                            <p className="text-gray-400">No comments yet. Be the first to share your thoughts!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentComponent;