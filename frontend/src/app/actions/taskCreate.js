'use server';

const { CloudTasksClient } = require('@google-cloud/tasks').v2;

export const taskCreate = async (id) => {
  const keyfile = {
    'type': process.env.GC_TYPE,
    'project_id': process.env.GC_PROJECT_ID,
    'private_key_id': process.env.GC_PRIVATE_KEY_ID,
    'private_key': process.env.GC_PRIVATE_KEY,
    'client_email': process.env.GC_CLIENT_EMAIL,
    'client_id': process.env.GC_CLIENT_ID,
    'auth_uri': process.env.GC_AUTH_URI,
    'token_uri': process.env.GC_TOKEN_URI,
    'auth_provider_x509_cert_url': process.env.GC_AUTH_CERT_URL,
    'client_x509_cert_url': process.env.GC_CLIENT_CERT_URL,
    'universe_domain': process.env.GC_UNIVERSE,
  };
  const baseUrl = process.env.API_URL;
  const gcProjectId = process.env.GC_PROJECT_ID;
  const gcEmail = process.env.GC_CLIENT_EMAIL;
  const gcKey = process.env.GC_PRIVATE_KEY.replace(/\\n/g, '\n');
  const gcLocation = process.env.GC_QUEUE_LOCATION;
  const gcQueue = process.env.GC_QUEUE_NAME;

  // Instantiates a client.
  //   const taskClient = new CloudTasksClient({ gcProjectId, keyfile });
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

  console.log(`Created task ${response.name}`);
  console.log(`Response: ${JSON.stringify(response, null, 2)}`);
};
