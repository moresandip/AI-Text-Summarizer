# AI Text Summarizer

## Overview
A full-stack app that accepts unstructured text via React frontend, sends it to OpenAI (gpt-4o-mini) backend via Express, and displays structured summary: one-sentence summary, 3 key points, sentiment label.

Tech: React+Vite (frontend), Node+Express+OpenAI (backend), Zod validation, dotenv secrets.

## Setup
1. Duplicate `server/.env.example` to `server/.env` and add `OPENAI_API_KEY=your_key`.
2. Backend: `cd server && npm install && npm run dev` (runs on http://localhost:3001)
3. Frontend: `cd client && npm install && npm run dev` (runs on http://localhost:3000, proxies /api to backend)

## Usage
- Paste text in textarea
- Click Submit
- View structured output

## Example Input/Output
**Input:**  
The new AI model is incredibly fast but sometimes hallucinates facts. Users love the speed for daily tasks. Developers note accuracy trade-offs.

**Output:**  
```
Summary: The new AI model offers impressive speed with some hallucination issues, pleasing users but concerning developers.

Key Points:
• Exceptional speed for everyday use
• Occasional fact hallucinations
• Users prioritize speed over perfect accuracy

Sentiment: neutral
```

## Prompt Design
Strict JSON-only prompt defines role, exact schema, constraints (1-sentence summary, exactly 3 bullets, allowed sentiments), reduces parsing errors.

## Trade-offs
- Backend API call for key security (no frontend exposure).
- Minimal UI: focus on core LLM integration.
- No auth/tests: scope-limited to 1-2h assignment.
- gpt-4o-mini: cheap/fast for demo.

## Future Improvements
- File upload/batch.
- Custom schemas.
- Rate limiting/caching.
- Unit tests.

![Screenshot](screenshot.png) <!-- Add real screenshot after running -->
