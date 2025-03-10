const { Queue } = require('bullmq');
const Redis = require('ioredis'); // Use ioredis instead of redis
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null
});

const logQueue = new Queue('log-processing-queue', {
  connection: redisClient,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  },
});

module.exports = logQueue;
