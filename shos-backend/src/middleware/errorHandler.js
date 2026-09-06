export const errorHandler = (err, req, res, next) => {
  console.error('[SHOS API Error]:', err.stack || err.message);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Hospital Operations Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
