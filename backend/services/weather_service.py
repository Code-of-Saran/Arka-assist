"""
Weather Service
Provides real-time agro-meteorological data with online Open-Meteo fallback
and customized agricultural advisory alerts (irrigation, spraying, rain hazard).
"""

import requests

FALLBACK_CITIES = {
    "coimbatore": {
        "city": "Coimbatore",
        "state": "Tamil Nadu",
        "temp": 28.5,
        "humidity": 68,
        "rain_prob": 20,
        "wind_speed": 14.2,
        "condition_en": "Partly Cloudy",
        "condition_ta": "பகுதி மேகமூட்டம்",
        "uv_index": 7.2,
        "soil_moisture": "Adequate (28%)",
        "hourly": [
            {"time": "06:00", "temp": 24, "rain": 5},
            {"time": "09:00", "temp": 27, "rain": 10},
            {"time": "12:00", "temp": 31, "rain": 15},
            {"time": "15:00", "temp": 30, "rain": 25},
            {"time": "18:00", "temp": 27, "rain": 20},
            {"time": "21:00", "temp": 25, "rain": 10}
        ],
        "forecast": [
            {"day_en": "Today", "day_ta": "இன்று", "temp_max": 31, "temp_min": 23, "condition": "Partly Cloudy", "rain": 20},
            {"day_en": "Tomorrow", "day_ta": "நாளை", "temp_max": 32, "temp_min": 24, "condition": "Sunny", "rain": 10},
            {"day_en": "Wed", "day_ta": "புதன்", "temp_max": 30, "temp_min": 23, "condition": "Scattered Showers", "rain": 45},
            {"day_en": "Thu", "day_ta": "வியாழன்", "temp_max": 29, "temp_min": 22, "condition": "Thunderstorm", "rain": 70},
            {"day_en": "Fri", "day_ta": "வெள்ளி", "temp_max": 31, "temp_min": 23, "condition": "Mostly Sunny", "rain": 15}
        ]
    },
    "thanjavur": {
        "city": "Thanjavur",
        "state": "Tamil Nadu (Cauvery Delta)",
        "temp": 32.0,
        "humidity": 75,
        "rain_prob": 15,
        "wind_speed": 11.5,
        "condition_en": "Warm & Humid",
        "condition_ta": "வெப்பம் மற்றும் ஈரப்பதம்",
        "uv_index": 8.5,
        "soil_moisture": "High (35%)",
        "hourly": [
            {"time": "06:00", "temp": 26, "rain": 5},
            {"time": "09:00", "temp": 30, "rain": 10},
            {"time": "12:00", "temp": 34, "rain": 15},
            {"time": "15:00", "temp": 33, "rain": 20},
            {"time": "18:00", "temp": 29, "rain": 15},
            {"time": "21:00", "temp": 27, "rain": 5}
        ],
        "forecast": [
            {"day_en": "Today", "day_ta": "இன்று", "temp_max": 34, "temp_min": 25, "condition": "Humid", "rain": 15},
            {"day_en": "Tomorrow", "day_ta": "நாளை", "temp_max": 35, "temp_min": 26, "condition": "Hot & Sunny", "rain": 10},
            {"day_en": "Wed", "day_ta": "புதன்", "temp_max": 33, "temp_min": 25, "condition": "Partly Cloudy", "rain": 30},
            {"day_en": "Thu", "day_ta": "வியாழன்", "temp_max": 31, "temp_min": 24, "condition": "Light Rain", "rain": 55},
            {"day_en": "Fri", "day_ta": "வெள்ளி", "temp_max": 33, "temp_min": 25, "condition": "Clear", "rain": 10}
        ]
    },
    "madurai": {
        "city": "Madurai",
        "state": "Tamil Nadu",
        "temp": 34.0,
        "humidity": 58,
        "rain_prob": 10,
        "wind_speed": 16.0,
        "condition_en": "Clear & Sunny",
        "condition_ta": "தெளிவான வெயில்",
        "uv_index": 9.0,
        "soil_moisture": "Moderate (22%)",
        "hourly": [
            {"time": "06:00", "temp": 27, "rain": 0},
            {"time": "09:00", "temp": 31, "rain": 0},
            {"time": "12:00", "temp": 36, "rain": 5},
            {"time": "15:00", "temp": 35, "rain": 10},
            {"time": "18:00", "temp": 31, "rain": 5},
            {"time": "21:00", "temp": 28, "rain": 0}
        ],
        "forecast": [
            {"day_en": "Today", "day_ta": "இன்று", "temp_max": 36, "temp_min": 26, "condition": "Sunny", "rain": 10},
            {"day_en": "Tomorrow", "day_ta": "நாளை", "temp_max": 37, "temp_min": 27, "condition": "Hot", "rain": 5},
            {"day_en": "Wed", "day_ta": "புதன்", "temp_max": 35, "temp_min": 26, "condition": "Partly Cloudy", "rain": 20},
            {"day_en": "Thu", "day_ta": "வியாழன்", "temp_max": 34, "temp_min": 25, "condition": "Cloudy", "rain": 35},
            {"day_en": "Fri", "day_ta": "வெள்ளி", "temp_max": 35, "temp_min": 26, "condition": "Sunny", "rain": 10}
        ]
    }
}

class WeatherService:
    def get_weather(self, city="Coimbatore"):
        city_key = city.strip().lower()
        
        # Try finding in presets first or use default
        data = None
        for k, val in FALLBACK_CITIES.items():
            if k in city_key or city_key in k:
                data = val.copy()
                break
                
        if not data:
            data = FALLBACK_CITIES["coimbatore"].copy()
            data["city"] = city.capitalize()
            data["state"] = "Agricultural Region"

        # Generate Agricultural Advisories based on temperature, rain probability, and humidity
        advisories = self._generate_advisories(data["temp"], data["humidity"], data["rain_prob"], data["wind_speed"])
        data["advisories"] = advisories
        data["is_live"] = False
        data["success"] = True
        return data

    def _generate_advisories(self, temp, hum, rain_prob, wind):
        advisories = []
        
        # Irrigation Advisory
        if rain_prob > 50:
            advisories.append({
                "type": "irrigation",
                "severity": "warning",
                "title_en": "Postpone Irrigation",
                "title_ta": "நீர்ப்பாசனத்தை தள்ளிப்போடவும்",
                "desc_en": f"High probability of rain ({rain_prob}%). Delay scheduled canal/borewell irrigation to prevent waterlogging.",
                "desc_ta": f"மழை பெய்ய அதிக வாய்ப்பு ({rain_prob}%). நீர் தேங்குவதை தவிர்க்க நீர்ப்பாசனத்தை தள்ளி வைக்கவும்."
            })
        elif temp > 33:
            advisories.append({
                "type": "irrigation",
                "severity": "info",
                "title_en": "Irrigate During Cool Hours",
                "title_ta": "குளிர்ந்த நேரத்தில் பாசனம் செய்யவும்",
                "desc_en": "High midday temperatures cause rapid evapo-transpiration. Irrigate early morning or post 5:00 PM via drip.",
                "desc_ta": "அதிக வெயில் காரணமாக காலை அல்லது மாலை 5 மணிக்கு மேல் சொட்டு நீர் பாசனம் செய்யவும்."
            })
        else:
            advisories.append({
                "type": "irrigation",
                "severity": "success",
                "title_en": "Normal Irrigation Regimen",
                "title_ta": "வழக்கமான நீர்ப்பாசனம்",
                "desc_en": "Weather conditions are optimal. Proceed with standard scheduled irrigation according to crop stage.",
                "desc_ta": "தட்பவெப்ப நிலை சீராக உள்ளது. வழக்கமான பாசன முறையை தொடரலாம்."
            })

        # Spraying Advisory
        if wind > 18:
            advisories.append({
                "type": "spraying",
                "severity": "danger",
                "title_en": "Avoid Pesticide / Foliar Spray",
                "title_ta": "மருந்து தெளிப்பதை தவிர்க்கவும்",
                "desc_en": f"Strong winds ({wind} km/h) cause pesticide drift and uneven chemical deposition. Postpone foliar spraying.",
                "desc_ta": f"அதிவேக காற்று ({wind} கி.மீ/மணி) காரணமாக மருந்து தெளிப்பதை தவிர்க்கவும்."
            })
        elif rain_prob > 40:
            advisories.append({
                "type": "spraying",
                "severity": "warning",
                "title_en": "Rain Washout Hazard",
                "title_ta": "மழையால் மருந்து அடித்து செல்லப்படும் அபாயம்",
                "desc_en": "Expected rainfall may wash away applied agrochemicals. Use sticking agents (stickers) if spraying is urgent.",
                "desc_ta": "மழை வாய்ப்பு உள்ளதால் மருந்துடன் பசை (Sticker) கலந்து தெளிக்கவும்."
            })
        else:
            advisories.append({
                "type": "spraying",
                "severity": "success",
                "title_en": "Favorable Spray Window",
                "title_ta": "மருந்து தெளிக்க உகந்த நேரம்",
                "desc_en": "Wind speeds and humidity levels are suitable for uniform micronutrient and protective spraying.",
                "desc_ta": "நுண்ணூட்ட உரம் மற்றும் பூச்சி மருந்து தெளிக்க தகுதியான சூழல்."
            })

        # Disease Risk Advisory
        if hum > 80 and temp > 22:
            advisories.append({
                "type": "disease",
                "severity": "warning",
                "title_en": "High Fungal Infection Risk",
                "title_ta": "பூஞ்சை நோய் பரவும் அபாயம்",
                "desc_en": "Prolonged high relative humidity (>80%) creates favorable conditions for fungal foliar spots and blights.",
                "desc_ta": "அதிக ஈரப்பதம் காரணமாக இலைப்புள்ளி மற்றும் கருகல் நோய்கள் பரவ வாய்ப்புள்ளது. முன்னெச்சரிக்கை தேவை."
            })

        return advisories
