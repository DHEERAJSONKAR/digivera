import { useNavigate } from 'react-router-dom';

const PlanCard = ({ plan = 'free', loading = false }) => {
  const navigate = useNavigate();
  const isPro = plan.toLowerCase() === 'pro';

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <div className={`
      rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl
      ${isPro 
        ? 'bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-800' 
        : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
      }
    `}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {isPro ? 'Pro Plan' : 'Free Plan'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isPro ? '₹299/month' : '₹0/month'}
          </p>
        </div>
        {isPro && (
          <span className="px-3 py-1 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-xs font-bold rounded-full">
            ACTIVE
          </span>
        )}
      </div>

      {isPro ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Auto monitoring active</span>
          </div>

          <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Scans this month</span>
              <span className="font-bold text-gray-900 dark:text-white">Unlimited</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Weekly monitoring</span>
              <span className="font-bold text-green-600 dark:text-green-400">✓ Active</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Priority support</span>
              <span className="font-bold text-green-600 dark:text-green-400">✓ Enabled</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/subscription')}
            className="w-full py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors"
          >
            Manage Subscription
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>1 scan per month</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Basic risk score</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-600 text-sm line-through">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>Weekly monitoring</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-600 text-sm line-through">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>Email alerts</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Upgrade to Pro for unlimited scans and real-time monitoring
            </p>
            <button
              onClick={() => navigate('/subscription')}
              className="w-full py-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-lg font-medium text-sm transition-all shadow-lg shadow-primary-500/30"
            >
              Upgrade to Pro - ₹299/month
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanCard;
