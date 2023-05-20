import { Client } from 'discord.js';
import { analyzeSentiment, recognizeEntities, classifyText } from './nlp/nlpProcessing';

const client = new Client();

const token = 'YOUR_BOT_TOKEN';

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('message', (message) => {
  const sentiment = analyzeSentiment(message.content);
  const entities = recognizeEntities(message.content);
  const classification = classifyText(message.content);

  console.log('Sentiment:', sentiment);
  console.log('Entities:', entities);
  console.log('Classification:', classification);
});

client.login(token);

