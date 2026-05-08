from flask import Blueprint, jsonify
from backend.services.analytics_service import AnalyticsService
from flask_jwt_extended import jwt_required, get_jwt_identity

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/user', methods=['GET'])
@jwt_required()
def user_stats():
    user_id = get_jwt_identity()
    try:
        stats = AnalyticsService.get_user_stats(user_id)
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analytics_bp.route('/admin', methods=['GET'])
@jwt_required()
def admin_stats():
    # In a real app, you'd check for admin role here
    try:
        stats = AnalyticsService.get_admin_stats()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
