import express from 'express';
import request from 'supertest';
import { createRateLimiter, getAllowedIps } from '../rateLimiter';

const createApp = (max: number) => {
  const app = express();
  app.use(createRateLimiter({ max }));
  app.get('/words', (_, res) => res.status(200).send({ message: 'ok' }));
  return app;
};

describe('rateLimiter', () => {
  afterEach(() => {
    delete process.env.RATE_LIMIT_ALLOWED_IPS;
  });

  it('allows requests under the limit', async () => {
    const app = createApp(2);
    await request(app).get('/words').expect(200);
    await request(app).get('/words').expect(200);
  });

  it('rejects requests over the limit with 429', async () => {
    const app = createApp(2);
    await request(app).get('/words').expect(200);
    await request(app).get('/words').expect(200);
    const res = await request(app).get('/words');
    expect(res.status).toEqual(429);
  });

  it('skips rate limiting for allowlisted IPs', async () => {
    process.env.RATE_LIMIT_ALLOWED_IPS = '::ffff:127.0.0.1, 127.0.0.1, ::1';
    const app = createApp(1);
    await request(app).get('/words').expect(200);
    await request(app).get('/words').expect(200);
    await request(app).get('/words').expect(200);
  });

  it('parses the allowlist from a comma-separated env value', () => {
    process.env.RATE_LIMIT_ALLOWED_IPS = ' 10.0.0.1, 10.0.0.2 ,,';
    expect(getAllowedIps()).toEqual(['10.0.0.1', '10.0.0.2']);
  });

  it('is mounted on the v1 router', () => {
    // eslint-disable-next-line global-require
    const router = require('../../routers/router').default;
    const names = router.stack.map(({ name }: { name: string }) => name);
    expect(names).toContain('rateLimit');
  });

  it('is mounted on the v2 router', () => {
    // eslint-disable-next-line global-require
    const routerV2 = require('../../routers/routerV2').default;
    const names = routerV2.stack.map(({ name }: { name: string }) => name);
    expect(names).toContain('rateLimit');
  });
});
