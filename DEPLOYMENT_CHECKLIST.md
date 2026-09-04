# RainAI Deployment Checklist

## ✅ Pre-Deployment Verification

### 1. Code Review
- [x] Backend app.py uses environment variables (FRONTEND_URL, MONGO_URI, JWT_SECRET_KEY)
- [x] Backend app.py binds to 0.0.0.0 (production-ready)
- [x] Backend app.py reads PORT from environment variable
- [x] Frontend API service uses VITE_API_URL environment variable
- [x] No hardcoded localhost URLs in production code
- [x] No hardcoded secrets in code
- [x] ML model paths use __file__-based absolute paths (production-safe)
- [x] MongoDB connection uses environment variable with error handling
- [x] CORS configured with FRONTEND_URL environment variable
- [x] JWT Secret uses environment variable with fallback for development
- [x] Health check endpoint exists (/api/health)

### 2. Configuration Files Created
- [x] backend/.env.example - Environment template with all required variables
- [x] frontend/.env.example - Frontend environment template
- [x] frontend/.env.development - Development environment configuration
- [x] render.yaml - Render deployment configuration
- [x] frontend/vercel.json - Vercel SPA routing configuration
- [x] DEPLOYMENT_GUIDE.md - Detailed deployment instructions
- [x] Updated README.md - With production deployment section

### 3. Dependencies
- [x] backend/requirements.txt includes gunicorn
- [x] All Python packages are specified with exact versions (production-safe)
- [x] frontend/package.json has all necessary dependencies
- [x] No unnecessary dependencies added

### 4. Security Review
- [x] .gitignore excludes .env files
- [x] .gitignore INCLUDES ML model files (*.pkl)
- [x] No secrets in .env.example files
- [x] CORS properly restricted (not using wildcard "*" for auth endpoints)
- [x] JWT secret requires strong random string
- [x] MongoDB connection string requires secure password
- [x] Error messages don't leak sensitive information

### 5. Database
- [x] MongoDB connection handles timeouts gracefully
- [x] Database initialization doesn't crash on connection failure
- [x] Collections are created automatically on first write
- [x] Indexes are created for performance

### 6. Frontend Build
- [x] Vite config optimized for production (minification, tree-shaking)
- [x] Vite config outputs to 'dist' directory
- [x] TypeScript compiles without errors
- [x] No console.logs left in production code
- [x] Source maps excluded from production build

### 7. API Routes
- [x] All routes use proper HTTP methods
- [x] All protected routes verify JWT
- [x] All error responses are JSON format
- [x] All endpoints handle CORS properly
- [x] Request validation on all endpoints
- [x] Database errors handled gracefully

### 8. ML Model
- [x] rainfall_model.pkl exists and is included in repo
- [x] scaler.pkl exists and is included in repo
- [x] feature_columns.pkl exists and is included in repo
- [x] Model loading code uses __file__-based paths
- [x] Model loading has proper error handling
- [x] Model paths work regardless of current working directory

### 9. Authentication
- [x] JWT generation works correctly
- [x] JWT validation on protected routes
- [x] Expired tokens return 401
- [x] Invalid tokens return 401
- [x] Password hashing uses bcrypt
- [x] User registration works
- [x] User login works
- [x] Token stored in localStorage on frontend
- [x] Token sent in Authorization header on API calls
- [x] Frontend redirects to /login on 401 response

---

## 🚀 Deployment Sequence

### Phase 1: Pre-Deployment (Do Before Deployment)

```
[ ] 1. Create GitHub account and fork/push repository
[ ] 2. Verify all files are committed (git status shows clean)
[ ] 3. Test locally:
        npm install (frontend)
        pip install -r requirements.txt (backend)
        npm run build (should succeed)
[ ] 4. Create MongoDB Atlas account
[ ] 5. Create MongoDB cluster
[ ] 6. Create MongoDB user
[ ] 7. Get MongoDB connection string
[ ] 8. Generate strong JWT_SECRET_KEY:
        python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Phase 2: MongoDB Atlas Setup

```
[ ] 1. Go to https://www.mongodb.com/cloud/atlas
[ ] 2. Create new cluster (free tier is fine)
[ ] 3. Create database user:
        Username: rainai_user
        Password: [Strong password]
        Permissions: Read and write to any database
[ ] 4. Get connection string from "Connect" → "Connect your application"
[ ] 5. Format: mongodb+srv://rainai_user:PASSWORD@cluster.mongodb.net/rainai?retryWrites=true&w=majority
[ ] 6. Add Render IP to network access (or allow 0.0.0.0/0 for now)
[ ] 7. Note MongoDB connection string for Render setup
```

### Phase 3: Deploy Backend to Render

```
[ ] 1. Create Render account at https://render.com
[ ] 2. Connect GitHub account to Render
[ ] 3. Click "New+" → "Web Service"
[ ] 4. Select repository: Ai-rainfall-prediction-platform
[ ] 5. Configure:
        Name: rainai-backend
        Root Directory: backend
        Runtime: Python 3.11
        Build Command: pip install -r requirements.txt
        Start Command: gunicorn app:app
        Instance Type: Free
[ ] 6. Add Environment Variables:
        MONGO_URI = [MongoDB connection string]
        JWT_SECRET_KEY = [Generated secret key]
        FRONTEND_URL = [Will set after Vercel deployment]
        GEMINI_API_KEY = [Optional]
        OPENWEATHER_API_KEY = [Optional]
        ENV = production
[ ] 7. Click "Create Web Service"
[ ] 8. Wait for deployment to complete (2-3 minutes)
[ ] 9. Test: Visit https://rainai-backend-xxxxx.onrender.com/api/health
        Should return: {"status":"ok"}
[ ] 10. Note the Render URL: https://rainai-backend-xxxxx.onrender.com
```

### Phase 4: Deploy Frontend to Vercel

```
[ ] 1. Create Vercel account at https://vercel.com
[ ] 2. Import GitHub repository
[ ] 3. Click "Add New" → "Project"
[ ] 4. Select repository: Ai-rainfall-prediction-platform
[ ] 5. Configure:
        Framework: Vite
        Root Directory: frontend
        Build Command: npm run build
        Output Directory: dist
        Install Command: npm install
[ ] 6. Add Environment Variable:
        VITE_API_URL = https://rainai-backend-xxxxx.onrender.com/api
        (Use the Render URL from Phase 3)
[ ] 7. Click "Deploy"
[ ] 8. Wait for deployment to complete (1-2 minutes)
[ ] 9. Note the Vercel URL: https://rainai-xxxxx.vercel.app
[ ] 10. Test: Visit https://rainai-xxxxx.vercel.app
        Should load the frontend without errors
```

### Phase 5: Update Render CORS Configuration

```
[ ] 1. Go to Render dashboard
[ ] 2. Select rainai-backend service
[ ] 3. Go to "Environment"
[ ] 4. Update FRONTEND_URL:
        FRONTEND_URL = https://rainai-xxxxx.vercel.app
[ ] 5. Click "Save Changes"
[ ] 6. Render will automatically redeploy (1-2 minutes)
[ ] 7. Verify backend is back online
```

### Phase 6: Production Verification

```
[ ] 1. Test Backend Health
        curl https://rainai-backend-xxxxx.onrender.com/api/health
        Expected: {"status":"ok"}

[ ] 2. Test Frontend Loading
        Open https://rainai-xxxxx.vercel.app
        Page should load without errors

[ ] 3. Test User Registration
        Go to /register page
        Create test account: test@example.com / password123
        Should show "Account created!" message

[ ] 4. Test User Login
        Go to /login page
        Login with: test@example.com / password123
        Should redirect to /dashboard

[ ] 5. Test JWT Storage
        Open browser DevTools → Application → LocalStorage
        Should see 'token' key with JWT value

[ ] 6. Test API Call
        Make any API request (e.g., /auth/profile)
        Should include Authorization header with JWT token

[ ] 7. Test Rainfall Prediction
        Go to /predict page
        Fill weather form
        Submit prediction
        Should show prediction result with confidence score

[ ] 8. Test Analytics
        Go to /analytics page
        Should load charts and statistics

[ ] 9. Test Prediction History
        Go to /history page
        Should show list of past predictions

[ ] 10. Test Settings
         Go to /settings page
         Change a setting (e.g., theme)
         Verify it saves to MongoDB

[ ] 11. Test CORS
        Run in browser console:
        fetch('https://rainai-backend-xxxxx.onrender.com/api/health')
          .then(r => r.json())
          .then(d => console.log(d))
        Should work without CORS error

[ ] 12. Test Database
        Make a prediction - should save to MongoDB Atlas
        Check MongoDB Atlas dashboard to verify data

[ ] 13. Test ML Model
        Make predictions with different inputs
        Model should load and return predictions

[ ] 14. Test Error Handling
        Try invalid login credentials
        Try accessing without JWT token
        Try malformed API requests
        Should get proper error responses
```

---

## 📊 Post-Deployment Monitoring

### Daily Checks
```
[ ] Check Render logs for errors
[ ] Check Vercel build logs
[ ] Verify health endpoint still responds
[ ] Spot check 2-3 API endpoints
```

### Weekly Checks
```
[ ] Review MongoDB Atlas dashboard
    - Storage usage
    - Query performance
    - Connection statistics
[ ] Review Vercel analytics
    - Build times
    - Page performance
    - Error rates
[ ] Review Render monitoring
    - CPU usage
    - Memory usage
    - Request latency
```

### Monthly Checks
```
[ ] Rotate secrets if exposed
[ ] Review access logs
[ ] Check for deprecated dependencies
[ ] Verify backups are working
[ ] Test disaster recovery
```

---

## 🔄 Redeployment Procedures

### Update Backend Code
```bash
# 1. Make changes locally
# 2. Test locally
# 3. Commit and push to GitHub
git add .
git commit -m "Update backend"
git push origin main

# 4. Render will automatically redeploy
# 5. Monitor deployment in Render dashboard
```

### Update Frontend Code
```bash
# 1. Make changes locally
# 2. Test locally (npm run dev)
# 3. Test build (npm run build)
# 4. Commit and push to GitHub
git add .
git commit -m "Update frontend"
git push origin main

# 5. Vercel will automatically redeploy
# 6. Monitor deployment in Vercel dashboard
```

### Rollback if Needed
```
Render Rollback:
1. Go to Render dashboard
2. Select rainai-backend
3. Go to "Deployments" tab
4. Find previous working deployment
5. Click three dots menu
6. Select "Redeploy"

Vercel Rollback:
1. Go to Vercel dashboard
2. Select rainai project
3. Go to "Deployments" tab
4. Find previous working deployment
5. Click "Promote to Production"
```

---

## ⚠️ Troubleshooting

### Frontend can't reach backend
```
1. Check VITE_API_URL is set correctly in Vercel
2. Check Render backend is running
3. Visit https://rainai-backend-xxxxx.onrender.com/api/health
4. Check browser DevTools → Network tab for requests
5. Check CORS error details in browser console
```

### Backend won't start
```
1. Check Render logs
2. Verify MONGO_URI is correct
3. Verify all environment variables are set
4. Check MongoDB Atlas IP whitelist
5. Verify Python version is 3.11.9
```

### JWT token not working
```
1. Verify JWT_SECRET_KEY matches between frontend and backend
2. Check token format in requests: "Bearer TOKEN"
3. Check token expiration (24 hours default)
4. Clear localStorage and login again
5. Check Authorization header is present
```

### MongoDB connection timeout
```
1. Verify MONGO_URI connection string
2. Check IP whitelist in MongoDB Atlas
3. Verify username and password
4. Test connection: mongosh "mongodb+srv://..."
5. Check network connectivity from Render
```

### API responses are slow
```
1. Check Render CPU/memory usage
2. Check MongoDB query performance in Atlas
3. Enable caching if available
4. Optimize database indexes
5. Check for N+1 queries
```

---

## ✨ Final Checklist

Before declaring deployment complete:

```
[ ] Backend is running on Render
[ ] Frontend is accessible on Vercel
[ ] MongoDB Atlas has data
[ ] User registration works end-to-end
[ ] User login works end-to-end
[ ] JWT tokens are being stored and sent
[ ] Rainfall predictions work
[ ] Analytics dashboard loads data
[ ] Prediction history is persisted
[ ] Settings are saved to MongoDB
[ ] CORS is working properly
[ ] All environment variables are set
[ ] No hardcoded localhost URLs in production
[ ] ML model loads and makes predictions
[ ] Error messages are user-friendly
[ ] Health check endpoint responds
[ ] Database connection is resilient
[ ] No sensitive data in logs or responses
[ ] SSL/TLS is working (HTTPS)
[ ] Application is production-ready
```

---

## 🎉 Deployment Complete!

If all checks pass, your RainAI application is successfully deployed!

**Frontend**: https://rainai-xxxxx.vercel.app  
**Backend API**: https://rainai-backend-xxxxx.onrender.com/api  
**Database**: MongoDB Atlas  

**Total Deployment Time**: Approximately 15-20 minutes

---

## 📞 Need Help?

1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions
2. Review the troubleshooting section above
3. Check service-specific documentation:
   - [Render Docs](https://render.com/docs)
   - [Vercel Docs](https://vercel.com/docs)
   - [MongoDB Docs](https://docs.mongodb.com)
4. Review application logs for error details
5. Test endpoints manually with curl or Postman

---

**Last Updated**: September 2026  
**Version**: 1.0  
**Status**: Production Ready ✅
