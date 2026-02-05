import { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import api from '../utils/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'high', 'medium', 'low'

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/alerts');
      console.log('Alerts response:', response.data); // Debug log
      
      // Handle nested data structure from backend
      const alertsData = response.data.data?.alerts || response.data.alerts || response.data || [];
      
      // Ensure it's always an array
      const alertsArray = Array.isArray(alertsData) ? alertsData : [];
      console.log('Setting alerts:', alertsArray); // Debug log
      
      setAlerts(alertsArray);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId) => {
    // Optimistic UI update
    setAlerts(alerts.map(alert => 
      alert._id === alertId ? { ...alert, isRead: true } : alert
    ));

    try {
      await api.patch(`/alerts/${alertId}/read`);
    } catch (error) {
      console.error('Failed to mark as read:', error);
      // Revert on error
      setAlerts(alerts.map(alert => 
        alert._id === alertId ? { ...alert, isRead: false } : alert
      ));
    }
  };

  const getSeverityConfig = (severity) => {
    const configs = {
      high: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-700 dark:text-red-400',
        badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
        dot: 'bg-red-500',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ),
      },
      medium: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-700 dark:text-yellow-400',
        badge: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
        dot: 'bg-yellow-500',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        ),
      },
      low: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-400',
        badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
        dot: 'bg-blue-500',
        icon: (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        ),
      },
    };
    return configs[severity?.toLowerCase()] || configs.low;
  };

  const filteredAlerts = Array.isArray(alerts) ? alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !alert.isRead;
    return alert.severity?.toLowerCase() === filter;
  }) : [];

  const unreadCount = Array.isArray(alerts) ? alerts.filter(a => !a.isRead).length : 0;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Security Alerts
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {unreadCount > 0 ? (
                <span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400">{unreadCount}</span> unread alert{unreadCount !== 1 ? 's' : ''}
                </span>
              ) : (
                'All caught up! No unread alerts.'
              )}
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'unread'
                  ? 'bg-primary-600 dark:bg-primary-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750'
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button
              onClick={() => setFilter('high')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'high'
                  ? 'bg-red-600 dark:bg-red-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750'
              }`}
            >
              High
            </button>
            <button
              onClick={() => setFilter('medium')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'medium'
                  ? 'bg-yellow-600 dark:bg-yellow-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setFilter('low')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'low'
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-750'
              }`}
            >
              Low
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {loading ? (
            /* Skeleton Loader */
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredAlerts.length === 0 ? (
            /* Empty State */
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {filter === 'all' ? "You're all secure!" : `No ${filter} alerts`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                {filter === 'all'
                  ? "You don't have any alerts at the moment. We'll notify you if we detect any issues with your digital identity."
                  : `No alerts matching the ${filter} filter. Try selecting a different filter or view all alerts.`}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="mt-6 px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-xl font-medium transition-colors"
                >
                  View All Alerts
                </button>
              )}
            </div>
          ) : (
            /* Alert Cards */
            filteredAlerts.map((alert) => {
              const severity = getSeverityConfig(alert.severity);
              return (
                <div
                  key={alert._id}
                  className={`
                    bg-white dark:bg-gray-900 rounded-2xl p-6 border transition-all duration-200
                    ${alert.isRead
                      ? 'border-gray-200 dark:border-gray-800'
                      : `${severity.border} ${severity.bg}`
                    }
                    hover:shadow-lg
                  `}
                >
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${severity.badge} flex items-center justify-center ${severity.text}`}>
                      {severity.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {alert.title || 'Security Alert'}
                          </h3>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wide ${severity.badge}`}>
                            {alert.severity}
                          </span>
                          {!alert.isRead && (
                            <span className={`w-2 h-2 rounded-full ${severity.dot} animate-pulse`} />
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                        {alert.message || alert.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {new Date(alert.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: 'numeric',
                            })}
                          </div>
                          {alert.source && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {alert.source}
                            </div>
                          )}
                        </div>

                        {!alert.isRead && (
                          <button
                            onClick={() => markAsRead(alert._id)}
                            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Help Section */}
        {!loading && alerts.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Need help understanding an alert?
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Our support team is here to help you understand and resolve any security concerns.
                </p>
                <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Contact Support →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Alerts;
