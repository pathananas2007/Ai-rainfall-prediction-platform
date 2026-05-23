import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load .env from the backend directory regardless of where the script is run from
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")

# Use the database name from the Atlas URI if present, otherwise default
# The Atlas URI already contains /rainai — MongoClient respects that
client = MongoClient(MONGO_URI)

# Extract DB name from URI or fall back to 'rainai'
_db_name = MONGO_URI.split("/")[-1].split("?")[0] or "rainai"
db = client[_db_name]

def get_db():
    return db
