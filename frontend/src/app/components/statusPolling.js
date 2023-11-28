'use client';
import { useState, useEffect } from 'react';
import { checkRedis, getRedis } from '../actions/redisActions';
import { useRouter } from 'next/navigation';
import { emissionsError } from './exceptions';

export function StatusPoll({ taskID }) {
  const [taskStatus, setTaskStatus] = useState('Not ready');
  const [errorCode, setErrorCode] = useState(0);
  // const [errorCode, setErrorCode] = useState(false);
  const router = useRouter();

  // useEffect(() => {
  //   if (errorCode !== 0) {
  //     throw new emissionsError(`Error: ${errorCode}`);
  //   }
  // }, [errorCode]);

  useEffect(() => {
    const pollTaskStatus = async (taskID) => {
      const pollInterval = setInterval(async () => {
        // try {
        const pollResponse = await checkRedis('response', taskID);
        if (pollResponse === 1) {
          clearInterval(pollInterval);
          setTaskStatus('Task is now ready');
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

          // setErrorCode(error);
          // throw new Error('Need to use content of error_id to determine what to throw here');
        }
        // } catch (error) {
        //   // How do you get the above error to trigger this catch block?
        //   console.error('Error polling task status:', error);
        //   if (error.message === 'Need to use content of error_id to determine what to throw here') {
        //     clearInterval(pollInterval);
        //   }
        //   clearInterval(pollInterval);
        // }
      }, 2000);

      return () => clearInterval(pollInterval);
    };

    pollTaskStatus(taskID);
  }, []);

  return <div></div>;
}
