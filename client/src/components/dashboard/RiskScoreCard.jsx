const RiskScoreCard = ({ score = 0, loading = false }) => {
  const getRiskLevel = (score) => {
    if (score >= 70) return { level: 'High', color: 'red', gradient: 'from-red-500 to-orange-500' };
    if (score >= 40) return { level: 'Medium', color: 'yellow', gradient: 'from-yellow-500 to-orange-500' };
    return { level: 'Low', color: 'green', gradient: 'from-green-500 to-emerald-500' };
  };

  const risk = getRiskLevel(score);

  const getExplanation = (score) => {
    if (score >= 70) return 'Your digital footprint shows significant exposure. Immediate action recommended.';
    if (score >= 40) return 'Some exposure detected. Review alerts and take preventive action.';
    return 'Your digital identity is well protected. Keep monitoring regularly.';
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl">
        <div className="text-center space-y-6 animate-pulse">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
          <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto" />
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your Digital Risk Score
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Risk Score Circle */}
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-40 h-40 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${(score / 100) * 440} 440`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={`text-${risk.color}-500`} stopColor="currentColor" />
                <stop offset="100%" className={`text-${risk.color}-600`} stopColor="currentColor" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-gray-900 dark:text-white">
              {score}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">/ 100</span>
          </div>
        </div>

        {/* Risk Level Badge */}
        <div className="flex justify-center">
          <span className={`
            inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg
            ${risk.color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' : ''}
            ${risk.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' : ''}
            ${risk.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : ''}
          `}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              {risk.color === 'green' ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              )}
            </svg>
            {risk.level} Risk
          </span>
        </div>

        {/* Explanation */}
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {getExplanation(score)}
        </p>

        {/* Action Button */}
        {score >= 40 && (
          <button className="mt-4 px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/30">
            View Recommendations
          </button>
        )}
      </div>
    </div>
  );
};

export default RiskScoreCard;
