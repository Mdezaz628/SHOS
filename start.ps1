# SHOS — Start All Services
# Run karo: powershell -ExecutionPolicy Bypass -File start.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " SHOS Smart Hospital Operations System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend
Write-Host "[1/3] Starting Backend (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\shos-backend'; Write-Host 'SHOS Backend' -ForegroundColor Cyan; node server.js"
Start-Sleep 2

# Start Web Frontend
Write-Host "[2/3] Starting Web Frontend (Port 5174)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\shos-web'; Write-Host 'SHOS Web' -ForegroundColor Green; npm run dev"
Start-Sleep 1

# Start Mobile (Expo)
Write-Host "[3/3] Starting Mobile (Expo)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\shos-mobile'; Write-Host 'SHOS Mobile' -ForegroundColor Magenta; npx expo start -c"

Write-Host ""
Write-Host "✅ All services starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "  Backend  → http://localhost:5000" -ForegroundColor Cyan
Write-Host "  Web      → http://localhost:5174" -ForegroundColor Green
Write-Host "  Mobile   → Scan QR in Expo window" -ForegroundColor Magenta
Write-Host ""
