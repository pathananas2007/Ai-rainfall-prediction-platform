import os
import sys

# Add the project root to sys.path to handle absolute imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from datetime import timedelta
from dotenv import load_dotenv

# Import routes
from backend.routes.auth_routes import auth_bp
from backend.routes.predict_routes import predict_bp
from backend.routes.analytics_routes import analytics_bp
from backend.routes.weather_routes import weather_bp
from backend.routes.ai_routes import ai_bp
from backend.routes.search_routes import search_bp
from backend.routes.settings_routes import settings_bp

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

app = Flask(__name__)
CORS(app,
     resources={r"/api/*": {"origins": "*"}},
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'rainfall-prediction-premium-secret-123')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

jwt = JWTManager(app)

bcrypt = Bcrypt(app)

# Wire bcrypt into auth_service
from backend.services import auth_service as _as
_as.bcrypt = bcrypt

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(predict_bp, url_prefix='/api/predict')
app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
app.register_blueprint(weather_bp, url_prefix='/api/weather')
app.register_blueprint(ai_bp, url_prefix='/api/ai')
app.register_blueprint(search_bp, url_prefix='/api/search')
app.register_blueprint(settings_bp, url_prefix='/api/settings')

@app.route('/')
def index():
    return {"message": "Rainfall Prediction API is running"}, 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
