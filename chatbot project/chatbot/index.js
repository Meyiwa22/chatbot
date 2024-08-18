const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

const app = express();
app.use(bodyParser.json());

const projectId = 'your-project-id'; // Replace with your Dialogflow project ID
const sessionId = uuid.v4();
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

app.post('/webhook', async (req, res) => {
  const query = req.body.queryResult.queryText;
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: 'en',
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    const fulfillmentText = result.fulfillmentText;

    res.json({ fulfillmentText });
  } catch (error) {
    console.error('ERROR:', error);
    res.status(500).send('Something went wrong!');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
