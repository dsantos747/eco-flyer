// TRY USING THIS SETUP INSTEAD FOR A WHILE. THIS SUPPOSEDLY CREATES A NEW CLIENT EVERY TIME A NEW REDIS OPERATION IS REQUIRED, THEN DISCONNECTS
// Issues: Often get errors such as "DisconnectsClientError". It may be that this is tied in to the way everything is being called multiple times, due to Next Redirect issues
// For the time being, stick with "redisActions"

'use server';

import { createClient } from 'redis';
import { redirect } from 'next/navigation';
import { v4 } from 'uuid';

const clientParams = {
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
};

let redisClient;

export async function createRedis(formData) {
  const id = v4();
  const requestData = JSON.stringify(formData);
  try {
    redisClient = await createClient(clientParams)
      .on('error', (err) => console.log('Redis Client Error', err))
      .connect();
    await redisClient.set(`request_${id}`, requestData);
  } catch (error) {
    console.error('Error setting value in Redis:', error);
    return new Response('Failed to set value');
  } finally {
    if (redisClient.isOpen) {
      await redisClient.disconnect();
    }
    redirect(`/progress/${id}`);
  }
}

export async function getRedis(type, id) {
  try {
    redisClient = await createClient(clientParams)
      .on('error', (err) => console.log('Redis Client Error', err))
      .connect();

    const data = await redisClient.get(`${type}_${id}`);
    return data;
  } catch (error) {
    console.error('Error getting value from Redis:', error);
    return new Response('Requested data not found');
  } finally {
    if (redisClient.isOpen) {
      await redisClient.disconnect();
    }
  }
}

export async function checkRedis(type, id) {
  try {
    redisClient = await createClient(clientParams)
      .on('error', (err) => console.log('Redis Client Error', err))
      .connect();
    const data = await redisClient.exists(`${type}_${id}`);
    return data;
  } catch (error) {
    console.error('Error checking for key in Redis:', error);
    return new Response('Requested key not found');
  } finally {
    if (redisClient.isOpen) {
      await redisClient.disconnect();
    }
  }
}
