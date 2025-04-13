/**
 * Custom Error Handler & Format Manager [Error Manager]
 */
class ApiError extends Error {
    isOperational;
    constructor(message, isOperational = true, stack) {
      super(message);
      this.isOperational = isOperational;
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
module.exports = {
  ApiError
};