import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { logout } from '../auth/auth';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('/api/alerts');
      setAlerts(response.data.alerts || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch alerts');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId) => {
    try {
      await axios.patch(`/api/alerts/${alertId}/read`);
      setAlerts(alerts.map(alert => 
        alert._id === alertId ? { ...alert, isRead: true } : alert
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark alert as read');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">DIGIVERA</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-700 hover:text-gray-900">
                Dashboard
              </Link>
              <Link to="/scan" className="text-gray-700 hover:text-gray-900">
                Scan
              </Link>
              <Link to="/history" className="text-gray-700 hover:text-gray-900">
                History
              </Link>
              <Link to="/alerts" className="text-gray-700 hover:text-gray-900">
                Alerts
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Alerts</h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <p className="text-gray-600">No alerts found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert._id}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} ${
                  alert.isRead ? 'opacity-60' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {alert.alertType || 'Alert'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </span>
                      {!alert.isRead && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 mb-2">{alert.message}</p>
                    {alert.scanId && (
                      <p className="text-sm text-gray-600">
                        Scan ID: {alert.scanId}
                      </p>
                    )}
                  </div>
                  {!alert.isRead && (
                    <button
                      onClick={() => markAsRead(alert._id)}
                      className="ml-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Alerts;
