const SkeletonLoader = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
    <SkeletonLoader className="h-6 w-1/3 mb-4" />
    <SkeletonLoader className="h-12 w-full mb-3" />
    <SkeletonLoader className="h-4 w-2/3" />
  </div>
);

export const RiskScoreSkeleton = () => (
  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl">
    <div className="text-center space-y-4">
      <SkeletonLoader className="h-8 w-48 mx-auto" />
      <SkeletonLoader className="h-32 w-32 rounded-full mx-auto" />
      <SkeletonLoader className="h-6 w-32 mx-auto" />
      <SkeletonLoader className="h-4 w-64 mx-auto" />
    </div>
  </div>
);

export default SkeletonLoader;
