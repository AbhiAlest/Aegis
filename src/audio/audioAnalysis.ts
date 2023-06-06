function analyzeAudio(audioData) {
  // Perform analysis on the audio data using Web Audio API //https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
  const audioContext = new AudioContext();
  const audioSource = audioContext.createBufferSource();
  audioSource.buffer = createAudioBuffer(audioData, audioContext.sampleRate);

  // Create an audio analyzer
  const audioAnalyser = audioContext.createAnalyser();
  audioAnalyser.fftSize = 2048;
  audioSource.connect(audioAnalyser);
  audioSource.connect(audioContext.destination);

  // Process the audio data and extract relevant information
  const analysisResult = processAudioAnalysis(audioAnalyser);

  // Perform additional analysis
  const spectralData = getFrequencySpectrum(audioAnalyser);
  const peaks = findPeaks(spectralData);
  const tempo = calculateTempo(audioData, audioContext.sampleRate);
  const amplitudeEnvelope = calculateAmplitudeEnvelope(audioData);

  // Add the additional analysis results to the existing analysis result object
  analysisResult.spectralData = spectralData;
  analysisResult.peaks = peaks;
  analysisResult.tempo = tempo;
  analysisResult.amplitudeEnvelope = amplitudeEnvelope;

  return analysisResult;
}

function getFrequencySpectrum(audioAnalyser) {
  const bufferLength = audioAnalyser.frequencyBinCount;
  const frequencyData = new Uint8Array(bufferLength);
  audioAnalyser.getByteFrequencyData(frequencyData);
  return frequencyData;
}

function findPeaks(spectralData: Uint8Array, threshold = 0.5, minPeakDistance = 10): number[] {
  const peaks: number[] = [];

  // Find local maxima that exceed the threshold
  for (let i = 1; i < spectralData.length - 1; i++) {
    if (spectralData[i] > spectralData[i - 1] && spectralData[i] > spectralData[i + 1] && spectralData[i] > threshold) {
      peaks.push(i);
    }
  }

  // Filter out peaks that are too close to each other
  const filteredPeaks: number[] = [];
  for (let i = 0; i < peaks.length; i++) {
    const currentPeak = peaks[i];
    const isFarEnough = filteredPeaks.every((filteredPeak) => Math.abs(currentPeak - filteredPeak) > minPeakDistance);
    if (isFarEnough) {
      filteredPeaks.push(currentPeak);
    }
  }

  return filteredPeaks;
}

function calculateTempo(audioData: Float32Array, sampleRate: number): number {
  const onsetDetectionThreshold = 0.1; // Adjust this threshold to detect onsets

  // Perform onset detection to find the timing of rhythmic events
  const onsets: number[] = [];
  for (let i = 1; i < audioData.length; i++) {
    if (audioData[i] > onsetDetectionThreshold && audioData[i - 1] <= onsetDetectionThreshold) {
      onsets.push(i);
    }
  }

  // Calculate the average time difference between onsets and convert to tempo
  const timeDifferences = onsets.map((onset, index) => {
    if (index === 0) {
      return 0;
    }
    return (onset - onsets[index - 1]) / sampleRate;
  });

  if (timeDifferences.length === 0) {
    return 0;
  }

  const averageTimeDifference = timeDifferences.reduce((sum, difference) => sum + difference, 0) / timeDifferences.length;
  const tempo = 60 / averageTimeDifference;

  return tempo;
}

function calculateAmplitudeEnvelope(audioData: Float32Array): number[] {
  const envelope: number[] = [];
  let maxAmplitude = -Infinity;

  // Calculate the instantaneous amplitude for each sample
  for (let i = 0; i < audioData.length; i++) {
    const amplitude = Math.abs(audioData[i]);
    envelope.push(amplitude);

    if (amplitude > maxAmplitude) {
      maxAmplitude = amplitude;
    }
  }

  // Normalize the envelope to the range [0, 1]
  const normalizedEnvelope = envelope.map((amplitude) => amplitude / maxAmplitude);

  return normalizedEnvelope;
}

export { analyzeAudio, findPeaks, calculateTempo, calculateAmplitudeEnvelope };

