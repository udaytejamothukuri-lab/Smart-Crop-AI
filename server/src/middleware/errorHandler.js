/**
 * SmartCrop AI - Centralized Error Handling Middleware
 */

export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: 'Endpoint Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}. Verify API route in documentation.`
  });
}

export function errorHandler(err, req, res, next) {
  console.error('Unhandled Application Error:', err);

  // Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid Identifier',
      message: `Invalid format for field "${err.path}": ${err.value}`
    });
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Database Validation Error',
      details: messages
    });
  }

  // JSON Body Parser Syntax Error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Malformed JSON Payload',
      message: 'The request body could not be parsed as valid JSON.'
    });
  }

  // Generic 500
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred on the server.' 
      : err.message
  });
}
