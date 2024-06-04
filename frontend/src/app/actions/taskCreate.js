'use server';

const { CloudTasksClient } = require('@google-cloud/tasks').v2;

export const taskCreate = async (id) => {
  const baseUrl = process.env.API_URL;
  const gcProjectId = process.env.GC_PROJECT_ID;
  const gcEmail = process.env.GC_CLIENT_EMAIL;
  const gcKey = process.env.GC_PRIVATE_KEY.replace(/\\n/g, '\n');
  const gcLocation = process.env.GC_QUEUE_LOCATION;
  const gcQueue = process.env.GC_QUEUE_NAME;

  // Instantiates a client.
  const taskClient = new CloudTasksClient({ gcProjectId, credentials: { client_email: gcEmail, private_key: gcKey } });

  // Construct the fully-qualified queue name.
  const parent = taskClient.queuePath(gcProjectId, gcLocation, gcQueue);
  const task = {
    httpRequest: {
      httpMethod: 'GET',
      url: `${baseUrl}/processRequest/${id.toString()}`,
    },
  };

  const request = { parent: parent, task: task };

  const [response] = await taskClient.createTask(request);
};
