from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.database.db import get_db
from datetime import datetime
from bson import ObjectId

settings_bp = Blueprint('settings', __name__)

# Default settings template
DEFAULT_SETTINGS = {
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

def get_settings_collection():
    """Get MongoDB settings collection"""
    db = get_db()
    return db['settings']

def _get_user_settings(user_id):
    """Retrieve user settings from DB or return defaults"""
    settings_collection = get_settings_collection()
    try:
        user_oid = ObjectId(user_id)
    except:
        user_oid = user_id
    
    user_settings = settings_collection.find_one({"user_id": user_oid})
    if user_settings:
        # Remove MongoDB _id and user_id from response
        user_settings.pop('_id', None)
        user_settings.pop('user_id', None)
        return user_settings
    return DEFAULT_SETTINGS

@settings_bp.route('/', methods=['GET'])
@jwt_required()
def get_settings():
    """Get user settings"""
    user_id = get_jwt_identity()
    
    try:
        settings = _get_user_settings(user_id)
        return jsonify(settings), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@settings_bp.route('/', methods=['PUT'])
@jwt_required()
def update_settings():
    """Update user settings"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No settings data provided"}), 400
    
    try:
        settings_collection = get_settings_collection()
        user_oid = ObjectId(user_id)
    except:
        user_oid = user_id
    
    try:
        # Update or insert settings
        result = settings_collection.update_one(
            {"user_id": user_oid},
            {
                "$set": {
                    "settings": data,
                    "updated_at": datetime.utcnow()
                },
                "$setOnInsert": {
                    "user_id": user_oid,
                    "created_at": datetime.utcnow()
                }
            },
            upsert=True
        )
        
        return jsonify({
            "message": "Settings updated successfully",
            "settings": data
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@settings_bp.route('/reset', methods=['POST'])
@jwt_required()
def reset_settings():
    """Reset settings to default"""
    user_id = get_jwt_identity()
    
    try:
        settings_collection = get_settings_collection()
        try:
            user_oid = ObjectId(user_id)
        except:
            user_oid = user_id
        
        # Delete user settings to revert to defaults
        settings_collection.delete_one({"user_id": user_oid})
        
        return jsonify({
            "message": "Settings reset to default",
            "settings": DEFAULT_SETTINGS
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@settings_bp.route('/export', methods=['GET'])
@jwt_required()
def export_settings():
    """Export user settings as JSON"""
    user_id = get_jwt_identity()
    
    try:
        settings = _get_user_settings(user_id)
        return jsonify({
            "exported_at": datetime.utcnow().isoformat(),
            "user_id": user_id,
            "settings": settings
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
