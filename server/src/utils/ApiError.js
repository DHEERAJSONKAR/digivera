/**
 * Custom API Error Class
 * Extends built-in Error with statusCode and error code
 */
class ApiError extends Error {
  constructor(statusCode, message, code = 'API_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
