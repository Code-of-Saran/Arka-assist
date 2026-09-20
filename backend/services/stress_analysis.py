"""
ARKA-ASSIST — Crop Stress Analysis Engine
Calculates normalized physiological stress indices based on thermal canopy differentials,
environmental indicators, and agronomic thresholds. Clearly demarcates prototype indicators.
"""

def evaluate_stress_level(stress_score):
    """Classifies numerical stress score (0-100) into clinical agronomic tiers."""
    if stress_score < 25:
        return "Healthy", "ஆரோக்கியமானது", "low"
    elif stress_score < 50:
        return "Mild Stress", "லேசான மன அழுத்தம்", "moderate"
    elif stress_score < 75:
        return "Moderate Stress", "மிதமான பாதிப்பு", "high"
    else:
        return "Severe Stress", "தீவிர பாதிப்பு", "critical"

class StressAnalysisEngine:
    def analyze_canopy_differential(self, canopy_temp, air_temp, soil_moisture_pct=50.0):
        """
        Calculates CWSI (Crop Water Stress Index) proxy based on Canopy-Air Temperature Difference (CATD).
        A canopy warmer than ambient air usually indicates transpiration shutdown / moisture stress.
        """
        delta_t = float(canopy_temp) - float(air_temp)
        
        # Base stress calculation
        # If canopy is 3°C hotter than air with low soil moisture (<40%), high stress
        stress_score = 15.0
        
        if delta_t > 4.0:
            stress_score += 50.0
        elif delta_t > 2.0:
            stress_score += 35.0
        elif delta_t > 0.0:
            stress_score += 15.0
        else: # Canopy is cooler than air (healthy evaporative cooling)
            stress_score = max(5.0, stress_score - 10.0)

        # Soil moisture adjustment
        if soil_moisture_pct < 35.0:
            stress_score += 25.0
        elif soil_moisture_pct < 50.0:
            stress_score += 10.0
        elif soil_moisture_pct > 80.0: # Waterlogging risk
            stress_score += 15.0

        stress_score = min(100.0, max(0.0, round(stress_score, 1)))
        level_en, level_ta, severity = evaluate_stress_level(stress_score)

        return {
            "stress_score": stress_score,
            "level_en": level_en,
            "level_ta": level_ta,
            "severity": severity,
            "delta_t": round(delta_t, 2),
            "canopy_temp": round(float(canopy_temp), 1),
            "air_temp": round(float(air_temp), 1),
            "transpiration_state": "Optimal Evaporative Cooling" if delta_t <= 0 else "Inhibited Transpiration / Stomatal Resistance"
        }
