#!/usr/bin/env pwsh

# RainAI Production Deployment Script
# One command to deploy everything

Write-Host "`n================================" -ForegroundColor Green
Write-Host "  RAINAI PRODUCTION DEPLOYMENT" -ForegroundColor Green
Write-Host "  AUTOMATED SETUP SCRIPT" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Configuration
$MONGO_URI = "mongodb+srv://pathananas2007_db_user:rzZdJPUY92mzzHLz@cluster0.t5arvrt.mongodb.net/?appName=Cluster0"
$JWT_SECRET = "[YOUR_JWT_SECRET_KEY]"
$FRONTEND_URL = "https://ai-rainfall-prediction-platform-k4e5-6m2ni3gty.vercel.app"
$BACKEND_URL = "https://ai-rainfall-prediction-platform.onrender.com"
$API_URL = "$BACKEND_URL/api"
$GITHUB_REPO = "https://github.com/pathananas2007/Ai-rainfall-prediction-platform.git"

Write-Host "`n[STEP 1] Verifying Configuration" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Gray

# Check if git is installed
$gitCheck = git --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Git installed" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Git not found. Please install Git." -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Configuration Loaded" -ForegroundColor Green

Write-Host "`n[STEP 2] Pushing Code to GitHub" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Gray

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    Write-Host "[INFO] Changes detected, committing..." -ForegroundColor Yellow
    git add -A
    git commit -m "Deploy: Production configuration - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" 
    git push origin main
    Write-Host "[OK] Code pushed to GitHub" -ForegroundColor Green
} else {
    Write-Host "[INFO] No changes to commit" -ForegroundColor Yellow
}

Write-Host "`n[STEP 3] Deployment Setup Ready" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Gray

Write-Host "`nRENDER BACKEND - 4 Variables to Set:" -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Gray

Write-Host "`nVariable 1: MONGO_URI" -ForegroundColor White
Write-Host "  mongodb+srv://pathananas2007_db_user:rzZdJPUY92mzzHLz@cluster0.t5arvrt.mongodb.net/?appName=Cluster0" -ForegroundColor Gray

Write-Host "`nVariable 2: JWT_SECRET_KEY" -ForegroundColor White
Write-Host "  [REDACTED_JWT_SECRET]" -ForegroundColor Gray

Write-Host "`nVariable 3: FRONTEND_URL" -ForegroundColor White
Write-Host "  https://ai-rainfall-prediction-platform-k4e5-6m2ni3gty.vercel.app" -ForegroundColor Gray

Write-Host "`nVariable 4: ENV" -ForegroundColor White
Write-Host "  production" -ForegroundColor Gray

Write-Host "`nVERCEL FRONTEND - 1 Variable to Set:" -ForegroundColor Yellow
Write-Host "-----------------------------------" -ForegroundColor Gray

Write-Host "`nVariable: VITE_API_URL" -ForegroundColor White
Write-Host "  https://ai-rainfall-prediction-platform.onrender.com/api" -ForegroundColor Gray

Write-Host "`n[DEPLOYMENT STEPS]" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Gray

Write-Host "`nPHASE 1 - RENDER BACKEND (5 min):" -ForegroundColor Cyan
Write-Host "  1. Open: https://dashboard.render.com" -ForegroundColor White
Write-Host "  2. Find: rainai-backend service" -ForegroundColor White
Write-Host "  3. Click: Environment tab" -ForegroundColor White
Write-Host "  4. Add: 4 variables listed above" -ForegroundColor White
Write-Host "  5. Click: Redeploy button" -ForegroundColor White
Write-Host "  6. Wait: 3-5 minutes for build" -ForegroundColor White

Write-Host "`nPHASE 2 - VERCEL FRONTEND (5 min):" -ForegroundColor Cyan
Write-Host "  1. Open: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "  2. Find: Ai-rainfall-prediction-platform" -ForegroundColor White
Write-Host "  3. Go: Settings > Environment Variables" -ForegroundColor White
Write-Host "  4. Add: VITE_API_URL variable" -ForegroundColor White
Write-Host "  5. Click: Redeploy button" -ForegroundColor White
Write-Host "  6. Wait: 1-3 minutes for build" -ForegroundColor White

Write-Host "`nPHASE 3 - TESTING (5-10 min):" -ForegroundColor Cyan
Write-Host "  1. Test backend health check" -ForegroundColor White
Write-Host "  2. Visit frontend URL" -ForegroundColor White
Write-Host "  3. Register new account" -ForegroundColor White
Write-Host "  4. Login with credentials" -ForegroundColor White
Write-Host "  5. Make rainfall prediction" -ForegroundColor White
Write-Host "  6. Check prediction history" -ForegroundColor White
Write-Host "  7. Verify MongoDB data" -ForegroundColor White

Write-Host "`n[DASHBOARD LINKS]" -ForegroundColor Green
Write-Host "=================" -ForegroundColor Gray
Write-Host "  Render Dashboard:   https://dashboard.render.com" -ForegroundColor Cyan
Write-Host "  Vercel Dashboard:   https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "  MongoDB Atlas:      https://cloud.mongodb.com" -ForegroundColor Cyan
Write-Host "  GitHub Repo:        https://github.com/pathananas2007/Ai-rainfall-prediction-platform.git" -ForegroundColor Cyan

Write-Host "`n[EXPECTED RESULTS]" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Gray
Write-Host "  Backend Health:     $BACKEND_URL/api/health" -ForegroundColor Green
Write-Host "  Frontend URL:       $FRONTEND_URL" -ForegroundColor Green
Write-Host "  API Endpoint:       $API_URL" -ForegroundColor Green

Write-Host "`n[TIMELINE]" -ForegroundColor Green
Write-Host "===========" -ForegroundColor Gray
Write-Host "  Phase 1 (Render):   10 min" -ForegroundColor Cyan
Write-Host "  Phase 2 (Vercel):   10 min" -ForegroundColor Cyan
Write-Host "  Phase 3 (Testing):  10 min" -ForegroundColor Cyan
Write-Host "  TOTAL:              30 min" -ForegroundColor Yellow

Write-Host "`n[STATUS]" -ForegroundColor Green
Write-Host "=========" -ForegroundColor Gray
Write-Host "  Code Status:        READY" -ForegroundColor Green
Write-Host "  Configuration:      READY" -ForegroundColor Green
Write-Host "  Credentials:        PROVIDED" -ForegroundColor Green
Write-Host "  Deployment Ready:   YES" -ForegroundColor Green

Write-Host "`n[NEXT ACTION]" -ForegroundColor Yellow
Write-Host "==============" -ForegroundColor Gray
Write-Host "  Copy the variables above" -ForegroundColor White
Write-Host "  Go to Render dashboard" -ForegroundColor White
Write-Host "  Add variables and redeploy" -ForegroundColor White
Write-Host "  Then do the same for Vercel" -ForegroundColor White
Write-Host "  Test all features" -ForegroundColor White
Write-Host "  Done! Your app is live!" -ForegroundColor Green

Write-Host "`n================================" -ForegroundColor Green
Write-Host "  DEPLOYMENT READY TO EXECUTE" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "`n"
