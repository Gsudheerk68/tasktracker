const errorHandler = (error, req, res, next) => {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(error.errors).map(e => e.message)
    });
  }
  if (error.name === 'CastError')
    return res.status(400).json({ message: 'Invalid task ID' });
  if (error.code === 11000)
    return res.status(400).json({ message: 'This record already exists' });

  res.status(error.statusCode || 500).json({
    message: error.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = errorHandler;
