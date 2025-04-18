import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaUserFriends, FaExclamationTriangle } from 'react-icons/fa';
import UserCard from './usersCard';

interface User {
  id: number;
  name: string;
  profile: string;
  createdAt: string;
}

const Add_friend = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  const fetchAllUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
      console.log('Fetched users:', response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const searchUserById = async () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      const userId = parseInt(searchTerm.trim());
      
      if (isNaN(userId)) {
        setSearchError("Please enter a valid user ID (numbers only)");
        setUsers([]);
        setIsSearching(false);
        return;
      }
      
      const response = await axios.get(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        // If we get a successful response with a user, update the users list
        setUsers([response.data.user]);
        console.log('User found:', response.data);
      } else {
        setUsers([]);
        setSearchError("No user found with that ID");
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      setSearchError("User not found or you don't have permission to view this user");
      setUsers([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    // Load all users initially
    fetchAllUsers();
  }, []);

  // Handle search when Enter key is pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      searchUserById();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)]">
      {/* Main content area */}
      <div className="flex-grow p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-500/30 rounded-lg p-2">
              <FaUserFriends className="text-purple-400 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Find Friends</h2>
          </div>
          
          {/* Search Bar with enhanced styling */}
          <div className="mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by user ID..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSearchError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-[var(--bg-secondary)] text-white px-4 py-3 pl-12 
                          rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 
                          border border-gray-700/50 shadow-inner"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <button
                onClick={searchUserById}
                disabled={!searchTerm.trim() || isSearching}
                className="px-5 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600
                       transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSearching ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  "Search"
                )}
              </button>
            </div>
            
            {searchError && (
              <div className="mt-2 text-red-400 text-sm flex items-center gap-2">
                <FaExclamationTriangle />
                <span>{searchError}</span>
              </div>
            )}
            
            <div className="mt-3 text-gray-400 text-sm">
              Enter a user ID to find a specific user, or browse all users below.
            </div>
          </div>

          {/* Content based on active tab */}
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-purple-500 border-t-transparent" />
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-900/20 border border-red-900/30 rounded-lg">
              <p className="text-red-400">{error}</p>
              <button 
                onClick={fetchAllUsers}
                className="mt-4 px-4 py-2 bg-red-500/30 text-red-300 rounded-lg hover:bg-red-500/40"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div>
              {users.length > 0 ? (
                <div className="space-y-3">
                  {users.map((user) => (
                    <UserCard
                      key={user.id}
                      id={user.id}
                      name={user.name}
                      profile={user.profile}
                      createdAt={user.createdAt}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center bg-[var(--bg-secondary)] rounded-lg p-8">
                  <div className="mb-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 mb-1">No users found</p>
                  <p className="text-gray-500 text-sm">
                    {searchTerm ? `No user found with ID "${searchTerm}"` : 'Try searching for a specific user ID'}
                  </p>
                  
                  {searchTerm && (
                    <button
                      onClick={fetchAllUsers}
                      className="mt-4 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
                    >
                      Show All Users
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Add_friend;