export default (req, res, next) => {
  const { body: data } = req;
  const { user } = req;

  if (!user || (user && !user.uid)) {
    res.status(400);
    return res.send({ error: 'User uid is required' });
  }

  if (!data.id) {
    res.status(400);
    return res.send({ error: 'The id property is missing, double check your provided data' });
  }
  return next();
};
