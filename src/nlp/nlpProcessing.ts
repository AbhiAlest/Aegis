import csvParser from 'csv-parser';
import fs from 'fs';

const tokenizer = new natural.WordTokenizer();

async function analyzeSentiment(text: string): Promise<string> {
  try {
    const csvFilePath = 'Aegis/src/dataset/train.csv'; // Replace with the actual path to the CSV file
    const stream = fs.createReadStream(csvFilePath).pipe(csvParser());

    return new Promise<string>((resolve, reject) => {
      stream.on('data', (row) => {
        const tweetText = row['5']; // Assuming the text column is at index 5
        const sentiment = row['0']; // Assuming the polarity column is at index 0

        if (tweetText === text) {
          resolve(sentiment === '4' ? 'positive' : sentiment === '0' ? 'negative' : 'neutral');
        }
      });

      stream.on('end', () => {
        reject(new Error('Sentiment not found in the dataset'));
      });
    });
  } catch (error) {
    console.error('Error occurred during sentiment analysis:', error);
    throw error;
  }
}

function recognizeEntities(text: string): string[] {
  const ner = new natural.NER();
  const entities = ner.getEntities(text);
  return entities;
}

function classifyText(text: string): string {
  const classification = classifier.classify(text);
  return classification;
}

const classifier = new natural.BayesClassifier();

// Train the classifier with example data from the Kaggle dataset
fs.createReadStream('Aegis/src/dataset/train.csv')
  .pipe(csvParser())
  .on('data', (row) => {
    const tweetText = row['5']; // Assuming the text column is at index 5
    const sentiment = row['0']; // Assuming the polarity column is at index 0

    classifier.addDocument(tweetText, sentiment === '4' ? 'positive' : sentiment === '0' ? 'negative' : 'neutral');
  })
  .on('end', () => {
    classifier.train();
  });

export { analyzeSentiment, recognizeEntities, classifyText };
