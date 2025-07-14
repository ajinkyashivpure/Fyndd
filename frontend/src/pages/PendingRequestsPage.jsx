import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PendingRequestsPage = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingRequests, setProcessingRequests] = useState(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken');
            if (!token) {
                setError('Not logged in');
                return;
            }

            const response = await fetch('https://api.fyndd.in/api/friends/requests', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch pending requests');
            }

            const data = await response.json();
            setPendingRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        setProcessingRequests(prev => new Set(prev).add(requestId));
        
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken');
            if (!token) {
                setError('Not logged in');
                return;
            }

            const response = await fetch(`https://api.fyndd.in/api/friends/accept/${requestId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to accept friend request');
            }

            // Remove the accepted request from the list
            setPendingRequests(prev => prev.filter(request => request.id !== requestId));
            
            // Show success message
            alert('Friend request accepted!');
        } catch (err) {
            alert('Error accepting request: ' + err.message);
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(requestId);
                return newSet;
            });
        }
    };

    const handleRejectRequest = async (requestId) => {
        setProcessingRequests(prev => new Set(prev).add(requestId));
        
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('authToken');
            if (!token) {
                setError('Not logged in');
                return;
            }

            const response = await fetch(`https://api.fyndd.in/api/friends/reject/${requestId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to reject friend request');
            }

            // Remove the rejected request from the list
            setPendingRequests(prev => prev.filter(request => request.id !== requestId));
            
            // Show success message
            alert('Friend request rejected.');
        } catch (err) {
            alert('Error rejecting request: ' + err.message);
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(requestId);
                return newSet;
            });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
                        onClick={() => navigate('/profile')}
                        className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
                    >
                        Back to Profile
                    </button>
                </div>
            </div>
        );
    }

   return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 mb-6">
            <button 
                onClick={() => navigate('/profile')}
                className="text-black hover:text-gray-600 flex items-center text-sm sm:text-base"
            >
                ← Back to Profile
            </button>
            <h2 className="text-2xl font-bold text-center sm:flex-1">FRIEND REQUESTS</h2>
            <div className="w-16 hidden sm:block"></div>
        </div>

        {/* Pending Requests Count */}
        <div className="mb-6">
            <p className="text-gray-600 text-center text-sm sm:text-base">
                {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''}
            </p>
        </div>

        {/* Pending Requests List */}
        {pendingRequests.length === 0 ? (
            <div className="text-center py-12">
                <div className="text-5xl sm:text-6xl mb-4">📨</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">No Pending Requests</h3>
                <p className="text-gray-500 text-sm sm:text-base">
                    You don't have any pending friend requests.
                </p>
                <button 
                    onClick={() => navigate('/profile/search-friends')}
                    className="mt-4 bg-black text-white px-5 py-2 rounded hover:bg-gray-800 text-sm sm:text-base"
                >
                    Search for Friends
                </button>
            </div>
        ) : (
            <div className="space-y-4">
                {pendingRequests.map((request) => (
                    <div key={request.id} className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                            {/* Request Info */}
                            <div className="flex items-center flex-1">
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                                    <span className="text-lg text-gray-600">👤</span>
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-semibold text-black">
                                        {request.senderName}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Sent {formatDate(request.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 sm:ml-4">
                                <button
                                    onClick={() => handleAcceptRequest(request.id)}
                                    disabled={processingRequests.has(request.id)}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                                >
                                    {processingRequests.has(request.id) ? 'Accepting...' : 'Accept'}
                                </button>
                                <button
                                    onClick={() => handleRejectRequest(request.id)}
                                    disabled={processingRequests.has(request.id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                                >
                                    {processingRequests.has(request.id) ? 'Rejecting...' : 'Reject'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

};

export default PendingRequestsPage;