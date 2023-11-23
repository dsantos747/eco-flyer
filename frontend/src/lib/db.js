import { createClient } from 'redis';

const redisClient = createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    connectTimeout: 10000,
  },
});

redisClient.on('error', (err) => console.log(err));

if (!redisClient.isOpen) {
  redisClient.connect();
}

export { redisClient };
