import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

ai_bp = Blueprint('ai', __name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Initialize Gemini
try:
    if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")
        print("[AI System] Gemini API initialized successfully with gemini-2.5-flash")
    else:
        model = None
        print("[AI System] Warning: GEMINI_API_KEY is not set or invalid.")
except Exception as e:
    model = None
    print(f"[AI System] Failed to initialize Gemini: {e}")


@ai_bp.route('/chat', methods=['POST'])
@jwt_required()
def ai_chat():
    """AI weather chat assistant powered by Gemini 2.0 Flash."""
    data = request.get_json()
    message = data.get("message", "").strip()
    context = data.get("context", {})
    language = data.get("language", "en")

    if not message:
        return jsonify({"error": "No message provided"}), 400

    if not model:
        return jsonify({
            "reply": "AI Error: Gemini API key not configured or model failed to initialize. Please check backend/.env."
        }), 503

    # Build rich weather context string
    ctx_parts = []
    if context.get("prediction"):
        ctx_parts.append(f"Rainfall Prediction: {context['prediction']} (Yes = rain expected, No = dry)")
    if context.get("confidence"):
        ctx_parts.append(f"Model Confidence: {float(context['confidence']):.1f}%")
    if context.get("humidity"):
        ctx_parts.append(f"Average Humidity: {context['humidity']}%")
    if context.get("pressure"):
        ctx_parts.append(f"Atmospheric Pressure: {context['pressure']} hPa")
    if context.get("wind"):
        ctx_parts.append(f"Wind Gust Speed: {context['wind']} km/h")
    if context.get("cloud"):
        ctx_parts.append(f"Cloud Cover: {context['cloud']} oktas")
    if context.get("sunshine"):
        ctx_parts.append(f"Sunshine Hours: {context['sunshine']} hrs")
    if context.get("temp_max"):
        ctx_parts.append(f"Max Temperature: {context['temp_max']}°C")
    if context.get("ai_summary"):
        ctx_parts.append(f"AI Summary: {context['ai_summary']}")

    ctx_str = "\n".join(ctx_parts) if ctx_parts else "No prediction data available."

    lang_instruction = {
        "hi": "Respond in Hindi (हिंदी).",
        "mr": "Respond in Marathi (मराठी).",
        "ur": "Respond in Urdu (اردو).",
        "ar": "Respond in Arabic (العربية).",
    }.get(language, "Respond in English.")

    prompt = f"""You are RainAI, an expert AI weather assistant. You have access to the user's current weather prediction data. Answer the user's question naturally, conversationally, and helpfully.

CURRENT WEATHER PREDICTION DATA:
{ctx_str}

USER QUESTION: {message}

INSTRUCTIONS:
- {lang_instruction}
- Answer in 2-3 sentences maximum
- Be specific — reference actual numbers from the prediction data when relevant
- Sound like a knowledgeable meteorologist, not a robot
- Give practical, actionable advice
- If no prediction data is available, answer based on general weather knowledge
- Never say "I don't have data" — always give a useful answer"""

    print("\n" + "="*40)
    print(f"[AI Chat] Incoming prompt:\n{prompt}")
    print("="*40 + "\n")

    try:
        # Call Gemini SDK
        response = model.generate_content(prompt)
        reply = response.text.strip()
        print(f"[AI Chat] Reply generated successfully: {reply[:50]}...")
        return jsonify({"reply": reply}), 200
    except Exception as e:
        error_msg = str(e)
        print(f"[AI Chat] Gemini Error: {error_msg}")
        return jsonify({
            "reply": f"AI Error: {error_msg}"
        }), 503
