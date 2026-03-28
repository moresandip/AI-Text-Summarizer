exports.handler = async (event) => {
  try {
    const { text } = JSON.parse(event.body);
    const model = process.env.GEMINI_MODEL || "gemini-flash-latest";
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing from environment variables.");
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: { temperature: 0.1 },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Gemini API failed (${response.status}) using model "${model}": ${errorText.slice(0, 300)}`
      );
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error("Gemini API returned no content.");
    }

    // Clean markdown backticks if present
    const jsonStr = content
      .replace(/```(?:json)?\n?/g, "")
      .replace(/```\n?$/g, "")
      .trim();
    
    const parsed = JSON.parse(jsonStr);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(parsed),
    };
  } catch (error) {
    console.error("Netlify Function Error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
