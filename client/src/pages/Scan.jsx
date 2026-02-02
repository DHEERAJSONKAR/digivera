import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { logout } from '../auth/auth';

const Scan = () => {
  const [formData, setFormData] = useState({
    scanTarget: 'email',
    targetValue: '',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await axios.post('/api/scan', formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Scan failed. Please try again.');
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Run a Scan</h2>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="scanTarget" className="block text-sm font-medium text-gray-700 mb-2">
                Scan Target Type
              </label>
              <select
                id="scanTarget"
                name="scanTarget"
                value={formData.scanTarget}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="email">Email</option>
                <option value="name">Name</option>
              </select>
            </div>

            <div>
              <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700 mb-2">
                Target Value
              </label>
              <input
                id="targetValue"
                name="targetValue"
                type="text"
                required
                value={formData.targetValue}
                onChange={handleChange}
                placeholder={formData.scanTarget === 'email' ? 'Enter email address' : 'Enter name'}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            {loading ? 'Scanning...' : 'Run Scan'}
          </button>
        </form>

        {result && (
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Scan Results</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Risk Score</p>
                <p className="text-2xl font-bold text-gray-900">{result.riskScore}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Severity</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.severity)}`}>
                  {result.severity}
                </span>
              </div>

              {result.breaches && result.breaches.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Breaches Found</p>
                  <ul className="list-disc list-inside space-y-1">
                    {result.breaches.map((breach, index) => (
                      <li key={index} className="text-sm text-gray-700">{breach}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/history"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All Scans →
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Scan;
