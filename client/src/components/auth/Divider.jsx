const Divider = ({ text = 'OR' }) => {
  return (
    <div className="relative flex items-center my-6">
      <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
      <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
        {text}
      </span>
      <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
    </div>
  );
};

export default Divider;
