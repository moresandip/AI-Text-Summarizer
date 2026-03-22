import { z } from 'zod';

const summarySchema = z.object({
  summary: z.string().max(200),
  keyPoints: z.array(z.string()).length(3),
  sentiment: z.enum(['positive', 'neutral', 'negative']),
});

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

  try {
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyC1LerLFQTxMDa4AaGwB_TNQfVaxM_BP8A";
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      throw new Error("Gemini API Error");
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    let jsonStr = content.replace(/```(?:json)?\n?/g, '').replace(/```\n?$/g, '').trim();
    let parsed = JSON.parse(jsonStr);
    
    console.log("Raw LLM output successfully parsed:", parsed);
    return summarySchema.parse(parsed);

  } catch (apiError) {
    console.warn("Gemini API call failed. Falling back to mock summary. Error:", apiError);
    return {
      summary: "This is a fallback mock summary because the real Gemini API request failed (check API key permissions).",
      keyPoints: ["The application is running!", "The UI works perfectly", "Check your Google Cloud console to fix the API key"],
      sentiment: "neutral"
    };
  }
}
