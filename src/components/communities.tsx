import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Community {
    id: number;
    Name: string;
    Description: string;
    membersCount: number;
    createdAt: string;
    CoverImage?: string;
}

const CommunitiesTab = () => {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    const fetchCommunities = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/community', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Communities:', response.data);
            setCommunities(response.data);
        } catch (error) {
            console.error('Error fetching communities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCommunities();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communities.length > 0 ? (
                communities.map((community) => (
                    <div key={community.id} 
                         className="bg-[var(--bg-secondary)] p-4 rounded-lg hover:bg-[var(--bg-secondary)]/80 
                                  transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-4" onClick={() => navigate(`/communitychat/${community.id}`)}>
                            {community.CoverImage ? (
                                <img 
                                    src={community.CoverImage}
                                    alt={community.Name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://via.placeholder.com/150?text=Community';
                                    }}
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-lg bg-purple-500/20 
                                              flex items-center justify-center">
                                    <FaUsers className="text-2xl text-purple-500" />
                                </div>
                            )}
                            <div>
                                <h3 className="text-white font-medium">{community.Name}</h3>
                                <p className="text-gray-400 text-sm">{community.membersCount} members</p>
                            </div>
                        </div>
                        <p className="text-gray-300 mt-2 text-sm">{community.Description}</p>
                    </div>
                ))
            ) : (
                <div className="col-span-2 text-center py-8">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full 
                                  flex items-center justify-center mx-auto mb-4">
                        <FaUsers className="text-3xl text-purple-500" />
                    </div>
                    <h3 className="text-white font-medium mb-2">No Communities Yet</h3>
                    <p className="text-gray-400">
                        Create a new community to get started!
                    </p>
                </div>
            )}
        </div>
    );
};

export default CommunitiesTab;