export default (req, res, next) => {
  const { body: data } = req;

  if (!data.email) {
    res.status(400);
    return res.send({ error: 'Email is required' });
  }

  if (!data.password) {
    res.status(400);
    return res.send({ error: 'Password is required' });
  }

  if (!data.host) {
    res.status(400);
    return res.send({ error: 'Host is required' });
  }

  return next();
};
