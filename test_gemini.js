const fs = require('fs');
const key = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

if (!key) {
  fs.writeFileSync('c:\\Users\\mores\\OneDrive\\Desktop\\Ai_Final_Project\\gemini_test.txt', 'Error: GEMINI_API_KEY is missing');
  process.exit(1);
}

fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + key
  },
  body: JSON.stringify({
    model,
    messages: [{role: 'user', content: 'hello'}]
  })
}).then(async r => {
  const t = await r.text();
  fs.writeFileSync('c:\\Users\\mores\\OneDrive\\Desktop\\Ai_Final_Project\\gemini_test.txt', 'Status: ' + r.status + '\nBody: ' + t);
  process.exit(0);
}).catch(err => {
  fs.writeFileSync('c:\\Users\\mores\\OneDrive\\Desktop\\Ai_Final_Project\\gemini_test.txt', 'Error: ' + err.message);
  process.exit(1);
});
