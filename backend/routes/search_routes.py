from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import re

search_bp = Blueprint('search', __name__)

def calculate_relevance_score(item, query, query_words):
    """Calculate relevance score for search results"""
    score = 0
    title_lower = item["title"].lower()
    desc_lower = item["description"].lower()
    
    # Exact phrase match (highest priority)
    if query in title_lower:
        score += 100
    if query in desc_lower:
        score += 50
    
    # Individual word matches
    for word in query_words:
        if word in title_lower:
            score += 20
        if word in desc_lower:
            score += 10
    
    # Boost recent items
    if "timestamp" in item:
        days_old = (datetime.now() - item["timestamp"]).days
        score += max(0, 30 - days_old)
    
    return score

@search_bp.route('/', methods=['GET'])
def smart_search():
    query = request.args.get('q', '').lower().strip()
    category_filter = request.args.get('category', '').strip()
    sort_by = request.args.get('sort', 'relevance')  # relevance, date, title
    date_filter = request.args.get('date', '')  # today, week, month, all
    
    if not query or len(query) < 2:
        return jsonify({"results": {}, "total": 0, "filters": {}}), 200

    # Enhanced mock data with timestamps and tags
    now = datetime.now()
    all_mock_data = [
        {"id": "p1", "category": "Predictions", "title": "Heavy rain tomorrow", "description": "Confidence: 82% - based on high humidity", "timestamp": now - timedelta(hours=2), "tags": ["rain", "high-confidence"]},
        {"id": "p2", "category": "Predictions", "title": "High Confidence Rain", "description": "Prediction from yesterday", "timestamp": now - timedelta(days=1), "tags": ["rain", "high-confidence"]},
        {"id": "p3", "category": "Predictions", "title": "Clear skies predicted", "description": "No rain expected for next 5 days", "timestamp": now - timedelta(hours=5), "tags": ["clear", "no-rain"]},
        {"id": "a1", "category": "Weather Analytics", "title": "May Weather Analytics", "description": "Monthly summary report showing wet trends", "timestamp": now - timedelta(days=2), "tags": ["analytics", "monthly"]},
        {"id": "a2", "category": "Weather Analytics", "title": "Humidity Spikes", "description": "Analytics report on rising humidity levels", "timestamp": now - timedelta(hours=12), "tags": ["humidity", "analytics"]},
        {"id": "a3", "category": "Weather Analytics", "title": "Temperature Trends", "description": "Analysis of temperature patterns over the week", "timestamp": now - timedelta(days=3), "tags": ["temperature", "trends"]},
        {"id": "i1", "category": "AI Insights", "title": "Storm Analysis", "description": "AI generated summary: Unstable atmospheric conditions detected", "timestamp": now - timedelta(hours=8), "tags": ["storm", "ai", "warning"]},
        {"id": "i2", "category": "AI Insights", "title": "Dry Spell Expected", "description": "AI insight: No rain predicted for next 3 days", "timestamp": now - timedelta(days=1), "tags": ["dry", "ai"]},
        {"id": "i3", "category": "AI Insights", "title": "Pressure System Analysis", "description": "Low pressure system moving in from the west", "timestamp": now - timedelta(hours=4), "tags": ["pressure", "ai"]},
        {"id": "c1", "category": "Chat History", "title": "Why is confidence low?", "description": "Conversation from yesterday about model confidence", "timestamp": now - timedelta(days=1), "tags": ["chat", "confidence"]},
        {"id": "c2", "category": "Chat History", "title": "Explain humidity", "description": "Conversation about humidity effects", "timestamp": now - timedelta(hours=6), "tags": ["chat", "humidity"]},
        {"id": "c3", "category": "Chat History", "title": "Rain prediction accuracy", "description": "Discussion about prediction accuracy rates", "timestamp": now - timedelta(hours=10), "tags": ["chat", "accuracy"]},
        {"id": "n1", "category": "Notifications", "title": "Rain probability increased", "description": "Alert from 2 hours ago", "timestamp": now - timedelta(hours=2), "tags": ["alert", "rain"]},
        {"id": "n2", "category": "Notifications", "title": "Weather warning issued", "description": "Severe weather alert for your area", "timestamp": now - timedelta(hours=1), "tags": ["alert", "warning"]},
    ]

    # Apply date filter
    if date_filter:
        filtered_data = []
        for item in all_mock_data:
            if date_filter == 'today' and (now - item["timestamp"]).days == 0:
                filtered_data.append(item)
            elif date_filter == 'week' and (now - item["timestamp"]).days <= 7:
                filtered_data.append(item)
            elif date_filter == 'month' and (now - item["timestamp"]).days <= 30:
                filtered_data.append(item)
            elif date_filter == 'all':
                filtered_data.append(item)
        all_mock_data = filtered_data if filtered_data else all_mock_data

    # Apply category filter
    if category_filter:
        all_mock_data = [item for item in all_mock_data if item["category"].lower() == category_filter.lower()]

    query_words = [w for w in query.split() if len(w) > 1]
    matched_items = []

    for item in all_mock_data:
        # Enhanced matching with relevance scoring
        title_lower = item["title"].lower()
        desc_lower = item["description"].lower()
        tags_str = " ".join(item.get("tags", [])).lower()
        
        # Check if query matches
        if (query in title_lower or query in desc_lower or query in tags_str or
            any(word in title_lower or word in desc_lower or word in tags_str for word in query_words)):
            
            score = calculate_relevance_score(item, query, query_words)
            matched_items.append({**item, "relevance_score": score})

    # Sort results
    if sort_by == 'relevance':
        matched_items.sort(key=lambda x: x["relevance_score"], reverse=True)
    elif sort_by == 'date':
        matched_items.sort(key=lambda x: x["timestamp"], reverse=True)
    elif sort_by == 'title':
        matched_items.sort(key=lambda x: x["title"].lower())

    # Group results by category
    grouped_results = {}
    for item in matched_items:
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

    # Get available categories for filtering
    available_categories = list(set(item["category"] for item in all_mock_data))
    
    return jsonify({
        "results": grouped_results,
        "total": len(matched_items),
        "query": query,
        "filters": {
            "categories": available_categories,
            "applied_category": category_filter,
            "applied_date": date_filter,
            "sort_by": sort_by
        }
    }), 200
