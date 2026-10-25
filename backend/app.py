"""
ARKA-ASSIST — Backend REST API Entrypoint
Flask REST API with Scikit-Learn ML Inference and Multimodal Decision Services.
A Multimodal AI-Based Farm Intelligence and Decision Support System.
"""

import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS

# Configure UTF-8 standard output for Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from config import Config
from services.crop_service import CropService
from services.disease_service import DiseaseService
from services.weather_service import WeatherService
from services.scheme_service import SchemeService
from services.chatbot_service import ChatbotService
from services.voice_service import VoiceService
from services.thermal_service import ThermalService
from services.multimodal_analysis import MultimodalAnalysisEngine
from services.daily_analysis import DailyAnalysisService
from services.market_service import MarketService
from services.sell_decision import SellDecisionEngine
from services.marketplace_service import MarketplaceService
from services.buyer_matching import BuyerMatchingService
from services.farm_health_service import FarmHealthService
from services.farm_twin import FarmTwinService

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize all core AI and multimodal decision services
print("[Arka-assist Backend] Initializing core AI, thermal, multimodal, and decision services...")
crop_service = CropService()
disease_service = DiseaseService()
weather_service = WeatherService()
scheme_service = SchemeService()
chatbot_service = ChatbotService()
voice_service = VoiceService()
thermal_service = ThermalService()
multimodal_engine = MultimodalAnalysisEngine()
daily_service = DailyAnalysisService()
market_service = MarketService()
sell_decision_engine = SellDecisionEngine()
marketplace_service = MarketplaceService()
buyer_matching_service = BuyerMatchingService()
farm_health_service = FarmHealthService()
farm_twin_service = FarmTwinService()
print("[Arka-assist Backend] All modular services initialized successfully.")

# ----------------------------------------------------
# 1. Health & Status Endpoint
# ----------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "online",
        "system": "Arka-assist Backend Decision Engine",
        "title": "Arka-assist — A Multimodal AI-Based Farm Intelligence and Decision Support System",
        "version": "2.0.0",
        "offline_ready": True
    }), 200

# ----------------------------------------------------
# 2. Authentication Endpoint (Demo Login)
# ----------------------------------------------------
@app.route("/api/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json(force=True, silent=True) or {}
        username = data.get("username", "").strip()
        password = data.get("password", "").strip()
        is_demo = data.get("is_demo", False)

        valid_passwords = ["arka-assist", "arkaassist"]

        if is_demo or (username.lower() == "farmer" and password.lower() in valid_passwords):
            return jsonify({
                "success": True,
                "message": "Login successful",
                "user": {
                    "username": "farmer",
                    "name": "VSBCETC [CSE PROJECT]",
                    "role": "Farmer & Agronomist",
                    "location": "Coimbatore, Tamil Nadu",
                    "preferred_language": "en",
                    "primary_crop": "Rice (Paddy)",
                    "farm_size": "4.5 Acres",
                    "soil_type": "Clay Loam",
                    "active_parcels": 4
                },
                "token": "arka_assist_session_token_xyz"
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": "Invalid credentials. Use demo login or username: 'farmer', password: 'arka-assist'"
            }), 401
    except Exception as e:
        return jsonify({"success": False, "error": f"Login error: {str(e)}"}), 500

# ----------------------------------------------------
# 3. Crop Recommendation Endpoint (ML Inference)
# ----------------------------------------------------
@app.route("/api/recommend-crop", methods=["POST"])
def recommend_crop():
    try:
        data = request.get_json(force=True, silent=True) or {}
        n = data.get("n", 80)
        p = data.get("p", 45)
        k = data.get("k", 40)
        temperature = data.get("temperature", 26.0)
        humidity = data.get("humidity", 75.0)
        ph = data.get("ph", 6.5)
        rainfall = data.get("rainfall", 150.0)

        try:
            n, p, k = float(n), float(p), float(k)
            temperature, humidity = float(temperature), float(humidity)
            ph, rainfall = float(ph), float(rainfall)
        except ValueError:
            return jsonify({"success": False, "error": "Invalid numerical parameters"}), 400

        result = crop_service.recommend(n, p, k, temperature, humidity, ph, rainfall)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Crop recommendation failed: {str(e)}"}), 500

# ----------------------------------------------------
# 4. Disease Detection Endpoint (Simulated CV Analysis)
# ----------------------------------------------------
@app.route("/api/detect-disease", methods=["POST"])
@app.route("/api/disease/analyze", methods=["POST"])
def detect_disease():
    try:
        image_bytes = None
        hint = ""

        if "image" in request.files:
            file_obj = request.files["image"]
            if file_obj.filename:
                image_bytes = file_obj.read()
                hint = file_obj.filename
        elif "file" in request.files:
            file_obj = request.files["file"]
            if file_obj.filename:
                image_bytes = file_obj.read()
                hint = file_obj.filename

        if request.form:
            hint = request.form.get("hint", hint)
        elif request.is_json:
            data = request.get_json(silent=True) or {}
            hint = data.get("hint", hint)

        result = disease_service.detect(image_input=image_bytes, filename_or_hint=hint)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Disease detection failed: {str(e)}"}), 500

# ----------------------------------------------------
# 5. Weather Endpoint (Agro-Meteorology & Alerts)
# ----------------------------------------------------
@app.route("/api/weather", methods=["GET"])
def get_weather():
    try:
        city = request.args.get("city", "Coimbatore")
        data = weather_service.get_weather(city)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Weather fetch failed: {str(e)}"}), 500

# ----------------------------------------------------
# 6. Government Schemes Endpoint
# ----------------------------------------------------
@app.route("/api/schemes", methods=["GET"])
def get_schemes():
    try:
        search = request.args.get("search", "")
        category = request.args.get("category", "All")
        data = scheme_service.get_schemes(search, category)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Schemes fetch failed: {str(e)}"}), 500

# ----------------------------------------------------
# 7. AI Agriculture Chatbot Endpoint
# ----------------------------------------------------
@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True, silent=True) or {}
        query = data.get("query", "").strip()
        language = data.get("language", "en")

        if not query:
            return jsonify({"success": False, "error": "Query cannot be empty"}), 400

        result = chatbot_service.ask(query, language)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Chatbot query failed: {str(e)}"}), 500

# ----------------------------------------------------
# 8. AI Voice Intent & Navigation Endpoint
# ----------------------------------------------------
@app.route("/api/voice/intent", methods=["POST"])
def voice_intent():
    try:
        data = request.get_json(force=True, silent=True) or {}
        transcript = data.get("transcript", "").strip()
        language = data.get("language", "en")

        result = voice_service.process_voice_query(transcript, language)
        # If it's a conversational query, run chatbot service directly
        if result.get("type") == "conversational_query":
            chat_res = chatbot_service.ask(transcript, language)
            speech_text = chat_res.get(f"answer_{language}") or chat_res.get("answer_en")
            result["speech_response"] = speech_text
            result["chat_result"] = chat_res

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Voice intent processing failed: {str(e)}"}), 500

# ----------------------------------------------------
# 9. Thermal Crop Imaging Endpoint
# ----------------------------------------------------
@app.route("/api/thermal/analyze", methods=["POST"])
def analyze_thermal():
    try:
        hint = ""
        ambient_temp = 28.5
        soil_moisture = 50.0
        image_bytes = None

        if "image" in request.files:
            file_obj = request.files["image"]
            if file_obj.filename:
                image_bytes = file_obj.read()
                hint = file_obj.filename
        elif "file" in request.files:
            file_obj = request.files["file"]
            if file_obj.filename:
                image_bytes = file_obj.read()
                hint = file_obj.filename

        if request.form:
            hint = request.form.get("hint", hint)
            ambient_temp = float(request.form.get("ambient_temp", 28.5))
            soil_moisture = float(request.form.get("soil_moisture", 50.0))
        elif request.is_json:
            data = request.get_json(silent=True) or {}
            hint = data.get("hint", hint)
            ambient_temp = float(data.get("ambient_temp", 28.5))
            soil_moisture = float(data.get("soil_moisture", 50.0))

        result = thermal_service.analyze(
            image_data=image_bytes,
            preset_hint=hint,
            ambient_temp=ambient_temp,
            soil_moisture=soil_moisture
        )
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Thermal analysis failed: {str(e)}"}), 500

# ----------------------------------------------------
# 10. RGB + Thermal Multimodal Analysis Endpoint
# ----------------------------------------------------
@app.route("/api/multimodal/analyze", methods=["POST"])
def analyze_multimodal():
    try:
        data = request.get_json(force=True, silent=True) or {}
        rgb_hint = data.get("rgb_hint", "leaf_spot")
        thermal_hint = data.get("thermal_hint", "moisture_stress")
        crop_name = data.get("crop_name", "Rice (Paddy)")
        crop_stage = data.get("crop_stage", "Tillering")
        soil_moisture = float(data.get("soil_moisture", 48.0))
        soil_ph = float(data.get("soil_ph", 6.5))
        air_temp = float(data.get("air_temp", 28.5))
        humidity = float(data.get("humidity", 65.0))

        result = multimodal_engine.fuse_and_analyze(
            rgb_hint=rgb_hint,
            thermal_hint=thermal_hint,
            crop_name=crop_name,
            crop_stage=crop_stage,
            soil_moisture=soil_moisture,
            soil_ph=soil_ph,
            air_temp=air_temp,
            humidity=humidity
        )
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Multimodal analysis failed: {str(e)}"}), 500

# ----------------------------------------------------
# 11. Daily Crop Analysis Endpoint
# ----------------------------------------------------
@app.route("/api/daily-analysis", methods=["GET"])
def get_daily_analysis():
    try:
        crop = request.args.get("crop", "Rice (Paddy)")
        parcel = request.args.get("parcel", "Field 1")
        data = daily_service.get_today_summary(crop_name=crop, parcel=parcel)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Daily analysis failed: {str(e)}"}), 500

@app.route("/api/daily-analysis/save", methods=["POST"])
def save_daily_analysis():
    try:
        data = request.get_json(force=True, silent=True) or {}
        res = daily_service.save_daily_snapshot(data)
        return jsonify(res), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Daily analysis save failed: {str(e)}"}), 500

# ----------------------------------------------------
# 12. Market Intelligence Endpoints
# ----------------------------------------------------
@app.route("/api/market/prices", methods=["GET"])
def get_market_prices():
    try:
        data = market_service.get_all_prices()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Market prices fetch failed: {str(e)}"}), 500

@app.route("/api/market/crop", methods=["GET"])
def get_crop_market():
    try:
        crop = request.args.get("crop", "rice")
        data = market_service.get_crop_market(crop)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Market crop fetch failed: {str(e)}"}), 500

# ----------------------------------------------------
# 13. AI Sell / Wait Decision Endpoint
# ----------------------------------------------------
@app.route("/api/market/sell-decision", methods=["POST"])
def get_sell_decision():
    try:
        data = request.get_json(force=True, silent=True) or {}
        crop = data.get("crop", "rice")
        condition = data.get("condition", "Good")
        days_to_perish = int(data.get("days_to_perish", 21))
        thermal_stress = data.get("thermal_stress", "Low")
        weather_risk = data.get("weather_risk", "Low")
        storage_avail = bool(data.get("storage_available", True))

        result = sell_decision_engine.evaluate_decision(
            crop_key=crop,
            crop_condition=condition,
            days_to_perish=days_to_perish,
            thermal_stress=thermal_stress,
            weather_risk=weather_risk,
            storage_available=storage_avail
        )
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Sell decision evaluation failed: {str(e)}"}), 500

# ----------------------------------------------------
# 14. Marketplace Endpoints
# ----------------------------------------------------
@app.route("/api/marketplace/listings", methods=["GET"])
def get_listings():
    try:
        search = request.args.get("search", "")
        crop = request.args.get("crop", "")
        district = request.args.get("district", "")
        data = marketplace_service.get_listings(search, crop, district)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Listings fetch failed: {str(e)}"}), 500

@app.route("/api/marketplace/listings", methods=["POST"])
def create_listing():
    try:
        data = request.get_json(force=True, silent=True) or {}
        res = marketplace_service.add_listing(data)
        return jsonify(res), 201
    except Exception as e:
        return jsonify({"success": False, "error": f"Create listing failed: {str(e)}"}), 500

@app.route("/api/marketplace/inquire", methods=["POST"])
def create_inquiry():
    try:
        data = request.get_json(force=True, silent=True) or {}
        res = marketplace_service.record_inquiry(data)
        return jsonify(res), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Inquiry failed: {str(e)}"}), 500

# ----------------------------------------------------
# 15. AI Buyer Matching Endpoint
# ----------------------------------------------------
@app.route("/api/marketplace/match-buyers", methods=["POST"])
def match_buyers():
    try:
        data = request.get_json(force=True, silent=True) or {}
        crop = data.get("crop", "Rice (Paddy)")
        qty = float(data.get("quantity_quintals", 45))
        price = float(data.get("expected_price", 2400))
        district = data.get("district", "Coimbatore")
        grade = data.get("quality_grade", "Grade A+")

        res = buyer_matching_service.match_buyers(
            crop_name=crop,
            quantity_quintals=qty,
            expected_price=price,
            district=district,
            quality_grade=grade
        )
        return jsonify(res), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Buyer matching failed: {str(e)}"}), 500

# ----------------------------------------------------
# 16. Farm Health Score Endpoint
# ----------------------------------------------------
@app.route("/api/farm/health-score", methods=["GET"])
def get_farm_health():
    try:
        data = farm_health_service.calculate_health_score()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Farm health calculation failed: {str(e)}"}), 500

# ----------------------------------------------------
# 17. 3D Digital Farm Model Endpoint
# ----------------------------------------------------
@app.route("/api/farm/digital-twin", methods=["GET"])
def get_digital_twin():
    try:
        data = farm_twin_service.get_digital_twin()
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Digital twin fetch failed: {str(e)}"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[ARKA-ASSIST] Starting Flask Server on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
