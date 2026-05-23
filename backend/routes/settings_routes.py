from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

settings_bp = Blueprint('settings', __name__)

# Mock user settings storage (in production, use database)
user_settings = {}

@settings_bp.route('/', methods=['GET'])
@jwt_required()
def get_settings():
    """Get user settings"""
    user_id = get_jwt_identity()
    
    # Default settings
    default_settings = {
        "notifications": {
            "email": True,
            "push": True,
            "weatherAlerts": True,
            "predictionUpdates": True,
            "aiInsights": True
        },
        "display": {
            "theme": "light",
            "language": "en",
            "temperatureUnit": "celsius",
            "windSpeedUnit": "kmh",
            "dateFormat": "DD/MM/YYYY"
        },
        "privacy": {
            "shareData": False,
            "publicProfile": False,
            "showHistory": True
        },
        "predictions": {
            "autoRefresh": True,
            "refreshInterval": 30,
            "confidenceThreshold": 70,
            "showAdvancedMetrics": True
        },
        "ai": {
            "enableChatAssistant": True,
            "autoSuggestions": True,
            "voiceInput": False
        }
    }
    
    # Get user-specific settings or return defaults
    settings = user_settings.get(user_id, default_settings)
    return jsonify(settings), 200

@settings_bp.route('/', methods=['PUT'])
@jwt_required()
def update_settings():
    """Update user settings"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No settings data provided"}), 400
    
    # Store settings (in production, save to database)
    user_settings[user_id] = data
    
    return jsonify({"message": "Settings updated successfully", "settings": data}), 200

@settings_bp.route('/reset', methods=['POST'])
@jwt_required()
def reset_settings():
    """Reset settings to default"""
    user_id = get_jwt_identity()
    
    # Remove user settings to revert to defaults
    if user_id in user_settings:
        del user_settings[user_id]
    
    return jsonify({"message": "Settings reset to default"}), 200

@settings_bp.route('/export', methods=['GET'])
@jwt_required()
def export_settings():
    """Export user settings as JSON"""
    user_id = get_jwt_identity()
    settings = user_settings.get(user_id, {})
    
    return jsonify({
        "exported_at": "2026-05-22T20:00:00Z",
        "user_id": user_id,
        "settings": settings
    }), 200

# Made with Bob
