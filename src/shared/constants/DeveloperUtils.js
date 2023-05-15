const fetchAPIKey = (req) => {
  const apiKey = req.headers['X-API-Key'] || req.headers['x-api-key'];
  return apiKey;
};

export { fetchAPIKey };
