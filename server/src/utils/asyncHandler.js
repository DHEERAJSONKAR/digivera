/**
 * Async Handler - Wraps async functions to catch errors
 * Eliminates need for try-catch in every controller
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
