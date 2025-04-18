import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaImage, FaSpinner, FaSave } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

interface Community {
    id: number;
    Name: string;
    Description: string;
    CoverImage?: string;
    createdAt: string;
    creatorId: number;
}

const CommunityEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // State variables
    const [community, setCommunity] = useState<Community | null>(null);
    const [name, setName] = useState('');
    const [Description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const token = localStorage.getItem('token');
    const userId = Number(localStorage.getItem('userId'));

    // Fetch community data
    useEffect(() => {
        const fetchCommunity = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:3000/api/community/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log(response.data);
                const communityData = response.data;
                setCommunity(communityData);
                setName(communityData.Name);
                setDescription(communityData.Description);
                
                if (communityData.CoverImage) {
                    setPreviewImage(communityData.CoverImage);
                }
                
                // Check if user has permission to edit
                const membersResponse = await axios.get(`http://localhost:3000/api/community/members/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const isAdmin = membersResponse.data.some(
                    (member: any) => member.id === userId && member.role === 'ADMIN'
                );
                
                if (!isAdmin) {
                    navigate(`/communitydetails/${id}`);
                    return;
                }
                
            } catch (error) {
                console.error('Error fetching community:', error);
                setError('Failed to load community details');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchCommunity();
    }, [id, token, userId, navigate]);

    // Handle image change
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setCoverImage(file);
               // Create a preview
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!name.trim()) {
            setError('Community name is required');
            return;
        }
        
        setIsSaving(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', Description);
        
        if (coverImage) {
            formData.append('coverImage', coverImage);
        }
        

        
        try {
            await axios.put(`http://localhost:3000/api/community/edit/${id}`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            
            toast.success('Community updated successfully');
            navigate(`/communitydetails/${id}`);
        } catch (error: any) {
            console.error('Error updating community:', error);
            setError(error.response?.data?.message || 'Failed to update community');
        } finally {
            setIsSaving(false);
        }
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)] pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
            </div>
        );
    }

    if (error && !community) {
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
        <div className="min-h-screen bg-[var(--bg-primary)] pt-20 px-4 pb-12">
            <div className="max-w-3xl mx-auto">
                {/* Header with Back Button */}
                <div className="flex items-center gap-4 mb-6">
                    <Link 
                        to={`/communitydetails/${id}`} 
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <FaArrowLeft size={20} />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Edit Community</h1>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-secondary)]/70 rounded-xl p-6 shadow-lg mb-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
                            {error}
                        </div>
                    )}
                    
                    {/* Cover Image Upload */}
                    <div className="mb-6">
                        <label className="block text-white font-medium mb-2">
                            Community Image
                        </label>
                        
                        <div className="flex flex-col items-center">
                            {/* Image Preview */}
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 mb-4 relative">
                                {previewImage ? (
                                    <>
                                        <img 
                                            src={previewImage} 
                                            alt="Community" 
                                            className="w-full h-full object-cover"
                                        />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <FaImage size={40} />
                                    </div>
                                )}
                            </div>
                            
                            {/* Upload Button */}
                            <label className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                                <FaImage />
                                <span>Choose Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            
                            <p className="text-gray-400 text-xs mt-2">
                                Recommended: Square image, at least 200x200px
                            </p>
                        </div>
                    </div>
                    
                    {/* Community Name */}
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-white font-medium mb-2">
                            Community Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 bg-[var(--bg-primary)]/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                            placeholder="Give your community a name"
                        />
                    </div>
                    
                    {/* Community Description */}
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-white font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={Description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-[var(--bg-primary)]/80 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none"
                        />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Link
                            to={`/community/${id}`}
                            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-70 flex items-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <FaSave />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
                
            </div>
        </div>
    );
};

export default CommunityEditPage;