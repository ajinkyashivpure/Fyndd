import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate=useNavigate();
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken')  ;
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
        localStorage.removeItem('token') ||  localStorage.removeItem('authToken') ;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
        </div>
    );
}

if (error) {
    return (
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
    );
}

return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <button 
                onClick={() => navigate('/')}
                className="text-black hover:text-gray-600 flex items-center text-sm sm:text-base"
            >
                ← Back
            </button>
            <h2 className="text-2xl  text-center flex-1">PROFILE</h2>
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
);

};

export default ProfilePage;