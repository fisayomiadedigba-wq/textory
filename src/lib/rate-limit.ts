import RateLimitModel from '@/models/RateLimit';
import { tooManyRequests } from './api';

// In-memory rate limiting for development (much faster than MongoDB)
const inMemoryLimits = new Map<string, { count: number; resetTime: number }>();

/**
 * Counts one request for `key` in the current fixed window and reports whether it is
 * still within `limit`. Uses in-memory storage for development to avoid MongoDB latency.
 */
export async function consumeRateLimit(key: string, limit: number, windowSeconds: number) {
  const windowMs = windowSeconds * 1000;
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const fullKey = `${key}:${windowStart}`;

  // Use in-memory for development (much faster)
  if (process.env.NODE_ENV !== 'production') {
    const existing = inMemoryLimits.get(fullKey);
    if (!existing || existing.resetTime < now) {
      inMemoryLimits.set(fullKey, { count: 1, resetTime: windowStart + windowMs });
      return true;
    }
    existing.count++;
    return existing.count <= limit;
  }

  // Production: Use MongoDB for distributed rate limiting
  const counter = await RateLimitModel.findOneAndUpdate(
    { key: fullKey },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(windowStart + windowMs) } },
    { upsert: true, new: true, lean: true },
  );
  return (counter?.count ?? 1) <= limit;
}

/** Like `consumeRateLimit`, but throws a 429 (with `message`, if given) when over the limit. */
export async function enforceRateLimit(key: string, limit: number, windowSeconds: number, message?: string) {
  if (!(await consumeRateLimit(key, limit, windowSeconds))) throw tooManyRequests(message);
}
