import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { summarizeText } from './services/llm.js';
import { validateInput } from './middleware/validate.js';

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
  })
);
app.use(express.json());

if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
  console.error('STARTUP ERROR: LLM API key not found. Add GEMINI_API_KEY to server/.env and restart server.');
  process.exit(1);
}
console.log('Server startup checks passed');

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/summarize', validateInput, async (req, res) => {
  try {
    const { text } = req.body;
    const result = await summarizeText(text);
    res.json(result);
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: 'Failed to summarize text. Details: ' + error.message });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Stop the other process or set PORT to a different value in server/.env.`);
    process.exit(1);
  }
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
