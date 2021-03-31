export default (req, res, next) => {
  const { body: data } = req;

  if (!data.name) {
    res.status(400);
    return res.send({ error: 'Name is required' });
  }

  if (!data.email) {
    res.status(400);
    return res.send({ error: 'Email is required' });
  }

  if (!data.password) {
    res.status(400);
    return res.send({ error: 'Password is required' });
  }

  return next();
};
