from flask_bcrypt import Bcrypt
from backend.database.db import get_db
from flask_jwt_extended import create_access_token
from datetime import datetime

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
            "createdAt": datetime.utcnow()
        }
        
        users_collection.insert_one(user_data)
        return {"message": "User registered successfully"}, 201

    @staticmethod
    def login_user(email, password):
        users_collection = get_users()
        user = users_collection.find_one({"email": email})
        if user and bcrypt.check_password_hash(user['password'], password):
            access_token = create_access_token(identity=str(user['_id']))
            return {
                "token": access_token,
                "user": {
                    "name": user['name'],
                    "email": user['email']
                }
            }, 200
        
        return {"error": "Invalid email or password"}, 401
