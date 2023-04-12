exports.errorHandler = (err, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
};
