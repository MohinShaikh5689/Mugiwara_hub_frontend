import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            
            const response = await axios.post('http://localhost:3000/api/users/auth/signup', {
                name: formData.username,
                email: formData.email,
                password: formData.password,
                gender: formData.gender
            },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );
            const token = response.data.user.token;
            const isLoggedIn = response.data.user.isLoggedIn;
            const profile = response.data.user.profile;
            localStorage.setItem('profile', JSON.stringify(profile));
            localStorage.setItem('isLoggedIn', isLoggedIn);
            localStorage.setItem('token', token);
            navigate('/');

        } catch (error) {
            console.error(error);
        }finally {
            setIsLoading(false);
        }

        
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 15, 0]
                    }}
                    transition={{ 
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut" 
                    }}
                    className="absolute -top-40 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, -15, 0]
                    }}
                    transition={{ 
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut" 
                    }}
                    className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
                />
            </div>

            {/* Main Content */}
            <motion.div 
                className="relative w-full max-w-md"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Header with Anime-style decorations */}
                <div className="text-center mb-8 relative">
                    <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-32 h-32 opacity-10">
                        <svg viewBox="0 0 200 200" className="absolute">
                            <path
                                d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                                className="text-purple-500 stroke-current"
                                fill="none"
                                strokeWidth="8"
                            >
                                <animateTransform
                                    attributeName="transform"
                                    attributeType="XML"
                                    type="rotate"
                                    from="0 100 100"
                                    to="360 100 100"
                                    dur="20s"
                                    repeatCount="indefinite"
                                />
                            </path>
                        </svg>
                    </div>
                    <motion.h2 
                        className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 
                                 bg-clip-text text-transparent relative z-10"
                        animate={{ 
                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] 
                        }}
                        transition={{ 
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear" 
                        }}
                        style={{ backgroundSize: '200% 200%' }}
                    >
                        Join Our Anime Community
                    </motion.h2>
                    <motion.p 
                        className="mt-2 text-gray-400"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                    >
                        Create your account and start exploring!
                    </motion.p>
                </div>

                {/* Enhanced Form */}
                <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-6 backdrop-blur-sm bg-[var(--bg-secondary)]/30 p-8 rounded-2xl
                             border border-gray-800/50 shadow-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Username Field */}
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 bg-[var(--bg-secondary)] text-white rounded-lg 
                                     border border-gray-700 focus:outline-none focus:border-purple-500
                                     transition-all duration-300 group-hover:border-purple-500/50"
                            placeholder="Choose your username"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                    </div>

                    {/* Email Field */}
                    <div className="group">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 bg-[var(--bg-secondary)] text-white rounded-lg 
                                     border border-gray-700 focus:outline-none focus:border-purple-500
                                     transition-all duration-300 group-hover:border-purple-500/50"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    {/* Enhanced Gender Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                        <div className="grid grid-cols-2 gap-4">
                            {['Male', 'Female'].map((gender) => (
                                <motion.button
                                    key={gender}
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setFormData({...formData, gender: gender.toLowerCase()})}
                                    className={`px-4 py-3 rounded-lg border transition-all duration-300
                                        ${formData.gender === gender.toLowerCase()
                                            ? 'border-purple-500 bg-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/20'
                                            : 'border-gray-700 text-gray-400 hover:border-purple-500/50'
                                        }`}
                                >
                                    {gender}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Password Fields */}
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 bg-[var(--bg-secondary)] text-white rounded-lg 
                                         border border-gray-700 focus:outline-none focus:border-purple-500
                                         transition-all duration-300 group-hover:border-purple-500/50"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                        <div className="group">
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 bg-[var(--bg-secondary)] text-white rounded-lg 
                                         border border-gray-700 focus:outline-none focus:border-purple-500
                                         transition-all duration-300 group-hover:border-purple-500/50"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Enhanced Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white 
                                 rounded-lg font-medium transition-all duration-300 bg-size-200 animate-gradient
                                 hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 
                                 disabled:cursor-not-allowed relative overflow-hidden group"
                    >
                        <span className="relative z-10">
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : 'Create Account'}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>

                    {/* Enhanced Login Link */}
                    <motion.p 
                        className="text-center text-gray-400 text-sm"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        transition={{ delay: 0.4 }}
                    >
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 transition-colors 
                                                   relative after:absolute after:bottom-0 after:left-0 after:w-full 
                                                   after:h-px after:bg-purple-400 after:scale-x-0 hover:after:scale-x-100 
                                                   after:transition-transform after:duration-300">
                            Log in
                        </Link>
                    </motion.p>
                </motion.form>
            </motion.div>
        </div>
    );
};

export default SignUpPage;