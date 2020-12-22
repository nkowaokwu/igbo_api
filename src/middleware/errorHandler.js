// eslint-disable-next-line
export default (err, req, res, next) => {
  res.status(400);
  /* Depending on the nested error message the status code will change */
  if (err.message.match(/No .{1,} exist(s)?/) || err.message.match(/doesn't exist(s)?/)) {
    res.status(404);
  }
  if (process.env.NODE_ENV === 'development') {
    console.log(err?.stack);
  }
  return res.send({ error: err.message });
};
