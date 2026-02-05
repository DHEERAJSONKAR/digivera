import { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import RiskScoreCard from '../components/dashboard/RiskScoreCard';
import QuickActions from '../components/dashboard/QuickActions';
import LatestScan from '../components/dashboard/LatestScan';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import PlanCard from '../components/dashboard/PlanCard';
import api from '../utils/api';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [riskScore, setRiskScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user profile data
      const profileResponse = await api.get('/me');
      console.log('Dashboard profile response:', profileResponse.data);
      
      // Handle nested data structure
      const user = profileResponse.data.data || profileResponse.data.user || profileResponse.data;
      setUserData(user);
      
      // Fetch risk score from latest scan
      try {
        const scanResponse = await api.get('/scan/latest');
        setRiskScore(scanResponse.data.riskScore || 0);
      } catch (scanError) {
        // If no scan exists, risk score remains 0
        setRiskScore(0);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back{userData?.name ? `, ${userData.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your digital identity protection overview
          </p>
        </div>

        {/* Risk Score Section */}
        <RiskScoreCard score={riskScore} loading={loading} />

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <QuickActions />
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Latest Scan & Alerts */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Latest Scan
              </h2>
              <LatestScan />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Alerts
              </h2>
              <RecentAlerts />
            </div>
          </div>

          {/* Right Column - Plan Status */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Plan
            </h2>
            <div className="sticky top-24">
              <PlanCard plan={userData?.plan || 'free'} loading={loading} />
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-2xl p-8 border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Account Overview
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {userData?.totalScans || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Scans
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {userData?.activeAlerts || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Active Alerts
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {userData?.resolvedIssues || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Resolved Issues
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {userData?.protectionDays || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Days Protected
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Need help getting started?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Learn how to protect your digital identity and interpret your risk score
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg font-medium text-sm transition-colors">
                  View Guide
                </button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-900 dark:text-white rounded-lg font-medium text-sm transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
