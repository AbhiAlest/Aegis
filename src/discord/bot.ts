import { Client, Message } from 'discord.js';

const client = new Client();

const token = 'YOUR_BOT_TOKEN';

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('message', (message: Message) => {
  // Add bot's logic here
  // moderation tasks and specific commands
});

client.login(token);

