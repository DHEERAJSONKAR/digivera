import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { CardSkeleton } from './SkeletonLoader';

const LatestScan = () => {
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestScan();
  }, []);

  const fetchLatestScan = async () => {
    try {
      const response = await api.get('/scan/latest');
      setScan(response.data);
    } catch (error) {
      console.error('Failed to fetch latest scan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CardSkeleton />;
  }

  if (!scan) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          No scans yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Run your first scan to check your digital footprint
        </p>
        <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/30">
          Run First Scan
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Latest Scan Results
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(scan.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Target Info */}
        <div>
          <label className="text-sm text-gray-500 dark:text-gray-400 mb-1 block">
            Scan Target
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {scan.target || 'Personal Identity'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {scan.targetType || 'Full Scan'}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-100 dark:border-red-900/50">
            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
              {scan.breachCount || 0}
            </div>
            <div className="text-xs text-red-700 dark:text-red-300 font-medium">
              Data Breaches
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-900/50">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-1">
              {scan.publicMentions || 0}
            </div>
            <div className="text-xs text-orange-700 dark:text-orange-300 font-medium">
              Public Mentions
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900/50">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {scan.exposedAccounts || 0}
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              Exposed Accounts
            </div>
          </div>
        </div>

        {/* View Details Button */}
        <button className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-750 text-gray-900 dark:text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
          View Full Report
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LatestScan;
