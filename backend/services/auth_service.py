from flask_bcrypt import Bcrypt
from backend.database.db import get_db
from flask_jwt_extended import create_access_token
from datetime import datetime

# Will be replaced by the app-bound instance from app.py
bcrypt = Bcrypt()

def get_users():
    db = get_db()
    return db['users']

class AuthService:
    @staticmethod
    def register_user(name, email, password):
        users_collection = get_users()
        if users_collection.find_one({"email": email}):
            return {"error": "User already exists"}, 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        user_data = {
            "name": name,
            "email": email,
            "password": hashed_password,
            "role": "user",  # Default role for new users
            "createdAt": datetime.utcnow()
        }
        users_collection.insert_one(user_data)
        return {"message": "User registered successfully"}, 201

    @staticmethod
    def login_user(email, password):
        users_collection = get_users()
        user = users_collection.find_one({"email": email})
        if not user:
            return {"error": "Invalid email or password"}, 401

        try:
            password_matches = bcrypt.check_password_hash(user['password'], password)
        except Exception:
            return {"error": "Invalid email or password"}, 401

        if password_matches:
            access_token = create_access_token(identity=str(user['_id']))
            return {
                "token": access_token,
                "user": {
                    "name": user['name'],
                    "email": user['email'],
                    "role": user.get('role', 'user')
                }
            }, 200

        return {"error": "Invalid email or password"}, 401

    @staticmethod
    def get_user_by_id(user_id):
        """Retrieve user by ID"""
        from bson import ObjectId
        users_collection = get_users()
        try:
            user = users_collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user['id'] = str(user['_id'])
                user.pop('password', None)
                return user
        except:
            pass
        return None

    @staticmethod
    def get_user_role(user_id):
        """Get user's role"""
        user = AuthService.get_user_by_id(user_id)
        return user.get('role', 'user') if user else None

    @staticmethod
    def is_admin(user_id):
        """Check if user is admin"""
        return AuthService.get_user_role(user_id) == 'admin'
