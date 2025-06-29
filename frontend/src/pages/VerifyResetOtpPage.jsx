import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyResetOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < 5) {
        const nextInput = document.getElementById(`reset-otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`reset-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter all 6 digits' });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('https://api.fyndd.in/auth/user/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otpString })
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'OTP verified! You can now reset your password.' });
      } else {
        setMessage({ type: 'error', text: 'Invalid OTP' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black relative inline-block mb-2">
            FYNDD
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
          </h1>
          <p className="text-gray-600">Verify reset code</p>
          <p className="text-sm text-gray-500 mt-2">
            Enter the 6-digit code sent to your email
          </p>
        </div>
        
        {message.text && (
          <div className={`p-4 rounded-lg text-center ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter Reset Code
            </label>
            <div className="flex gap-3 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`reset-otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                  maxLength={1}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        <div className="text-center">
          <button className="text-black hover:underline text-sm">
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetOtpPage;