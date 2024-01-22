import { Redis } from 'ioredis';

const redisClient = new Redis({
  password: process.env.REDIS_PASS,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  connectTimeout: 10000,
  idleTimeout: 90000,
  enableAutoPipelining: true,
  maxRetriesPerRequest: 2,
});

redisClient.on('error', (err) => console.log(err.name));

if (redisClient.status !== 'connecting' && redisClient.status !== 'reconnecting' && redisClient.status !== 'connect') {
  redisClient.connect();
}

const cleanupRedisConnection = async () => {
  await redisClient.quit();
};

process.on('beforeExit', cleanupRedisConnection);

export { redisClient };
