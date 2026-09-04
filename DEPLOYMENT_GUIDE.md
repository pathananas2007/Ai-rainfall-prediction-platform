# RainAI Production Deployment Guide
## Vercel (Frontend) + Render (Backend) + MongoDB Atlas (Database)

---

## 📋 Pre-Deployment Checklist

### 1. MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- [ ] Create a cluster
- [ ] Create a database user with username and password
- [ ] Get the connection string (mongodb+srv://...)
- [ ] Add your Render IP to network access (or allow all: 0.0.0.0/0)

### 2. GitHub Repository
- [ ] Fork/clone the repository
- [ ] Verify .gitignore excludes .env files
- [ ] Verify .gitignore INCLUDES ML model files (*.pkl)
- [ ] Commit all code to GitHub

### 3. Render Account
- [ ] Create Render account at https://render.com
- [ ] Connect GitHub repository

### 4. Vercel Account
- [ ] Create Vercel account at https://vercel.com
- [ ] Connect GitHub repository

---

## 🚀 Deployment Order

### Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier is fine)
3. Create a database user:
   - Database Access → Add New Database User
   - Username: rainai_user
   - Password: [Generate Strong Password]
   - Permissions: Read and write to any database
4. Get connection string:
   - Clusters → Connect → Connect your application
   - Copy MongoDB Driver connection string
   - Example: `mongodb+srv://rainai_user:PASSWORD@cluster0.xxxxx.mongodb.net/rainai?retryWrites=true&w=majority`

**Save this connection string for Render setup**

---

### Step 2: Deploy Backend to Render

1. Go to https://render.com and sign up
2. Click "New+" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: rainai-backend
   - **Root Directory**: backend
   - **Runtime**: Python 3.11
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: Free (sufficient for development)

5. Add Environment Variables:
   ```
   MONGO_URI = mongodb+srv://rainai_user:PASSWORD@cluster0.xxxxx.mongodb.net/rainai?retryWrites=true&w=majority
   JWT_SECRET_KEY = [Generate a strong random string - at least 32 characters]
   FRONTEND_URL = [Will get from Vercel - set after frontend deployment]
   GEMINI_API_KEY = [Optional - your Google Gemini API key]
   OPENWEATHER_API_KEY = [Optional - your OpenWeather API key]
   ENV = production
   ```

6. Click "Create Web Service"
7. Wait for deployment to complete
8. Note the URL: `https://rainai-backend-xxxxx.onrender.com`

**This URL will be needed for frontend VITE_API_URL**

---

### Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
   - **Install Command**: `npm install`

5. Add Environment Variables:
   ```
   VITE_API_URL = https://rainai-backend-xxxxx.onrender.com/api
   ```
   (Use the Render URL from Step 2)

6. Click "Deploy"
7. Wait for deployment to complete
8. Note the URL: `https://rainai-xxxxx.vercel.app`

---

### Step 4: Update Render with Frontend URL

1. Go back to Render dashboard
2. Click on your rainai-backend service
3. Go to "Environment"
4. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL = https://rainai-xxxxx.vercel.app
   ```

5. Click "Save Changes"
6. Render will automatically redeploy with new CORS configuration

---

### Step 5: Final Verification

#### Test Backend Health
```bash
curl https://rainai-backend-xxxxx.onrender.com/api/health
# Expected: {"status":"ok"}
```

#### Test Frontend
1. Open https://rainai-xxxxx.vercel.app in browser
2. Test registration (create new account)
3. Test login
4. Test rainfall prediction
5. Test analytics
6. Verify JWT tokens work

#### Verify CORS Works
```bash
# Should NOT be blocked
curl -H "Origin: https://rainai-xxxxx.vercel.app" \
     https://rainai-backend-xxxxx.onrender.com/api/auth/profile \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📝 Environment Variables Reference

### Backend (.env or Render Environment)

| Variable | Example | Required | Notes |
|----------|---------|----------|-------|
| MONGO_URI | mongodb+srv://... | YES | MongoDB Atlas connection string |
| JWT_SECRET_KEY | strong-random-string | YES | Min 32 characters for production |
| FRONTEND_URL | https://your-domain.vercel.app | YES | For CORS configuration |
| GEMINI_API_KEY | your-key | NO | For AI explanations (uses fallback if missing) |
| OPENWEATHER_API_KEY | your-key | NO | For weather data |
| ENV | production | YES | Set to "production" on Render |
| PORT | 5000 | NO | Render sets automatically |

### Frontend (Vercel Environment)

| Variable | Example | Required | Notes |
|----------|---------|----------|-------|
| VITE_API_URL | https://your-backend.onrender.com/api | YES | Must match backend URL |

---

## 🔒 Security Notes

1. **Never commit .env files** - Always use environment variables
2. **Strong JWT Secret** - Generate with: `python -c "import secrets; print(secrets.token_urlsafe(32))"`
3. **MongoDB IP Whitelist** - On production, restrict IPs instead of 0.0.0.0/0
4. **SSL/TLS** - Both Vercel and Render provide HTTPS automatically
5. **Rotate Secrets** - If a secret is exposed, rotate it immediately

---

## 🐛 Troubleshooting

### Frontend shows "API unreachable"
- Check VITE_API_URL is correct in Vercel environment
- Check Render backend is running: Visit `/api/health` endpoint
- Check CORS: Verify FRONTEND_URL is set in Render

### Backend won't start on Render
- Check logs: Render dashboard → Logs tab
- Verify MONGO_URI is correct
- Verify all Python dependencies in requirements.txt
- Check for typos in environment variables

### JWT token not working
- Verify JWT_SECRET_KEY is same on both sides
- Check token expiration (24 hours default)
- Check token format in requests: `Authorization: Bearer TOKEN`

### CORS errors
- Verify FRONTEND_URL matches Vercel deployment URL exactly
- Check browser console for exact error message
- Restart Render service after changing FRONTEND_URL

### MongoDB connection timeout
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Test connection: `mongosh "mongodb+srv://..."`
- Check network access on Atlas dashboard

---

## 📞 Local Testing Before Deployment

### Test Backend Locally
```bash
cd backend
python -m pip install -r requirements.txt
python app.py
# Visit http://localhost:5000/api/health
```

### Test Frontend Locally
```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:3000
# Ensure .env.development has VITE_API_URL=http://localhost:5000/api
```

### Test Production Build
```bash
cd frontend
npm run build
npm run preview
# Should serve from dist/ at http://localhost:5000 or configured port
```

---

## 📊 Monitoring & Maintenance

### Render Monitoring
- Check application logs regularly
- Monitor error rates and response times
- Set up log alerts for errors

### MongoDB Monitoring
- Use Atlas dashboard to monitor query performance
- Watch storage usage
- Set up backup schedules

### Vercel Analytics
- Check deployment history
- Monitor build times
- Check web vitals

---

## 🔄 Redeployment

### Update Backend
```bash
git push origin main
# Render automatically redeploys on push to main branch
```

### Update Frontend
```bash
git push origin main
# Vercel automatically redeploys on push to main branch
```

### Rollback
- Render: Dashboard → Deployments → Click previous deployment
- Vercel: Deployments → Click previous deployment → Promote to Production

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Flask Production Deployment](https://flask.palletsprojects.com/deployment)
- [React Production Build](https://react.dev/learn/deployment)

---

## ✅ Post-Deployment Verification Checklist

- [ ] Backend health endpoint responds
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login returns valid JWT
- [ ] Protected endpoints require JWT
- [ ] Rainfall predictions work end-to-end
- [ ] Analytics dashboard loads data
- [ ] Search functionality works
- [ ] Settings persist to MongoDB
- [ ] CORS works from frontend domain
- [ ] No localhost URLs in production builds
- [ ] ML model loads correctly
- [ ] Error messages are user-friendly
- [ ] Database connection is resilient
- [ ] All environment variables are set

---

## 🎯 Performance Optimization Tips

1. **Enable Redis Caching** (Render Pro)
2. **Use CDN for static assets** (Vercel does this automatically)
3. **Compress API responses** (Flask-Compress)
4. **Optimize database indexes** (MongoDB Atlas)
5. **Monitor and optimize slow queries**

---

## 📞 Support

For issues with specific services:
- **Render Issues**: support@render.com
- **Vercel Issues**: https://vercel.com/support
- **MongoDB Issues**: https://support.mongodb.com
- **Application Issues**: Check logs and error messages first
