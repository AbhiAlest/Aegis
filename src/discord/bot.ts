import { Message } from 'discord.js';
import { detectLanguage, translateMessage } from '../translation/translation';
import { isBypassingFilter } from '../utils/bypassDetection';

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
    if (isBypassingFilter(message.content)) {
      console.log('Bypass attempt detected');
      // Handle bypass attempt
    } else {
      console.log('Message is not a bypass attempt');
      // Handle the message directly
    }
  }
}
