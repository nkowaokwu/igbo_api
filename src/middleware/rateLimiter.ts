import { Request } from 'express';
import rateLimit from 'express-rate-limit';
import { MiddleWare } from '../types';

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const DEFAULT_MAX_REQUESTS = 20;

/* Trusted callers (e.g. Nkọwa okwu's GCP servers) bypass rate limiting.
 * Provide a comma-separated list of IPs via RATE_LIMIT_ALLOWED_IPS. */
export const getAllowedIps = (): string[] =>
  (process.env.RATE_LIMIT_ALLOWED_IPS || '')
    .split(',')
    .map((ip) => ip.trim())
    .filter(Boolean);

export const createRateLimiter = ({
  windowMs = FIFTEEN_MINUTES,
  max = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || DEFAULT_MAX_REQUESTS,
}: {
  windowMs?: number,
  max?: number,
} = {}): MiddleWare =>
  rateLimit({
    windowMs,
    max,
    message: 'Too many requests, please try again later',
    skip: (req: Request) => getAllowedIps().includes(req.ip || ''),
  });

const rateLimiter = createRateLimiter();

export default rateLimiter;
