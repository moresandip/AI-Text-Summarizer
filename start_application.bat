@echo off
echo Starting Backend Server...
start cmd /k "cd server && node src/index.js"

echo Starting Frontend Server...
start cmd /k "cd client && npm run dev"

echo ==============================================
echo Both servers are starting in separate windows!
echo Once they are ready, you can view the app at:
echo http://localhost:3000
echo ==============================================
