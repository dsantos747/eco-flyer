'use server';

import { redisClient } from '@/lib/db';
import { redirect } from 'next/navigation';
import { v4 } from 'uuid';

export async function createRedis(formData) {
  const id = v4();
  const requestData = JSON.stringify(formData);

  try {
    await redisClient.set(`request_${id}`, requestData);
  } catch (error) {
    console.error('Error setting value in Redis:', error);
    return new Response('Failed to set value');
  } finally {
    redirect(`/progress/${id}`);
  }
}

export async function getRedis(type, id) {
  try {
    const data = await redisClient.get(`${type}_${id}`);
    return data;
  } catch (error) {
    console.error('Error getting value from Redis:', error);
    return new Response('Requested data not found');
  }
}

export async function checkRedis(type, id) {
  try {
    const data = await redisClient.exists(`${type}_${id}`);
    return data;
  } catch (error) {
    console.error('Error checking for key in Redis:', error);
    return new Response('Requested key not found');
  }
}
