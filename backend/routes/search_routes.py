from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from backend.database.db import get_db
from bson import ObjectId
from flask_jwt_extended import jwt_required, get_jwt_identity

search_bp = Blueprint('search', __name__)

def calculate_relevance_score(item, query, query_words):
    """Calculate relevance score for search results"""
    score = 0
    title_lower = str(item.get("title", "")).lower()
    desc_lower = str(item.get("description", "")).lower()
    tags_str = " ".join(item.get("tags", [])).lower() if item.get("tags") else ""
    
    # Exact phrase match (highest priority)
    if query in title_lower:
        score += 100
    if query in desc_lower:
        score += 50
    if query in tags_str:
        score += 30
    
    # Individual word matches
    for word in query_words:
        if word in title_lower:
            score += 20
        if word in desc_lower:
            score += 10
        if word in tags_str:
            score += 5
    
    # Boost recent items
    if "timestamp" in item:
        try:
            days_old = (datetime.utcnow() - item["timestamp"]).days
            score += max(0, 30 - days_old)
        except:
            pass
    
    return score

def _get_predictions_from_db(user_id, query_words, query_lower):
    """Search predictions in database"""
    predictions_collection = get_db()['predictions']
    try:
        user_oid = ObjectId(user_id)
    except:
        user_oid = user_id
    
    # Search predictions by weather data or prediction result
    results = []
    try:
        predictions = predictions_collection.find({"user_id": user_oid}).sort("timestamp", -1).limit(100)
        for pred in predictions:
            pred_text = str(pred.get("prediction_result", "")) + " " + str(pred.get("confidence", ""))
            
            # Match logic
            if query_lower in pred_text.lower() or any(w in pred_text.lower() for w in query_words):
                item = {
                    "id": str(pred.get("_id", "")),
                    "category": "Predictions",
                    "title": f"Prediction: {pred.get('prediction_result', 'Unknown')}",
                    "description": f"Confidence: {pred.get('confidence', 0):.0f}% - {pred.get('timestamp', datetime.utcnow()).strftime('%Y-%m-%d')}",
                    "timestamp": pred.get("timestamp", datetime.utcnow()),
                    "tags": ["rain"] if "rain" in pred.get('prediction_result', '').lower() else ["no-rain"]
                }
                results.append(item)
    except Exception as e:
        print(f"Error searching predictions: {e}")
    
    return results

def _get_chat_history_from_db(user_id, query_words, query_lower):
    """Search chat history in database"""
    # Note: Implement if chat history is stored in DB
    # For now return empty as it's not fully implemented
    return []

@search_bp.route('/', methods=['GET'])
@jwt_required()
def smart_search():
    user_id = get_jwt_identity()
    query = request.args.get('q', '').lower().strip()
    category_filter = request.args.get('category', '').strip()
    sort_by = request.args.get('sort', 'relevance')  # relevance, date, title
    date_filter = request.args.get('date', '')  # today, week, month, all
    
    if not query or len(query) < 2:
        return jsonify({"results": {}, "total": 0, "filters": {}}), 200

    query_words = [w for w in query.split() if len(w) > 1]
    now = datetime.utcnow()
    
    # Collect results from different sources
    all_results = []
    
    # 1. Search predictions from database
    if not category_filter or category_filter.lower() == "predictions":
        all_results.extend(_get_predictions_from_db(user_id, query_words, query))
    
    # 2. Search chat history (if implemented)
    if not category_filter or category_filter.lower() == "chat history":
        all_results.extend(_get_chat_history_from_db(user_id, query_words, query))
    
    # 3. Generate dynamic insights from user's data
    if not category_filter or category_filter.lower() == "ai insights":
        try:
            predictions_collection = get_db()['predictions']
            try:
                user_oid = ObjectId(user_id)
            except:
                user_oid = user_id
            
            user_predictions = list(predictions_collection.find({"user_id": user_oid}).sort("timestamp", -1).limit(5))
            
            if user_predictions:
                rain_count = sum(1 for p in user_predictions if "rain" in str(p.get('prediction_result', '')).lower())
                if rain_count >= 3 or query_lower in "rain trend pattern":
                    all_results.append({
                        "id": "insight_rain_trend",
                        "category": "AI Insights",
                        "title": "Rain Pattern Analysis",
                        "description": f"High frequency of rain predictions ({rain_count}/{len(user_predictions)} recent)",
                        "timestamp": now,
                        "tags": ["rain", "pattern", "analysis"]
                    })
                
                avg_confidence = sum(p.get('confidence', 0) for p in user_predictions) / len(user_predictions)
                if query_lower in "confidence accuracy":
                    all_results.append({
                        "id": "insight_confidence",
                        "category": "AI Insights",
                        "title": "Confidence Score Analysis",
                        "description": f"Average confidence: {avg_confidence:.1f}% from recent predictions",
                        "timestamp": now,
                        "tags": ["confidence", "accuracy", "metrics"]
                    })
        except Exception as e:
            print(f"Error generating insights: {e}")
    
    # Apply date filter
    if date_filter:
        filtered_results = []
        for item in all_results:
            if date_filter == 'today' and (now - item["timestamp"]).days == 0:
                filtered_results.append(item)
            elif date_filter == 'week' and (now - item["timestamp"]).days <= 7:
                filtered_results.append(item)
            elif date_filter == 'month' and (now - item["timestamp"]).days <= 30:
                filtered_results.append(item)
            elif date_filter == 'all':
                filtered_results.append(item)
        all_results = filtered_results if filtered_results else all_results
    
    # Calculate relevance scores for all results
    for item in all_results:
        item["relevance_score"] = calculate_relevance_score(item, query, query_words)
    
    # Sort results
    if sort_by == 'relevance':
        all_results.sort(key=lambda x: x["relevance_score"], reverse=True)
    elif sort_by == 'date':
        all_results.sort(key=lambda x: x["timestamp"], reverse=True)
    elif sort_by == 'title':
        all_results.sort(key=lambda x: x["title"].lower())
    
    # Group results by category
    grouped_results = {}
    for item in all_results:
        cat = item["category"]
        if cat not in grouped_results:
            grouped_results[cat] = []
        grouped_results[cat].append({
            "id": item["id"],
            "title": item["title"],
            "description": item["description"],
            "timestamp": item["timestamp"].isoformat(),
            "tags": item.get("tags", []),
            "relevance": item["relevance_score"]
        })
    
    # Get available categories
    available_categories = list(set(item["category"] for item in all_results))
    if not available_categories:
        available_categories = ["Predictions", "AI Insights", "Chat History"]
    
    return jsonify({
        "results": grouped_results,
        "total": len(all_results),
        "query": query,
        "filters": {
            "categories": available_categories,
            "applied_category": category_filter,
            "applied_date": date_filter,
            "sort_by": sort_by
        }
    }), 200

