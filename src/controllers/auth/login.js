export const login = (req, res, next) => {
  try {
    return res.status(200).send({
      message: 'Logging in...',
    });
  } catch (error) {
    return res.status(400).send({
      error: error.message,
    });
  }
};
