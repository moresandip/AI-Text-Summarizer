import dotenv from 'dotenv';
import { summarizeText } from './src/services/llm.js';

dotenv.config();

async function test() {
  try {
console.log('Testing Gemini API with model:', process.env.GEMINI_MODEL || 'gemini-1.5-flash');
    const result = await summarizeText('The quick brown fox jumps over the lazy dog. This is a classic test sentence used for typography and testing systems.');
    console.log('Success!');
    console.log('Summary:', result.summary);
    console.log('Key Points:', result.keyPoints);
    console.log('Sentiment:', result.sentiment);
  } catch (error) {
    console.error('Test Failed:', error);
    process.exit(1);
  }
}

console.log('Starting test...');
await test();
console.log('Test finished.');
