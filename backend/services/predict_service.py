import joblib
import os
import numpy as np
import pandas as pd
from backend.database.db import get_db
from backend.services.gen_ai import generate_ai_explanation
from datetime import datetime
from bson import ObjectId

ML_DIR = os.path.join(os.path.dirname(__file__), '../ml')
MODEL_PATH   = os.path.join(ML_DIR, 'rainfall_model.pkl')
SCALER_PATH  = os.path.join(ML_DIR, 'scaler.pkl')
COLUMNS_PATH = os.path.join(ML_DIR, 'feature_columns.pkl')


def get_predictions_collection():
    db = get_db()
    return db['predictions']


class PredictService:
    _model = None
    _scaler = None
    _feature_columns = None

    @classmethod
    def _load_artifacts(cls):
        if cls._model is None:
            if not os.path.exists(MODEL_PATH):
                raise Exception("Model not found. Run backend/ml/train_model.py first.")
            cls._model = joblib.load(MODEL_PATH)
            cls._scaler = joblib.load(SCALER_PATH)
            cls._feature_columns = joblib.load(COLUMNS_PATH)

    @classmethod
    def predict(cls, user_id, weather_data):
        cls._load_artifacts()

        # Map RainYesterday string -> int if needed
        rain_yesterday = weather_data.get('RainYesterday', 'No')
        if isinstance(rain_yesterday, str):
            rain_yesterday = 1 if rain_yesterday.lower() == 'yes' else 0

        # Build input dict with only the trained feature columns
        input_dict = {}
        for col in cls._feature_columns:
            if col == 'RainYesterday':
                input_dict[col] = rain_yesterday
            else:
                val = weather_data.get(col)
                if val is None:
                    raise ValueError(f"Missing required field: {col}")
                input_dict[col] = float(val)

        # Create DataFrame in exact feature order
        input_df = pd.DataFrame([input_dict], columns=cls._feature_columns)

        # Scale
        input_scaled = cls._scaler.transform(input_df)

        # Predict
        prediction_int = cls._model.predict(input_scaled)[0]
        probabilities  = cls._model.predict_proba(input_scaled)[0]
        confidence     = float(max(probabilities)) * 100
        prediction_str = 'Yes' if prediction_int == 1 else 'No'

        # Generate AI explanation (Gemini or rule-based fallback)
        ai_explanation = generate_ai_explanation(weather_data, prediction_str, confidence)

        # Persist to DB
        predictions_col = get_predictions_collection()
        record = {
            "userId":        ObjectId(user_id),
            "inputs":        weather_data,
            "prediction":    prediction_str,
            "confidence":    confidence,
            "ai_explanation": ai_explanation,
            "timestamp":     datetime.utcnow()
        }
        predictions_col.insert_one(record)

        return {
            "_id":            str(record["_id"]),
            "userId":         str(record["userId"]),
            "inputs":         weather_data,
            "prediction":     prediction_str,
            "confidence":     confidence,
            "ai_explanation": ai_explanation,
            "timestamp":      record["timestamp"].isoformat()
        }

    @classmethod
    def get_history(cls, user_id):
        predictions_col = get_predictions_collection()
        history = list(
            predictions_col.find({"userId": ObjectId(user_id)}).sort("timestamp", -1)
        )
        for item in history:
            item["_id"]    = str(item["_id"])
            item["userId"] = str(item["userId"])
            if isinstance(item.get("timestamp"), datetime):
                item["timestamp"] = item["timestamp"].isoformat()
        return history

    @classmethod
    def delete_history(cls, prediction_id, user_id):
        predictions_col = get_predictions_collection()
        res = predictions_col.delete_one({
            "_id":    ObjectId(prediction_id),
            "userId": ObjectId(user_id)
        })
        return res.deleted_count > 0
