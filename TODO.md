# AI Summarizer Project TODO

## Approved Plan Breakdown
1. ~~Plan confirmed~~
2. Create root files: README.md, .gitignore
3. Create server/ directory structure and files (package.json, .env.example, src/index.js, src/services/llm.js, src/middleware/validate.js)
4. Create client/ directory structure and files (package.json, vite.config.js, index.html, src/main.jsx, src/App.jsx, src/components/*)
5. Install dependencies (execute npm install in server/ and client/)
6. Test backend: run server, curl POST to /api/summarize
7. Test frontend: run client, input text, verify UI + LLM output
8. Add example output to README.md
9. Complete: attempt_completion with run instructions

**Progress: Step 5 complete (client deps installed). Next: 6. Test backend - run `cd server && npm run dev` (add OPENAI_API_KEY first), then curl test.**
