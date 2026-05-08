from backend.database.db import get_db
from bson import ObjectId

db = get_db()
predictions_collection = db['predictions']
users_collection = db['users']

class AnalyticsService:
    @staticmethod
    def get_user_stats(user_id):
        total_predictions = predictions_collection.count_documents({"userId": ObjectId(user_id)})
        yes_count = predictions_collection.count_documents({"userId": ObjectId(user_id), "prediction": "Yes"})
        no_count = predictions_collection.count_documents({"userId": ObjectId(user_id), "prediction": "No"})
        
        # Simple trend (last 7 predictions)
        recent = list(predictions_collection.find({"userId": ObjectId(user_id)}).sort("timestamp", -1).limit(7))
        
        return {
            "totalPredictions": total_predictions,
            "distribution": {
                "Yes": yes_count,
                "No": no_count
            },
            "recentHistory": [{
                "date": item["timestamp"].strftime("%Y-%m-%d"),
                "prediction": item["prediction"],
                "confidence": item["confidence"]
            } for item in recent]
        }

    @staticmethod
    def get_admin_stats():
        total_users = users_collection.count_documents({})
        total_predictions = predictions_collection.count_documents({})
        
        return {
            "totalUsers": total_users,
            "totalPredictions": total_predictions
        }
