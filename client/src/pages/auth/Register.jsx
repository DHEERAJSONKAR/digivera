import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import Input from '../../components/auth/Input';
import Button from '../../components/auth/Button';
import Divider from '../../components/auth/Divider';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';
import api from '../../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      console.log('Full Register response:', response);
      console.log('Response data:', response.data);
      
      // Check multiple possible token locations
      const token = response.data.token || response.data.data?.token || response.data.accessToken;
      
      if (token) {
        localStorage.setItem('token', token);
        console.log('Token saved successfully:', token.substring(0, 20) + '...');
        console.log('Redirecting to dashboard...');
        
        // Force redirect after small delay to ensure token is saved
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 100);
      } else {
        console.error('Token not found in response:', response.data);
        setErrors({ submit: 'Registration successful but no token received. Response: ' + JSON.stringify(response.data) });
      }
    } catch (error) {
      console.error('Register error:', error);
      console.error('Error response:', error.response);
      setErrors({ 
        submit: error.response?.data?.message || error.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:5000/api/google-auth';
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create your DIGIVERA account
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Start protecting your digital identity in seconds
          </p>
        </div>

        {errors.submit && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                autoComplete="new-password"
                icon={
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />

              <Button type="submit" loading={loading}>
                Create Account
              </Button>
            </form>

            <Divider />

            <GoogleLoginButton onError={(error) => setErrors({ submit: error })} />

        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              Login
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
