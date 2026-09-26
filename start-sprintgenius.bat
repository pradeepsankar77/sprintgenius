@echo off
title SprintGenius AI - Unified Multi-Agent Runner
color 0b

echo ========================================================
echo        SprintGenius AI - Autonomous Sprint Copilot
echo ========================================================
echo.

:: Detect root directory
set "CURRENT_DIR=%~dp0"
if exist "%CURRENT_DIR%server.js" (
    set "BACKEND_DIR=%CURRENT_DIR%"
    set "FRONTEND_DIR=%CURRENT_DIR%..\sprintgenius-frontend"
) else if exist "%CURRENT_DIR%sprintgenius-backend" (
    set "BACKEND_DIR=%CURRENT_DIR%sprintgenius-backend"
    set "FRONTEND_DIR=%CURRENT_DIR%sprintgenius-frontend"
) else (
    set "BACKEND_DIR=%CURRENT_DIR%..\sprintgenius-backend"
    set "FRONTEND_DIR=%CURRENT_DIR%"
)

:: 1. Check MongoDB
echo [1/3] Verifying MongoDB service...
sc query MongoDB | find "RUNNING" >nul
if %ERRORLEVEL% equ 0 (
    echo [OK] MongoDB service is active.
) else (
    echo [WARN] MongoDB service not running as Windows Service. Checking local port 27017...
)

:: 2. Launch Backend (Port 5000)
echo [2/3] Starting SprintGenius Express API Backend on port 5000...
start "SprintGenius Backend (Port 5000)" cmd /k "cd /d "%BACKEND_DIR%" && npm start"

:: Wait 3 seconds for backend to bind to port
timeout /t 3 /nobreak >nul

:: 3. Launch Frontend (Port 3000)
echo [3/3] Starting SprintGenius Vite UI Frontend on port 3000...
start "SprintGenius Frontend (Port 3000)" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"

:: Wait 2 seconds and open browser
timeout /t 2 /nobreak >nul
echo.
echo ========================================================
echo [SUCCESS] SprintGenius AI is running!
echo Backend API : http://localhost:5000
echo Frontend UI : http://localhost:3000
echo ========================================================
echo.

start http://localhost:3000

