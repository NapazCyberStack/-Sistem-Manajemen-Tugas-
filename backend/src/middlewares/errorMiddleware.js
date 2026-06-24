const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err.message || err);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message || 'An unexpected server error occurred',
    // Only show stack trace in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

const notFoundHandler = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

module.exports = { errorHandler, notFoundHandler };
