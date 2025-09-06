import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage] = useState('profile');
    const navigate = useNavigate();

    // Bottom Navigation Component
    const BottomNavigation = ({ currentPage }) => {
        const navigate = useNavigate();
        
        const navItems = [
            {
                key: 'home',
                icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                ),
                label: 'Home',
                path: '/'
            },
            {
                key: 'search',
                icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                ),
                label: 'Search',
                path: '/search'
            },
            {
                key: 'cart',
                icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                    </svg>
                ),
                label: 'Cart',
                path: '/cart'
            },
            {
                key: 'profile',
                icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                ),
                label: 'Profile',
                path: '/profile'
            }
        ];
    
        return (
            <nav 
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
                style={{ 
                    zIndex: 9000,
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    borderTop: '1px solid #e5e7eb',
                    boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
                    paddingBottom: 'env(safe-area-inset-bottom)',
                }}
            >
                <div className="flex justify-around items-center py-1 px-4 max-w-md mx-auto">
                    {navItems.map((item) => (
                        <button 
                            key={item.key}
                            className={`flex flex-col items-center justify-center p-2 min-w-0 transition-colors duration-200 ${
                                currentPage === item.key 
                                    ? 'text-red-500' 
                                    : 'text-gray-400 hover:text-red-500'
                            }`}
                            onClick={() => navigate(item.path)}
                        >
                            <div className="w-6 h-6 mb-1">
                                {item.icon}
                            </div>
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        );
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken');
            if (!token) {
                setError('Not logged in');
                return;
            }

            const response = await fetch('https://api.fyndd.in/auth/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const userData = await response.json();
            setUser(userData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    const profileOptions = [
        {
            title: 'Search Friends',
            description: 'Find and add new friends',
            path: '/profile/search-friends',
            icon: '🔍'
        },
        {
            title: 'My Friends',
            description: 'View your friends list',
            path: '/profile/friends-list',
            icon: '👥'
        },
        {
            title: 'Friend Requests',
            description: 'Manage pending friend requests',
            path: '/profile/friend-requests',
            icon: '📨'
        },
        {
            title: 'Friends\' Carts',
            description: 'View what your friends are buying',
            path: '/profile/friends-carts',
            icon: '🛒'
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <div className="w-full">
                    <div className="h-screen overflow-y-auto pb-20" style={{ zIndex: 1 }}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <BottomNavigation currentPage={currentPage} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white">
                <div className="w-full">
                    <div className="h-screen overflow-y-auto pb-20" style={{ zIndex: 1 }}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
                            <div className="text-center">
                                <p className="text-xl text-red-500">{error}</p>
                                <button 
                                    onClick={() => navigate('/login')}
                                    className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <BottomNavigation currentPage={currentPage} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content Container */}
            <div className="w-full">
                {/* Scrollable Content Area - Same structure as other pages */}
                <div className="h-screen overflow-y-auto pb-20" style={{ zIndex: 1 }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <button 
                                onClick={() => navigate('/')}
                                className="text-black hover:text-gray-600 flex items-center text-sm sm:text-base"
                            >
                                ← Back
                            </button>
                            <h2 className="text-2xl text-center flex-1">PROFILE</h2>
                            <div className="w-16"></div>
                        </div>

                        {/* User Info */}
                        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
                            <div className="flex items-center flex-col sm:flex-row text-center sm:text-left">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-0 sm:mr-4 mb-4 sm:mb-0">
                                    <span className="text-2xl text-gray-600">👤</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-black">{user?.name || 'User'}</h3>
                                    <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            {profileOptions.map((option, index) => (
                                <div 
                                    key={index}
                                    onClick={() => handleNavigation(option.path)}
                                    className="bg-white shadow-md rounded-lg p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-shadow border hover:border-gray-300"
                                >
                                    <div className="flex items-center mb-2">
                                        <span className="text-2xl mr-3">{option.icon}</span>
                                        <h3 className="text-lg font-semibold text-black">{option.title}</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm sm:text-base">{option.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* Logout Button */}
                        <div className="text-center">
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition-colors font-semibold w-full sm:w-auto"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Fixed Bottom Navigation - Always on top */}
            <BottomNavigation currentPage={currentPage} />

            {/* Custom Styles - Same as other pages */}
            <style jsx>{`
                /* Ensure proper scrolling behavior */
                html, body {
                    height: 100%;
                    overflow: hidden;
                }
                
                /* Custom scrollbar for the main content */
                .overflow-y-auto::-webkit-scrollbar {
                    width: 4px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                :root {
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
}

.bottom-nav {
  padding-bottom: var(--safe-area-inset-bottom);
}

                
                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: rgba(156, 163, 175, 0.5);
                    border-radius: 2px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: rgba(156, 163, 175, 0.7);
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;