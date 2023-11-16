'use server';

import { redisClient } from '@/lib/db';
import { redirect } from 'next/navigation';
import { v4 } from 'uuid';

export async function createRedis(formData) {
  // return "test"
  const id = v4();
  const requestData = JSON.stringify(formData);

  await redisClient.set(`request_${id}`, requestData);
  redirect(`/progress/${id}`);
}

export async function getRedis(type, id) {
  try {
    const data = await redisClient.get(`${type}_${id}`);
    return data;
  } catch (error) {
    console.log('error here');
    return new Response('Requested data not found');
  }
}