import { createClient } from 'redis';

const redisClient = createClient({
  password: 'STQXNJPSwOWyKPT9WiaDtBCk8hmJvvfr', // process.env.REDIS_PASS,
  socket: {
    host: 'redis-13815.c304.europe-west1-2.gce.cloud.redislabs.com', // process.env.REDIS_HOST,
    port: 13815, // process.env.REDIS_PORT,
  },
  //   database: 0,
});
//   .on()
//   .connect();

redisClient.on('error', (err) => console.log(err));

if (!redisClient.isOpen) {
  redisClient.connect();
}

export { redisClient };
