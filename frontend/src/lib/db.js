import { createClient } from 'redis';

// const globalForRedis = global;

// export const redisClient = globalForRedis.redisClient ?? createClient({ url: process.env.REDIS_URL });
// // createClient({
// //   password: process.env.REDIS_PASS,
// //   socket: {
// //     host: process.env.REDIS_HOST,
// //     port: process.env.REDIS_PORT,
// //     connectTimeout: 10000,
// //     idleTimeout: 60000,
// //   },
// // });

// if (process.env.NODE_ENV !== 'production') {
//   globalForRedis.redisClient = redisClient;
// }

const redisClient = createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    connectTimeout: 10000,
    idleTimeout: 60000,
  },
});

redisClient.on('error', (err) => console.log(err));

if (!redisClient.isOpen) {
  redisClient.connect();
}

export { redisClient };
