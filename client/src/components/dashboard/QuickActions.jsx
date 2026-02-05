import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Run New Scan',
      description: 'Check your latest digital footprint',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      action: () => navigate('/scan'),
    },
    {
      title: 'View Alerts',
      description: 'Review security notifications',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      color: 'red',
      gradient: 'from-red-500 to-pink-500',
      action: () => navigate('/alerts'),
    },
    {
      title: 'Scan History',
      description: 'View all previous scans',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-500',
      action: () => navigate('/history'),
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.action}
          className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left"
        >
          {/* Icon with gradient background */}
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${action.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
            {action.icon}
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {action.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {action.description}
          </p>

          {/* Arrow Icon */}
          <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:gap-2 transition-all">
            <span>Go</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
