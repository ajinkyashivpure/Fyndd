import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(
  `https://api.fyndd.in/auth/user/forgot-password?email=${encodeURIComponent(email)}`,
  {
    method: 'POST',
  }
);
      
      if (response.ok) {
  const responseText = await response.text();
  setMessage({ type: 'success', text: responseText });

 
  setTimeout(() => {
    navigate('/verify-reset-otp', { state: { email } }); 
  }, 1500);
} else {
        setMessage({ type: 'error', text: 'Email not found' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
  <div className="w-full max-w-md space-y-8">
    <div className="text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-black relative inline-block mb-2">
        FYNDD
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
      </h1>
      <p className="text-gray-600 text-base sm:text-lg">Reset your password</p>
      <p className="text-sm text-gray-500 mt-2">
        Enter your email and we'll send you a reset link
      </p>
    </div>

    {message.text && (
      <div
        className={`p-4 rounded-lg text-center text-sm ${
          message.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}
      >
        {message.text}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-sm sm:text-base"
          placeholder="Enter your email"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black text-white py-2 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>

    <div className="text-center">
      <button
        className="text-black hover:underline text-sm sm:text-base"
        onClick={() => navigate('/login')}
      >
        Back to Sign In
      </button>
    </div>
  </div>
</div>
  );
};

export default ForgotPasswordPage;