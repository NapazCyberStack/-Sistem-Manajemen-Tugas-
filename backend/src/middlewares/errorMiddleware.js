const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Terjadi kesalahan pada server';

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'Ukuran file maksimal 2MB';
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    const field = err.errors[0].path;
    message = `${field} sudah digunakan`;
  }

  // JWT invalid/expired
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token tidak valid';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token sudah kadaluarsa, silakan login ulang';
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Endpoint tidak ditemukan: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFoundHandler };

