import attachRedisClient, { redisClient } from '../attachRedisClient';
import {
  nextFunctionFixture,
  requestFixture,
  responseFixture,
} from '../../__tests__/shared/fixtures';
import { IgboAPIRequest } from '../../types';

describe('attachRedisClient', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('attaches the shared Redis client to the request', async () => {
    const req: IgboAPIRequest = requestFixture();
    const next = nextFunctionFixture();
    await attachRedisClient(req, responseFixture(), next);
    expect(req.redisClient).toBe(redisClient);
    expect(next).toHaveBeenCalled();
  });

  it('does not add an error listener to the shared Redis client on each request', async () => {
    const onSpy = jest.spyOn(redisClient, 'on');
    for (let i = 0; i < 3; i++) {
      await attachRedisClient(requestFixture(), responseFixture(), nextFunctionFixture());
    }
    expect(onSpy).not.toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('does not connect again while the Redis client is still connecting', async () => {
    jest.replaceProperty(redisClient, 'isOpen', true);
    jest.replaceProperty(redisClient, 'isReady', false);
    const connectSpy = jest.spyOn(redisClient, 'connect');
    await attachRedisClient(requestFixture(), responseFixture(), nextFunctionFixture());
    expect(connectSpy).not.toHaveBeenCalled();
  });

  it('connects when the Redis client is not open', async () => {
    jest.replaceProperty(redisClient, 'isOpen', false);
    jest.replaceProperty(redisClient, 'isReady', false);
    const connectSpy = jest.spyOn(redisClient, 'connect');
    await attachRedisClient(requestFixture(), responseFixture(), nextFunctionFixture());
    expect(connectSpy).toHaveBeenCalledTimes(1);
  });
});
