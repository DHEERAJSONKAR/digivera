import { useNavigate } from 'react-router-dom';
import { XCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Cancel Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
          {/* Cancel Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mb-6">
            <XCircleIcon className="w-12 h-12 text-white" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Payment Cancelled
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your payment was cancelled. No charges have been made to your account.
          </p>

          {/* Info Box */}
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6 mb-8 border border-orange-200 dark:border-orange-800">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              You can try again anytime to unlock premium features:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 text-left">
              <li>✓ Unlimited Scans</li>
              <li>✓ Weekly Auto Monitoring</li>
              <li>✓ Priority Alerts</li>
              <li>✓ Premium Support</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/subscription')}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Try Again
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Support Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help?{' '}
            <a
              href="mailto:support@digivera.com"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
