from flask import Blueprint, request, jsonify
from backend.services.auth_service import AuthService
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.database.db import get_db
from bson import ObjectId

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"error": "Missing required fields"}), 400
    
    response, status = AuthService.register_user(data['name'], data['email'], data['password'])
    return jsonify(response), status

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Missing required fields"}), 400
    
    response, status = AuthService.login_user(data['email'], data['password'])
    return jsonify(response), status

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    db = get_db()
    user = db['users'].find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "name": user['name'],
        "email": user['email'],
        "createdAt": user['createdAt']
    }), 200
