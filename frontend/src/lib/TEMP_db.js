/**
 * Temporarily created db setup. Not currently used. Once double-redirect issue has been sorted, try setting
 * redis up again with proper connect/disconnecting
 */

import { createClient } from 'redis';

let redisClient = global.redis;

if (!redisClient) {
  redisClient = global.redis = createClient({
    password: process.env.REDIS_PASS,
    socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      connectTimeout: 10000,
    },
  });
}

export const redisConnect = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

export const redisDisconnect = async () => {
  if (!redisClient.isOpen) {
    await redisClient.quit();
  }
};

export { redisConnect, redisDisconnect };

// const redisClient = createClient({
//   password: process.env.REDIS_PASS,
//   socket: {
//     host: process.env.REDIS_HOST,
//     port: process.env.REDIS_PORT,
//     connectTimeout: 10000,
//     idleTimeout: 60000,
//   },
// });

// redisClient.on('error', (err) => console.log(err));

// if (!redisClient.isOpen) {
//   redisClient.connect();
// }

// export { redisClient };
