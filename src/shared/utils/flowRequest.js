const flowRequest = (funcs) => {
  const updatedFuncs = [...funcs];
  const lastFunction = updatedFuncs[updatedFuncs.length - 1];

  updatedFuncs[updatedFuncs.length - 1] = async (req, res, next) => {
    const result = await lastFunction(req, res, next);
    if (req.redisClient) {
      console.time('Closing the Redis client');
      req.redisClient.quit();
      console.timeEnd('Closing the Redis client');
      return result;
    }
    console.log('Skipped closing Redis client');
    return result;
  };
  return updatedFuncs;
};

export default flowRequest;
