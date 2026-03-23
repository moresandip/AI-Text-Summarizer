import dotenv from 'dotenv';
import { summarizeText } from './src/services/llm.js';
import fs from 'fs';

dotenv.config();

async function test() {
  let log = '';
  try {
    log += `Testing Gemini API with model: ${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}\n`;
    const result = await summarizeText('The quick brown fox jumps over the lazy dog. This is a classic test sentence.');
    log += `Success!\nSummary: ${result.summary}\n`;
    fs.writeFileSync('test_result_success.txt', log);
  } catch (error) {
    log += `Test Failed: ${error.message}\nStack: ${error.stack}\n`;
    fs.writeFileSync('test_result_fail.txt', log);
    process.exit(1);
  }
}

test();
