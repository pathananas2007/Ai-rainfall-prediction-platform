from backend.database.db import get_db
from flask_bcrypt import Bcrypt
from datetime import datetime

bcrypt = Bcrypt()
db = get_db()

def seed_data():
    print("Seeding data...")
    # Create an admin user
    hashed_pw = bcrypt.generate_password_hash("password123").decode('utf-8')
    admin_user = {
        "name": "Admin User",
        "email": "admin@example.com",
        "password": hashed_pw,
        "role": "admin",  # Explicitly set admin role
        "createdAt": datetime.utcnow()
    }
    
    if not db['users'].find_one({"email": "admin@example.com"}):
        db['users'].insert_one(admin_user)
        print("Admin user created with email: admin@example.com and password: password123")
    else:
        print("Admin user already exists.")

if __name__ == "__main__":
    seed_data()
