import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import RiskScoreCard from '../components/dashboard/RiskScoreCard';
import api from '../utils/api';

const Scan = () => {
  const navigate = useNavigate();
  const [scanType, setScanType] = useState('email'); // 'email' or 'name'
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanResult, setScanResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      setError(`Please enter ${scanType === 'email' ? 'an email address' : 'a name'}`);
      return;
    }

    // Email validation
    if (scanType === 'email' && !inputValue.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setLoading(true);
    setScanResult(null);

    try {
      const payload = {
        scanTarget: scanType,
        targetValue: inputValue.trim()
      };

      console.log('Starting scan:', payload);
      const response = await api.post('/scan', payload);
      console.log('Scan response:', response.data);

      setScanResult(response.data);
    } catch (error) {
      console.error('Scan error:', error);
      setError(
        error.response?.data?.message || 
        'Failed to complete scan. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInputValue('');
    setScanResult(null);
    setError('');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Run Digital Footprint Scan
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Check your digital exposure and online reputation
          </p>
        </div>

        {!scanResult ? (
          /* Scan Form */
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 lg:p-10 border border-gray-200 dark:border-gray-800 shadow-xl">
            {/* Toggle */}
            <div className="flex items-center justify-center mb-8">
              <div className="inline-flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setScanType('email')}
                  className={`
                    px-6 py-2.5 rounded-lg font-medium transition-all duration-200
                    ${scanType === 'email'
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Address
                  </div>
                </button>
                <button
                  onClick={() => setScanType('name')}
                  className={`
                    px-6 py-2.5 rounded-lg font-medium transition-all duration-200
                    ${scanType === 'name'
                      ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Name
                  </div>
                </button>
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleScan} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {scanType === 'email' ? 'Enter Email Address' : 'Enter Full Name'}
                </label>
                <div className="relative">
                  <input
                    type={scanType === 'email' ? 'email' : 'text'}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setError('');
                    }}
                    placeholder={
                      scanType === 'email'
                        ? 'you@example.com'
                        : 'John Doe'
                    }
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    disabled={loading}
                  />
                  {scanType === 'email' && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">What we'll scan:</p>
                    <ul className="space-y-1 text-blue-600 dark:text-blue-400">
                      <li>• Data breach databases</li>
                      <li>• Public online mentions</li>
                      <li>• Social media exposure</li>
                      <li>• Digital footprint analysis</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 dark:hover:from-primary-600 dark:hover:to-primary-700 text-white text-lg font-semibold rounded-xl shadow-lg shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Scanning... This may take a few seconds</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Run Scan
                  </>
                )}
              </button>
            </form>

            {/* Trust Note */}
            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              🔒 We never access your private accounts. Scans are based on publicly available data only.
            </p>
          </div>
        ) : (
          /* Scan Results */
          <div className="space-y-8">
            {/* Success Message */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                    Scan Completed Successfully
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Scanned: <span className="font-medium">{inputValue}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Score */}
            <RiskScoreCard score={scanResult.data?.riskScore || scanResult.riskScore || 0} loading={false} />

            {/* Detailed Results */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Scan Details
                </h3>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Breach Count */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-xl p-6 border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                      {scanResult.data?.findings?.breachCount || scanResult.findings?.breachCount || 0}
                    </div>
                    <div className="text-sm font-medium text-red-900 dark:text-red-100">
                      Data Breaches Found
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-2">
                      {(scanResult.data?.findings?.breachCount || scanResult.findings?.breachCount || 0) > 0 ? 'Action required' : 'No breaches detected'}
                    </p>
                  </div>

                  {/* Public Mentions */}
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/40 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                      {scanResult.data?.findings?.publicMentions || scanResult.findings?.publicMentions || 0}
                    </div>
                    <div className="text-sm font-medium text-orange-900 dark:text-orange-100">
                      Public Mentions
                    </div>
                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-2">
                      Online visibility score
                    </p>
                  </div>

                  {/* Exposed Accounts */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {scanResult.data?.findings?.exposedAccounts || scanResult.findings?.exposedAccounts || 0}
                    </div>
                    <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Exposed Accounts
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                      Linked social profiles
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleReset}
                className="flex-1 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 text-gray-900 dark:text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Run Another Scan
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 dark:from-primary-500 dark:to-primary-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate('/scans')}
                className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-900 dark:text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View History
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Scan;
