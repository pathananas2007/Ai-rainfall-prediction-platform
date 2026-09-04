# RainAI - Comprehensive Testing Guide

## Prerequisites

### Required Services
- ✅ MongoDB running (local or cloud)
- ✅ Python 3.8+ installed
- ✅ Node.js 16+ installed
- ✅ Pip and npm available

### Environment Setup
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### Configuration
Create `.env` in backend directory:
```env
MONGO_URI=mongodb://localhost:27017/rainai
JWT_SECRET_KEY=test-secret-key-change-in-production
GEMINI_API_KEY=your_gemini_key_here  # Optional, will use fallback
OPENWEATHER_API_KEY=your_openweather_key  # Optional
```

---

## 🧪 Test Plan

### Phase 1: Backend Startup & API Validation

#### Test 1.1: Backend Startup with API Validation
```bash
cd backend
python app.py
```

**Expected Output:**
```
============================================================
🚀 RainAI Backend Startup
============================================================
✅ Gemini API key validated successfully
============================================================
```

**OR** (if API key not configured):
```
⚠️  WARNING: Gemini API key not configured. AI explanations will use fallback system.
```

**Status:** ✅ PASS if you see one of the above messages

---

#### Test 1.2: Database Connection
```bash
# In another terminal, test database connection
curl http://localhost:5000/
```

**Expected Response:**
```json
{"message": "Rainfall Prediction API is running"}
```

**Status:** ✅ PASS if you get 200 OK with message

---

### Phase 2: User Authentication & Roles

#### Test 2.1: Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{"message": "User registered successfully"}
```

**Verify:** User created with `role: "user"` in MongoDB

**Status:** ✅ PASS if 201 Created

---

#### Test 2.2: Login & Get JWT
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "name": "Test User",
    "email": "testuser@example.com",
    "role": "user"
  }
}
```

**Save token:** Copy the JWT token for next tests

**Status:** ✅ PASS if you get token with role: "user"

---

#### Test 2.3: Admin User Login
```bash
# First, seed admin user
python backend/database/seed.py
```

**Expected Output:**
```
Admin user created with email: admin@example.com and password: password123
```

**Then login as admin:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Verify:** Response includes `role: "admin"`

**Status:** ✅ PASS if role is "admin"

---

### Phase 3: Admin Access Control

#### Test 3.1: Non-Admin Access Denied
```bash
# Use non-admin user's JWT token
curl http://localhost:5000/api/analytics/admin \
  -H "Authorization: Bearer <non-admin-token>"
```

**Expected Response:**
```json
{
  "error": "Unauthorized. Admin access required."
}
```

**Status Code:** 403 Forbidden

**Status:** ✅ PASS if 403 Forbidden

---

#### Test 3.2: Admin Access Granted
```bash
# Use admin user's JWT token
curl http://localhost:5000/api/analytics/admin \
  -H "Authorization: Bearer <admin-token>"
```

**Expected Response:**
```json
{
  "total_users": X,
  "total_predictions": Y,
  "average_confidence": Z,
  ...
}
```

**Status Code:** 200 OK

**Status:** ✅ PASS if 200 OK with stats

---

### Phase 4: Settings Persistence

#### Test 4.1: Get Default Settings
```bash
curl http://localhost:5000/api/settings \
  -H "Authorization: Bearer <token>"
```

**Expected Response:**
```json
{
  "notifications": {
    "email": true,
    "push": true,
    "weatherAlerts": true,
    ...
  },
  "display": {
    "theme": "light",
    "language": "en",
    ...
  },
  ...
}
```

**Status:** ✅ PASS if 200 OK with default settings

---

#### Test 4.2: Update Settings
```bash
curl -X PUT http://localhost:5000/api/settings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "notifications": {"email": false},
    "display": {"theme": "dark", "language": "es"}
  }'
```

**Expected Response:**
```json
{
  "message": "Settings updated successfully",
  "settings": {
    "notifications": {"email": false},
    "display": {"theme": "dark", "language": "es"}
  }
}
```

**Status:** ✅ PASS if 200 OK

---

#### Test 4.3: Verify Settings Persist
```bash
# Restart backend
# python app.py

# Then get settings again
curl http://localhost:5000/api/settings \
  -H "Authorization: Bearer <token>"
```

**Expected Response:** Settings should match what you set (theme: "dark", email: false)

**Status:** ✅ PASS if settings persist after restart

---

#### Test 4.4: Reset Settings
```bash
curl -X POST http://localhost:5000/api/settings/reset \
  -H "Authorization: Bearer <token>"
```

**Expected Response:**
```json
{
  "message": "Settings reset to default",
  "settings": {
    "notifications": {"email": true},
    "display": {"theme": "light"},
    ...
  }
}
```

**Status:** ✅ PASS if defaults returned

---

#### Test 4.5: Export Settings
```bash
curl http://localhost:5000/api/settings/export \
  -H "Authorization: Bearer <token>"
```

**Expected Response:**
```json
{
  "exported_at": "2026-09-04T...",
  "user_id": "...",
  "settings": {...}
}
```

**Status:** ✅ PASS if exports with timestamp

---

### Phase 5: Search Functionality

#### Test 5.1: Make a Prediction First
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "MinTemp": 10,
    "MaxTemp": 25,
    "Rainfall": 0,
    "Evaporation": 5,
    "Sunshine": 8,
    "WindGustSpeed": 30,
    "WindSpeed9am": 10,
    "WindSpeed3pm": 15,
    "Humidity9am": 60,
    "Humidity3pm": 50,
    "Pressure9am": 1010,
    "Pressure3pm": 1008,
    "Cloud9am": 2,
    "Cloud3pm": 3,
    "Temp9am": 15,
    "Temp3pm": 22,
    "RainYesterday": "No"
  }'
```

**Expected Response:**
```json
{
  "prediction_result": "No",
  "confidence": 82.5,
  "explanation": "...",
  ...
}
```

**Status:** ✅ PASS if prediction created

---

#### Test 5.2: Search Predictions
```bash
curl "http://localhost:5000/api/search?q=no" \
  -H "Authorization: Bearer <token>"
```

**Expected Response:**
```json
{
  "results": {
    "Predictions": [
      {
        "id": "...",
        "title": "Prediction: No",
        "description": "Confidence: 82% - 2026-09-04",
        "tags": ["no-rain"],
        "relevance": ...
      }
    ]
  },
  "total": 1,
  "query": "no",
  ...
}
```

**Key Points:**
- Results are from YOUR actual predictions (not mock)
- Contains your prediction data
- Shows confidence score
- Has real timestamp

**Status:** ✅ PASS if returns your actual prediction

---

#### Test 5.3: Search with Category Filter
```bash
curl "http://localhost:5000/api/search?q=rain&category=Predictions" \
  -H "Authorization: Bearer <token>"
```

**Expected:** Results filtered to Predictions category only

**Status:** ✅ PASS if filtered results returned

---

#### Test 5.4: Search with Date Filter
```bash
curl "http://localhost:5000/api/search?q=no&date=today" \
  -H "Authorization: Bearer <token>"
```

**Expected:** Results from today only

**Status:** ✅ PASS if today's predictions returned

---

#### Test 5.5: Verify No Mock Data
```bash
curl "http://localhost:5000/api/search?q=mock" \
  -H "Authorization: Bearer <token>"
```

**Expected Response:**
```json
{
  "results": {},
  "total": 0,
  "query": "mock",
  ...
}
```

**Important:** Should NOT return hardcoded results like "Heavy rain tomorrow" or "May Weather Analytics"

**Status:** ✅ PASS if only real user data returned

---

### Phase 6: Frontend Error Boundary

#### Test 6.1: Frontend Startup
```bash
cd frontend
npm run dev
```

**Expected:** App starts at http://localhost:3000

**Status:** ✅ PASS if no errors on startup

---

#### Test 6.2: Register & Login
1. Navigate to http://localhost:3000/register
2. Fill form and register
3. Navigate to /login and login
4. Should see dashboard

**Status:** ✅ PASS if login successful

---

#### Test 6.3: Test Error Boundary (Development)
1. Open browser dev tools (F12)
2. Go to Console tab
3. Intentionally cause an error in a component

```javascript
// In any React component render method, add:
throw new Error("Test error boundary")
```

**Expected:**
- App doesn't crash
- Red error UI appears with "Something went wrong"
- "Try again" and "Home" buttons visible
- Stack trace shown in dev mode

**Status:** ✅ PASS if error caught gracefully

---

#### Test 6.4: Error Recovery
1. Click "Try again" button
2. Component should re-render normally
3. App should work

**Status:** ✅ PASS if recovery successful

---

#### Test 6.5: Settings Persistence in Frontend
1. Go to /settings page
2. Change a setting (e.g., theme)
3. Refresh page (Ctrl+R or Cmd+R)
4. Check if setting persisted

**Expected:** Setting should remain after refresh

**Status:** ✅ PASS if setting persists

---

### Phase 7: Integration Tests

#### Test 7.1: Complete User Journey
```
1. Register new user ✅
2. Login (get JWT) ✅
3. Get settings (defaults) ✅
4. Update settings ✅
5. Make a prediction ✅
6. Search predictions ✅
7. Logout ✅
8. Login again ✅
9. Verify settings still there ✅
```

**Status:** ✅ PASS if all steps work

---

#### Test 7.2: Admin Workflow
```
1. Seed admin user ✅
2. Login as admin ✅
3. Access /api/analytics/admin ✅
4. Get admin stats ✅
5. Non-admin can't access ✅
```

**Status:** ✅ PASS if admin access controlled

---

#### Test 7.3: API Key Fallback
```
1. Remove/comment GEMINI_API_KEY in .env ✅
2. Restart backend ✅
3. Check startup message (should show warning) ✅
4. Make a prediction ✅
5. Should use rule-based explanation ✅
```

**Status:** ✅ PASS if fallback works

---

## ✅ Test Results Template

### Execution Checklist

```
Phase 1: Backend Startup
- [ ] 1.1 Backend starts with API validation message
- [ ] 1.2 API responds to health check

Phase 2: Authentication & Roles
- [ ] 2.1 New user registration works
- [ ] 2.2 Login returns JWT with role
- [ ] 2.3 Admin login shows admin role

Phase 3: Admin Access Control
- [ ] 3.1 Non-admin gets 403 Forbidden
- [ ] 3.2 Admin gets 200 OK

Phase 4: Settings Persistence
- [ ] 4.1 Get default settings
- [ ] 4.2 Update settings works
- [ ] 4.3 Settings persist after restart
- [ ] 4.4 Reset to defaults works
- [ ] 4.5 Export settings works

Phase 5: Search Functionality
- [ ] 5.1 Can make predictions
- [ ] 5.2 Search returns actual predictions
- [ ] 5.3 Category filter works
- [ ] 5.4 Date filter works
- [ ] 5.5 No mock data returned

Phase 6: Frontend Error Boundary
- [ ] 6.1 Frontend starts without errors
- [ ] 6.2 Registration & login works
- [ ] 6.3 Error boundary catches errors
- [ ] 6.4 Error recovery works
- [ ] 6.5 Settings persist in frontend

Phase 7: Integration
- [ ] 7.1 Complete user journey works
- [ ] 7.2 Admin workflow secure
- [ ] 7.3 API key fallback works
```

---

## 🚨 Common Issues & Solutions

### Issue: MongoDB Connection Failed
**Solution:**
- Verify MongoDB is running: `mongo` or `mongosh`
- Check MONGO_URI in .env
- For MongoDB Atlas: Use correct password URL

### Issue: Settings Not Persisting
**Solution:**
- Check MongoDB is running
- Verify settings collection exists
- Check user_id is ObjectId in DB

### Issue: Admin Access Always 403
**Solution:**
- Verify user created with `role: "admin"`
- Run: `python backend/database/seed.py`
- Check JWT includes user ID

### Issue: Search Returns No Results
**Solution:**
- Make a prediction first
- Use same user's JWT token
- Check prediction_result field has value

### Issue: Error Boundary Not Working
**Solution:**
- Verify ErrorBoundary wrapped in App.jsx
- Check React dev tools shows boundary
- Ensure error is thrown in component render

---

## 📊 Performance Metrics

### Expected Response Times
- Login: < 100ms
- Settings update: < 50ms
- Search: < 200ms
- Prediction: < 1000ms (with Gemini API)

### Database Queries
- Settings: Indexed on user_id
- Predictions: Indexed on user_id + timestamp
- Users: Indexed on email

---

## 🎯 Success Criteria

### All Issues Fixed: ✅
- [ ] Settings persist across restarts
- [ ] Admin access controlled
- [ ] API keys validated on startup
- [ ] React errors caught gracefully
- [ ] Search returns real data

### Code Quality: ✅
- [ ] No syntax errors
- [ ] No runtime errors
- [ ] Proper error handling
- [ ] Clean code practices

### Ready for Production: ✅
- [ ] All tests pass
- [ ] No deprecated code
- [ ] Proper logging
- [ ] Security measures

---

**Generated:** September 4, 2026  
**Test Coverage:** Comprehensive  
**Estimated Test Time:** 30-45 minutes
