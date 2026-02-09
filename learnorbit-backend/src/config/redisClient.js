// src/config/redisClient.js
const Redis = require('ioredis');
const logger = require('../utils/logger');

/**
 * Redis Client Configuration
 * Provides distributed caching and rate limiting
 * Gracefully degrades if Redis is unavailable
 */

const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: false,
};

const redis = new Redis(redisConfig);

// Track connection status
let isConnected = false;

redis.on('connect', () => {
  logger.info('Redis client connecting...');
});

redis.on('ready', () => {
  isConnected = true;
  logger.info('✓ Redis client connected and ready');
});

redis.on('error', (err) => {
  isConnected = false;
  logger.error(`Redis connection error: ${err.message}`);
});

redis.on('close', () => {
  isConnected = false;
  logger.warn('Redis connection closed');
});

redis.on('reconnecting', () => {
  logger.info('Redis client reconnecting...');
});

/**
 * Safe wrapper for Redis operations
 * Returns null if Redis is unavailable
 */
const safeRedisOperation = async (operation, fallbackValue = null) => {
  if (!isConnected) {
    logger.warn('Redis operation skipped - not connected');
    return fallbackValue;
  }
  try {
    return await operation();
  } catch (err) {
    logger.error(`Redis operation failed: ${err.message}`);
    return fallbackValue;
  }
};

// Export both the client and helper
module.exports = redis;
module.exports.safeRedisOperation = safeRedisOperation;
module.exports.isConnected = () => isConnected;
