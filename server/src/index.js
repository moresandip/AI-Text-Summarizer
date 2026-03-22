import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { summarizeText } from './services/llm.js';
import { validateInput } from './middleware/validate.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
