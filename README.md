# RainAI - AI-Powered Rainfall Prediction SaaS

A production-ready AI-powered full-stack SaaS platform for rainfall prediction, analytics, and weather intelligence using Machine Learning.

---

# ✨ Features

- 🎯 Premium AI SaaS UI with Tailwind CSS and Glassmorphism
- 🔐 JWT Authentication with Bcrypt Password Hashing
- 🤖 ML-Powered Rainfall Prediction using Random Forest
- 📊 Interactive Analytics Dashboard with Real-time Charts
- 📝 Prediction History Tracking and Management
- 🌍 MongoDB Atlas Integration for Data Persistence
- 🛡️ Protected Routes and Secure REST API
- 📱 Fully Responsive Mobile-Friendly Design
- 🎨 Modern UI with Framer Motion Animations
- 🧠 AI-powered Weather Analytics with Google Gemini
- ⚡ Real-time Prediction Insights and Recommendations
- 🔄 Settings Management with Export/Import Functionality
- 🔍 Advanced Search with Relevance Scoring

---

# 🚀 Quick Start

## Local Development

### Prerequisites
- Node.js 16+
- Python 3.8+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MongoDB URI and other configs
python app.py
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.development
# Edit .env.development if needed (defaults to localhost:5000)
npm run dev
```

### Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/api/health

---

# 📦 Tech Stack

## Frontend
- **React.js** 19.2.6 - UI Framework
- **Vite** 8.0.10 - Build Tool & Dev Server
- **Tailwind CSS** 4.2.4 - Utility-First CSS
- **React Router DOM** 7.15.0 - Client-Side Routing
- **Axios** 1.16.0 - HTTP Client
- **Framer Motion** 12.38.0 - Animation Library
- **Recharts** 3.8.1 - Chart Components
- **Lucide React** 1.14.0 - Icon Library
- **React Hot Toast** 2.6.0 - Toast Notifications
- **TypeScript** 6.0.2 - Type Safety

## Backend
- **Flask** 2.x - Web Framework
- **Flask-CORS** - Cross-Origin Resource Sharing
- **Flask-JWT-Extended** - JWT Token Management
- **Flask-Bcrypt** - Password Hashing
- **PyMongo** - MongoDB Driver
- **Gunicorn** - WSGI Server (Production)

## Machine Learning
- **Scikit-learn** - ML Algorithms & Random Forest
- **Pandas** - Data Processing
- **NumPy** - Numerical Computing
- **Joblib** - Model Serialization

## Database & APIs
- **MongoDB Atlas** - Cloud Database
- **Google Gemini** - AI-Powered Explanations
- **OpenWeather** - Weather Data (Optional)

---

# 📋 Project Structure

```
RainAI/
├── backend/                    # Flask REST API
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt        # Python dependencies
│   ├── runtime.txt            # Python version
│   ├── .env.example           # Environment template
│   │
│   ├── database/
│   │   ├── db.py              # MongoDB connection
│   │   └── seed.py            # Database initialization
│   │
│   ├── ml/
│   │   ├── train_model.py     # Model training script
│   │   ├── rainfall_model.pkl # Trained Random Forest model
│   │   ├── scaler.pkl         # Feature scaler
│   │   └── feature_columns.pkl# Feature columns
│   │
│   ├── routes/
│   │   ├── auth_routes.py     # Authentication endpoints
│   │   ├── predict_routes.py  # Prediction endpoints
│   │   ├── analytics_routes.py# Analytics endpoints
│   │   ├── weather_routes.py  # Weather endpoints
│   │   ├── search_routes.py   # Search endpoints
│   │   ├── settings_routes.py # Settings endpoints
│   │   └── ai_routes.py       # AI chat endpoints
│   │
│   └── services/
│       ├── auth_service.py    # Auth business logic
│       ├── predict_service.py # Prediction logic
│       ├── analytics_service.py
│       └── gen_ai.py          # Gemini AI integration
│
├── frontend/                   # React + Vite Application
│   ├── package.json           # Node dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── vercel.json            # Vercel deployment config
│   ├── tailwind.config.js     # Tailwind configuration
│   ├── .env.example           # Environment template
│   ├── .env.development       # Development env vars
│   │
│   ├── public/
│   │   └── favicon.svg
│   │
│   └── src/
│       ├── main.jsx           # Entry point
│       ├── App.jsx            # Root component
│       ├── index.css          # Global styles
│       │
│       ├── pages/             # Route components
│       │   ├── Landing.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Predict.jsx
│       │   ├── History.jsx
│       │   ├── Analytics.jsx
│       │   └── Settings.jsx
│       │
│       ├── components/        # Reusable components
│       │   ├── Sidebar.jsx
│       │   ├── Navbar.jsx
│       │   ├── ErrorBoundary.jsx
│       │   ├── AIChatAssistant.jsx
│       │   ├── WeatherComparison.jsx
│       │   └── ...
│       │
│       ├── context/           # React Context providers
│       │   ├── AuthContext.jsx
│       │   ├── LanguageContext.jsx
│       │   └── SettingsContext.jsx
│       │
│       ├── services/          # API and utility services
│       │   ├── api.js         # Axios instance & interceptors
│       │   └── aiEngine.js
│       │
│       └── utils/             # Utility functions
│           └── aiEngine.js
│
├── data/                       # Training data
│   ├── data final.csv         # Australian rainfall dataset
│   └── final 2.ipynb          # Jupyter notebook
│
├── render.yaml                 # Render deployment config
├── .gitignore                 # Git ignore rules
├── DEPLOYMENT_GUIDE.md        # Detailed deployment instructions
└── README.md                  # This file
```

---

# 🌐 Production Deployment

## Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL                               │
│              React + Vite Frontend                          │
│          https://rainai-xxxxx.vercel.app                   │
└──────────────────────────┬──────────────────────────────────┘
                          │ HTTP/HTTPS
                          │ VITE_API_URL
                          ↓
┌──────────────────────────────────────────────────────────────┐
│                        RENDER                                │
│         Flask Backend + Gunicorn WSGI Server                │
│      https://rainai-backend-xxxxx.onrender.com              │
│                    /api/...                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │ MongoDB Driver
                       │ MONGO_URI
                       ↓
┌──────────────────────────────────────────────────────────────┐
│                  MONGODB ATLAS                              │
│                  Cloud Database                             │
│    mongodb+srv://user:pwd@cluster.mongodb.net               │
└──────────────────────────────────────────────────────────────┘
```

## Deployment Steps

### 1. **MongoDB Atlas Setup**
- Create MongoDB Atlas cluster at https://www.mongodb.com/cloud/atlas
- Create database user and get connection string
- Add Render IP to network access

### 2. **Deploy Backend to Render**
- Connect GitHub repository to Render
- Create Web Service with:
  - Root Directory: `backend`
  - Build Command: `pip install -r requirements.txt`
  - Start Command: `gunicorn app:app`
  - Environment Variables: `MONGO_URI`, `JWT_SECRET_KEY`, `FRONTEND_URL`, etc.

### 3. **Deploy Frontend to Vercel**
- Connect GitHub repository to Vercel
- Create Project with:
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Environment Variable: `VITE_API_URL` (Render backend URL)

### 4. **Update Render CORS**
- Set `FRONTEND_URL` environment variable to Vercel deployment URL
- Render will automatically redeploy with updated CORS configuration

### 5. **Test Deployment**
- Verify `/api/health` endpoint responds
- Test user registration and login
- Test rainfall predictions
- Verify ML model loads correctly

**For detailed step-by-step instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

---

# 🔐 Security Features

- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Password Hashing** - Bcrypt with salt
- ✅ **CORS Configuration** - Production-safe origin restrictions
- ✅ **Environment Variables** - No hardcoded secrets
- ✅ **Protected Routes** - JWT-required endpoints
- ✅ **Error Handling** - User-friendly, no stack traces leaked
- ✅ **Input Validation** - Server-side validation on all endpoints
- ✅ **ML Model Security** - Models loaded safely with absolute paths
- ✅ **MongoDB Atlas** - SSL/TLS encrypted connections
- ✅ **HTTPS Enforced** - Vercel and Render provide SSL/TLS

---

# 🧪 Testing

## Backend Tests
```bash
cd backend
# Test health endpoint
curl http://localhost:5000/api/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Test prediction
curl -X POST http://localhost:5000/api/predict \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"MinTemp":10,"MaxTemp":25,...}'
```

## Frontend Tests
- Navigate to http://localhost:3000
- Test user registration
- Test user login
- Test rainfall prediction form
- Test analytics dashboard
- Test prediction history
- Test settings management

---

# 📊 ML Model Details

**Algorithm**: Random Forest Classifier (100 estimators)  
**Accuracy**: ~82% on test set  
**Features**: 17 weather parameters  
**Target**: Binary rainfall prediction (Yes/No)  
**Dataset**: Australian weather data  

### Feature Columns
- MinTemp, MaxTemp, Temp9am, Temp3pm
- Humidity9am, Humidity3pm
- Pressure9am, Pressure3pm
- Cloud9am, Cloud3pm
- WindGustSpeed, WindSpeed9am, WindSpeed3pm
- Rainfall, Evaporation, Sunshine
- RainYesterday (0/1)

---

# 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - User profile (protected)

### Prediction
- `POST /api/predict` - Make rainfall prediction (protected)
- `GET /api/predict/history` - Get prediction history (protected)
- `DELETE /api/predict/history/:id` - Delete prediction (protected)

### Analytics
- `GET /api/analytics/user` - User statistics (protected)
- `GET /api/analytics/admin` - Admin statistics (admin role required)

### Weather
- `GET /api/weather/current?city=...` - Current weather by city
- `GET /api/weather/coords?lat=...&lon=...` - Weather by coordinates

### Search
- `GET /api/search?q=...` - Full-text search (protected)

### Settings
- `GET /api/settings` - Get user settings (protected)
- `PUT /api/settings` - Update settings (protected)
- `POST /api/settings/reset` - Reset to defaults (protected)
- `GET /api/settings/export` - Export settings (protected)

### Health
- `GET /api/health` - Health check

---

# 🌍 Environment Variables

### Backend
```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/rainai
JWT_SECRET_KEY=your-secret-key-min-32-chars
FRONTEND_URL=https://your-vercel-domain.vercel.app
GEMINI_API_KEY=optional-gemini-api-key
OPENWEATHER_API_KEY=optional-openweather-key
ENV=production
PORT=5000
```

### Frontend
```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

---

# 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

# 📝 License

This project is open source and available under the MIT License.

---

# 👤 Author

**Anas Pathan**
- GitHub: [@pathananas2007](https://github.com/pathananas2007)
- Project: [AI Rainfall Prediction Platform](https://github.com/pathananas2007/Ai-rainfall-prediction-platform)

---

# 📞 Support

For issues, questions, or suggestions:
1. Check [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for deployment help
2. Review existing GitHub issues
3. Create a new GitHub issue with detailed description
4. Check API documentation in code

---

# 🎉 Acknowledgments

- **Dataset**: Australian weather dataset from Kaggle
- **ML Framework**: Scikit-learn
- **Frontend Framework**: React and Vite
- **UI Components**: Tailwind CSS and Lucide React
- **Cloud Services**: Vercel, Render, and MongoDB Atlas

---

**Last Updated**: September 2026  
**Version**: 2.0.0  
**Status**: Production Ready ✅
