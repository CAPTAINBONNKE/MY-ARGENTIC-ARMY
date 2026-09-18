import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  tokens: number;
  lastRefill: number;
}

export function createRateLimiter(options: {
  windowMs: number; // e.g. 60,000 ms (1 minute)
  maxRequests: number; // e.g. 100 requests per window
  message?: string;
}) {
  const { windowMs, maxRequests, message = 'Rate limit exceeded. Please try again later.' } = options;
  const clientMap = new Map<string, RateLimitRecord>();

  // Cleanup old clients every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of clientMap.entries()) {
      if (now - record.lastRefill > windowMs * 2) {
        clientMap.delete(ip);
      }
    }
  }, 300000);

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || '127.0.0.1';
    const now = Date.now();

    let record = clientMap.get(clientIp);
    if (!record) {
      record = { tokens: maxRequests, lastRefill: now };
      clientMap.set(clientIp, record);
    }

    // Refill tokens based on elapsed time
    const elapsed = now - record.lastRefill;
    if (elapsed > windowMs) {
      record.tokens = maxRequests;
      record.lastRefill = now;
    } else {
      const refill = (elapsed / windowMs) * maxRequests;
      record.tokens = Math.min(maxRequests, record.tokens + refill);
      record.lastRefill = now;
    }

    res.setHeader('X-RateLimit-Limit', maxRequests.toString());

    if (record.tokens < 1) {
      const retryAfterSeconds = Math.ceil((windowMs - elapsed) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds.toString());
      res.setHeader('X-RateLimit-Remaining', '0');

      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message,
          retryAfterSeconds,
          timestamp: new Date().toISOString(),
        },
      });
    }

    record.tokens -= 1;
    res.setHeader('X-RateLimit-Remaining', Math.floor(record.tokens).toString());
    next();
  };
}

export const standardRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 180,
  message: 'Too many requests to Argentic Agent OS. Please back off.',
});

export const aiInferenceRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 60,
  message: 'Inference rate limit reached. Please throttle protocol requests.',
});
