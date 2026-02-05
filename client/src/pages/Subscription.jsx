import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import api from '../utils/api';
import {
  CreditCardIcon,
  CheckCircleIcon,
  XMarkIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BoltIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

const Subscription = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('india'); // 'india' or 'global'
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUserData();
    loadRazorpayScript();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/me');
      console.log('User data response:', response.data);
      
      // Handle nested data structure
      const userData = response.data.data || response.data.user || response.data;
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSubscribe = async () => {
    if (user?.plan === 'pro') {
      showMessage('error', 'You are already a Pro user');
      return;
    }

    setProcessing(true);

    try {
      const country = selectedPlan === 'india' ? 'india' : 'global';
      const response = await api.post('/subscribe', { country });

      if (response.data.data.provider === 'razorpay') {
        handleRazorpayPayment(response.data.data);
      } else {
        handleStripePayment(response.data.data);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      showMessage('error', error.response?.data?.message || 'Failed to create subscription');
      setProcessing(false);
    }
  };

  const handleRazorpayPayment = (data) => {
    const options = {
      key: data.key,
      amount: data.amount,
      currency: data.currency,
      name: 'DIGIVERA',
      description: 'Pro Plan Subscription',
      order_id: data.orderId,
      prefill: {
        name: data.user.name,
        email: data.user.email,
      },
      theme: {
        color: '#6366f1',
      },
      handler: async (response) => {
        try {
          const verifyResponse = await api.post('/subscribe/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyResponse.data.success) {
            showMessage('success', 'Subscription activated successfully!');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 2000);
          }
        } catch (error) {
          showMessage('error', 'Payment verification failed');
          setProcessing(false);
        }
      },
      modal: {
        ondismiss: () => {
          setProcessing(false);
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleStripePayment = (data) => {
    // Redirect to Stripe checkout
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else {
      showMessage('error', 'Failed to create checkout session');
      setProcessing(false);
    }
  };

  const plans = {
    india: {
      name: 'Pro Plan (India)',
      price: '₹299',
      period: '/month',
      currency: 'INR',
      provider: 'Razorpay',
    },
    global: {
      name: 'Pro Plan (Global)',
      price: '$5',
      period: '/month',
      currency: 'USD',
      provider: 'Stripe',
    },
  };

  const features = [
    {
      icon: BoltIcon,
      title: 'Unlimited Scans',
      description: 'Run as many scans as you want, anytime',
    },
    {
      icon: ArrowPathIcon,
      title: 'Auto Monitoring',
      description: 'Weekly automated scans of your digital footprint',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Priority Alerts',
      description: 'Instant notifications for new breaches',
    },
    {
      icon: ClockIcon,
      title: 'Scan History',
      description: 'Access unlimited scan history and reports',
    },
    {
      icon: SparklesIcon,
      title: 'Premium Support',
      description: 'Priority customer support via email',
    },
    {
      icon: CheckCircleIcon,
      title: 'No Ads',
      description: 'Ad-free experience across the platform',
    },
  ];

  const freePlanFeatures = [
    { text: '1 scan per month', included: true },
    { text: 'Basic breach detection', included: true },
    { text: 'Risk score calculation', included: true },
    { text: 'Unlimited scans', included: false },
    { text: 'Auto monitoring', included: false },
    { text: 'Priority alerts', included: false },
  ];

  const proPlanFeatures = [
    { text: '1 scan per month', included: true },
    { text: 'Basic breach detection', included: true },
    { text: 'Risk score calculation', included: true },
    { text: 'Unlimited scans', included: true },
    { text: 'Auto monitoring', included: true },
    { text: 'Priority alerts', included: true },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upgrade to Pro
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get unlimited scans and automated monitoring to protect your digital identity 24/7
          </p>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`mb-8 p-4 rounded-xl flex items-start gap-3 max-w-2xl mx-auto ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XMarkIcon className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p className={message.type === 'success' 
              ? 'text-green-700 dark:text-green-400' 
              : 'text-red-700 dark:text-red-400'
            }>
              {message.text}
            </p>
          </div>
        )}

        {/* Already Pro User */}
        {user?.plan === 'pro' && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-2xl p-8 mb-8 border border-green-200 dark:border-green-800 text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              You're Already a Pro User!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Enjoy unlimited scans and automated monitoring
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* Plan Selection (Only for Free users) */}
        {user?.plan === 'free' && (
          <>
            {/* Region Selector */}
            <div className="flex justify-center gap-4 mb-12">
              <button
                onClick={() => setSelectedPlan('india')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedPlan === 'india'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                🇮🇳 India - ₹299/month
              </button>
              <button
                onClick={() => setSelectedPlan('global')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedPlan === 'global'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                🌍 Global - $5/month
              </button>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Free Plan */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Free Plan
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">₹0</span>
                    <span className="text-gray-500 dark:text-gray-400">/month</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {freePlanFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XMarkIcon className="w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included 
                        ? 'text-gray-700 dark:text-gray-300' 
                        : 'text-gray-400 dark:text-gray-600 line-through'
                      }>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled
                  className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed"
                >
                  Current Plan
                </button>
              </div>

              {/* Pro Plan */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-2xl p-8 border-2 border-indigo-200 dark:border-indigo-800 shadow-xl relative overflow-hidden">
                {/* Popular Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Popular
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plans[selectedPlan].name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {plans[selectedPlan].price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">{plans[selectedPlan].period}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    via {plans[selectedPlan].provider}
                  </p>
                </div>

                <ul className="space-y-4 mb-8">
                  {proPlanFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleSubscribe}
                  disabled={processing}
                  className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="w-5 h-5" />
                      Upgrade to Pro
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                What You Get with Pro
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Can I cancel anytime?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Yes, you can cancel your subscription anytime from your profile settings. No questions asked.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Is my payment information secure?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Absolutely! We use Razorpay and Stripe - industry-leading payment processors with bank-level security.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    What happens after I upgrade?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You'll instantly get access to unlimited scans and automated weekly monitoring will start within 24 hours.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
