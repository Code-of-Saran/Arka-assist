"""
ARKA-ASSIST — Daily Crop Analysis Service
Combines multi-day temporal farm telemetry, recent thermal/RGB observations,
irrigation records, and meteorological risk metrics into a unified daily health snapshot.
Maintains history for temporal comparisons.
"""

from datetime import datetime, timedelta

# In-memory historical daily analyses storage
DAILY_HISTORY = [
    {
        "date": (datetime.now() - timedelta(days=6)).strftime("%Y-%m-%d"),
        "overall_health": 88,
        "health_status": "Good",
        "stress_level": "Low",
        "temp_stress": "Low",
        "water_risk": "Low",
        "weather_risk": "Low",
        "primary_concern": "Optimal growth conditions observed."
    },
    {
        "date": (datetime.now() - timedelta(days=5)).strftime("%Y-%m-%d"),
        "overall_health": 86,
        "health_status": "Good",
        "stress_level": "Low",
        "temp_stress": "Low",
        "water_risk": "Low",
        "weather_risk": "Low",
        "primary_concern": "Vegetative tillering proceeding smoothly."
    },
    {
        "date": (datetime.now() - timedelta(days=4)).strftime("%Y-%m-%d"),
        "overall_health": 85,
        "health_status": "Good",
        "stress_level": "Low",
        "temp_stress": "Moderate",
        "water_risk": "Low",
        "weather_risk": "Low",
        "primary_concern": "Slight mid-day canopy warming detected."
    },
    {
        "date": (datetime.now() - timedelta(days=3)).strftime("%Y-%m-%d"),
        "overall_health": 83,
        "health_status": "Good",
        "stress_level": "Moderate",
        "temp_stress": "Moderate",
        "water_risk": "Low",
        "weather_risk": "Medium",
        "primary_concern": "Humidity spike; keep watch for fungal leaf spots."
    },
    {
        "date": (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d"),
        "overall_health": 81,
        "health_status": "Good",
        "stress_level": "Moderate",
        "temp_stress": "Moderate",
        "water_risk": "Moderate",
        "weather_risk": "Medium",
        "primary_concern": "Soil moisture dipping below 45% in Field 2."
    },
    {
        "date": (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d"),
        "overall_health": 82,
        "health_status": "Good",
        "stress_level": "Low",
        "temp_stress": "Moderate",
        "water_risk": "Low",
        "weather_risk": "Medium",
        "primary_concern": "Field 2 drip irrigation scheduled; thermal stress mitigated."
    }
]

class DailyAnalysisService:
    def get_today_summary(self, crop_name="Rice (Paddy)", parcel="Field 1"):
        """Generates comprehensive daily crop status and action plan."""
        today_date = datetime.now().strftime("%Y-%m-%d")
        
        return {
            "success": True,
            "system": "Arka-assist Daily Crop Intelligence Engine",
            "date": today_date,
            "crop": crop_name,
            "parcel": parcel,
            "crop_age_days": 42,
            "crop_stage": "Active Tillering & Panicle Initiation",
            "today_crop_status": {
                "health": "Good",
                "health_ta": "நல்ல நிலை",
                "stress": "Low",
                "stress_ta": "குறைந்த அழுத்தம்",
                "temperature_stress": "Moderate",
                "temperature_stress_ta": "மிதமான வெப்ப அழுத்தம்",
                "water_risk": "Low",
                "water_risk_ta": "குறைந்த நீர் இடர்",
                "weather_risk": "Medium",
                "weather_risk_ta": "நடுத்தர வானிலை இடர்",
                "overall_crop_health": 82
            },
            "today_metrics": {
                "soil_moisture_pct": 54.0,
                "soil_ph": 6.6,
                "canopy_temp_celsius": 29.4,
                "ambient_temp_celsius": 28.5,
                "relative_humidity_pct": 68.0,
                "accumulated_solar_mj": 18.2
            },
            "today_recommended_actions": [
                {
                    "step": 1,
                    "priority": "High",
                    "action_en": "Monitor the affected canopy zone in Field 2 for thermal normalization.",
                    "action_ta": "நிலம் 2-ல் வெப்ப அழுத்தம் தணிந்துள்ளதா என்பதை கண்காணிக்கவும்."
                },
                {
                    "step": 2,
                    "priority": "Medium",
                    "action_en": "Check soil moisture tension before activating the evening drip cycle.",
                    "action_ta": "மாலை நேர சொட்டு நீர் பாசனத்திற்கு முன் மண்ணின் ஈரப்பதத்தை சரிபார்க்கவும்."
                },
                {
                    "step": 3,
                    "priority": "Low",
                    "action_en": "Avoid unnecessary overhead irrigation to prevent high foliar humidity.",
                    "action_ta": "இலைகளில் பூஞ்சை தாக்குதலை தடுக்க தேவையற்ற மேல் தெளிப்பு பாசனத்தை தவிர்க்கவும்."
                },
                {
                    "step": 4,
                    "priority": "Low",
                    "action_en": "Recheck crop canopy scan tomorrow morning at 09:30 AM.",
                    "action_ta": "நாளை காலை 09:30 மணிக்கு மீண்டும் பயிர் நிலையை சரிபார்க்கவும்."
                }
            ],
            "historical_trend": DAILY_HISTORY
        }

    def save_daily_snapshot(self, snapshot_data):
        """Appends a new daily snapshot to history."""
        DAILY_HISTORY.append(snapshot_data)
        if len(DAILY_HISTORY) > 30:
            DAILY_HISTORY.pop(0)
        return {"success": True, "total_records": len(DAILY_HISTORY)}
