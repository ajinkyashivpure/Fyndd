import React, { useState } from 'react';

const SearchFriendsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sendingRequest, setSendingRequest] = useState(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setError('Please enter a username to search');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken') ;
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
            const token = localStorage.getItem('token') || localStorage.getItem('authToken') ;
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

    const getButtonText = (user) => {
        if (user.isFriend) return 'Already Friends';
        if (user.requestStatus === 'PENDING') return 'Request Sent';
        return 'Add Friend';
    };

    const getButtonClass = (user) => {
        if (user.isFriend) return 'bg-green-600 text-white cursor-not-allowed';
        if (user.requestStatus === 'PENDING') return 'bg-yellow-600 text-white cursor-not-allowed';
        return 'bg-black text-white hover:bg-gray-800';
    };

    const isButtonDisabled = (user) => {
        return user.isFriend || user.requestStatus === 'PENDING' || sendingRequest === user.id;
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