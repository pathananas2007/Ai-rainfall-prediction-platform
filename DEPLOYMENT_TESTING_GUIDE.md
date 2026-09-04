# ✅ COMPREHENSIVE DEPLOYMENT TESTING GUIDE

**After both Render and Vercel are deployed, run these tests in order.**

---

## TEST 1: Backend Health Check (1 minute)

### Test 1.1: Health Endpoint
```bash
curl https://ai-rainfall-prediction-platform.onrender.com/api/health
```

**Expected Response**:
```json
{"status":"ok"}
```

**If fails**: 
- Render backend not running
- Go back to Render setup and check logs

---

## TEST 2: Frontend Loading (1 minute)

### Test 2.1: Load Frontend URL
Visit in browser: https://ai-rainfall-prediction-platform-k4e5-6m2ni3gty.vercel.app

**Expected**:
- Page loads (not blank, not 404)
- React app visible
- Login screen shows

**If fails**:
- Check browser console (F12)
- Look for error messages
- Redeploy Vercel

### Test 2.2: Check Browser Console
Press F12 in browser, go to Console tab

**Expected**:
- No red errors
- Maybe yellow warnings (normal)

**Errors to look for**:
- `Cannot connect to API` → Backend not running
- `CORS error` → FRONTEND_URL not set in Render
- `Module not found` → Build failed

---

## TEST 3: User Registration (2 minutes)

### Test 3.1: Navigate to Register
1. Visit: https://ai-rainfall-prediction-platform-k4e5-6m2ni3gty.vercel.app
2. Click "Register" button

### Test 3.2: Create Test Account
Fill form with:
- **Email**: testuser@example.com
- **Password**: Test@123456
- **Confirm Password**: Test@123456
- Click "Register"

**Expected**:
- Success message
- Redirect to login or dashboard
- No error messages

**If fails**:
- Check browser console for error
- Common issue: Backend API not responding
- Verify Render backend is running

### Test 3.3: Check Network Request
1. Press F12 (Developer Tools)
2. Go to "Network" tab
3. Try to register again
4. Look for POST request to `/api/auth/register`
5. Check response (should be 200 OK with user data)

---

## TEST 4: User Login (2 minutes)

### Test 4.1: Login with Test Account
1. Visit: https://ai-rainfall-prediction-platform-k4e5-6m2ni3gty.vercel.app
2. Click "Login"
3. Enter:
   - **Email**: testuser@example.com
   - **Password**: Test@123456
4. Click "Login"

**Expected**:
- Success
- Redirect to dashboard
- See weather data or main interface
- No error messages

**If fails**:
- Email/password might be wrong
- Backend not running
- Check browser console

### Test 4.2: Verify JWT Token
1. Press F12
2. Go to "Application" tab
3. Click "Local Storage"
4. Select your domain
5. Look for `token` key
6. Should see a long string (JWT)

**Expected**:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

If missing: Backend didn't return token

---

## TEST 5: Make Rainfall Prediction (3 minutes)

### Test 5.1: Navigate to Predict
1. After login, find "Predict" or "Prediction" button/menu
2. Click it

### Test 5.2: Fill Prediction Form
Enter weather data:
- **Temperature**: 25
- **Humidity**: 65
- **Wind Speed**: 10
- **Pressure**: 1013
- Or use auto-fill if available
- Click "Predict" or "Submit"

**Expected**:
- Prediction result appears
- Shows rainfall amount
- No error messages

**If fails**:
- Backend API error
- Check browser console
- Verify ML model loaded

### Test 5.3: Check Network Request
1. Press F12
2. Go to "Network" tab
3. Make prediction again
4. Look for POST request to `/api/predict`
5. Check response (should have `rainfall` field)

**Expected Response Format**:
```json
{
  "rainfall": 45.2,
  "location": "Current Location",
  "timestamp": "2026-09-04T12:00:00"
}
```

---

## TEST 6: Check Prediction History (2 minutes)

### Test 6.1: Go to History
1. Find "History" or "Predictions" menu
2. Click it

**Expected**:
- See list of past predictions
- Includes the test prediction made in TEST 5

### Test 6.2: Verify Data in MongoDB
1. Go to: https://cloud.mongodb.com
2. Login to MongoDB Atlas
3. Navigate to cluster
4. Click "Browse Collections"
5. Find **predictions** collection
6. Should see your test prediction entry

**Expected Document**:
```json
{
  "userId": "your-user-id",
  "temperature": 25,
  "humidity": 65,
  "rainfall": 45.2,
  "timestamp": "2026-09-04T12:00:00"
}
```

If missing: Data not saving to MongoDB

---

## TEST 7: Analytics (1 minute)

### Test 7.1: Go to Analytics/Dashboard
1. Find "Analytics" or "Dashboard" menu
2. Click it

**Expected**:
- See statistics/charts
- Shows prediction count
- Shows history graph
- No error messages

---

## TEST 8: Settings (1 minute)

### Test 8.1: Go to Settings
1. Find "Settings" in menu
2. Click it

### Test 8.2: Update Settings
1. Change a setting (e.g., theme, units)
2. Save

**Expected**:
- Setting saves
- Change persists on page refresh
- Stored in MongoDB

---

## TEST 9: Logout & Login Again (1 minute)

### Test 9.1: Logout
1. Click "Logout" button
2. Redirected to login screen

### Test 9.2: Login Again
1. Login with same credentials
2. Should work normally

**Expected**:
- All previous data preserved
- Predictions still in history
- Settings still saved

---

## TEST 10: Mobile Responsiveness (1 minute)

### Test 10.1: Open DevTools
Press F12 in browser

### Test 10.2: Enable Mobile View
1. Click device icon (top-left of DevTools)
2. Or press Ctrl+Shift+M
3. Select different devices (iPhone, iPad, etc.)

**Expected**:
- Layout adapts
- All buttons clickable
- No overflow/cutoff
- Responsive design works

---

## FINAL VERIFICATION CHECKLIST

Mark each as done:

- [ ] Backend /api/health returns {"status":"ok"}
- [ ] Frontend loads without errors
- [ ] Can register new user account
- [ ] Can login with credentials
- [ ] JWT token appears in localStorage
- [ ] Can make rainfall prediction
- [ ] Prediction shows results
- [ ] Prediction appears in history
- [ ] Data visible in MongoDB Atlas
- [ ] Analytics show data
- [ ] Settings can be updated
- [ ] Logout works
- [ ] Can login again
- [ ] Mobile view responsive
- [ ] No localhost URLs in production
- [ ] No CORS errors in console
- [ ] No API errors in console

---

## QUICK TEST SCRIPT

If you're comfortable with curl/terminal, run this:

```bash
# Test 1: Backend health
curl -i https://ai-rainfall-prediction-platform.onrender.com/api/health

# Test 2: Register (adjust email each time)
curl -X POST https://ai-rainfall-prediction-platform.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test'$(date +%s)'@example.com","password":"Test@123456","confirmPassword":"Test@123456"}'

# Test 3: Login
curl -X POST https://ai-rainfall-prediction-platform.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"Test@123456"}'
```

---

## SUCCESS CRITERIA

You're done when ALL of these are true:

✅ Backend responds to health check  
✅ Frontend loads without errors  
✅ Can create user accounts  
✅ Can login with JWT  
✅ Can make predictions  
✅ Can see prediction history  
✅ Data saves to MongoDB  
✅ Mobile view works  
✅ No errors in console  

---

## WHAT TO DO IF TESTS FAIL

1. **Identify which test failed**
2. **Check the "If fails" section for that test**
3. **Follow the recommended fix**
4. **Retry the test**

Common fixes:
- Render: Check environment variables are ALL set
- Render: Check build logs for errors
- Vercel: Redeploy after environment variable changes
- Both: Give them 2-3 minutes to update caches

---

## SUPPORT INFORMATION

If you get stuck:

1. Check browser console (F12) for error messages
2. Check Render build logs
3. Check Vercel build logs
4. Verify MongoDB Atlas cluster is running
5. Verify environment variables are correct
6. Try redeploying the service

