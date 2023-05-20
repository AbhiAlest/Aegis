import { Message } from 'discord.js';
import { detectLanguage, translateMessage } from '../translation/translation';

export async function handleMessage(message: Message) {
  // Add your bot's logic here
  if (message.author.bot) return;

  const detectedLanguage = await detectLanguage(message.content);
  console.log('Detected Language:', detectedLanguage);

  if (detectedLanguage !== 'en') {
    const translation = await translateMessage(message.content, 'en');
    console.log('Translation:', translation);
    // Handle the translated message
  } else {
    console.log('Message is in English:', message.content);
    // Handle the message directly
  }
}
