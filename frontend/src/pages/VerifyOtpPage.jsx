import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);
  
  // Get email/name from previous page state
  const { email, name, fromSignup } = location.state || {};

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  useEffect(() => {
    // Redirect back if no email provided
    if (!email) {
      navigate('/signup', { replace: true });
      return;
    }

    // Focus on the first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [email, navigate]);

  // Resend timer effect
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => timer - 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Auto-clear success messages
  useEffect(() => {
    if (message.type === 'success' && message.text.includes('resent')) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleOtpChange = (index, value) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;
    
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Clear error message when user starts typing
      if (message.type === 'error') {
        setMessage({ type: '', text: '' });
      }
      
      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
    // Handle arrow keys
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Handle paste
    else if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handlePaste();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const digits = text.replace(/\D/g, '').slice(0, 6);
      
      if (digits.length === 6) {
        const newOtp = digits.split('');
        setOtp(newOtp);
        inputRefs.current[5]?.focus();
        
        // Clear any existing error messages
        if (message.type === 'error') {
          setMessage({ type: '', text: '' });
        }
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleInputClick = (index) => {
    // Focus on the first empty input or the clicked input
    const firstEmptyIndex = otp.findIndex(digit => !digit);
    const targetIndex = firstEmptyIndex !== -1 ? Math.min(firstEmptyIndex, index) : index;
    inputRefs.current[targetIndex]?.focus();
  };

  const validateOtp = () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter all 6 digits' });
      // Focus on first empty input
      const firstEmptyIndex = otp.findIndex(digit => !digit);
      if (firstEmptyIndex !== -1) {
        inputRefs.current[firstEmptyIndex]?.focus();
      }
      return false;
    }
    
    if (!/^\d{6}$/.test(otpString)) {
      setMessage({ type: 'error', text: 'OTP must contain only numbers' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateOtp()) {
      return;
    }

    const otpString = otp.join('');
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch('https://api.fyndd.in/auth/user/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          otp: otpString,
          email: email.trim().toLowerCase()
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'OTP verified successfully!' });
        
        // Store token if provided
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        // Store user info if provided
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Redirect based on context
        setTimeout(() => {
          if (fromSignup) {
            navigate('/login', { 
              replace: true,
              state: { message: 'Account verified successfully! Please login with your credentials.' }
            });
          } else {
            // For password reset or other flows
            navigate('/', { replace: true });
          }
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Invalid OTP. Please check and try again.' });
        // Clear OTP inputs on error
        setOtp(['', '', '', '', '', '']);
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

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setIsResending(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch('https://api.fyndd.in/auth/user/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase()
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'New OTP sent successfully!' });
        // Clear current OTP inputs
        setOtp(['', '', '', '', '', '']);
        // Focus on first input
        inputRefs.current[0]?.focus();
        // Start resend timer
        setResendTimer(60); // 60 seconds
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to resend OTP. Please try again.' });
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignup = () => {
    navigate('/signup', { replace: true });
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
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-4">
            Verify your account
          </h2>
          <div className="mt-3 space-y-1">
            {name && (
              <p className="text-sm sm:text-base text-gray-600">
                Hi <span className="font-medium">{name}</span>!
              </p>
            )}
            <p className="text-xs sm:text-sm text-gray-500">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-sm sm:text-base font-medium text-gray-700 break-all">
              {email}
            </p>
          </div>
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
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter Verification Code
            </label>
            <div className="flex gap-2 sm:gap-3 justify-center px-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onClick={() => handleInputClick(index)}
                  className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 bg-white"
                  maxLength={1}
                  inputMode="numeric"
                  pattern="[0-9]"
                  autoComplete="one-time-code"
                  aria-label={`Digit ${index + 1} of verification code`}
                />
              ))}
            </div>
            
            {/* Paste hint */}
            <p className="text-xs text-gray-500 text-center mt-2">
              You can paste the complete code from your clipboard
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
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
              'Verify OTP'
            )}
          </button>
        </form>

        {/* Footer Actions */}
        <div className="text-center space-y-3">
          <p className="text-gray-600 text-sm">
            Didn't receive the code?{' '}
            <button 
              onClick={handleResendOtp}
              disabled={isResending || resendTimer > 0}
              className="text-black hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:underline transition-all duration-200"
              type="button"
            >
              {isResending ? 'Resending...' : 
               resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
            </button>
          </p>
          
          <p className="text-gray-600 text-sm">
            Wrong email?{' '}
            <button 
              onClick={handleBackToSignup}
              className="text-black hover:underline font-medium focus:outline-none focus:underline transition-all duration-200"
              type="button"
            >
              Back to Signup
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;