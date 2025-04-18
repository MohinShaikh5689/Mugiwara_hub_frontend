import { useState } from 'react';
import axios from 'axios';
import { FaImage, FaTimes } from 'react-icons/fa';

interface CreateCommunityModalProps {
    onClose: () => void;
}

const CreateCommunityModal = ({ onClose }: CreateCommunityModalProps) => {
    const [newCommunity, setNewCommunity] = useState({
        name: '',
        description: '',
        image: null as File | null
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = localStorage.getItem('token');

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            setNewCommunity(prev => ({
                ...prev,
                image: file
            }));

            // Create preview URL for the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setNewCommunity(prev => ({
            ...prev,
            image: null
        }));
        setImagePreview(null);
    };

    const handleCreateCommunity = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {

            // Create a FormData object
            const formData = new FormData();

            // Append the text fields to the form data
            formData.append('name', newCommunity.name);
            formData.append('description', newCommunity.description);

            // Append the file to the form data
            // Make sure newCommunity.image contains the File object from an input type="file"
            if (newCommunity.image) {
                formData.append('coverImage', newCommunity.image);
            }

            // Send the request with the FormData object
            await axios.post('http://localhost:3000/api/community/create', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Don't set Content-Type when sending FormData
                    // axios will automatically set the correct Content-Type with boundary
                }
            });
            onClose();
            // We could add a callback for refreshing the communities list
        } catch (error) {
            console.error('Error creating community:', error);
            // We could add error handling UI here
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[var(--bg-secondary)] p-6 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-4">Create Community</h2>
                <form onSubmit={handleCreateCommunity}>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Community Name"
                            value={newCommunity.name}
                            onChange={(e) => setNewCommunity(prev => ({
                                ...prev,
                                name: e.target.value
                            }))}
                            className="w-full bg-[var(--bg-primary)] text-white px-4 py-2 rounded-lg"
                            required
                        />
                        <textarea
                            placeholder="Community Description"
                            value={newCommunity.description}
                            onChange={(e) => setNewCommunity(prev => ({
                                ...prev,
                                description: e.target.value
                            }))}
                            className="w-full bg-[var(--bg-primary)] text-white px-4 py-2 rounded-lg"
                            rows={4}
                            required
                        />

                        {/* Image Preview */}
                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Community preview"
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full
                                            hover:bg-red-600 transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        ) : (
                            <div className="w-full h-40 border-2 border-dashed border-gray-600 rounded-lg
                                           flex flex-col items-center justify-center text-gray-400 cursor-pointer"
                                onClick={() => document.getElementById('community-image-input')?.click()}
                            >
                                <FaImage className="text-3xl mb-2" />
                                <p>Click to upload community image</p>
                            </div>
                        )}

                        <input
                            id="community-image-input"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-purple-500 text-white rounded-lg 
                                         hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <span>Create</span>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCommunityModal;