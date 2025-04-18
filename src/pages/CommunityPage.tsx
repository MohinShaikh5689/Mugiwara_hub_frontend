import { useState, useEffect } from 'react';
import { FaUsers, FaComments, FaPlus } from 'react-icons/fa';
import CommunitiesTab from '../components/communities';
import MessagesTab from '../components/message';
import CreateCommunityModal from '../components/createCommunityModal';

const CommunityPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'communities' | 'messages'>('communities');
    const [showCreateCommunity, setShowCreateCommunity] = useState(false);


    useEffect(() => {
        // Initial setup
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] pt-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Tabs and Mobile Menu */}
                <div className="mb-8">
                    {/* Desktop View */}
                    <div className="hidden md:flex md:items-center md:justify-between">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab('communities')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                                    ${activeTab === 'communities' 
                                        ? 'bg-purple-500 text-white' 
                                        : 'text-gray-400 hover:text-white'}`}
                            >
                                <FaUsers />
                                <span>Communities</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('messages')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                                    ${activeTab === 'messages' 
                                        ? 'bg-purple-500 text-white' 
                                        : 'text-gray-400 hover:text-white'}`}
                            >
                                <FaComments />
                                <span>Messages</span>
                            </button>
                        </div>
                        
                        {activeTab === 'communities' && (
                            <button
                                onClick={() => setShowCreateCommunity(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-500 
                                         text-white rounded-lg hover:bg-purple-600 transition-colors"
                            >
                                <FaPlus />
                                <span>Create Community</span>
                            </button>
                        )}
                    </div>

                    {/* Mobile View */}
                    <div className="flex md:hidden flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setActiveTab('communities')}
                                    className={`flex items-center justify-center w-12 h-10 rounded-lg transition-colors
                                        ${activeTab === 'communities' 
                                            ? 'bg-purple-500 text-white' 
                                            : 'bg-gray-800/50 text-gray-400'}`}
                                >
                                    <FaUsers />
                                </button>
                                <button
                                    onClick={() => setActiveTab('messages')}
                                    className={`flex items-center justify-center w-12 h-10 rounded-lg transition-colors
                                        ${activeTab === 'messages' 
                                            ? 'bg-purple-500 text-white' 
                                            : 'bg-gray-800/50 text-gray-400'}`}
                                >
                                    <FaComments />
                                </button>
                            </div>
                            
                            {activeTab === 'communities' && (
                                <div className="flex flex-col gap-2">
                                    <p className="text-gray-400 text-sm">
                                    {activeTab === 'communities' 
                                        ? 'Join and create communities around your favorite anime.' 
                                        : 'Chat with your Friends.'}
                                    </p>
                                    <button
                                        onClick={() => setShowCreateCommunity(true)}
                                        className="flex items-center gap-1 px-3 py-2 bg-purple-500 
                                                 text-white text-sm rounded-lg hover:bg-purple-600 
                                                 transition-colors"
                                    >
                                        <FaPlus className="text-xs" />
                                        <span>Create</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-[var(--bg-secondary)]/60 rounded-lg p-3 mb-4">
                            <h2 className="text-white font-medium">
                                {activeTab === 'communities' ? 'Anime Communities' : 'Community Messages'}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                {activeTab === 'communities' 
                                    ? 'Join and create communities around your favorite anime.' 
                                    : 'Chat with your Friends.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Active Tab Content */}
                {activeTab === 'communities' && <CommunitiesTab />}
                {activeTab === 'messages' && <MessagesTab />}
            </div>

            {/* Create Community Modal */}
            {showCreateCommunity && (
                <CreateCommunityModal 
                    onClose={() => setShowCreateCommunity(false)}
                />
            )}
        </div>
    );
};

export default CommunityPage;