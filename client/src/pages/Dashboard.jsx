import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { logout } from '../auth/auth';

const Dashboard = () => {
  const [latestScan, setLatestScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLatestScan();
  }, []);

  const fetchLatestScan = async () => {
    try {
      const response = await axios.get('/api/scan/history?limit=1');
      if (response.data.scans && response.data.scans.length > 0) {
        setLatestScan(response.data.scans[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch latest scan');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestScan ? (
              <>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Risk Score</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {latestScan.riskScore || 'N/A'}
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Severity</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(latestScan.severity)}`}>
                    {latestScan.severity || 'N/A'}
                  </span>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Last Scan</h3>
                  <p className="text-lg font-medium text-gray-900">
                    {latestScan.createdAt
                      ? new Date(latestScan.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </>
            ) : (
              <div className="col-span-full bg-white p-6 rounded-lg border border-gray-200 text-center">
                <p className="text-gray-600 mb-4">No scans available</p>
                <Link
                  to="/scan"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Run Your First Scan
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/scan"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Run New Scan
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
