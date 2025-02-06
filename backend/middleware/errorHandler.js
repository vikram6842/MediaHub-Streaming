export const handleError = (res, error, context) => {
  console.error(`${context} error:`, error);
  res.status(500).json({
    success: false,
    message: `${context} failed`,
    error: error.message,
  });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
