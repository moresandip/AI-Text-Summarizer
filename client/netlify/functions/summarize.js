exports.handler = async (event) => {
  try {
    const { text } = JSON.parse(event.body);
    const requestedModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const model =
      requestedModel === "gemini-1.5-flash" || requestedModel === "gemini-1.5-flash-latest"
        ? "gemini-1.5-flash"
        : requestedModel;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `Summarize this text:\n${text}` }],
            },
          ],
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

    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No summary generated";

    return {
      statusCode: 200,
      body: JSON.stringify({ summary }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
