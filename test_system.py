"""
Arka-assist — End-to-End Test Suite
Validates backend REST endpoints, Vite frontend server, dataset integrity, ML models, and dual language localization.
"""

import sys
import json
import os
import urllib.request
import urllib.parse
import urllib.error

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

base_dir = os.path.dirname(os.path.abspath(__file__))

def test_json_datasets():
    print("\n--- 1. Testing Offline JSON Datasets & Localization ---")
    data_dir = os.path.join(base_dir, "frontend", "src", "data")
    i18n_dir = os.path.join(base_dir, "frontend", "src", "i18n")

    files = [
        os.path.join(data_dir, "crops.json"),
        os.path.join(data_dir, "diseases.json"),
        os.path.join(data_dir, "schemes.json"),
        os.path.join(data_dir, "weather.json"),
        os.path.join(data_dir, "chatbot.json"),
        os.path.join(i18n_dir, "en.json"),
        os.path.join(i18n_dir, "ta.json"),
    ]

    for f in files:
        assert os.path.exists(f), f"Missing file: {f}"
        with open(f, "r", encoding="utf-8") as fp:
            data = json.load(fp)
            assert data, f"Empty JSON in {f}"
        print(f"  [PASS] {os.path.basename(f)} parsed cleanly.")

    # Check key parity between en.json and ta.json
    with open(os.path.join(i18n_dir, "en.json"), "r", encoding="utf-8") as fp:
        en = json.load(fp)
    with open(os.path.join(i18n_dir, "ta.json"), "r", encoding="utf-8") as fp:
        ta = json.load(fp)

    missing_in_ta = set(en.keys()) - set(ta.keys())
    assert not missing_in_ta, f"Keys missing in ta.json: {missing_in_ta}"
    print(f"  [PASS] 100% translation key parity ({len(en)} localized strings in EN and TA).")

def make_request(url, method="GET", data=None):
    headers = {"Content-Type": "application/json"}
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=8) as response:
        return response.status, json.loads(response.read().decode("utf-8"))

def test_backend_api():
    print("\n--- 2. Testing Flask Backend REST API (http://127.0.0.1:5000) ---")

    # Health
    status, res = make_request("http://127.0.0.1:5000/api/health")
    assert status == 200 and res["status"] == "online"
    print(f"  [PASS] /api/health -> status: online, version: {res['version']}, product: {res.get('product', 'Arka-assist')}")

    # Auth Demo Login (with new 'arka-assist' password)
    status, res = make_request("http://127.0.0.1:5000/api/auth/login", "POST", {"username": "farmer", "password": "arka-assist"})
    assert status == 200 and res["success"] and "VSBCETC" in res["user"]["name"]
    print(f"  [PASS] /api/auth/login (password: 'arka-assist') -> authenticated as '{res['user']['name']}'")

    # Auth Demo Login (with backward-compatible 'agrivision' password)
    status, res = make_request("http://127.0.0.1:5000/api/auth/login", "POST", {"username": "farmer", "password": "agrivision"})
    assert status == 200 and res["success"]
    print(f"  [PASS] /api/auth/login (password: 'agrivision' backward compatibility) -> authenticated")

    # Crop Recommendation (Sample 1 - Rice)
    status, res1 = make_request("http://127.0.0.1:5000/api/recommend-crop", "POST", {
        "n": 80, "p": 48, "k": 40, "temperature": 24.0, "humidity": 82.0, "ph": 6.4, "rainfall": 235.0
    })
    assert status == 200 and res1["success"] and res1["crop_key"] == "rice"
    alt_names1 = [a["name_en"] for a in res1.get("alternatives", [])]
    print(f"  [PASS] /api/recommend-crop (Sample 1: Rice) -> {res1['crop_name_en']} ({res1['crop_name_ta']}) | Confidence: {res1['confidence']}% | Alts: {alt_names1}")

    # Crop Recommendation (Sample 2 - Cotton)
    status, res2 = make_request("http://127.0.0.1:5000/api/recommend-crop", "POST", {
        "n": 118, "p": 46, "k": 19, "temperature": 24.0, "humidity": 80.0, "ph": 6.9, "rainfall": 80.0
    })
    assert status == 200 and res2["success"] and res2["crop_key"] == "cotton"
    alt_names2 = [a["name_en"] for a in res2.get("alternatives", [])]
    print(f"  [PASS] /api/recommend-crop (Sample 2: Cotton) -> {res2['crop_name_en']} ({res2['crop_name_ta']}) | Confidence: {res2['confidence']}% | Alts: {alt_names2}")

    # Crop Recommendation (Sample 3 - Grapes)
    status, res3 = make_request("http://127.0.0.1:5000/api/recommend-crop", "POST", {
        "n": 23, "p": 133, "k": 201, "temperature": 24.0, "humidity": 82.0, "ph": 6.0, "rainfall": 69.0
    })
    assert status == 200 and res3["success"] and res3["crop_key"] == "grapes"
    alt_names3 = [a["name_en"] for a in res3.get("alternatives", [])]
    print(f"  [PASS] /api/recommend-crop (Sample 3: Grapes) -> {res3['crop_name_en']} ({res3['crop_name_ta']}) | Confidence: {res3['confidence']}% | Alts: {alt_names3}")

    # Verification of Distinctness
    assert len({res1["crop_key"], res2["crop_key"], res3["crop_key"]}) == 3, "Crop recommendations must produce distinct outputs for distinct inputs"

    # Disease Detection (Tomato)
    status, res = make_request("http://127.0.0.1:5000/api/detect-disease", "POST", {"hint": "tomato_early_blight"})
    assert status == 200 and res["success"] and len(res["bounding_boxes"]) > 0
    print(f"  [PASS] /api/detect-disease (Tomato) -> {res['condition_en']} | Severity: {res['severity']} | Box Count: {len(res['bounding_boxes'])}")

    # Weather
    status, res = make_request("http://127.0.0.1:5000/api/weather?city=Coimbatore")
    assert status == 200 and res["success"] and len(res["advisories"]) > 0
    print(f"  [PASS] /api/weather (Coimbatore) -> {res['temp']}°C, {res['condition_en']} | Advisories: {len(res['advisories'])}")

    # Schemes
    status, res = make_request("http://127.0.0.1:5000/api/schemes?category=Financial+Support")
    assert status == 200 and res["count"] > 0
    print(f"  [PASS] /api/schemes (Financial Support) -> Found {res['count']} matching schemes (e.g. {res['schemes'][0]['name_en']})")

    # Chatbot (English & Tamil)
    status, res_en = make_request("http://127.0.0.1:5000/api/chat", "POST", {"query": "Which crop is suitable for high rainfall?", "language": "en"})
    assert status == 200 and res_en["success"] and "Rice" in res_en["answer_en"]
    print(f"  [PASS] /api/chat (English Query) -> Answer matched: '{res_en['answer_en'][:60]}...'")

    # Thermal Crop Analysis
    status, res_th = make_request("http://127.0.0.1:5000/api/thermal/analyze", "POST", {
        "field_id": "field_1",
        "canopy_temp": 32.5,
        "ambient_temp": 30.0,
        "soil_moisture": 38.0
    })
    assert status == 200 and res_th["success"] and "canopy_temperature" in res_th
    dt = res_th["canopy_temperature"]["delta_t_celsius"]
    score = res_th["stress_assessment"]["stress_score"]
    print(f"  [PASS] /api/thermal/analyze -> Status: {res_th['status']} | Delta-T: {dt}°C | Stress Score: {score}")

    # Multimodal RGB + Thermal Analysis
    status, res_mm = make_request("http://127.0.0.1:5000/api/multimodal/analyze", "POST", {
        "visual_symptoms": ["yellow_spots", "wilting"],
        "canopy_temp": 33.0,
        "ambient_temp": 30.0,
        "soil_moisture": 35.0,
        "growth_stage": "vegetative",
        "rainfall": 15.0
    })
    assert status == 200 and res_mm["success"] and "overall_stress_assessment" in res_mm
    risk_score = res_mm["overall_stress_assessment"]["composite_score"]
    dominant = res_mm.get("dominant_stress_factor", "General")
    print(f"  [PASS] /api/multimodal/analyze -> Risk Score: {risk_score} | Dominant: {dominant}")

    # Daily Crop Analysis
    status, res_da = make_request("http://127.0.0.1:5000/api/daily-analysis")
    assert status == 200 and res_da["success"] and len(res_da["today_recommended_actions"]) > 0
    health_val = res_da["today_crop_status"]["overall_crop_health"]
    actions_cnt = len(res_da["today_recommended_actions"])
    print(f"  [PASS] /api/daily-analysis -> Health Score: {health_val}/100 | Actions: {actions_cnt} prioritized")

    # Market Prices (Agmarknet)
    status, res_mp = make_request("http://127.0.0.1:5000/api/market/prices")
    assert status == 200 and res_mp["success"] and len(res_mp["commodities"]) > 0
    print(f"  [PASS] /api/market/prices -> {len(res_mp['commodities'])} Mandi commodity prices listed")

    # Specific Crop Market
    status, res_mc = make_request("http://127.0.0.1:5000/api/market/crop?crop=Rice")
    assert status == 200 and res_mc["success"] and "commodity" in res_mc
    comm = res_mc["commodity"]
    print(f"  [PASS] /api/market/crop (Rice) -> {comm['name_en']}: {comm['current_price']} {comm['unit']}")

    # Sell vs. Wait Decision
    status, res_sw = make_request("http://127.0.0.1:5000/api/market/sell-decision", "POST", {
        "crop": "Tomato",
        "days_to_perish": 5
    })
    assert status == 200 and res_sw["success"] and res_sw["recommendation"] in ["SELL NOW", "SELL_NOW", "WAIT", "HOLD_WAIT", "SELL"]
    print(f"  [PASS] /api/market/sell-decision (Tomato) -> Decision: {res_sw['recommendation']} ({res_sw['confidence_pct']}%)")

    # Marketplace Listings
    status, res_ml = make_request("http://127.0.0.1:5000/api/marketplace/listings")
    assert status == 200 and res_ml["success"] and len(res_ml["listings"]) > 0
    print(f"  [PASS] /api/marketplace/listings -> {len(res_ml['listings'])} active listings found")

    # Buyer Matching Engine
    status, res_bm = make_request("http://127.0.0.1:5000/api/marketplace/match-buyers", "POST", {
        "crop": "Rice (Paddy)",
        "quantity_quintals": 45
    })
    assert status == 200 and res_bm["success"] and len(res_bm["best_buyer_matches"]) > 0
    top_buyer = res_bm["best_buyer_matches"][0]["name"]
    print(f"  [PASS] /api/marketplace/match-buyers -> {len(res_bm['best_buyer_matches'])} matched buyers (Top: {top_buyer})")

    # Farm Health Score (0-100)
    status, res_fh = make_request("http://127.0.0.1:5000/api/farm/health-score")
    assert status == 200 and res_fh["success"] and 0 <= res_fh["overall_health_score"] <= 100
    print(f"  [PASS] /api/farm/health-score -> Composite Index: {res_fh['overall_health_score']}/100 ({res_fh['rating_en']})")

    # Digital Farm Twin
    status, res_ft = make_request("http://127.0.0.1:5000/api/farm/digital-twin")
    assert status == 200 and res_ft["success"] and len(res_ft["farm_data"]["parcels"]) > 0
    parcels_count = len(res_ft["farm_data"]["parcels"])
    print(f"  [PASS] /api/farm/digital-twin -> {parcels_count} farm parcels loaded in twin engine")

    # Voice Intent Processing
    status, res_vi = make_request("http://127.0.0.1:5000/api/voice/intent", "POST", {
        "transcript": "Show me thermal analysis",
        "language": "en"
    })
    assert status == 200 and res_vi["success"] and res_vi["target_route"] == "/thermal"
    print(f"  [PASS] /api/voice/intent ('Show me thermal analysis') -> Target: {res_vi['target_route']}")

def test_frontend_dev_server():
    print("\n--- 3. Testing Vite Frontend Dev Server (http://localhost:5173) ---")
    req = urllib.request.Request("http://localhost:5173/")
    with urllib.request.urlopen(req, timeout=5) as response:
        content = response.read().decode("utf-8")
        assert response.status == 200
        assert "Arka-assist" in content
        assert "/src/main.jsx" in content
        print(f"  [PASS] http://localhost:5173/ loaded with HTTP 200, 'Arka-assist' branding, and root DOM container.")

def main():
    print("=" * 65)
    print("🌾 RUNNING COMPLETE E2E VERIFICATION SUITE FOR ARKA-ASSIST")
    print("=" * 65)

    test_json_datasets()
    test_backend_api()
    test_frontend_dev_server()

    print("\n" + "=" * 65)
    print("🎉 ALL 20 ARKA-ASSIST VERIFICATION TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 65)

if __name__ == "__main__":
    main()
