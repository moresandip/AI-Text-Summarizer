export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { text } = await req.json();
    
    if (!text || text.length > 5000) {
      return new Response(JSON.stringify({ error: "Invalid text input" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

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

    // Read the API key from Netlify Environment Variables
    const apiKey = Netlify.env.get("OPENAI_API_KEY") || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Server API Key is not configured." }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

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
      return new Response(JSON.stringify({ error: `Gemini API Error: ${errorText}` }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    // Clean up markdown wrapping from AI output
    let jsonStr = content.replace(/```(?:json)?\n?/g, '').replace(/```\n?$/g, '').trim();
    
    return new Response(jsonStr, {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
    });
  }
};
