exports.validationParams = (res, errors) => {
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
};
