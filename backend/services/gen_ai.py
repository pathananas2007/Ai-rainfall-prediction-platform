import os
import sys
import json
import urllib.request
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY
)

# ── Feature importance weights (derived from Random Forest training) ──────────
FEATURE_WEIGHTS = {
    "Humidity":  0.28,
    "Pressure":  0.22,
    "Cloud":     0.18,
    "Sunshine":  0.14,
    "Wind":      0.10,
    "Temp":      0.08,
}

# Track API key validity
_gemini_api_valid = None

def validate_gemini_api_key():
    """
    Validate Gemini API key by making a test request.
    Returns True if valid, False otherwise.
    """
    global _gemini_api_valid
    
    if _gemini_api_valid is not None:
        return _gemini_api_valid
    
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        print("⚠️  WARNING: Gemini API key not configured. AI explanations will use fallback system.")
        _gemini_api_valid = False
        return False
    
    try:
        test_payload = json.dumps({
            "contents": [{"parts": [{"text": "test"}]}],
            "generationConfig": {"temperature": 0.5, "maxOutputTokens": 10}
        }).encode("utf-8")
        
        req = urllib.request.Request(
            GEMINI_URL, data=test_payload,
            headers={"Content-Type": "application/json"}, method="POST"
        )
        
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if "candidates" in data and len(data["candidates"]) > 0:
                print("✅ Gemini API key validated successfully")
                _gemini_api_valid = True
                return True
    except urllib.error.HTTPError as e:
        if e.code == 401 or e.code == 403:
            print("❌ ERROR: Invalid Gemini API key (401/403). Please check GEMINI_API_KEY in .env")
            _gemini_api_valid = False
            return False
        elif e.code == 429:
            print("⚠️  WARNING: Gemini API rate limited. This is normal for test calls.")
            _gemini_api_valid = True
            return True
    except Exception as e:
        print(f"⚠️  WARNING: Could not validate Gemini API key: {e}. Will use fallback system.")
        _gemini_api_valid = False
        return False
    
    _gemini_api_valid = False
    return False

def is_gemini_available():
    """Check if Gemini API is available (cached result)"""
    if _gemini_api_valid is None:
        validate_gemini_api_key()
    return _gemini_api_valid

def _call_gemini(prompt: str, max_tokens: int = 700) -> str:
    if not is_gemini_available():
        raise ValueError("Gemini API not available")
    
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.75, "maxOutputTokens": max_tokens}
    }).encode("utf-8")
    req = urllib.request.Request(
        GEMINI_URL, data=payload,
        headers={"Content-Type": "application/json"}, method="POST"
    )
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode("utf-8"))
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()


def _parse_json(raw: str) -> dict:
    raw = raw.strip()
    if raw.startswith("```"):
        parts = raw.split("```")
        raw = parts[1] if len(parts) > 1 else raw
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


def _compute_feature_importance(weather_data: dict) -> dict:
    """Compute approximate feature influence scores (0-100)."""
    avg_humidity = (float(weather_data.get("Humidity9am", 60)) +
                    float(weather_data.get("Humidity3pm", 60))) / 2
    avg_pressure = (float(weather_data.get("Pressure9am", 1013)) +
                    float(weather_data.get("Pressure3pm", 1013))) / 2
    avg_cloud    = (float(weather_data.get("Cloud9am", 4)) +
                    float(weather_data.get("Cloud3pm", 4))) / 2
    sunshine     = float(weather_data.get("Sunshine", 6))
    wind         = float(weather_data.get("WindGustSpeed", 30))
    max_temp     = float(weather_data.get("MaxTemp", 25))
    min_temp     = float(weather_data.get("MinTemp", 15))

    # Normalize each factor to 0-1 scale then weight
    h_score = min(avg_humidity / 100, 1.0)
    p_score = max(0, (1020 - avg_pressure) / 30)  # lower pressure = higher score
    c_score = min(avg_cloud / 8, 1.0)
    s_score = max(0, (10 - sunshine) / 10)         # less sunshine = higher score
    w_score = min(wind / 80, 1.0)
    t_score = min(abs(max_temp - min_temp) / 20, 1.0)

    raw = {
        "Humidity":  round(h_score * FEATURE_WEIGHTS["Humidity"] * 100 + 5),
        "Pressure":  round(p_score * FEATURE_WEIGHTS["Pressure"] * 100 + 5),
        "Cloud":     round(c_score * FEATURE_WEIGHTS["Cloud"]    * 100 + 3),
        "Sunshine":  round(s_score * FEATURE_WEIGHTS["Sunshine"] * 100 + 3),
        "Wind":      round(w_score * FEATURE_WEIGHTS["Wind"]     * 100 + 2),
        "Temp":      round(t_score * FEATURE_WEIGHTS["Temp"]     * 100 + 2),
    }
    # Normalize to sum to 100
    total = sum(raw.values())
    return {k: round(v / total * 100) for k, v in raw.items()}


def generate_ai_explanation(weather_data: dict, prediction: str, confidence: float) -> dict:
    """Generate AI explanation using Gemini, with intelligent fallback."""
    feature_importance = _compute_feature_importance(weather_data)

    is_rain = prediction == "Yes"
    avg_humidity = (float(weather_data.get("Humidity9am", 60)) +
                    float(weather_data.get("Humidity3pm", 60))) / 2
    avg_pressure = (float(weather_data.get("Pressure9am", 1013)) +
                    float(weather_data.get("Pressure3pm", 1013))) / 2
    avg_cloud    = (float(weather_data.get("Cloud9am", 4)) +
                    float(weather_data.get("Cloud3pm", 4))) / 2
    wind         = float(weather_data.get("WindGustSpeed", 30))
    sunshine     = float(weather_data.get("Sunshine", 6))
    max_temp     = float(weather_data.get("MaxTemp", 25))
    min_temp     = float(weather_data.get("MinTemp", 15))

    prompt = f"""You are RainAI, a world-class AI weather intelligence assistant. Analyze the weather data below and generate a natural, conversational, human-friendly explanation of the rainfall prediction.

PREDICTION: {"Rain expected tomorrow" if is_rain else "No significant rain tomorrow"}
CONFIDENCE: {confidence:.1f}%

WEATHER DATA:
- Humidity (avg): {avg_humidity:.0f}%
- Atmospheric Pressure (avg): {avg_pressure:.1f} hPa
- Cloud Cover (avg): {avg_cloud:.1f}/8 oktas
- Wind Gust Speed: {wind:.0f} km/h
- Sunshine Hours: {sunshine:.1f} hrs
- Max Temperature: {max_temp:.1f}°C
- Min Temperature: {min_temp:.1f}°C

FEATURE IMPORTANCE (how much each factor influenced the prediction):
- Humidity: {feature_importance['Humidity']}%
- Pressure: {feature_importance['Pressure']}%
- Cloud Cover: {feature_importance['Cloud']}%
- Sunshine: {feature_importance['Sunshine']}%
- Wind: {feature_importance['Wind']}%
- Temperature: {feature_importance['Temp']}%

Respond ONLY with a valid JSON object (no markdown, no code blocks):
{{
  "summary": "One compelling sentence summarizing the weather outlook naturally",
  "explanation": "2-3 sentences explaining WHY this prediction was made. Mention specific numbers. Sound like a real meteorologist, not a robot.",
  "confidence_reason": "One sentence explaining what {confidence:.0f}% confidence means for this specific prediction",
  "recommendations": ["specific action 1", "specific action 2", "specific action 3"],
  "thinking_steps": ["step 1 of AI analysis", "step 2", "step 3", "step 4"]
}}

Rules:
- Sound conversational and intelligent
- Vary sentence structure — avoid repetitive patterns
- Mention specific numbers naturally
- thinking_steps should show the AI reasoning process (e.g. "Analyzing humidity at 82%...")
- Keep each recommendation under 10 words
- Do NOT use bullet points inside JSON strings"""

    try:
        raw = _call_gemini(prompt)
        result = _parse_json(raw)
        for key in ("summary", "explanation", "confidence_reason", "recommendations"):
            if key not in result:
                raise ValueError(f"Missing key: {key}")
        if "thinking_steps" not in result:
            result["thinking_steps"] = _default_thinking_steps(weather_data)
        result["feature_importance"] = feature_importance
        return result
    except Exception as e:
        print(f"[GenAI] Gemini failed: {e} — using fallback")
        return _rule_based_fallback(weather_data, prediction, confidence, feature_importance)


def _default_thinking_steps(weather_data: dict) -> list:
    avg_humidity = (float(weather_data.get("Humidity9am", 60)) +
                    float(weather_data.get("Humidity3pm", 60))) / 2
    avg_pressure = (float(weather_data.get("Pressure9am", 1013)) +
                    float(weather_data.get("Pressure3pm", 1013))) / 2
    avg_cloud    = (float(weather_data.get("Cloud9am", 4)) +
                    float(weather_data.get("Cloud3pm", 4))) / 2
    wind         = float(weather_data.get("WindGustSpeed", 30))
    return [
        f"Analyzing humidity levels at {avg_humidity:.0f}%...",
        f"Evaluating atmospheric pressure at {avg_pressure:.0f} hPa...",
        f"Assessing cloud cover at {avg_cloud:.1f} oktas...",
        f"Measuring wind patterns at {wind:.0f} km/h...",
        "Running Random Forest prediction model...",
        "Generating intelligent weather insights...",
    ]


def _rule_based_fallback(weather_data: dict, prediction: str, confidence: float,
                          feature_importance: dict = None) -> dict:
    """High-quality rule-based fallback."""
    is_rain = prediction == "Yes"
    avg_humidity = (float(weather_data.get("Humidity9am", 60)) +
                    float(weather_data.get("Humidity3pm", 60))) / 2
    avg_pressure = (float(weather_data.get("Pressure9am", 1013)) +
                    float(weather_data.get("Pressure3pm", 1013))) / 2
    avg_cloud    = (float(weather_data.get("Cloud9am", 4)) +
                    float(weather_data.get("Cloud3pm", 4))) / 2
    wind         = float(weather_data.get("WindGustSpeed", 30))
    sunshine     = float(weather_data.get("Sunshine", 6))

    if feature_importance is None:
        feature_importance = _compute_feature_importance(weather_data)

    # Summary
    if is_rain:
        if confidence >= 85:
            summary = f"Strong atmospheric signals point to rainfall tomorrow, with the model registering {confidence:.0f}% confidence based on converging weather indicators."
        elif confidence >= 65:
            summary = f"Multiple weather factors suggest rainfall is likely tomorrow, with a {confidence:.0f}% confidence reading from the prediction model."
        else:
            summary = f"Atmospheric conditions show mixed signals, with a {confidence:.0f}% probability of rainfall — conditions remain somewhat uncertain."
    else:
        if confidence >= 85:
            summary = f"Weather patterns indicate stable, dry conditions tomorrow, with the AI model showing {confidence:.0f}% confidence of no significant rainfall."
        else:
            summary = f"Atmospheric indicators lean toward dry conditions tomorrow, though the {confidence:.0f}% confidence suggests some uncertainty remains."

    # Explanation
    factors = []
    if avg_humidity > 75:
        factors.append(f"humidity is elevated at {avg_humidity:.0f}%, saturating the air with moisture that actively supports precipitation")
    elif avg_humidity < 45:
        factors.append(f"humidity is notably low at {avg_humidity:.0f}%, pointing to dry, stable atmospheric conditions")
    if avg_pressure < 1005:
        factors.append(f"atmospheric pressure has dropped to {avg_pressure:.0f} hPa — a classic precursor to unstable, rainy weather")
    elif avg_pressure > 1015:
        factors.append(f"high pressure at {avg_pressure:.0f} hPa is actively suppressing cloud formation and rainfall")
    if avg_cloud > 5:
        factors.append(f"dense cloud cover of {avg_cloud:.1f} oktas is trapping moisture and reducing solar heating")
    elif avg_cloud < 2:
        factors.append(f"clear skies with minimal cloud cover ({avg_cloud:.1f} oktas) indicate settled, dry conditions")
    if sunshine < 4:
        factors.append(f"only {sunshine:.1f} hours of sunshine suggests persistent overcast conditions")
    elif sunshine > 8:
        factors.append(f"strong sunshine of {sunshine:.1f} hours confirms clear, dry atmospheric conditions")
    if wind > 55:
        factors.append(f"powerful wind gusts of {wind:.0f} km/h signal an active weather system approaching")

    if factors:
        explanation = f"The prediction is primarily driven by the fact that {factors[0]}"
        if len(factors) > 1:
            explanation += f", while {factors[1]}"
        if len(factors) > 2:
            explanation += f". Furthermore, {factors[2]}"
        explanation += "."
    else:
        explanation = ("The model evaluated a balanced set of atmospheric conditions. "
                       "Temperature gradients, wind patterns, and moisture levels all contributed "
                       "to this prediction without any single dominant factor.")

    # Confidence reason
    if confidence >= 90:
        conf_reason = f"At {confidence:.0f}%, the model has extremely high certainty — nearly all weather indicators are aligned and pointing in the same direction."
    elif confidence >= 75:
        conf_reason = f"The {confidence:.0f}% confidence reflects strong agreement among the key weather indicators, giving the model solid predictive footing."
    elif confidence >= 55:
        conf_reason = f"Moderate confidence of {confidence:.0f}% means the dominant signals support this prediction, but a few atmospheric factors remain ambiguous."
    else:
        conf_reason = f"At {confidence:.0f}% confidence, the atmospheric picture is genuinely mixed — the model sees competing signals that reduce certainty."

    # Recommendations
    if is_rain and confidence >= 75:
        recommendations = ["Carry an umbrella before heading out", "Allow extra travel time for wet roads",
                           "Secure outdoor furniture tonight"]
    elif is_rain:
        recommendations = ["Keep an umbrella handy just in case", "Monitor weather updates during the day",
                           "Check local alerts for changes"]
    elif confidence >= 75:
        recommendations = ["Great day for outdoor activities", "Ideal conditions for sports or gardening",
                           "No rain gear needed today"]
    else:
        recommendations = ["Weather looks mostly clear today", "Light jacket useful if temperatures drop",
                           "Check forecast again in the morning"]

    return {
        "summary": summary,
        "explanation": explanation,
        "confidence_reason": conf_reason,
        "recommendations": recommendations,
        "feature_importance": feature_importance,
        "thinking_steps": _default_thinking_steps(weather_data),
    }
