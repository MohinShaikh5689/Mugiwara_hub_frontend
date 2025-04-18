import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBell, FaTrash, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

interface Notification {
  id: number;
  content: string;
  createdAt: string;
}

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const token = localStorage.getItem('token');

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:3000/api/notification', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setError('Unable to load notifications. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNotification = async (id: number) => {
    setDeletingId(id);
    
    try {
      await axios.delete(`http://localhost:3000/api/notification/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove the notification from the state
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
      // Show temporary error message
      setError('Failed to delete notification. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Calculate the difference in milliseconds
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    // Format based on how long ago
    if (diffSecs < 60) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      // Format to a readable date for older notifications
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto pb-12">
        <div className="flex items-center mb-6">
          <div className="bg-purple-500/30 p-2 rounded-lg mr-3">
            <FaBell className="text-purple-400 text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-300">
            <FaExclamationCircle />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className="bg-[var(--bg-secondary)] rounded-lg p-4 flex items-start justify-between
                         hover:bg-[var(--bg-secondary)]/80 transition-colors"
              >
                <div className="flex-1 mr-4">
                  <p className="text-white">{notification.content}</p>
                  <p className="text-gray-400 text-sm mt-1">{formatDate(notification.createdAt)}</p>
                </div>
                
                <button
                  onClick={() => deleteNotification(notification.id)}
                  disabled={deletingId === notification.id}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg
                           transition-colors disabled:opacity-50"
                >
                  {deletingId === notification.id ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[var(--bg-secondary)]/50 rounded-lg">
            <div className="bg-purple-500/10 rounded-full p-6 inline-block mb-4">
              <FaBell className="text-4xl text-purple-400/70" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Notifications</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              You're all caught up! We'll notify you when there's new activity related to your account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;