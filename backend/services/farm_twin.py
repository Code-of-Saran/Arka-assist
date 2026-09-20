"""
ARKA-ASSIST — 3D Digital Farm Twin Model Service
Maintains geometric coordinate structures, live agronomic telemetry,
and real-time stress status for the farmer's 3D digital farm twin.
"""

FARM_TWIN_DATA = {
    "farm_metadata": {
        "farm_id": "arka-farm-01",
        "farm_name": "Arka-assist Demo Smart Farm",
        "farmer_name": "VSBCETC [CSE PROJECT]",
        "total_area": "4.5 Acres",
        "location": "Coimbatore, Tamil Nadu",
        "soil_type": "Clay Loam",
        "irrigation_type": "Automated Drip & Borewell",
        "weather_station": "Coimbatore Agromet Station (28.5°C, 68% RH)"
    },
    "parcels": [
        {
            "id": "field-1",
            "name": "North Parcel (Field 1)",
            "name_ta": "வடக்கு நிலம் (பகுதி 1)",
            "area": "1.8 Acres",
            "crop": "Rice (Paddy)",
            "crop_ta": "நெல் (பயறு)",
            "crop_icon": "🌾",
            "growth_stage": "Active Tillering",
            "days_after_sowing": 42,
            "health_score": 88,
            "status_state": "healthy", # "healthy" | "warning" | "critical"
            "status_badge": "Optimal Growth",
            "telemetry": {
                "temperature_celsius": 28.2,
                "moisture_pct": 72.0,
                "stress_level": "Low (Healthy)",
                "stress_level_ta": "குறைந்த அழுத்தம்",
                "nitrogen_status": "Adequate (80 mg/kg)",
                "irrigation_status": "Flooded (3 cm standing water)"
            },
            "position_3d": {"x": -2.2, "y": 0.1, "z": -2.2, "width": 3.6, "depth": 3.6, "height": 0.2},
            "color_hex": "#10B981", # Green
            "recommended_action": "Maintain 3 cm standing water level. Scheduled second split of urea for Day 45."
        },
        {
            "id": "field-2",
            "name": "East Parcel (Field 2)",
            "name_ta": "கிழக்கு நிலம் (பகுதி 2)",
            "area": "1.2 Acres",
            "crop": "Cotton (Bt Long Staple)",
            "crop_ta": "பருத்தி",
            "crop_icon": "🌱",
            "growth_stage": "Square Formation & Early Flowering",
            "days_after_sowing": 65,
            "health_score": 64,
            "status_state": "warning",
            "status_badge": "Thermal Stress Warning",
            "telemetry": {
                "temperature_celsius": 34.1,
                "moisture_pct": 45.0,
                "stress_level": "Moderate Canopy Hyperthermia",
                "stress_level_ta": "மிதமான வெப்ப அழுத்தம்",
                "nitrogen_status": "Moderate (65 mg/kg)",
                "irrigation_status": "Drip deficit in Row 12-18"
            },
            "position_3d": {"x": 2.2, "y": 0.1, "z": -2.2, "width": 3.6, "depth": 3.6, "height": 0.2},
            "color_hex": "#F59E0B", # Amber
            "recommended_action": "Deliver 30 mm targeted drip cycle in Row 12-18 to restore canopy cooling."
        },
        {
            "id": "field-3",
            "name": "South Parcel (Field 3)",
            "name_ta": "தெற்கு நிலம் (பகுதி 3)",
            "area": "1.0 Acres",
            "crop": "Banana (Grand Naine)",
            "crop_ta": "வாழை",
            "crop_icon": "🍌",
            "growth_stage": "Shooting & Bunch Development",
            "days_after_sowing": 240,
            "health_score": 95,
            "status_state": "healthy",
            "status_badge": "Flourishing Orchard",
            "telemetry": {
                "temperature_celsius": 27.5,
                "moisture_pct": 80.0,
                "stress_level": "None (Thriving)",
                "stress_level_ta": "அழுத்தம் இல்லை (நன்று)",
                "nitrogen_status": "High (95 mg/kg)",
                "irrigation_status": "Optimal Drip Mulched"
            },
            "position_3d": {"x": -2.2, "y": 0.1, "z": 2.2, "width": 3.6, "depth": 3.6, "height": 0.2},
            "color_hex": "#059669", # Deep Green
            "recommended_action": "Apply potash fertilizer to plump up fingers. Provide sturdy propping."
        },
        {
            "id": "field-4",
            "name": "West Parcel (Field 4)",
            "name_ta": "மேற்கு நிலம் (பகுதி 4)",
            "area": "0.5 Acres",
            "crop": "Tomato (Hybrid Red)",
            "crop_ta": "தக்காளி",
            "crop_icon": "🍅",
            "growth_stage": "Fruit Maturation & Harvesting",
            "days_after_sowing": 75,
            "health_score": 58,
            "status_state": "warning",
            "status_badge": "Foliar Spot Alert",
            "telemetry": {
                "temperature_celsius": 32.8,
                "moisture_pct": 50.0,
                "stress_level": "Mild Pathogen Risk",
                "stress_level_ta": "லேசான நோய் எச்சரிக்கை",
                "nitrogen_status": "Adequate (72 mg/kg)",
                "irrigation_status": "Normal"
            },
            "position_3d": {"x": 2.2, "y": 0.1, "z": 2.2, "width": 3.6, "depth": 3.6, "height": 0.2},
            "color_hex": "#EF4444", # Red
            "recommended_action": "Inspect lower leaves for Alternaria early blight. Spray organic neem formulation."
        }
    ]
}

class FarmTwinService:
    def get_digital_twin(self):
        """Returns the complete 3D digital farm twin state."""
        return {
            "success": True,
            "system": "Arka-assist 3D Digital Farm Model",
            "farm_data": FARM_TWIN_DATA
        }
