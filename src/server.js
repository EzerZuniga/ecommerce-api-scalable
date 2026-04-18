const app = require('./app');
const env = require('./config/env');
const prisma = require('./config/prisma');
const getRedisClient = require('./config/redis');
const logger = require('./utils/logger');

async function bootstrap() {
  try {
    await prisma.$connect();
    logger.info('PostgreSQL connected');

    const redis = getRedisClient();
    if (redis) {
      try {
        await redis.connect();
        logger.info('Redis connected');
      } catch (error) {
        logger.warn('Redis unavailable, continuing without cache', { message: error.message });
      }
    }

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server', { message: error.message, stack: error.stack });
    process.exit(1);
  }
}

bootstrap();
