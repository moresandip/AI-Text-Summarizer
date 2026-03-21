const fs = require('fs');
fetch('http://localhost:3001/api/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'This is a test of the Gemini API summary generation.' })
}).then(async r => {
  const text = await r.text();
  fs.writeFileSync('fetch_result.txt', 'Status: ' + r.status + '\nBody: ' + text);
  console.log('done');
}).catch(err => {
  fs.writeFileSync('fetch_result.txt', 'Error: ' + err.message);
  console.log('done error');
});
