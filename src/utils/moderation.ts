import * as tf from '@tensorflow/tfjs';
import * as fs from 'fs';

// parse the rules from a text document
function loadRules(filePath: string): string[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const rules = fileContent.split('\n').map((rule) => rule.trim());
  return rules;
}

// Apply mod rules
function applyModerationRules(message: string, rules: string[]): boolean {
  for (const rule of rules) {
    if (message.includes(rule)) {
      return true; // Message violates a rule
    }
  }
  return false; // Message is within the rules
}

const model = tf.sequential();
model.add(tf.layers.dense({ units: 10, inputShape: [4], activation: 'relu' }));
model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

model.compile({ loss: 'categoricalCrossentropy', optimizer: 'adam' });

// TRAINING DATA (REPLACE)
const trainingData = tf.tensor2d([
  [0.1, 0.2, 0.3, 0.4],
  [0.2, 0.3, 0.4, 0.5],
  [0.3, 0.4, 0.5, 0.6],
  // ...
]);
const targetData = tf.tensor2d([
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
  // ...
]);

// Train model
async function trainModel(feedbackData: number[][], targetData: number[][]) {
  const iterations = 10; // Number of iterations to update the model

  for (let i = 0; i < iterations; i++) {
    await model.fit(feedbackData, targetData, {
      epochs: 1,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
        },
      },
    });

    // Example feedback (REPLACE LATER)
    const feedback = [1, 0, 0]; // Adjust based on feedback

    // Incorporate feedback into the training data
    const updatedTrainingData = tf.tensor2d([...feedbackData, ...feedback]);
    const updatedTargetData = tf.tensor2d([...targetData, ...feedback]);

    // Update model based on feedback
    await model.fit(updatedTrainingData, updatedTargetData, { epochs: 1 });
  }
}

// Make predictions with trained model
function makePredictions(inputData: number[][]) {
  const input = tf.tensor2d(inputData);
  const predictions = model.predict(input) as tf.Tensor;
  const outputData = predictions.arraySync() as number[][];

  console.log('Predictions:');
  console.log(outputData);
}

trainModel(trainingData, targetData).then(() => {
  // Once training is complete, load the moderation rules from a file
  const rules = loadRules('rules.txt');

  // Example messages for mod rules (Parse later from rules.txt - - -> input rules)
  const messages = [
    'This is a clean message.',
    'This message violates rule 1.',
    'This message violates rule 2.',
  ];

  // Apply mod rules to each message
  for (const message of messages) {
    const isViolatingRules = applyModerationRules(message, rules);

    if (isViolatingRules) {
      console.log(`Message "${message}" violates the rules.`);
    } else {
      console.log(`Message "${message}" is within the rules.`);
    }
  }

  // Make predictions with new data (LEARNING)
  const newData = [
    [0.4, 0.5, 0.6, 0.7],
    [0.5, 0.6, 0.7, 0.8],
  ];
  makePredictions(newData);
});
