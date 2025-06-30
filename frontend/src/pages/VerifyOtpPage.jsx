import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Get email and name from navigation state
  const email = location.state?.email || '';
  const name = location.state?.name || '';
  const fromSignup = location.state?.fromSignup || false;

  // Redirect if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow numeric input
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear error message when user starts typing
    if (message.type === 'error') {
      setMessage({ type: '', text: '' });
    }

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasteData.length === 4) {
      setOtp(pasteData.split(''));
      inputRefs.current[3]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setMessage({ type: 'error', text: 'Please enter the complete 4-digit OTP' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('https://api.fyndd.in/auth/user/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otpString)}`
      });

      if (response.ok) {
        const data = await response.text();
        setMessage({ type: 'success', text: 'Account verified successfully! Redirecting to login...' });
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              email: email,
              message: 'Account created successfully! Please sign in.'
            } 
          });
        }, 2000);
      } else {
        const errorText = await response.text();
        setMessage({ 
          type: 'error', 
          text: errorText || 'Invalid OTP. Please try again.' 
        });
        // Clear OTP on error
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP (placeholder - you'll need to implement the resend endpoint)
  const handleResendOtp = async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // This would need a resend OTP endpoint
      // const response = await fetch('https://api.fyndd.in/auth/user/resend-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      //   body: `email=${encodeURIComponent(email)}`
      // });

      // For now, just show success message and reset timer
      setMessage({ type: 'success', text: 'OTP resent successfully!' });
      setTimeLeft(300);
      setCanResend(false);
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Resend OTP error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to resend OTP. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-black relative inline-block mb-2">
            FYNDD
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            Verify your email address
          </p>
        </div>

        {/* Verification Info */}
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Enter Verification Code
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            We've sent a 4-digit code to
          </p>
          <p className="text-black font-medium text-sm sm:text-base break-all">
            {email}
          </p>
        </div>
        
        {/* Message Display */}
        {message.text && (
          <div 
            className={`p-3 sm:p-4 rounded-lg text-center text-sm sm:text-base transition-all duration-300 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
            role="alert"
            aria-live="polite"
          >
            {message.text}
          </div>
        )}

        {/* OTP Form */}
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          {/* OTP Input Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Verification Code
            </label>
            <div className="flex justify-center space-x-3 sm:space-x-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="text-center">
            {!canResend ? (
              <p className="text-gray-600 text-sm">
                Resend code in <span className="font-medium text-black">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-black hover:underline font-medium text-sm focus:outline-none focus:underline transition-all duration-200 disabled:opacity-50"
              >
                Resend Code
              </button>
            )}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isLoading || otp.join('').length !== 4}
            className="w-full bg-black text-white py-2.5 sm:py-3 px-4 rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black text-base"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify Code'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Didn't receive the code?{' '}
            <button 
              className="text-black hover:underline font-medium focus:outline-none focus:underline transition-all duration-200" 
              onClick={handleBackToSignup}
              type="button"
            >
              Back to Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;