function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Route not found' });
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV !== 'production') {
    console.error(error);
  }

  res.status(statusCode).json({
    message: error.message || 'Internal Server Error'
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
