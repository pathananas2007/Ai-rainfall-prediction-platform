#!/usr/bin/env python3
import os
import sys
import warnings

# Add the project root to sys.path to handle absolute imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
env_file = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(env_file)

# Create Flask app
app = Flask(__name__)

# Production-ready CORS configuration
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
CORS(app,
     resources={r"/api/*": {"origins": [FRONTEND_URL, "http://localhost:3000", "http://localhost:5000"]}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'rainfall-prediction-premium-secret-123')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Initialize extensions
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Wire bcrypt into auth_service
from backend.services import auth_service as _as
_as.bcrypt = bcrypt

# Startup logging
print("\n" + "="*60)
print("RainAI Backend Startup")
print("="*60)
print(f"Environment: {os.getenv('ENV', 'development')}")
print(f"Frontend URL: {FRONTEND_URL}")
print("="*60 + "\n")

# Validate API keys on startup
try:
    from backend.services.gen_ai import validate_gemini_api_key
    validate_gemini_api_key()
except Exception as e:
    print(f"Warning: Could not validate Gemini API: {e}")

# Import and register blueprints
from backend.routes.auth_routes import auth_bp
from backend.routes.predict_routes import predict_bp
from backend.routes.analytics_routes import analytics_bp
from backend.routes.weather_routes import weather_bp
from backend.routes.ai_routes import ai_bp
from backend.routes.search_routes import search_bp
from backend.routes.settings_routes import settings_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(predict_bp, url_prefix='/api/predict')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
app.register_blueprint(weather_bp, url_prefix='/api/weather')
app.register_blueprint(ai_bp, url_prefix='/api/ai')
app.register_blueprint(search_bp, url_prefix='/api/search')
app.register_blueprint(settings_bp, url_prefix='/api/settings')

# Health check endpoint
@app.route('/')
def index():
    return {"message": "Rainfall Prediction API is running", "version": "1.0.0"}, 200

@app.route('/api/health')
def health():
    """Health check endpoint for Render deployment monitoring"""
    return {"status": "ok", "service": "rainai-backend"}, 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return {"error": "Not found"}, 404

@app.errorhandler(500)
def server_error(error):
    return {"error": "Internal server error"}, 500

# Only use Flask dev server if running directly (not through Gunicorn)
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('ENV', 'development') == 'development'
    print(f"Starting Flask dev server on port {port}...")
    app.run(debug=debug, port=port, host='0.0.0.0', threaded=True)
