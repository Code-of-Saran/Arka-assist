"""
ARKA-ASSIST — Multimodal Crop Intelligence & Stress Analysis Service
Fuses visual symptoms (RGB pathology), thermal canopy infrared signatures,
ambient agro-meteorological metrics, and soil chemistry into an explainable 
crop health and stress assessment.

Data Integrity & Modularity:
- Transparent rule-based and explainable scoring engine (RULE_BASED)
- Does not claim to be a single end-to-end trained multimodal deep neural network
- Every stress assessment and recommendation includes explicit contributing factors
- Modular architecture ready for tensor feature fusion as multimodal weights are developed
"""

from services.stress_analysis import evaluate_stress_level, StressAnalysisEngine
from services.thermal_service import ThermalService
from services.disease_service import DiseaseService

class MultimodalAnalysisEngine:
    def __init__(self):
        self.thermal_service = ThermalService()
        self.disease_service = DiseaseService()
        self.stress_engine = StressAnalysisEngine()

    def fuse_and_analyze(self, rgb_hint="blast", thermal_hint="moisture_stress",
                          crop_name="Rice (Paddy)", crop_stage="Flowering",
                          soil_moisture=48.0, soil_ph=6.5,
                          air_temp=28.5, humidity=65.0, rainfall=0.0):
        """
        Modular Multimodal Fusion Layer:
        Fuses:
        1. RGB Pathology indicators (from Disease Detection model or hint)
        2. Thermal canopy gradient & transpiration differential
        3. Ambient weather (temperature, humidity, rainfall)
        4. Soil & phenological parameters (moisture, pH, growth stage)
        """
        # 1. Thermal Domain
        thermal_res = self.thermal_service.analyze(
            preset_hint=thermal_hint,
            ambient_temp=air_temp,
            soil_moisture=soil_moisture
        )
        thermal_score = thermal_res["stress_assessment"]["stress_score"]
        delta_t = thermal_res["canopy_temperature"]["delta_t_celsius"]

        # 2. RGB Visual Pathology Domain
        disease_res = self.disease_service.detect(filename_or_hint=rgb_hint)
        disease_key = disease_res.get("disease_key", "blast")
        severity_level = disease_res.get("severity_level", 1) # 0: Healthy, 1: Mild, 2: Moderate, 3: Severe
        
        rgb_stress_score = {0: 5.0, 1: 30.0, 2: 60.0, 3: 85.0}.get(severity_level, 40.0)

        # 3. Agro-Meteorological Stress Evaluation
        weather_stress = 10.0
        weather_factors = []
        if air_temp > 35.0:
            weather_stress += 25.0
            weather_factors.append(f"High ambient temperature ({air_temp}°C)")
        elif air_temp < 15.0:
            weather_stress += 20.0
            weather_factors.append(f"Low ambient temperature ({air_temp}°C)")

        if humidity < 35.0:
            weather_stress += 20.0
            weather_factors.append(f"Atmospheric dryness (RH {humidity}%) causing high vapor pressure deficit")
        elif humidity > 85.0:
            weather_stress += 15.0
            weather_factors.append(f"Excessive humidity (RH {humidity}%) fostering foliar fungal incubation")

        if rainfall > 50.0:
            weather_stress += 10.0
            weather_factors.append(f"Heavy precipitation ({rainfall} mm)")

        # 4. Soil Moisture & Phenological Multipliers
        soil_factors = []
        soil_stress = 10.0
        if soil_moisture < 35.0:
            soil_stress += 35.0
            soil_factors.append(f"Critically low soil moisture ({soil_moisture}%)")
        elif soil_moisture > 85.0:
            soil_stress += 20.0
            soil_factors.append(f"Waterlogging saturation ({soil_moisture}%)")

        stage_multiplier = 1.0
        stage_clean = (crop_stage or "").lower()
        if "flower" in stage_clean or "bloom" in stage_clean:
            stage_multiplier = 1.25
        elif "grain" in stage_clean or "fruit" in stage_clean:
            stage_multiplier = 1.15

        # 5. Explainable Weighted Fusion
        # Weights: Thermal (30%) + RGB Pathology (35%) + Climate (20%) + Soil Moisture (15%)
        raw_composite = (
            (thermal_score * 0.30) +
            (rgb_stress_score * 0.35) +
            (weather_stress * 0.20) +
            (soil_stress * 0.15)
        ) * stage_multiplier

        composite_score = min(100.0, max(5.0, round(raw_composite, 1)))
        level_en, level_ta, severity = evaluate_stress_level(composite_score)

        # 6. Stress Factors & Risk Indicators
        stress_factors = []
        if delta_t > 2.0:
            stress_factors.append(f"Canopy hyperthermia (+{delta_t}°C above air temp) indicating restricted stomatal transpiration.")
        if severity_level > 0:
            stress_factors.append(f"Pathology detected: {disease_res['condition_en']} ({disease_res['severity']} severity).")
        stress_factors.extend(weather_factors)
        stress_factors.extend(soil_factors)

        if not stress_factors:
            stress_factors.append("Optimal vegetative equilibrium; physiological metrics within standard baseline.")

        # Synthesis of explanation
        explanation_en = " + ".join(stress_factors[:3])
        if len(stress_factors) > 3:
            explanation_en += f" with {len(stress_factors)-3} additional micro-environmental stress factor(s)."

        # Actionable recommendations
        if composite_score >= 65.0:
            primary_action = disease_res.get("chemical_treatment_en") or "Implement emergency crop defense."
            primary_action_ta = disease_res.get("chemical_treatment_ta") or "அவசர பாதுகாப்பு நடவடிக்கைகளை மேற்கொள்ளவும்."
        elif composite_score >= 35.0:
            primary_action = disease_res.get("organic_treatment_en") or "Apply preventive bio-stimulants and regulate irrigation."
            primary_action_ta = disease_res.get("organic_treatment_ta") or "பஞ்சகவ்யா தெளித்து பாசனத்தை முறைப்படுத்தவும்."
        else:
            primary_action = "Canopy transpiration healthy. Continue scheduled irrigation and scouting regimen."
            primary_action_ta = "பயிர் நலம் சீராக உள்ளது. வழக்கமான பாசனம் மற்றும் கண்காணிப்பை தொடரவும்."

        return {
            "success": True,
            "status_type": "RULE_BASED",
            "model_engine": "Arka-assist Explainable Multimodal Fusion Engine (v2.0)",
            "fusion_architecture": "Modular Cross-Domain Feature Fusion (RGB + Thermal + Weather + Soil)",
            "data_integrity_notice": "Explainable rule-based heuristics across verified physical parameters. Not an unverified black-box neural net.",
            "inputs_fused": {
                "crop_name": crop_name,
                "crop_stage": crop_stage,
                "rgb_indicator": rgb_hint,
                "thermal_indicator": thermal_hint,
                "soil_moisture_pct": soil_moisture,
                "soil_ph": soil_ph,
                "air_temperature_celsius": air_temp,
                "humidity_pct": humidity,
                "rainfall_mm": rainfall
            },
            "domain_findings": {
                "rgb_visual_analysis": {
                    "detected_pathology": disease_res["condition_en"],
                    "pathology_ta": disease_res["condition_ta"],
                    "severity": disease_res["severity"],
                    "domain_stress_score": rgb_stress_score
                },
                "thermal_ir_analysis": {
                    "canopy_temperature": thermal_res["canopy_temperature"]["mean_celsius"],
                    "delta_t": delta_t,
                    "affected_region": thermal_res["affected_region"],
                    "domain_stress_score": thermal_score
                },
                "environmental_stress_score": weather_stress,
                "soil_stress_score": soil_stress
            },
            "overall_stress_assessment": {
                "composite_score": composite_score,
                "health_score": round(100.0 - composite_score, 1),
                "level_en": level_en,
                "level_ta": level_ta,
                "severity": severity
            },
            "stress_factors": stress_factors,
            "risk_indicators": [
                {"factor": "Transpiration Stress", "status": "High" if delta_t > 2.5 else "Moderate" if delta_t > 0 else "Low"},
                {"factor": "Pathology Severity", "status": disease_res["severity"]},
                {"factor": "Climate Vulnerability", "status": "High" if weather_stress > 30 else "Moderate" if weather_stress > 15 else "Low"},
                {"factor": "Soil Water Tension", "status": "High" if soil_stress > 30 else "Low"}
            ],
            "root_cause_explanation": {
                "cause_en": explanation_en,
                "cause_ta": "இலை வெப்பநிலை, நோய் அறிகுறிகள் மற்றும் வானிலை காரணிகளின் ஒருங்கிணைந்த மதிப்பீடு."
            },
            "actionable_recommendation": {
                "action_en": primary_action,
                "action_ta": primary_action_ta
            }
        }
