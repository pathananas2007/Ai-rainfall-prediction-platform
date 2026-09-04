import os
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
from dotenv import load_dotenv

# Load .env from the backend directory regardless of where the script is run from
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")

# Create MongoDB client with production settings
try:
    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=10000,
        retryWrites=True,
        w='majority'
    )
    # Test connection
    client.admin.command('ping')
    print("✅ MongoDB connection successful")
except (ServerSelectionTimeoutError, ConnectionFailure) as e:
    print(f"⚠️  Warning: MongoDB connection failed - {e}")
    print("⚠️  Application will continue but database operations may fail")
    print("⚠️  Make sure MONGO_URI is set correctly in environment variables")
    client = MongoClient(MONGO_URI)

# Extract DB name from URI or fall back to 'rainai'
_db_name = MONGO_URI.split("/")[-1].split("?")[0] or "rainai"
db = client[_db_name]

def get_db():
    """Get database instance with error handling"""
    try:
        # Verify connection is still alive
        db.command('ping')
        return db
    except Exception as e:
        print(f"⚠️  Database connection warning: {e}")
        return db  # Return db anyway in case it reconnects
