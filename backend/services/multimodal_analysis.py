"""
ARKA-ASSIST — Multimodal Analysis Engine
Fuses visual symptoms from RGB imagery, thermal canopy infrared signatures,
ambient agro-meteorological metrics, and soil chemistry / crop growth stage
into a holistic, multimodal crop stress assessment.
"""

from services.stress_analysis import evaluate_stress_level, StressAnalysisEngine
from services.thermal_service import ThermalService

class MultimodalAnalysisEngine:
    def __init__(self):
        self.thermal_service = ThermalService()
        self.stress_engine = StressAnalysisEngine()

    def fuse_and_analyze(self, rgb_hint="tomato_leaf", thermal_hint="moisture_stress",
                         crop_name="Rice (Paddy)", crop_stage="Flowering",
                         soil_moisture=48.0, soil_ph=6.5,
                         air_temp=28.5, humidity=65.0):
        """
        Multimodal fusion pipeline:
        Combines RGB visual lesions, thermal transpiration differential, environmental factors,
        and phenological stage.
        """
        # 1. Thermal Domain Inference
        thermal_res = self.thermal_service.analyze(
            preset_hint=thermal_hint,
            ambient_temp=air_temp,
            soil_moisture=soil_moisture
        )

        thermal_score = thermal_res["stress_assessment"]["stress_score"]

        # 2. RGB Visual Domain Diagnostics
        rgb_lower = (rgb_hint or "").lower()
        rgb_stress_factor = 10.0
        visual_findings_en = "Uniform green foliage, no necrosis or fungal sporulation detected."
        visual_findings_ta = "சீரான பச்சை இலைகள், பூஞ்சை அல்லது அழுகல் புள்ளிகள் இல்லை."

        if "blight" in rgb_lower or "spot" in rgb_lower or "disease" in rgb_lower:
            rgb_stress_factor = 65.0
            visual_findings_en = "Concentric dark brown lesions with chlorotic halos visible on upper lamina."
            visual_findings_ta = "இலைகளின் மேல் பரப்பில் வளைய வடிவிலான பழுப்பு புள்ளிகள் காணப்படுகின்றன."
        elif "yellow" in rgb_lower or "chlorosis" in rgb_lower or "deficiency" in rgb_lower:
            rgb_stress_factor = 45.0
            visual_findings_en = "Interveinal chlorosis and yellowing on mature leaves."
            visual_findings_ta = "இலை நரம்புகளுக்கு இடையே மஞ்சள் நிற மாற்றம் தென்படுகிறது."
        elif "pest" in rgb_lower or "worm" in rgb_lower:
            rgb_stress_factor = 55.0
            visual_findings_en = "Foliar margin chewing damage and skeletonized leaf patches."
            visual_findings_ta = "இலை விளிம்புகளில் பூச்சி கடித்த தடம் மற்றும் துளைகள் உள்ளன."

        # 3. Weather & Environmental Stress Domain
        weather_stress = 10.0
        if air_temp > 35.0:
            weather_stress += 25.0
        elif air_temp < 15.0:
            weather_stress += 20.0

        if humidity < 35.0: # High Vapor Pressure Deficit (VPD)
            weather_stress += 20.0
        elif humidity > 88.0: # Fungal incubation risk
            weather_stress += 15.0

        # 4. Phenological Stage Sensitivity
        stage_multiplier = 1.0
        stage_clean = (crop_stage or "").lower()
        if "flower" in stage_clean or "bloom" in stage_clean:
            stage_multiplier = 1.25 # Critical vulnerability window
        elif "grain" in stage_clean or "fruit" in stage_clean:
            stage_multiplier = 1.15
        elif "seed" in stage_clean or "germ" in stage_clean:
            stage_multiplier = 1.1

        # 5. Multimodal Composite Fusion Formula
        # Weighted fusion: Thermal (40%) + RGB Visual (35%) + Climate/Soil (25%) scaled by stage sensitivity
        composite_stress_raw = (
            (thermal_score * 0.40) +
            (rgb_stress_factor * 0.35) +
            (weather_stress * 0.25)
        ) * stage_multiplier

        composite_stress = min(100.0, max(5.0, round(composite_stress_raw, 1)))
        level_en, level_ta, severity = evaluate_stress_level(composite_stress)

        # Cross-Domain Correlation Synthesis
        if composite_stress < 25:
            cause_en = "Balanced physiological homeostasis. Optimal water potential and leaf gas exchange."
            cause_ta = "சீரான உடலியல் சமநிலை. உகந்த நீர் மேலாண்மை மற்றும் இலை வாயு பரிமாற்றம்."
            action_en = "Continue regular agronomic surveillance. Maintain balanced drip irrigation."
            action_ta = "தற்போதைய பாசன முறையை தொடரவும். சிறப்பு நடவடிக்கைகள் தேவையில்லை."
        elif "blight" in rgb_lower or "spot" in rgb_lower:
            cause_en = "Fungal foliar pathogen compounded by localized canopy hyperthermia and high relative humidity."
            cause_ta = "அதிக ஈரப்பதம் மற்றும் இலை வெப்பத்தால் தூண்டப்பட்ட பூஞ்சை நோய் தாக்குதல்."
            action_en = "1. Spray systemic bio-fungicide (Trichoderma / Copper Oxychloride 2.5g/L).\n2. Avoid overhead sprinkler irrigation to keep foliage dry."
            action_ta = "1. காப்பர் ஆக்ஸிகுளோரைடு அல்லது ட்ரைக்கோடெர்மா தெளிக்கவும்.\n2. இலைகளில் நீர் தேங்குவதை தவிர்க்க தெளிப்பு நீர்ப்பாசனத்தை குறைக்கவும்."
        elif thermal_score > 50:
            cause_en = "Severe transpiration suppression and root-zone water deficit aggravated by ambient thermal load."
            cause_ta = "மண்ணில் நீர் பற்றாக்குறை மற்றும் அதிக வெப்பத்தால் பயிரில் நீர்ச்சத்து இழப்பு."
            action_en = "1. Deliver 35 mm emergency drip fertigation within 12 hours.\n2. Apply Kaolin clay foliar spray (3%) to reduce solar radiation stress."
            action_ta = "1. அடுத்த 12 மணி நேரத்திற்குள் 35 மி.மீ நீர்ப்பாசனம் அளிக்கவும்.\n2. சூரிய வெப்பத்தை குறைக்க கயோலின் களிமண் கரைசல் (3%) தெளிக்கவும்."
        else:
            cause_en = "Sub-optimal soil nutrient availability or moderate evaporative stress."
            cause_ta = "மண்ணில் ஊட்டச்சத்து குறைபாடு அல்லது மிதமான நீர் ஆவியாதல் அழுத்தம்."
            action_en = "1. Check soil nitrogen and phosphorus availability.\n2. Irrigate during cooler early morning hours."
            action_ta = "1. மண் தழைச்சத்து மற்றும் மணிச்சத்து அளவை சரிபார்க்கவும்.\n2. அதிகாலை வேளையில் நீர்ப்பாசனம் செய்யவும்."

        confidence = round(85.0 + (min(10.0, abs(50.0 - composite_stress) / 5.0)), 1)

        return {
            "success": True,
            "system": "Arka-assist Multimodal Fusion Engine (v1.0)",
            "data_integrity_notice": "Prototype Multimodal CV Engine combining simulated RGB visual diagnosis and thermal IR indicators.",
            "inputs_fused": {
                "crop_name": crop_name,
                "crop_stage": crop_stage,
                "rgb_indicator": rgb_hint,
                "thermal_indicator": thermal_hint,
                "soil_moisture_pct": soil_moisture,
                "soil_ph": soil_ph,
                "air_temperature_celsius": air_temp,
                "humidity_pct": humidity
            },
            "domain_findings": {
                "rgb_visual_analysis": {
                    "findings_en": visual_findings_en,
                    "findings_ta": visual_findings_ta,
                    "sub_score": rgb_stress_factor
                },
                "thermal_ir_analysis": {
                    "canopy_temperature": thermal_res["canopy_temperature"]["mean_celsius"],
                    "delta_t": thermal_res["canopy_temperature"]["delta_t_celsius"],
                    "affected_region": thermal_res["affected_region"],
                    "sub_score": thermal_score
                },
                "environmental_stress_score": weather_stress
            },
            "overall_stress_assessment": {
                "composite_score": composite_stress,
                "health_score": round(100.0 - composite_stress, 1),
                "level_en": level_en,
                "level_ta": level_ta,
                "severity": severity
            },
            "root_cause_explanation": {
                "cause_en": cause_en,
                "cause_ta": cause_ta
            },
            "actionable_recommendation": {
                "action_en": action_en,
                "action_ta": action_ta
            },
            "model_confidence_pct": confidence
        }
