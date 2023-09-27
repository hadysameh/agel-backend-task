const catchAsync = (handler) => {
  return (req, res, next) => {
    handler(req, res, next).catch((error) => next(error));
  };
};

export { catchAsync };
