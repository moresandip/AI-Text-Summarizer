import { z } from 'zod';

const summarySchema = z.object({
  summary: z.string().max(200),
  keyPoints: z.array(z.string()).length(3),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
});

// Removed invalid legacy mapping - use valid models directly
const LEGACY_MODEL_MAP = {};

function resolveGeminiModel(rawModel) {
  const requestedModel = rawModel || 'gemini-1.5-flash';
  return {
    requestedModel,
    model: LEGACY_MODEL_MAP[requestedModel] || requestedModel,
  };
}

export async function summarizeText(text) {
  const prompt = `You are an expert summarization assistant.
Analyze the following text and return ONLY a strict JSON object with the exact structure below. Do not include markdown formatting or backticks.

{
  "summary": "<write exactly one single sentence summarizing the text>",
  "keyPoints": [
    "<extract first key point>",
    "<extract second key point>",
    "<extract third key point>"
  ],
  "sentiment": "<choose exactly one: positive, neutral, or negative>"
}

Text to summarize:
${text}`;

  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  const { requestedModel, model } = resolveGeminiModel(process.env.GEMINI_MODEL);

  if (!apiKey) {
    console.error(
      'API KEY ERROR: No LLM API key found. Get GEMINI_API_KEY from https://aistudio.google.com/app/apikey'
    );
    throw new Error('API key missing. Set GEMINI_API_KEY in server/.env');
  }

  if (requestedModel !== model) {
    console.warn(`Legacy Gemini model "${requestedModel}" remapped to "${model}". Update GEMINI_MODEL in server/.env.`);
  }

  console.log(`LLM API ready (Gemini: ${model})`);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1 },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API Error (${response.status}):`, errorText);
      const isQuotaError = response.status === 429;
      const message = isQuotaError 
        ? `Gemini API quota exceeded (429). Try switching to "gemini-flash-latest" in .env, or check your billing at aistudio.google.com.`
        : `Gemini API failed (${response.status}) using model "${model}": ${errorText.slice(0, 200)}.`;
      throw new Error(message);
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('Gemini API returned no summary content');
    }

    const jsonStr = content
      .replace(/```(?:json)?\n?/g, '')
      .replace(/```\n?$/g, '')
      .trim();
    const parsed = JSON.parse(jsonStr);

    console.log('LLM response parsed OK');
    return summarySchema.parse(parsed);
  } catch (apiError) {
    console.error('LLM call failed:', apiError.message);
    throw new Error(`Summarization failed: ${apiError.message}. Verify GEMINI_API_KEY in server/.env`);
  }
}
