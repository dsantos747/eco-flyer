'use client';
import { useState, useEffect } from 'react';
import { checkRedis, getRedis } from '../actions/redisActions';
import { useRouter } from 'next/navigation';
import { emissionsError } from './exceptions';

export function StatusPoll({ taskID }) {
  const [taskStatus, setTaskStatus] = useState('Not ready');
  const [errorCode, setErrorCode] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (errorCode !== 0) {
      throw new emissionsError(`Error: ${errorCode}`);
    }
  }, [errorCode]);

  useEffect(() => {
    const pollTaskStatus = async (taskID) => {
      const intervalId = setInterval(async () => {
        try {
          const pollResponse = await checkRedis('response', taskID); // Modify this loop to instead check if a "data"
          if (pollResponse === 1) {
            clearInterval(intervalId);
            setTaskStatus('Task is now ready');
            router.push(`/results/${taskID}`);
          }
          const pollError = await checkRedis('error', taskID);
          if (pollError === 1) {
            const error = await getRedis('error', taskID);
            console.log(`The error is ${error}`);
            setErrorCode(error);
            // throw new Error('Need to use content of error_id to determine what to throw here');
          }
        } catch (error) {
          // How do you get the above error to trigger this catch block?
          console.error('Error polling task status:', error);
          if (error.message === 'Need to use content of error_id to determine what to throw here') {
            clearInterval(intervalId);
          }
          clearInterval(intervalId);
        }
      }, 2000);

      return () => clearInterval(intervalId);
    };

    pollTaskStatus(taskID);
  }, []);

  return <div></div>;
}
