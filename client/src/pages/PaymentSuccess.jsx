import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import api from '../utils/api';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verify Stripe payment if session_id is present
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifyStripePayment(sessionId);
    } else {
      // No session_id means Razorpay (already verified)
      setVerifying(false);
      startCountdown();
    }
  }, [searchParams]);

  const verifyStripePayment = async (sessionId) => {
    try {
      const response = await api.post('/subscribe/verify-stripe', {
        session_id: sessionId,
      });
      
      console.log('Stripe payment verified:', response.data);
      setVerifying(false);
      startCountdown();
    } catch (error) {
      console.error('Stripe verification error:', error);
      setError(error.response?.data?.message || 'Payment verification failed');
      setVerifying(false);
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Verifying Payment...
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we confirm your payment
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Verification Error
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>
            <button
              onClick={() => navigate('/subscription')}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <CheckCircleIcon className="w-12 h-12 text-white" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Congratulations! Your subscription has been activated successfully.
          </p>

          {/* Pro Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full mb-8 shadow-lg">
            <SparklesIcon className="w-5 h-5" />
            <span className="font-semibold">You are now a PRO user!</span>
          </div>

          {/* Features Unlocked */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl p-6 mb-6 border border-indigo-200 dark:border-indigo-800">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Features Unlocked:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                Unlimited Scans
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                Weekly Auto Monitoring
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                Priority Alerts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-600" />
                Premium Support
              </li>
            </ul>
          </div>

          {/* Redirect Info */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Redirecting to dashboard in <span className="font-bold text-indigo-600 dark:text-indigo-400">{countdown}</span> seconds...
          </p>

          {/* Manual Navigation */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go to Dashboard Now
          </button>
        </div>

        {/* Session Info (if available) */}
        {searchParams.get('session_id') && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Session ID: {searchParams.get('session_id').substring(0, 20)}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
