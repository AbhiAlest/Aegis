import { Message } from 'discord.js';
import { detectLanguage, translateMessage } from '../translation/translation';
import { isBypassingFilter } from '../utils/bypassDetection';
import { translateText } from '../translation/translation';

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

// ...

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!')) {
    const command = message.content.slice(1).trim(); // Remove the '!' and trim whitespace

    // Check if the command is for translation
    if (command.startsWith('translate')) {
      const textToTranslate = command.slice(9).trim(); // Remove 'translate' and trim whitespace

      // Call the translateText function to translate the text
      const translatedText = await translateText(textToTranslate);

      // Send the translated text as a reply
      message.reply(`Translated text: ${translatedText}`);
    }
  }
});
