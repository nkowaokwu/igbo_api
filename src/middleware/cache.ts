export default (maxAge = 302400, smaxAge = 604800) =>
  (req, res, next) => {
    res.set('Cache-Control', `public, max-age=${maxAge}, s-maxage=${smaxAge}`);
    return next();
  };
