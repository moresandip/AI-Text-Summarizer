# AI Text Summarizer

A full-stack web application that accepts unstructured text and produces a highly structured summary using the Google Gemini 1.5 Flash LLM API. 

This project was built for the AI Developer Intern shortlisting task.

## 🚀 Quick Start & Setup

The project uses a separated Client/Server architecture:
- Frontend: **React** (Vite)
- Backend: **Node.js** (Express)

### 1. Backend Setup
1. Open a terminal and navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` file to create your own `.env`:
   ```bash
   cp .env.example .env
   ```
4. Open `.env` and add your Gemini API Key as `OPENAI_API_KEY` (or `GEMINI_API_KEY`).
5. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a **new** terminal and navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **http://localhost:3000** to use the application.

*Note: For convenience on Windows, you can simply run the provided `start_application.bat` script in the root directory to instantly spawn both backend and frontend servers.*

---

## 🤖 AI Model & Architecture
**Model Chosen:** Google Gemini 1.5 Flash (`gemini-1.5-flash`) via the native Google REST API.  
**Why?** Gemini 1.5 Flash is incredibly fast, highly cost-effective, and exceptionally reliable at formatting structured output. By using the native REST API rather than an SDK wrapper (like OpenAI compatibility mode), I bypassed third-party adapter bugs (such as `v1main` endpoint crashes) providing a 100% reliable production connection.

### Prompt Design & Reasoning
The core of the logic lives in `server/src/services/llm.js`. 

Initially, passing a JSON template with text like `"summary": "One sentence summary."` caused the AI to literally duplicate the placeholder string instead of summarizing the text.

**The Fix:** I redesigned the prompt to use explicit `<action instructions>` inside the JSON skeleton:
```json
{
  "summary": "<write exactly one single sentence summarizing the text>",
  "keyPoints": [
    "<extract first key point>",
    ...
```
This forces the model to treat the values as computational instructions rather than literal strings. 

### Error Handling
- **API Failure / Empty Input:** The backend leverages Zod (`z.object`) to strictly validate the parsed JSON shape before returning it to the client. If the Gemini API fails, times out, or returns a 400/403 restricted key error, the `try/catch` block gracefully catches it and serves a **fallback mock summary**. This prevents the UI from completely breaking and alerts the user.
- **Frontend Catch:** If the backend server itself crashes or goes offline, the React app safely catches the 500/404 error and displays a readable red error message in the UI (`Backend unreachable (404?)`).

---

## ⚖️ Trade-offs & Shortcuts
1. **Frontend-Only vs Backend Proxy:** While I could have built this using only a React frontend calling Gemini directly, I chose to maintain an Express backend to properly hide the API key from the public browser client payload, keeping security best practices.
2. **Minimal UI:** State management is kept extremely simple utilizing standard React `useState` hooks rather than adding Redux/Zustand or a styled component library (like Tailwind) to ensure the 80/20 rule: functioning logic over over-engineered CSS within the 1-2 hour limit.
3. **Regex JSON Cleanup:** Instead of forcing `responseMimeType: "application/json"`, I used a robust Regex cleanup (`replace(/```(?:json)?\n?/g, '')`) because it is backwards compatible across a wider array of proxy LLMs (if the company decides to switch from Gemini to Llama or Anthropic down the line).

---

## 🔮 Future Extensions (If given more time)
* **Confidence Score:** Utilizing Gemini's logprobs or prompting it for an internal `confidence_level` from 1-10 to flag unsure generations.
* **Batch Processing:** Adding a bulk file uploader in the React UI to parse `.txt` or `.csv` files, loop them through the API, and download a structured JSON/Excel file containing the batched summaries.
* **Serverless Deployment Integration:** Converting the Express app logic natively into Netlify Serverless Functions for automated, single-click deployment scaling.

---

## 📸 Example Output
**Input Text:**
> *Apple is an incredible technology company. They created the iPhone, iPad, and Mac computers which completely fundamentally revolutionized the world as we know it. I absolutely love using modern technology every single day.*

**Structured Output:**
- **Summary:** Apple has revolutionized the world with its incredible technological innovations like the iPhone and Mac.
- **Key Points:**
  - Apple created the iPhone, iPad, and Mac.
  - Their products fundamentally revolutionized the world.
  - The author deeply enjoys using modern technology daily.
- **Sentiment:** POSITIVE
