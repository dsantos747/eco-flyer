'use client';
import { useState, useEffect } from 'react';
import { checkRedis, getRedis } from '../actions/redisActions';
import { useRouter } from 'next/navigation';

export function StatusPoll({ taskID }) {
  const [errorCode, setErrorCode] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const pollTaskStatus = async (taskID) => {
      const pollInterval = setInterval(async () => {
        const pollResponse = await checkRedis('response', taskID);
        if (pollResponse === 1) {
          clearInterval(pollInterval);
          router.push(`/results/${taskID}`);
        }
        const pollError = await checkRedis('error', taskID);
        if (pollError === 1 && errorCode === 0) {
          clearInterval(pollInterval);
          const error = await getRedis('error', taskID);
          const errorText = await JSON.parse(error);
          setErrorCode(error);
          setErrorCode(() => {
            throw new Error(errorText);
          });
        }
      }, 2000);

      return () => clearInterval(pollInterval);
    };

    pollTaskStatus(taskID);
  }, [errorCode]);

  return <div></div>;
}
