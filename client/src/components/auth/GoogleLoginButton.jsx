import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../../utils/api';

const GoogleLoginButton = ({ onError }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      console.log('Google credential received:', credentialResponse);
      
      // Send credential to backend
      const response = await api.post('/auth/google', {
        idToken: credentialResponse.credential,
      });

      console.log('Backend response:', response.data);

      // Extract token from response
      const token = response.data.data?.token || response.data.token;

      if (token) {
        localStorage.setItem('token', token);
        console.log('Google login successful, redirecting...');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (onError) {
        onError(error.response?.data?.message || 'Google login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    console.error('Google login failed:', error);
    
    // Check if it's an authorization error
    if (error && typeof error === 'object') {
      console.error('Google OAuth Error Details:', error);
    }
    
    if (onError) {
      onError('Google login failed. Please check the setup guide (GOOGLE_OAUTH_SETUP.md) or use Email/Password login.');
    }
  };

  if (loading) {
    return (
      <button
        disabled
        className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl font-medium text-gray-900 dark:text-white flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
      >
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Signing in with Google...
      </button>
    );
  }

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        size="large"
        width="100%"
        theme="outline"
        text="continue_with"
        shape="rectangular"
        logo_alignment="left"
        useOneTap={false}
        cancel_on_tap_outside={true}
      />
    </div>
  );
};

export default GoogleLoginButton;
