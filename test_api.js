const text = "Apple is an incredible technology company. They created the iPhone and Mac computers which revolutionised the world. I love using modern technology.";
fetch('http://localhost:3001/api/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({text})
}).then(r => r.json()).then(data => {
  console.log("TEST RESULT:", data);
  process.exit(0);
}).catch(err => {
  console.log("TEST ERROR:", err);
  process.exit(1);
});
