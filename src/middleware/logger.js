export default (req, res, next) => {
  if (process.env.NODE_ENV === 'dev') {
    console.log(req.query);
  }
  next();
};
