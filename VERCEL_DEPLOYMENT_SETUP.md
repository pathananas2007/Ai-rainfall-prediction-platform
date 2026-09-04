# 🎨 VERCEL FRONTEND DEPLOYMENT - STEP BY STEP

**Project**: https://ai-rainfall-prediction-platform-k4e5-6m2ni3gty.vercel.app  
**Status**: Need to configure environment variables

---

## STEP 1: Access Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Login with your account
3. Find project named: **Ai-rainfall-prediction-platform** (or similar)
4. Click on the project name to open it

---

## STEP 2: Add Environment Variable

1. Click **"Settings"** in the top menu
2. Click **"Environment Variables"** in left sidebar
3. Click **"Add"** or **"New Environment Variable"**

### Add this variable:

- **Name**: `VITE_API_URL`
- **Value**: 
```
https://ai-rainfall-prediction-platform.onrender.com/api
```
- **Select Environment**: Production
- **Click**: Save

---

## STEP 3: Trigger Redeployment

Method A (Recommended):
1. Go to **"Deployments"** tab
2. Find the most recent deployment
3. Click the **three dots (...)** menu
4. Click **"Redeploy"**
5. Select **"Use existing Build Cache"** (faster)
6. Click **"Redeploy"**

Method B (Push to GitHub):
- Make any small change locally, commit, and push to main branch
- Vercel will automatically redeploy

---

## STEP 4: Wait for Build

- Build should complete in 1-3 minutes
- You'll see status change from "Building" to "Ready"
- Visit the project URL: https://ai-rainfall-prediction-platform-k4e5-6m2ni3gty.vercel.app

---

## STEP 5: Verify Frontend Loads

Visit: https://ai-rainfall-prediction-platform-k4e5-6m2ni3gty.vercel.app

You should see:
- ✅ React app loads
- ✅ Login screen appears
- ✅ No errors in browser console

Check browser console (F12 → Console tab):
- Should NOT see "Cannot connect to API" errors
- Should NOT see "ERR_HTTP_RESPONSE_CODE_FAILURE" errors

---

## TROUBLESHOOTING

### If page shows blank/error:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for error messages
4. Common fix: Redeploy again

### If page says "Cannot reach API":
- Check VITE_API_URL is set correctly
- Check Render backend is running (/api/health)
- Wait 2-3 minutes for Vercel cache to update

### If you see CORS error in console:
- This happens when backend isn't running
- Fix Render backend first
- Then refresh Vercel frontend

### If build fails:
- Check Vercel build log
- Verify `frontend/package.json` has all dependencies
- Try redeploy

---

## WHAT'S HAPPENING

When you set the environment variable and redeploy:

1. Vercel uses VITE_API_URL environment variable
2. Frontend code imports this during build
3. All API calls point to Render backend
4. Frontend builds with Vite (optimized production build)
5. Deployed to Vercel CDN globally

---

## KEY POINTS

- **VITE_API_URL** must match your Render backend URL
- Build should complete in <3 minutes
- Page should load instantly after that
- Check console (F12) for any errors

