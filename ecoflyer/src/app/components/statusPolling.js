'use client';
import { useState, useEffect } from 'react';
import { checkRedis } from '../actions/redisActions';

export function StatusPoll({ taskID }) {
  //   const [taskID, setTaskId] = useState(taskID);
  const [taskStatus, setTaskStatus] = useState('Not ready');

  useEffect(() => {
    const pollTaskStatus = async (taskID) => {
      const intervalId = setInterval(async () => {
        try {
          const responseReady = await checkRedis('response', taskID);
          if (responseReady === 1) {
            // console.log(responseReady);
            // console.log('response exists');
            clearInterval(intervalId);
            setTaskStatus('Task is now ready');
          }
          //   else {
          //     console.log(responseReady);
          //     console.log('response DOES NOT exist');
          //   }

          // If the task is completed, stop polling
          //   if (responseReady) {
          //   }
        } catch (error) {
          console.error('Error polling task status:', error);
        }
      }, 2000);

      // Cleanup function to stop polling on component unmount
      return () => clearInterval(intervalId);
    };

    pollTaskStatus(taskID);
  }, []);

  return (
    <div>
      <p>Task ID: {taskID}</p>
      <p>Task Status: {taskStatus}</p>
    </div>
  );
}
