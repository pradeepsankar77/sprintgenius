# SprintGenius AI - Unified Startup Script
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      SprintGenius AI - Autonomous Agile Copilot       " -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$currentDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (Test-Path "$currentDir\server.js") {
    $backendDir = $currentDir
    $frontendDir = Resolve-Path "$currentDir\..\sprintgenius-frontend"
} elseif (Test-Path "$currentDir\sprintgenius-backend") {
    $backendDir = "$currentDir\sprintgenius-backend"
    $frontendDir = "$currentDir\sprintgenius-frontend"
} else {
    $backendDir = Resolve-Path "$currentDir\..\sprintgenius-backend"
    $frontendDir = $currentDir
}

# 1. Verify MongoDB
Write-Host "[1/3] Checking MongoDB connection..." -ForegroundColor Yellow
try {
    $tcp = Test-NetConnection -ComputerName 127.0.0.1 -Port 27017 -WarningAction SilentlyContinue
    if ($tcp.TcpTestSucceeded) {
        Write-Host "  [OK] MongoDB is active on port 27017." -ForegroundColor Green
    } else {
        Write-Host "  [WARN] MongoDB not detected on 127.0.0.1:27017. Attempting to start MongoDB service..." -ForegroundColor Yellow
        Start-Service MongoDB -ErrorAction SilentlyContinue
    }
} catch {
    Write-Host "  [INFO] Proceeding to start servers..." -ForegroundColor Gray
}

# 2. Launch Backend
Write-Host "[2/3] Launching Express Backend (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; npm start"

Start-Sleep -Seconds 3

# 3. Launch Frontend
Write-Host "[3/3] Launching Vite Frontend (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendDir'; npm run dev"

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host " [SUCCESS] SprintGenius AI is now running concurrently! " -ForegroundColor Green
Write-Host " Backend API : http://localhost:5000" -ForegroundColor White
Write-Host " Frontend UI : http://localhost:3000" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""

Start-Process "http://localhost:3000"

