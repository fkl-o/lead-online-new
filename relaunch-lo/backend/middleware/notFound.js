export const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} nicht gefunden`);
  res.status(404).json({
    success: false,
    message: error.message
  });
};
