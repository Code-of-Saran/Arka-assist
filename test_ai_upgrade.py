"""
ARKA-ASSIST — Real AI Capability Upgrade Verification & Regression Suite
Tests:
1. Preservation of Crop Recommendation Random Forest Model
2. Genuine PyTorch MobileNetV3 Transfer Learning Model & Class Names
3. Real Disease Detection via multipart/form-data Image Upload
4. Low-Confidence Threshold Handling & Agricultural Advice
5. Real Thermal Image File Processing & Uncalibrated Labelling
6. Multimodal Feature Fusion Engine
7. Explainable Daily Intelligence & Prioritized Actions
8. Explainable Farm Risk Analysis (5 Categories)
9. Explainable Sell / Wait Decision Engine with Reasons & Caveats
10. Transparent Buyer Matching Score & Explicit Reason Breakdown
11. Tamil & English Voice Intent Navigation
"""

import sys
import os
import io
import json
import requests
from pathlib import Path
from PIL import Image

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_URL = "http://127.0.0.1:5000"

def log_test(name, passed, details=""):
    mark = "[PASS]" if passed else "[FAIL]"
    print(f"{mark} | {name}")
    if details:
        print(f"       -> {details}")

def run_tests():
    print("==================================================")
    print("ARKA-ASSIST: REAL AI UPGRADE REGRESSION TEST SUITE")
    print("==================================================\n")

    passed_count = 0
    total_count = 0

    # Test 1: Check Model Artifacts on Disk
    total_count += 1
    crop_model = Path("backend/models/crop_model.joblib").exists()
    disease_model = Path("backend/models/disease_model.pth").exists()
    class_names = Path("ml/class_names.json").exists()
    metrics = Path("ml/metrics.json").exists()
    artifacts_ok = crop_model and disease_model and class_names and metrics
    passed_count += 1 if artifacts_ok else 0
    log_test("Artifact Integrity Check", artifacts_ok,
             f"CropModel: {crop_model}, DiseaseModel: {disease_model}, ClassNames: {class_names}, Metrics: {metrics}")

    # Test 2: Health Check
    total_count += 1
    try:
        r = requests.get(f"{BASE_URL}/api/health", timeout=5)
        ok = r.status_code == 200 and r.json().get("status") == "online"
        passed_count += 1 if ok else 0
        log_test("Backend Health Endpoint", ok, f"Status: {r.status_code}, Response: {r.json().get('system')}")
    except Exception as e:
        log_test("Backend Health Endpoint", False, str(e))

    # Test 3: Existing Crop Recommendation (Random Forest)
    total_count += 1
    try:
        payload = {"n": 90, "p": 42, "k": 43, "temperature": 20.8, "humidity": 82.0, "ph": 6.5, "rainfall": 202.9}
        r = requests.post(f"{BASE_URL}/api/recommend-crop", json=payload, timeout=5)
        data = r.json()
        crop_name = data.get("crop_key") or data.get("crop_name_en") or data.get("crop", "")
        ok = r.status_code == 200 and data.get("success") and "rice" in str(crop_name).lower()
        passed_count += 1 if ok else 0
        log_test("Existing Crop Model Preservation", ok, f"Recommended: {crop_name} (Confidence: {data.get('confidence')}%)")
    except Exception as e:
        log_test("Existing Crop Model Preservation", False, str(e))

    # Test 4: Real Disease Inference with Image Upload (multipart/form-data)
    total_count += 1
    sample_img_path = Path("datasets/paddy_doctor/sample_verification/blast/blast_sample_1.png")
    if not sample_img_path.exists():
        # Create a small dummy image
        img = Image.new("RGB", (224, 224), color=(60, 140, 50))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        img_bytes = buf.getvalue()
    else:
        img_bytes = sample_img_path.read_bytes()

    try:
        files = {"image": ("leaf_test.png", img_bytes, "image/png")}
        r = requests.post(f"{BASE_URL}/api/detect-disease", files=files, timeout=8)
        data = r.json()
        ok = r.status_code == 200 and data.get("success") and data.get("status_type") == "REAL_MODEL"
        passed_count += 1 if ok else 0
        log_test("Real PyTorch Disease Image Inference", ok,
                 f"Predicted: {data.get('disease')} (Status: {data.get('status_type')}, Confidence: {data.get('confidence')})")
    except Exception as e:
        log_test("Real PyTorch Disease Image Inference", False, str(e))

    # Test 5: Low-Confidence Handling Alert
    total_count += 1
    try:
        # A blank grey square has ambiguous features and triggers low confidence (< 0.60)
        grey_img = Image.new("RGB", (224, 224), color=(128, 128, 128))
        buf = io.BytesIO()
        grey_img.save(buf, format="PNG")
        files = {"image": ("ambiguous.png", buf.getvalue(), "image/png")}
        r = requests.post(f"{BASE_URL}/api/disease/analyze", files=files, timeout=8)
        data = r.json()
        is_low = data.get("is_low_confidence")
        warning = data.get("low_confidence_warning")
        ok = r.status_code == 200 and is_low and warning is not None
        passed_count += 1 if ok else 0
        log_test("Low-Confidence Prediction Warning", ok,
                 f"IsLowConfidence: {is_low}, Warning: '{warning[:55]}...'")
    except Exception as e:
        log_test("Low-Confidence Prediction Warning", False, str(e))

    # Test 6: Real Thermal Image Upload & Honest Uncalibrated Labeling
    total_count += 1
    try:
        thermal_sim = Image.new("RGB", (224, 224), color=(200, 80, 40))
        buf = io.BytesIO()
        thermal_sim.save(buf, format="PNG")
        files = {"image": ("drone_thermal.png", buf.getvalue(), "image/png")}
        r = requests.post(f"{BASE_URL}/api/thermal/analyze", files=files, timeout=5)
        data = r.json()
        status_type = data.get("status_type")
        analysis_type = data.get("analysis_type")
        has_grid = len(data.get("thermal_grid", [])) == 8
        ok = r.status_code == 200 and status_type == "RULE_BASED" and "relative" in analysis_type.lower() and has_grid
        passed_count += 1 if ok else 0
        log_test("Real Thermal Image Ingestion & Honest Label", ok,
                 f"Status: {status_type}, Mode: {analysis_type}, MeanTemp: {data.get('canopy_temperature', {}).get('mean_celsius')}°C")
    except Exception as e:
        log_test("Real Thermal Image Ingestion & Honest Label", False, str(e))

    # Test 7: Multimodal Fusion Engine
    total_count += 1
    try:
        payload = {
            "rgb_hint": "blast",
            "thermal_hint": "moisture_stress",
            "crop_name": "Rice (Paddy)",
            "crop_stage": "Tillering",
            "air_temp": 32.0,
            "humidity": 75.0,
            "soil_moisture": 45.0
        }
        r = requests.post(f"{BASE_URL}/api/multimodal/analyze", json=payload, timeout=5)
        data = r.json()
        ok = r.status_code == 200 and data.get("status_type") == "RULE_BASED" and len(data.get("stress_factors", [])) > 0
        passed_count += 1 if ok else 0
        log_test("Multimodal Feature Fusion Engine", ok,
                 f"Stress Level: {data.get('overall_stress_assessment', {}).get('level_en')}, Factors: {len(data.get('stress_factors', []))}")
    except Exception as e:
        log_test("Multimodal Feature Fusion Engine", False, str(e))

    # Test 8: Daily Intelligence & Prioritized Actions
    total_count += 1
    try:
        r = requests.get(f"{BASE_URL}/api/daily-analysis?crop=Rice%20(Paddy)&parcel=Field%201", timeout=5)
        data = r.json()
        actions = data.get("prioritized_actions", [])
        risks = data.get("risk_analysis", {})
        has_3_actions = len(actions) == 3
        has_5_risks = len(risks) == 5
        notice = data.get("historical_data_notice")
        ok = r.status_code == 200 and has_3_actions and has_5_risks and notice is not None
        passed_count += 1 if ok else 0
        log_test("Daily Crop Intelligence & Action Plan", ok,
                 f"Priorities: {len(actions)}, Risks: {len(risks)}, HistoryNotice: '{notice[:45]}...'")
    except Exception as e:
        log_test("Daily Crop Intelligence & Action Plan", False, str(e))

    # Test 9: Explainable Sell / Wait Decision
    total_count += 1
    try:
        payload = {"crop": "rice", "condition": "Good", "days_to_perish": 30, "thermal_stress": "Low", "weather_risk": "Low"}
        r = requests.post(f"{BASE_URL}/api/market/sell-decision", json=payload, timeout=5)
        data = r.json()
        dec = data.get("decision")
        reasons = data.get("reasons", [])
        caveats = data.get("important_caveats", [])
        ok = r.status_code == 200 and dec in ["WAIT", "SELL"] and len(reasons) > 0 and len(caveats) > 0
        passed_count += 1 if ok else 0
        log_test("Explainable Sell/Wait Decision Engine", ok,
                 f"Decision: {dec}, Reasons: {len(reasons)}, Caveats: {len(caveats)}, Status: {data.get('status_type')}")
    except Exception as e:
        log_test("Explainable Sell/Wait Decision Engine", False, str(e))

    # Test 10: Farmer to Buyer Matching
    total_count += 1
    try:
        payload = {"crop": "Rice (Paddy)", "quantity_quintals": 45, "expected_price": 2400, "district": "Coimbatore"}
        r = requests.post(f"{BASE_URL}/api/marketplace/match-buyers", json=payload, timeout=5)
        data = r.json()
        matches = data.get("matched_buyers", [])
        ok = r.status_code == 200 and len(matches) > 0 and "match_reason" in matches[0]
        passed_count += 1 if ok else 0
        log_test("Farmer-Buyer Transparent Matching", ok,
                 f"Matches: {len(matches)}, Top Score: {matches[0].get('match_score')}%, Reason: '{matches[0].get('match_reason')[:50]}...'")
    except Exception as e:
        log_test("Farmer-Buyer Transparent Matching", False, str(e))

    # Test 11: Tamil & English Voice Intent Routing
    total_count += 1
    try:
        r_ta = requests.post(f"{BASE_URL}/api/voice/intent", json={"transcript": "என் பயிரை இப்போது விற்கலாமா?", "language": "ta"}, timeout=5)
        data_ta = r_ta.json()
        route_ta = data_ta.get("target_route")
        
        r_en = requests.post(f"{BASE_URL}/api/voice/intent", json={"transcript": "check leaf disease", "language": "en"}, timeout=5)
        data_en = r_en.json()
        route_en = data_en.get("target_route")

        ok = route_ta == "/sell-decision" and route_en == "/disease"
        passed_count += 1 if ok else 0
        log_test("Voice Intent Routing (Tamil & English)", ok,
                 f"Tamil 'விற்கலாமா' -> {route_ta} | English 'check leaf disease' -> {route_en}")
    except Exception as e:
        log_test("Voice Intent Routing (Tamil & English)", False, str(e))

    print("\n==================================================")
    print(f"REGRESSION SUITE COMPLETED: {passed_count}/{total_count} PASSED")
    print("==================================================")

    return passed_count == total_count

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
