const Redis = require('ioredis');
const env = require('./env');
const logger = require('../utils/logger');

let redis = null;

function getRedisClient() {
  if (!env.REDIS_URL) {
    return null;
  }

  if (!redis) {
    redis = new Redis(env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 2
    });

    redis.on('error', (error) => {
      logger.warn('Redis error', { message: error.message });
    });
  }

  return redis;
}

module.exports = getRedisClient;
