import React, { useState, useEffect } from 'react';

const SearchFriendsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sendingRequest, setSendingRequest] = useState(null);
    const [existingFriends, setExistingFriends] = useState(new Set());
    const [pendingRequests, setPendingRequests] = useState(new Set());
    const [rejectedRequests, setRejectedRequests] = useState(new Set());

    const fetchExistingFriends = async () => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken');
            if (!token) {
                return;
            }

            const response = await fetch('https://api.fyndd.in/cart/friends', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const friendsData = await response.json();
                const friendIds = new Set(friendsData.map(friend => friend.friendId));
                setExistingFriends(friendIds);
                
                // Remove any users who are now friends from pending requests and update localStorage
                setPendingRequests(prev => {
                    const updated = new Set(prev);
                    friendIds.forEach(friendId => updated.delete(friendId));
                    localStorage.setItem('pendingFriendRequests', JSON.stringify([...updated]));
                    return updated;
                });
            }
        } catch (err) {
            console.error('Failed to fetch existing friends:', err);
        }
    };

    // Since there's no endpoint for sent requests, we'll manage this locally
    const initializePendingRequests = () => {
        // Initialize pending requests from localStorage
        const savedPending = localStorage.getItem('pendingFriendRequests');
        if (savedPending) {
            try {
                const parsed = JSON.parse(savedPending);
                setPendingRequests(new Set(parsed));
            } catch (err) {
                console.error('Failed to parse saved pending requests:', err);
            }
        }

        // Initialize rejected requests from localStorage
        const savedRejected = localStorage.getItem('rejectedFriendRequests');
        if (savedRejected) {
            try {
                const parsed = JSON.parse(savedRejected);
                setRejectedRequests(new Set(parsed));
            } catch (err) {
                console.error('Failed to parse saved rejected requests:', err);
            }
        }
    };

    const checkForRejectedRequests = async () => {
        // Since there's no rejected endpoint, use timeout approach
        // Consider requests as potentially rejected/expired after 24 hours
        const pendingRequestsWithTime = JSON.parse(localStorage.getItem('pendingRequestsWithTime') || '{}');
        const now = new Date().getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        const expiredRequests = Object.entries(pendingRequestsWithTime)
            .filter(([userId, timestamp]) => now - timestamp > twentyFourHours)
            .map(([userId]) => userId);

        if (expiredRequests.length > 0) {
            // Remove expired requests from pending (allows retry)
            setPendingRequests(prev => {
                const updated = new Set(prev);
                expiredRequests.forEach(userId => updated.delete(userId));
                localStorage.setItem('pendingFriendRequests', JSON.stringify([...updated]));
                return updated;
            });

            // Remove from time tracking
            const updatedTimeTracking = { ...pendingRequestsWithTime };
            expiredRequests.forEach(userId => delete updatedTimeTracking[userId]);
            localStorage.setItem('pendingRequestsWithTime', JSON.stringify(updatedTimeTracking));
        }
    };

    // Fetch existing friends on component mount
    useEffect(() => {
        fetchExistingFriends();
        initializePendingRequests();
        
        // Set up periodic refresh to check if pending requests were accepted or expired
        const interval = setInterval(() => {
            fetchExistingFriends();
            checkForRejectedRequests();
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setError('Please enter a username to search');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken');
            if (!token) {
                setError('Not logged in');
                return;
            }

            const response = await fetch(`https://api.fyndd.in/api/friends/search?query=${encodeURIComponent(searchQuery)}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to search users');
            }

            const results = await response.json();
            setSearchResults(results);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendFriendRequest = async (userId) => {
        setSendingRequest(userId);
        setError(null);

        try {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken');
            if (!token) {
                setError('Not logged in');
                return;
            }

            const response = await fetch(`https://api.fyndd.in/api/friends/request/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to send friend request');
            }

            // Update the search results to reflect the sent request
            setSearchResults(prev => prev.map(user => 
                user.id === userId 
                    ? { ...user, requestStatus: 'PENDING' }
                    : user
            ));

            // Add to pending requests set and save to localStorage
            setPendingRequests(prev => {
                const updated = new Set([...prev, userId]);
                localStorage.setItem('pendingFriendRequests', JSON.stringify([...updated]));
                return updated;
            });

            // Remove from rejected requests if it was there (clean slate)
            setRejectedRequests(prev => {
                const updated = new Set(prev);
                updated.delete(userId);
                localStorage.setItem('rejectedFriendRequests', JSON.stringify([...updated]));
                return updated;
            });

            // Track timestamp for timeout approach
            const pendingRequestsWithTime = JSON.parse(localStorage.getItem('pendingRequestsWithTime') || '{}');
            pendingRequestsWithTime[userId] = new Date().getTime();
            localStorage.setItem('pendingRequestsWithTime', JSON.stringify(pendingRequestsWithTime));

        } catch (err) {
            setError(err.message);
        } finally {
            setSendingRequest(null);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const getUserStatus = (user) => {
        if (user.isFriend || existingFriends.has(user.id)) {
            return 'FRIEND';
        }
        if (user.requestStatus === 'PENDING' || pendingRequests.has(user.id)) {
            return 'PENDING';
        }
        // Note: rejectedRequests state is kept for potential future use
        // but since there's no rejected endpoint, expired requests just go back to 'NONE'
        return 'NONE';
    };

    const getButtonText = (user) => {
        const status = getUserStatus(user);
        switch (status) {
            case 'FRIEND':
                return 'Already Added';
            case 'PENDING':
                return 'Request Sent';
            default:
                return 'Add Friend';
        }
    };

    const getButtonClass = (user) => {
        const status = getUserStatus(user);
        switch (status) {
            case 'FRIEND':
                return 'bg-green-600 text-white cursor-not-allowed';
            case 'PENDING':
                return 'bg-yellow-600 text-white cursor-not-allowed';
            default:
                return 'bg-black text-white hover:bg-gray-800';
        }
    };

    const isButtonDisabled = (user) => {
        const status = getUserStatus(user);
        return (status === 'FRIEND' || status === 'PENDING') || sendingRequest === user.id;
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <button 
                    onClick={() => window.history.back()}
                    className="text-black hover:text-gray-600 flex items-center"
                >
                    ← Back
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-center flex-1">SEARCH FRIENDS</h2>
                <div className="w-16 hidden sm:block"></div>
            </div>

            {/* Search Input */}
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter exact username"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className={`w-full sm:w-auto px-6 py-2 rounded font-semibold ${
                            loading 
                                ? 'bg-gray-400 text-white cursor-not-allowed' 
                                : 'bg-black text-white hover:bg-gray-800'
                        }`}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Searching...
                            </div>
                        ) : (
                            'Search'
                        )}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-600 text-sm sm:text-base">{error}</p>
                </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4">Search Results</h3>
                    <div className="space-y-4">
                        {searchResults.map((user) => (
                            <div 
                                key={user.id} 
                                className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-4 w-full">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                        <span className="text-lg text-gray-600">👤</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-black text-base">{user.name}</h4>
                                        <p className="text-gray-600 text-sm">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSendFriendRequest(user.id)}
                                    disabled={isButtonDisabled(user)}
                                    className={`w-full sm:w-auto px-4 py-2 rounded font-semibold transition-colors ${getButtonClass(user)}`}
                                >
                                    {sendingRequest === user.id ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Sending...
                                        </div>
                                    ) : (
                                        getButtonText(user)
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Results Message */}
            {!loading && searchQuery && searchResults.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500">No users found with username "{searchQuery}"</p>
                    <p className="text-gray-400 mt-2">Make sure you're searching for the exact username</p>
                </div>
            )}
        </div>
    );
};

export default SearchFriendsPage;