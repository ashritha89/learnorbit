// src/middlewares/redisRateLimiter.middleware.js
const redis = require('../config/redis');
const logger = require('../utils/logger');

/**
 * Redis-based distributed rate limiter
 * Falls back to allowing requests if Redis is unavailable
 * 
 * Configuration:
 * - 100 requests per 15-minute window per IP
 * - Graceful degradation if Redis fails
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;

// Helper for timeout
const withTimeout = (promise, ms) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error('Redis timeout')), ms))
]);

module.exports = async (req, res, next) => {
  try {
    // Check if Redis is connected
    if (!redis.isConnected()) {
      logger.warn('Rate limiter bypassed - Redis not connected');
      return next();
    }

    const ip = req.ip || req.connection.remoteAddress;
    const key = `rl:${ip}`;

    // Increment request count with timeout
    const current = await withTimeout(redis.incr(key), 1000);

    // Set TTL on first request (fire and forget or timeout, but don't block main flow too long)
    if (current === 1) {
      withTimeout(redis.pexpire(key, WINDOW_MS), 1000).catch(err => logger.warn('Failed to set rate limit expiry', err));
    }

    // Get TTL for Retry-After header
    const ttl = await withTimeout(redis.pttl(key), 1000).catch(() => WINDOW_MS);

    // Check if limit exceeded
    if (current > MAX_REQUESTS) {
      const retryAfter = Math.ceil(ttl / 1000);
      res.set('Retry-After', retryAfter);
      res.set('X-RateLimit-Limit', MAX_REQUESTS);
      res.set('X-RateLimit-Remaining', 0);
      res.set('X-RateLimit-Reset', new Date(Date.now() + ttl).toISOString());

      logger.warn(`Rate limit exceeded for IP: ${ip}`, { requestId: req.id });

      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        message: 'You have exceeded the rate limit. Please try again later.',
        retryAfter,
      });
    }

    // Set rate limit headers
    res.set('X-RateLimit-Limit', MAX_REQUESTS);
    res.set('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - current));
    res.set('X-RateLimit-Reset', new Date(Date.now() + ttl).toISOString());

    next();
  } catch (err) {
    // If Redis fails, log error and allow request through
    logger.error(`Redis rate limiter error: ${err.message}`, { requestId: req.id });
    next();
  }
};

