import * as natural from 'natural';

const tokenizer = new natural.WordTokenizer();
const classifier = new natural.BayesClassifier();

function analyzeSentiment(text: string): string {
  const tokens = tokenizer.tokenize(text);

  const sentiment = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
  const sentimentResult = sentiment.getSentiment(tokens);

  return sentimentResult;
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

// add some example data (FIX LATER)  sentiment analysis
classifier.addDocument('I love this place', 'positive');
classifier.addDocument('This is terrible', 'negative');
classifier.train();

export { analyzeSentiment, recognizeEntities, classifyText };

