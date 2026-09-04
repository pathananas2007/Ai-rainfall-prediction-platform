# � PRE-DEPLOYMENT VERIFICATION CHECKLIST

**Before you start the deployment, verify all these items are correct.**

---

## 1. GITHUB REPOSITORY

- [ ] Repository exists: https://github.com/pathananas2007/Ai-rainfall-prediction-platform.git
- [ ] All code is committed
- [ ] Code is pushed to `main` branch
- [ ] `.env` files are NOT committed (check .gitignore)
- [ ] `backend/ml/*.pkl` files ARE committed (negation pattern in .gitignore)

**Verify**:
```bash
# Check if ML models will be committed
git ls-files backend/ml/

# Should show:
# backend/ml/rainfall_model.pkl
# backend/ml/scaler.pkl
# backend/ml/feature_columns.pkl
```

---

## 2. MONGODB ATLAS

- [ ] MongoDB Atlas account exists
- [ ] Cluster is created and running
- [ ] Database user "rainai_user" exists
- [ ] Connection string is correct format: `mongodb+srv://username:password@cluster.mongodb.net/...`

**Your Connection String** ✅
```
mongodb+srv://pathananas2007_db_user:rzZdJPUY92mzzHLz@cluster0.t5arvrt.mongodb.net/?appName=Cluster0
```

**Verify Connection**:
```bash
# Test locally (if mongosh installed)
mongosh "mongodb+srv://pathananas2007_db_user:rzZdJPUY92mzzHLz@cluster0.t5arvrt.mongodb.net/?appName=Cluster0"

# Run: db.runCommand("ping")
# Should return: { ok: 1 }
```

### MongoDB Atlas Network Access
- [ ] IP whitelist includes Render region IPs
- [ ] Or 0.0.0.0/0 is allowed (less secure but works)

**How to check**:
1. Go to MongoDB Atlas Dashboard
2. Click "Network Access" in left menu
3. Look for IP whitelist entries
4. Should include Render's IP range or 0.0.0.0/0

---

## 3. RENDER BACKEND

- [ ] Render account exists
- [ ] Service "rainai-backend" exists
- [ ] Service is connected to GitHub repository
- [ ] Root Directory is set to "backend"
- [ ] Build Command: `pip install -r requirements.txt`
- [ ] Start Command: `gunicorn app:app`

**Verify**:
1. Go to https://dashboard.render.com
2. Click on rainai-backend service
3. Check "Settings" tab for above values

### Required Environment Variables (Will add in Phase 1)
- [ ] MONGO_URI (will set in Phase 1)
- [ ] JWT_SECRET_KEY (will set in Phase 1)
- [ ] FRONTEND_URL (will set in Phase 1)
- [ ] ENV=production (will set in Phase 1)

---

## 4. VERCEL FRONTEND

- [ ] Vercel account exists
- [ ] Project exists: "Ai-rainfall-prediction-platform"
- [ ] Project is connected to GitHub repository
- [ ] Root Directory is set to "frontend"
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

**Verify**:
1. Go to https://vercel.com/dashboard
2. Click on Ai-rainfall-prediction-platform project
3. Check "Settings" tab for above values

### Required Environment Variables (Will add in Phase 2)
- [ ] VITE_API_URL (will set in Phase 2)

---

## 5. BACKEND CODE

### File: `backend/app.py`
- [ ] CORS configured with FRONTEND_URL from environment
- [ ] /api/health endpoint exists
- [ ] Binds to 0.0.0.0
- [ ] PORT from environment variable
- [ ] JWT configuration exists

**Check**:
```bash
grep -n "FRONTEND_URL" backend/app.py
# Should show: CORS with FRONTEND_URL variable
```

### File: `backend/database/db.py`
- [ ] MongoDB connection with error handling
- [ ] Timeout configuration
- [ ] Graceful degradation on failure

### File: `backend/requirements.txt`
- [ ] All dependencies listed
- [ ] Includes: flask, pymongo, gunicorn, etc.

**Check**:
```bash
grep gunicorn backend/requirements.txt
# Should find: gunicorn
```

---

## 6. FRONTEND CODE

### File: `frontend/vite.config.js`
- [ ] Production build optimization
- [ ] Output directory: dist
- [ ] No source maps
- [ ] Console stripping

### File: `frontend/.env.example`
- [ ] Includes: VITE_API_URL example

### File: `frontend/vercel.json`
- [ ] SPA rewrites configured
- [ ] Routes any /* to /index.html

**Check**:
```bash
cat frontend/vercel.json
# Should include rewrites array
```

### File: `frontend/package.json`
- [ ] Build script: `npm run build`
- [ ] All dependencies present
- [ ] React, Vite, etc. included

---

## 7. GIT CONFIGURATION

### File: `.gitignore`
- [ ] .env files are excluded: `.env`, `backend/.env`, `frontend/.env`
- [ ] ML model files are INCLUDED: `!backend/ml/*.pkl`
- [ ] node_modules is excluded

**Check**:
```bash
cat .gitignore | grep -A 2 -B 2 "\.env\|\.pkl"
# Should show:
# *.env (excluded)
# !backend/ml/*.pkl (INCLUDED)
```

---

## 8. ENVIRONMENT VARIABLES PREPARED

### MongoDB URI ✅
```
mongodb+srv://pathananas2007_db_user:rzZdJPUY92mzzHLz@cluster0.t5arvrt.mongodb.net/?appName=Cluster0
```

### JWT Secret Key ✅
```
REDACTED_JWT_SECRET_KEY
```

### Frontend URL ✅
```
https://ai-rainfall-prediction-platform-k4e5-6m2ni3gty.vercel.app
```

### Backend URL (from Render) ✅
```
https://ai-rainfall-prediction-platform.onrender.com
```

---

## 9. CREDENTIALS CHECK

### Render Access
- [ ] You have login credentials for Render
- [ ] You can access your rainai-backend service
- [ ] You can view/edit environment variables

### Vercel Access
- [ ] You have login credentials for Vercel
- [ ] You can access your Ai-rainfall-prediction-platform project
- [ ] You can view/edit environment variables

### MongoDB Atlas Access
- [ ] You have login credentials for MongoDB Atlas
- [ ] You can access your cluster
- [ ] You can view connection string

### GitHub Access
- [ ] You have access to https://github.com/pathananas2007/Ai-rainfall-prediction-platform.git
- [ ] Both Render and Vercel have permission to deploy from this repo

---

## 10. DOCUMENTATION

- [ ] DEPLOYMENT_EXECUTION_PLAN.md exists (master guide)
- [ ] RENDER_DEPLOYMENT_SETUP.md exists (Render instructions)
- [ ] VERCEL_DEPLOYMENT_SETUP.md exists (Vercel instructions)
- [ ] DEPLOYMENT_TESTING_GUIDE.md exists (testing procedures)
- [ ] DEPLOYMENT_STATUS_FIX_REPORT.md exists (diagnostics)

---

## 11. FINAL CHECKS

### Code Quality
- [ ] No hardcoded localhost references in production code
- [ ] No hardcoded API keys or secrets (except JWT fallback which is safe)
- [ ] All environment variable placeholders defined

### Build Verification
- [ ] Backend Python environment can be replicated (requirements.txt complete)
- [ ] Frontend Node.js environment can be replicated (package.json complete)
- [ ] No missing dependencies

### Security
- [ ] .env files excluded from git
- [ ] No plaintext secrets in code
- [ ] JWT uses environment variable
- [ ] CORS configured properly

---

## 12. READY TO DEPLOY CHECKLIST

If all boxes above are checked:

- [ ] ALL verifications passed
- [ ] Ready to start Phase 1 (Render setup)
- [ ] Have Render login ready
- [ ] Have Vercel login ready
- [ ] Have MongoDB connection string ready
- [ ] Have time to complete deployment (~30 minutes)

---

## ISSUE RESOLUTION

If any check fails:

| Issue | Solution |
|-------|----------|
| GitHub repo not found | Verify URL: https://github.com/pathananas2007/Ai-rainfall-prediction-platform.git |
| MongoDB connection fails | Test connection string locally, check Atlas cluster status |
| Render service missing | Create web service on Render, connect to GitHub |
| Vercel project missing | Create project on Vercel, import from GitHub |
| Environment files in git | Update .gitignore, remove .env from git history |
| ML models not in git | Add negation pattern: `!backend/ml/*.pkl` to .gitignore |
| Missing dependencies | Check requirements.txt and package.json, add missing items |

---

## BACKUP PLAN

If anything fails during deployment:

1. **Don't panic** - All changes are reversible
2. **Check the logs** - Render and Vercel show detailed build logs
3. **Review the testing guide** - DEPLOYMENT_TESTING_GUIDE.md has troubleshooting
4. **Redeploy** - Most issues fix with a redeploy after fixing the root cause
5. **Check MongoDB** - If database isn't responding, nothing works

---

## PROCEED WHEN READY

Once you've verified all items above, start with:

→ **PHASE 1**: `RENDER_DEPLOYMENT_SETUP.md`

---

**Last Updated**: September 4, 2026  
**Status**: Ready for Verification

