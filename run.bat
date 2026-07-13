@echo off
title Project Management Time Tracker
color 0A

echo.
echo  ============================================
echo   Project Management Time Tracker
echo   By Prateek  ^|  @2026
echo  ============================================
echo.

echo  [1/3] Starting Backend (Spring Boot)...
start "PMTT Backend" cmd /k "mvn spring-boot:run"

echo  [2/3] Waiting for backend to initialize (20 seconds)...
timeout /t 20 /nobreak > nul

echo  [3/3] Starting Frontend (Vite + React)...
start "PMTT Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo  Waiting for frontend to start (10 seconds)...
timeout /t 10 /nobreak > nul

echo.
echo  ============================================
echo   Both servers are running!
echo   Backend  :  http://localhost:8080
echo   Frontend :  http://localhost:5173
echo  ============================================
echo.

echo  Opening browser...
start "" "http://localhost:5173"

echo.
echo  Press any key to STOP all servers and exit...
pause > nul

echo.
echo  Shutting down servers...
taskkill /FI "WindowTitle eq PMTT Backend*"  /T /F > nul 2>&1
taskkill /FI "WindowTitle eq PMTT Frontend*" /T /F > nul 2>&1
echo  Done! All servers stopped.
echo.
