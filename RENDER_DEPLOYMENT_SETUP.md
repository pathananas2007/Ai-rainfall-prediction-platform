# 🚀 RENDER BACKEND DEPLOYMENT - STEP BY STEP

**Service**: https://ai-rainfall-prediction-platform.onrender.com  
**Status**: Need to configure environment variables

---

## STEP 1: Access Render Dashboard

1. Go to: https://dashboard.render.com
2. Login with your account
3. Find service named: **rainai-backend** (or similar)
4. Click on the service name to open it

---

## STEP 2: Add/Update Environment Variables

Click on **"Environment"** tab in the service settings.

### Add these environment variables ONE BY ONE:

#### Variable 1: MONGO_URI
- **Key**: `MONGO_URI`
- **Value**: 
```
mongodb+srv://pathananas2007_db_user:rzZdJPUY92mzzHLz@cluster0.t5arvrt.mongodb.net/?appName=Cluster0
```
- **Click**: Save

#### Variable 2: JWT_SECRET_KEY
- **Key**: `JWT_SECRET_KEY`
- **Value**: 
```
[REDACTED_JWT_SECRET]
```
- **Click**: Save

#### Variable 3: FRONTEND_URL
- **Key**: `FRONTEND_URL`
- **Value**: 
```
https://ai-rainfall-prediction-platform-k4e5-6m2ni3gty.vercel.app
```
- **Click**: Save

#### Variable 4: ENV
- **Key**: `ENV`
- **Value**: 
```
production
```
- **Click**: Save

---

## STEP 3: Trigger Redeployment

After adding all environment variables:

1. Go to **"Deploy"** tab
2. Find the latest deployment
3. Click the **three dots (...)** button
4. Select **"Redeploy"**
5. Wait for deployment to complete (3-5 minutes)

**Check the build log for any errors**

---

## STEP 4: Verify Backend is Running

Once deployment completes, test:

```bash
# In your terminal or browser:
curl https://ai-rainfall-prediction-platform.onrender.com/api/health
```

**Expected Response**:
```json
{"status":"ok"}
```

If you see this, your backend is working! ✅

---

## TROUBLESHOOTING

### If you get "503 Service Unavailable":
- Check environment variables are ALL set
- Check MONGO_URI is correct
- Check build log in Render dashboard for errors
- Try redeploy again

### If you get "Cannot connect to MongoDB":
- Verify MONGO_URI is correct (copied exactly)
- Go to MongoDB Atlas and check IP whitelist
- Check cluster is running

### If you get module import errors:
- This means requirements.txt dependencies aren't installing
- Check Render build log
- Verify backend/requirements.txt exists with all packages

---

## WHAT'S HAPPENING

When you set these environment variables and redeploy:

1. Render pulls latest code from GitHub
2. Installs Python dependencies from `backend/requirements.txt`
3. Starts Flask app with Gunicorn (production server)
4. Binds to Render's assigned port
5. Connects to MongoDB Atlas using MONGO_URI
6. App ready to receive requests

