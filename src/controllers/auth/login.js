export const login = (res) => {
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
