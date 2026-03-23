@echo off
echo Starting Backend...
start "Backend" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak >nul
echo Starting Frontend...
start "Frontend" cmd /k "cd client && npm run dev"
timeout /t 5 /nobreak >nul
echo Opening UI...
start http://localhost:3000
echo Done! Check terminals.
