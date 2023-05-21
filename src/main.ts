import { Client, GatewayIntentBits, Message } from 'discord.js';
import { analyzeSentiment, recognizeEntities, classifyText } from './nlp/nlpProcessing';
import { detectLanguage, translateText } from './translation/translation';
import { applyModerationRules, loadRules } from './moderation/moderation';

require('dotenv').config();

const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return;

  // NLP Processing
  const sentiment = analyzeSentiment(message.content);
  const entities = recognizeEntities(message.content);
  const classification = classifyText(message.content);

  console.log('Sentiment:', sentiment);
  console.log('Entities:', entities);
  console.log('Classification:', classification);

  // Moderation
  const rules = loadRules('rules.txt');
  const isViolatingRules = applyModerationRules(message.content, rules);

  if (isViolatingRules) {
    console.log(`Message "${message.content}" violates the rules.`);
    // Handle the violating message
  } else {
    console.log(`Message "${message.content}" is within the rules.`);
    // Handle the message within the rules
  }

  // Translation
  const detectedLanguage = await detectLanguage(message.content);
  console.log('Detected Language:', detectedLanguage);

  if (detectedLanguage !== 'en') {
    const translation = await translateText(message.content, detectedLanguage, 'en');
    console.log('Translation:', translation);
    // Handle the translated message
  } else {
    console.log('Message is in English:', message.content);
    // Handle the message directly
  }
});

client.login(process.env.DISCORD_TOKEN);
