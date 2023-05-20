import axios from 'axios';

// language detection
async function detectLanguage(message: string): Promise<string> {
  try {
    const googleTranslateEndpoint = 'https://translation.googleapis.com/language/translate/v2/detect';
    const apiKey = 'YOUR_GOOGLE_TRANSLATE_API_KEY'; // Replace with your Google Translate API key

    const response = await axios.post(
      googleTranslateEndpoint,
      {
        q: message,
        key: apiKey,
      }
    );

    const detectedLanguage = response.data.data.detections[0][0].language;
    return detectedLanguage;
  } catch (error) {
    console.error('Error occurred during language detection:', error);
    throw error;
  }
}

// language translation
async function translateMessage(message: string, targetLanguage: string): Promise<string> {
  try {
    const googleTranslateEndpoint = 'https://translation.googleapis.com/language/translate/v2';
    const apiKey = 'YOUR_GOOGLE_TRANSLATE_API_KEY'; // Replace with your Google Translate API key

    const response = await axios.post(
      googleTranslateEndpoint,
      {
        q: message,
        target: targetLanguage,
        key: apiKey,
      }
    );

    const translation = response.data.data.translations[0].translatedText;
    return translation;
  } catch (error) {
    console.error('Error occurred during translation:', error);
    throw error;
  }
}
