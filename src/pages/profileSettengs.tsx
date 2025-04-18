import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaSave, FaSpinner, FaCamera, FaTrash, FaArrowLeft } from 'react-icons/fa';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  profile: string | null;
  createdAt: string;
}

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [_profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [removeProfileImage, setRemoveProfileImage] = useState(false);
  
  const token = localStorage.getItem('token');

  // Fetch user profile
  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('http://localhost:3000/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const userData = response.data;
      setProfile(userData);
      
      // Initialize form with existing data
      setName(userData.name || '');
      setEmail(userData.email || '');
      
      // Set profile image preview if it exists
      if (userData.profile) {
        setPreviewImage(`${userData.profile}`);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile image change
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileImage(file);
      setRemoveProfileImage(false);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle removing the profile image
  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewImage(null);
    setRemoveProfileImage(true);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    // Create FormData object
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    
    if (password) {
      formData.append('password', password);
    }

    if (newPassword) {
      formData.append('newPassword', newPassword);
    }
    
    if (profileImage) {
      formData.append('profile', profileImage);
    }
    
    if (removeProfileImage) {
      formData.append('removeProfile', 'true');
    }
    
    try {
      const response = await axios.put('http://localhost:3000/api/users/update', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.data.profile) {
        localStorage.setItem('profile',response.data.user.profile);
      } else if (removeProfileImage) {
        localStorage.removeItem('profile');
      }
      
      setSuccessMessage('Profile updated successfully!');
      
     
      setPassword('');
      setNewPassword('');
      
     
      fetchProfile();
      
     
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchProfile();
  }, [token, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate('/profile')}
            className="mr-4 p-2 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 transition-colors"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        </div>
        
        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
            {successMessage}
          </div>
        )}
        
        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="bg-[var(--bg-secondary)] rounded-lg p-6 shadow-lg">
          {/* Profile Image Section */}
          <div className="mb-8 flex flex-col items-center">
            <div className="relative mb-4 group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-purple-500/20 border-4 border-purple-500/30">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile preview" 
                    className="w-full h-full object-cover"
                    onError={() => setPreviewImage(null)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaUser className="text-4xl text-purple-400" />
                  </div>
                )}
                
                {/* Image overlay with options */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <label className="p-2 bg-purple-500 text-white rounded-full cursor-pointer hover:bg-purple-600 transition-colors">
                      <FaCamera className="text-lg" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    
                    {previewImage && (
                      <button 
                        type="button"
                        onClick={handleRemoveImage}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-400">
              Hover over your profile picture to change it
            </p>
          </div>
          
          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-2 font-medium">
                Display Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[var(--bg-primary)]/70 border border-gray-700 rounded-lg 
                         text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              />
            </div>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[var(--bg-primary)]/70 border border-gray-700 rounded-lg 
                         text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
              />
            </div>
            
            {/* Password Section */}
            <div className="pt-4 border-t border-gray-700">
              <h2 className="text-xl text-white mb-4">Change Password</h2>
              <p className="text-gray-400 text-sm mb-4">
                Leave the password fields blank if you don't want to change it
              </p>
              
              {/* New Password Field */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-300 mb-2 font-medium">
                  Enter Old Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-primary)]/70 border border-gray-700 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                  minLength={6}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-gray-300 mb-2 font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-primary)]/70 border border-gray-700 rounded-lg 
                           text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                />
              </div>
            </div>
            
            {/* Save Button */}
            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 
                         transition-colors disabled:opacity-70 flex items-center gap-2"
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;