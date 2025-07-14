import React, { useState, useEffect } from 'react';

const FriendsListPage = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [removingFriend, setRemovingFriend] = useState(null);

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
    try {
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) {
            setError('Not logged in');
            return;
        }

        const response = await fetch('https://api.fyndd.in/cart/friends', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch friends');
        }

        const friendsData = await response.json();

        // Deduplicate by friendId
        const seen = new Set();
        const uniqueFriends = friendsData
            .filter(friend => {
                if (seen.has(friend.friendId)) return false;
                seen.add(friend.friendId);
                return true;
            })
            .map(friend => ({
                id: friend.friendId,
                name: friend.friendName,
                cartItemsCount: friend.cartProducts.length
            }));

        setFriends(uniqueFriends);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};


    const handleRemoveFriend = async (friendId) => {
        if (!window.confirm('Are you sure you want to remove this friend?')) {
            return;
        }

        setRemovingFriend(friendId);
        setError(null);

        try {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken')  ;
            if (!token) {
                setError('Not logged in');
                return;
            }

            const response = await fetch(`https://api.fyndd.in/api/friends/${friendId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove friend');
            }

            // Remove the friend from the local state
            setFriends(prev => prev.filter(friend => friend.id !== friendId));
        } catch (err) {
            setError(err.message);
        } finally {
            setRemovingFriend(null);
        }
    };

    const handleViewCart = (friendId) => {
        window.location.href = `/profile/friends-carts?friendId=${friendId}`;
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                </div>
            </div>
        );
    }

    return (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
      <button
        onClick={() => window.history.back()}
        className="text-black hover:text-gray-600 flex items-center text-sm sm:text-base"
      >
        ← Back
      </button>
      <h2 className="text-2xl font-bold text-center flex-1">MY FRIENDS</h2>
      <div className="w-24 sm:w-16"></div>
    </div>

    {/* Error Message */}
    {error && (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm sm:text-base">
        <p className="text-red-600">{error}</p>
      </div>
    )}

    {/* Friends List */}
    {friends.length === 0 ? (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500">No friends found</p>
        <p className="text-gray-400 mt-2">Start by searching for friends to add them</p>
        <button
          onClick={() => window.location.href = '/profile/search-friends'}
          className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Search Friends
        </button>
      </div>
    ) : (
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
          <h3 className="text-lg font-semibold text-center sm:text-left">Friends ({friends.length})</h3>
          <button
            onClick={() => window.location.href = '/profile/search-friends'}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm sm:text-base"
          >
            Add Friends
          </button>
        </div>

        {/* Friend Cards */}
        <div className="space-y-4">
          {friends.map((friend) => (
            <div
              key={friend.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              {/* Friend Info */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-lg text-gray-600">👤</span>
                </div>
                <div>
                  <h4 className="font-semibold text-black text-base sm:text-lg">{friend.name}</h4>
                  <p className="text-gray-600 text-sm">
                    {friend.cartItemsCount > 0
                      ? `${friend.cartItemsCount} items in cart`
                      : 'Cart is empty'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <button
                  onClick={() => handleViewCart(friend.id)}
                  className="px-4 py-2 bg-gray-100 text-black rounded hover:bg-gray-200 font-semibold text-sm sm:text-base"
                >
                  View Cart
                </button>
                <button
                  onClick={() => handleRemoveFriend(friend.id)}
                  disabled={removingFriend === friend.id}
                  className={`px-4 py-2 rounded font-semibold text-sm sm:text-base ${
                    removingFriend === friend.id
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {removingFriend === friend.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Removing...
                    </div>
                  ) : (
                    'Remove'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

};

export default FriendsListPage;