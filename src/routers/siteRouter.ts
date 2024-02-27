import express from 'express';
import nextjs from 'next';
import compact from 'lodash/compact';
import { parse } from 'url';

const nextApp = nextjs({});
const handle = nextApp.getRequestHandler();

const routes = compact([/^\/$/]);

const siteRouter = express.Router();

siteRouter.use(async (req, res, next) => {
  try {
    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;
    if (routes.find((route) => pathname?.match?.(route))) {
      return await nextApp.render(req, res, pathname || '/', query);
    }
    return await handle(req, res, parsedUrl);
  } catch (err) {
    return next(err);
  }
});

export default siteRouter;
