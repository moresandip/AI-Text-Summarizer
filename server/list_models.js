import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!response.ok) {
        fs.writeFileSync('C:\\Users\\mores\\OneDrive\\Desktop\\Ai_Final_Project\\models_list_root.txt', `API Error: ${response.status} ${await response.text()}`);
        return;
    }
    const data = await response.json();
    let models = 'Available Models:\n';
    data.models.forEach(m => models += `- ${m.name}\n`);
    fs.writeFileSync('C:\\Users\\mores\\OneDrive\\Desktop\\Ai_Final_Project\\models_list_root.txt', models);
  } catch (err) {
    fs.writeFileSync('C:\\Users\\mores\\OneDrive\\Desktop\\Ai_Final_Project\\models_list_root.txt', `Fetch Error: ${err.message}`);
  }
}

listModels();
