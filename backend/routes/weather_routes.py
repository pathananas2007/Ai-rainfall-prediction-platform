import os
import json
import urllib.request
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

weather_bp = Blueprint('weather', __name__)

OPENWEATHER_KEY = os.getenv("OPENWEATHER_API_KEY", "")
GEMINI_API_KEY  = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY
)


def _call_gemini(prompt: str) -> str:
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 400}
    }).encode("utf-8")
    req = urllib.request.Request(
        GEMINI_URL, data=payload,
        headers={"Content-Type": "application/json"}, method="POST"
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()


@weather_bp.route('/current', methods=['GET'])
@jwt_required()
def get_current_weather():
    """Fetch real weather for a city using OpenWeatherMap."""
    city = request.args.get('city', 'Sydney')
    if not OPENWEATHER_KEY:
        # Return mock data if no API key
        return jsonify({
            "city": city,
            "temp": 22,
            "humidity": 68,
            "description": "Partly cloudy",
            "icon": "02d",
            "wind_speed": 15,
            "pressure": 1012,
            "mock": True
        }), 200
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_KEY}&units=metric"
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        return jsonify({
            "city": data["name"],
            "temp": round(data["main"]["temp"], 1),
            "humidity": data["main"]["humidity"],
            "description": data["weather"][0]["description"].title(),
            "icon": data["weather"][0]["icon"],
            "wind_speed": round(data["wind"]["speed"] * 3.6, 1),
            "pressure": data["main"]["pressure"],
            "mock": False
        }), 200
    except Exception as e:
        print(f"[Weather API Error] {e}")
        return jsonify({
            "city": city,
            "temp": 22,
            "humidity": 68,
            "description": "Partly cloudy",
            "icon": "02d",
            "wind_speed": 15,
            "pressure": 1012,
            "mock": True
        }), 200





@weather_bp.route('/coords', methods=['GET'])
@jwt_required()
def get_weather_by_coords():
    """Fetch weather by latitude/longitude coordinates."""
    lat = request.args.get('lat', '')
    lon = request.args.get('lon', '')

    if not lat or not lon:
        return jsonify({"error": "lat and lon required"}), 400

    if not OPENWEATHER_KEY or OPENWEATHER_KEY == "your_openweather_key_here":
        return jsonify({
            "city": "Your Location",
            "temp": 22,
            "humidity": 68,
            "description": "Partly cloudy",
            "icon": "02d",
            "wind_speed": 15,
            "pressure": 1012,
            "mock": True
        }), 200

    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_KEY}&units=metric"
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        return jsonify({
            "city": data.get("name", "Your Location"),
            "temp": round(data["main"]["temp"], 1),
            "humidity": data["main"]["humidity"],
            "description": data["weather"][0]["description"].title(),
            "icon": data["weather"][0]["icon"],
            "wind_speed": round(data["wind"]["speed"] * 3.6, 1),
            "pressure": data["main"]["pressure"],
            "mock": False
        }), 200
    except Exception as e:
        print(f"[Weather API Error] {e}")
        return jsonify({
            "city": "Your Location",
            "temp": 22,
            "humidity": 68,
            "description": "Partly cloudy",
            "icon": "02d",
            "wind_speed": 15,
            "pressure": 1012,
            "mock": True
        }), 200
