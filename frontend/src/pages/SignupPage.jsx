import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });
  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 1;
    else if (password.length >= 6) score += 0.5;
    
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score, text: 'Weak', color: 'text-red-600' };
    if (score <= 3) return { score, text: 'Medium', color: 'text-yellow-600' };
    return { score, text: 'Strong', color: 'text-green-600' };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Calculate password strength for password field
    if (name === 'password') {
      if (value.length > 0) {
        setPasswordStrength(calculatePasswordStrength(value));
      } else {
        setPasswordStrength({ score: 0, text: '', color: '' });
      }
    }
    
    // Clear error message when user starts typing
    if (message.type === 'error') {
      setMessage({ type: '', text: '' });
    }
  };

  const handleClick = () => {
    navigate('/login');
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(prev => !prev);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(prev => !prev);
    }
  };

  const validateForm = () => {
    // Name validation
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Full name is required' });
      return false;
    }
    
    if (formData.name.trim().length < 2) {
      setMessage({ type: 'error', text: 'Name must be at least 2 characters long' });
      return false;
    }

    // Email validation
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Email address is required' });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return false;
    }

    // Password validation
    if (!formData.password) {
      setMessage({ type: 'error', text: 'Password is required' });
      return false;
    }
    
    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Please confirm your password' });
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch('https://api.fyndd.in/auth/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Account created successfully! Redirecting to OTP verification...' });
        setTimeout(() => {
          // Pass the email and name to the OTP verification page
          navigate('/verify-otp', { 
            state: { 
              email: formData.email.trim().toLowerCase(),
              name: formData.name.trim(),
              fromSignup: true
            } 
          });
        }, 1500);
      } else {
        setMessage({ type: 'error', text: data.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setIsLoading(false);
    }
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
            Join the fashion community
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

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" noValidate>
          {/* Full Name Field */}
          <div>
            <label 
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              autoComplete="name"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-base"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label 
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              autoComplete="email"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-base"
              placeholder="Enter your email address"
            />
          </div>

          {/* Password Field */}
          <div>
            <label 
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                autoComplete="new-password"
                minLength={6}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-base"
                placeholder="Create a password (min 6 characters)"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('password')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <svg 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 8.464m5.656 5.656l1.415 1.415m-1.415-1.415l1.415 1.415M12 3c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21l-6.868-6.868" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  )}
                </svg>
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.score <= 1 ? 'bg-red-500 w-1/3' :
                        passwordStrength.score <= 3 ? 'bg-yellow-500 w-2/3' :
                        'bg-green-500 w-full'
                      }`}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    {passwordStrength.text}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label 
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                autoComplete="new-password"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 text-base"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirmPassword')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                <svg 
                  className="h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {showConfirmPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L8.464 8.464m5.656 5.656l1.415 1.415m-1.415-1.415l1.415 1.415M12 3c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21l-6.868-6.868" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  )}
                </svg>
              </button>
            </div>
            
            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className="mt-1">
                {formData.password === formData.confirmPassword ? (
                  <p className="text-xs text-green-600 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Passwords match
                  </p>
                ) : (
                  <p className="text-xs text-red-600 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Passwords don't match
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
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
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button 
              className="text-black hover:underline font-medium focus:outline-none focus:underline transition-all duration-200" 
              onClick={handleClick}
              type="button"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;