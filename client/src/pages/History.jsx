import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import api from '../utils/api';
import { 
  ClockIcon, 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const History = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/scan/history');
      console.log('History response:', response.data); // Debug log
      
      // Handle nested data structure from backend
      const scansData = response.data.data?.scans || response.data.scans || response.data || [];
      const scansArray = Array.isArray(scansData) ? scansData : [];
      
      console.log('Setting scans:', scansArray); // Debug log
      setScans(scansArray);
    } catch (error) {
      console.error('Error fetching scan history:', error);
      setScans([]);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityConfig = (riskScore) => {
    if (riskScore >= 70) {
      return {
        label: 'High Risk',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        textColor: 'text-red-700 dark:text-red-400',
        badgeBg: 'bg-red-100 dark:bg-red-900/50',
        badgeText: 'text-red-700 dark:text-red-300',
        icon: ExclamationTriangleIcon,
        scoreColor: 'text-red-600 dark:text-red-400'
      };
    } else if (riskScore >= 40) {
      return {
        label: 'Medium Risk',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        textColor: 'text-yellow-700 dark:text-yellow-400',
        badgeBg: 'bg-yellow-100 dark:bg-yellow-900/50',
        badgeText: 'text-yellow-700 dark:text-yellow-300',
        icon: ShieldCheckIcon,
        scoreColor: 'text-yellow-600 dark:text-yellow-400'
      };
    } else {
      return {
        label: 'Low Risk',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        borderColor: 'border-green-200 dark:border-green-800',
        textColor: 'text-green-700 dark:text-green-400',
        badgeBg: 'bg-green-100 dark:bg-green-900/50',
        badgeText: 'text-green-700 dark:text-green-300',
        icon: CheckCircleIcon,
        scoreColor: 'text-green-600 dark:text-green-400'
      };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInMs / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      const days = Math.floor(diffInDays);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div>
              <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Scan History
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View all your previous digital footprint scans
              </p>
            </div>
            <button
              onClick={() => navigate('/scan')}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              New Scan
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && scans.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-200 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Scan History Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You haven't run any scans yet. Start by scanning your email or name to discover your digital footprint.
            </p>
            <button
              onClick={() => navigate('/scan')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              Run Your First Scan
            </button>
          </div>
        )}

        {/* Scan History List */}
        {!loading && scans.length > 0 && (
          <div className="space-y-4">
            {scans.map((scan) => {
              const config = getSeverityConfig(scan.riskScore || 0);
              const SeverityIcon = config.icon;

              return (
                <div
                  key={scan._id || scan.id}
                  className={`${config.bgColor} ${config.borderColor} border rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-start justify-between gap-6">
                    {/* Left Section: Scan Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`${config.badgeBg} p-2.5 rounded-lg`}>
                          <SeverityIcon className={`w-5 h-5 ${config.textColor}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {scan.targetValue || scan.target || scan.email || scan.name || 'Unknown Target'}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <ClockIcon className="w-4 h-4" />
                            <span>{formatDate(scan.createdAt || scan.date)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Scan Metrics */}
                      <div className="flex items-center gap-6 mt-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Data Breaches</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {scan.findings?.breachCount || scan.breaches || scan.dataBreaches || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Online Mentions</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {scan.findings?.publicMentions || scan.mentions || scan.onlineMentions || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Accounts Found</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {scan.findings?.exposedAccounts || scan.accounts || scan.exposedAccounts || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Risk Score */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-20 h-20">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            className="text-gray-200 dark:text-gray-700"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 32}`}
                            strokeDashoffset={`${2 * Math.PI * 32 * (1 - (scan.riskScore || 0) / 100)}`}
                            className={config.scoreColor}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className={`text-xl font-bold ${config.scoreColor}`}>
                            {scan.riskScore || 0}
                          </span>
                        </div>
                      </div>
                      <span className={`${config.badgeBg} ${config.badgeText} px-3 py-1 rounded-full text-xs font-medium`}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg flex-shrink-0">
              <ArrowPathIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                Regular Monitoring Recommended
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Run scans regularly to stay updated on your digital footprint. We recommend scanning at least once a month to catch new exposures early.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default History;
