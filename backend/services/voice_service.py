"""
ARKA-ASSIST — Voice Command and Conversational Speech Service
Processes speech-recognized queries, maps spoken intent to application routes/actions,
and provides natural language voice responses for Text-to-Speech playback in English & Tamil.
"""

import re

VOICE_COMMAND_REGISTRY = [
    {
        "intent": "crop_health",
        "route": "/daily-analysis",
        "keywords": ["crop health", "plant health", "crop status", "health of crop", "பயிர் நலம்", "பயிர் நிலை", "பயிர் ஆரோக்கியம்"],
        "speech_en": "Opening your Daily Crop Health Analysis. Current overall canopy rating is 82 percent with moderate temperature stress in Field 2.",
        "speech_ta": "தினசரி பயிர் ஆரோக்கிய பகுப்பாய்வை திறக்கிறேன். தற்போதைய ஒட்டுமொத்த பயிர் நலன் 82 சதவீதமாக உள்ளது."
    },
    {
        "intent": "weather_forecast",
        "route": "/weather",
        "keywords": ["weather", "temperature", "rain", "climate", "forecast", "வானிலை", "மழை", "வெப்பநிலை"],
        "speech_en": "Navigating to Weather and Agro-Meteorology. Today is 28.5 degrees Celsius in Coimbatore with 68 percent humidity.",
        "speech_ta": "வானிலை பக்கத்திற்கு செல்கிறேன். கோயம்புத்தூரில் இன்றைய வெப்பநிலை 28.5 டிகிரி செல்சியஸ், மழை வாய்ப்பு குறைவு."
    },
    {
        "intent": "farm_digital_twin",
        "route": "/farm-3d",
        "keywords": ["show my farm", "analyze my farm", "3d farm", "farm model", "digital twin", "பண்ணை", "பண்ணை மாதிரி", "பண்ணை ஆய்வு", "நிலம்"],
        "speech_en": "Loading your 3D Digital Twin Farm Model. You have 4 active field parcels under monitoring.",
        "speech_ta": "உங்கள் 3D டிஜிட்டல் பண்ணை மாதிரியை திறக்கிறேன். உங்கள் 4 நிலப்பகுதிகளும் கண்காணிப்பில் உள்ளன."
    },
    {
        "intent": "market_prices",
        "route": "/market",
        "keywords": ["market price", "mandi price", "today price", "rate", "price of crop", "சந்தை விலை", "மண்டி விலை", "இன்றைய விலை", "விலை விவரம்"],
        "speech_en": "Opening Daily Market Intelligence. Paddy is trading at 2,350 rupees per quintal, up 6 percent this week.",
        "speech_ta": "சந்தை நுண்ணறிவு பக்கத்தை திறக்கிறேன். நெல் குவிண்டாலுக்கு 2,350 ரூபாயாக 6 சதவீதம் உயர்ந்துள்ளது."
    },
    {
        "intent": "sell_wait_decision",
        "route": "/sell-decision",
        "keywords": ["should i sell", "sell my crop", "sell or wait", "sell now", "harvest decision", "விற்பனை", "விற்கலாமா", "காத்திருக்கலாமா", "பயிர் விற்பனை"],
        "speech_en": "Opening AI Sell or Wait Decision. Current recommendation is to WAIT for 7 to 10 days due to rising price momentum.",
        "speech_ta": "விற்பனை முடிவு பக்கத்திற்கு செல்கிறேன். விலை உயர்வு காரணமாக 7 முதல் 10 நாட்கள் காத்திருக்க பரிந்துரைக்கப்படுகிறது."
    },
    {
        "intent": "crop_recommendation",
        "route": "/crop-recommendation",
        "keywords": ["crop recommendation", "recommend crop", "which crop", "suggest crop", "பயிர் பரிந்துரை", "பயிர் தேர்வு", "என்ன பயிர் செய்யலாம்"],
        "speech_en": "Opening AI Crop Recommendation Engine. Input your soil NPK values to calculate the optimal crop.",
        "speech_ta": "பயிர் பரிந்துரை பக்கத்திற்கு செல்கிறேன். உங்கள் மண் NPK அளவுகளை உள்ளிட்டு உகந்த பயிரை அறியலாம்."
    },
    {
        "intent": "daily_actions",
        "route": "/dashboard",
        "keywords": ["advice", "farming advice", "daily action", "what should i do", "today plan", "விவசாய ஆலோசனை", "இன்றைய வேலை", "ஆலோசனை"],
        "speech_en": "Displaying today's prioritized action plan. High priority: check Field 2 thermal canopy for moisture deficit.",
        "speech_ta": "இன்றைய முன்னுரிமை விவசாய பணிகளை காட்டுகிறேன். முக்கிய பணி: நிலம் 2-ல் ஈரப்பத குறைபாட்டை சரிபார்க்கவும்."
    },
    {
        "intent": "thermal_analysis",
        "route": "/thermal",
        "keywords": ["thermal", "thermal image", "heat map", "canopy temp", "வெப்ப படம்", "வெப்ப ஆய்வு", "கனோபி"],
        "speech_en": "Opening Thermal Crop Imaging. Analyze transpiration stress and canopy temperature hotspots.",
        "speech_ta": "வெப்பநிலை பயிர் பட ஆய்வை திறக்கிறேன். பயிர் வெப்ப அழுத்தங்களை ஆய்வு செய்யலாம்."
    },
    {
        "intent": "multimodal_analysis",
        "route": "/multimodal",
        "keywords": ["multimodal", "rgb thermal", "dual image", "combined analysis", "பல்நோக்கு", "இரட்டை ஆய்வு"],
        "speech_en": "Opening Multimodal Analysis Engine, fusing RGB imagery, thermal infrared, and environmental telemetry.",
        "speech_ta": "பல்நோக்கு பயிர் ஆய்வு எஞ்சினை திறக்கிறேன். நிறப்படம் மற்றும் வெப்ப படங்களை ஒருங்கிணைத்து ஆய்வு செய்யலாம்."
    },
    {
        "intent": "marketplace",
        "route": "/marketplace",
        "keywords": ["marketplace", "sell product", "buyers", "list crop", "சந்தை தளம்", "பயிர் பட்டியல்", "விளைபொருள் விற்பனை"],
        "speech_en": "Opening Farmer to Buyer Marketplace. You can list your harvest or review active buyer bids.",
        "speech_ta": "விவசாயி சந்தை தளத்தை திறக்கிறேன். உங்கள் விளைபொருட்களை பட்டியலிட்டு வாங்குவோரை தொடர்புகொள்ளலாம்."
    },
    {
        "intent": "buyer_matching",
        "route": "/buyer-matching",
        "keywords": ["buyer match", "matching buyers", "find buyers", "best buyers", "கொள்முதல் செய்வோர்", "வாங்குவோர் பொருத்தம்"],
        "speech_en": "Opening AI Buyer Matching. Viewing ranked agro-buyers based on price, location, and volume compatibility.",
        "speech_ta": "AI வாங்குவோர் பொருத்தத்தை திறக்கிறேன். உங்கள் பயிருக்கு ஏற்ற சிறந்த வாங்குவோரை தரவரிசைப்படுத்துகிறது."
    }
]

class VoiceService:
    def process_voice_query(self, transcript, language="en"):
        """
        Parses recognized voice transcript and determines if it is a navigation command
        or an agronomic advisory question.
        """
        if not transcript or not transcript.strip():
            return {
                "success": False,
                "type": "error",
                "message_en": "No voice input was detected. Please try speaking again.",
                "message_ta": "குரல் கேட்கவில்லை. தயவுசெய்து மீண்டும் பேசவும்."
            }

        cleaned = transcript.lower().strip()

        # Check for matched voice commands
        best_cmd = None
        max_len = 0
        for cmd in VOICE_COMMAND_REGISTRY:
            for kw in cmd["keywords"]:
                if kw.lower() in cleaned:
                    if len(kw) > max_len:
                        max_len = len(kw)
                        best_cmd = cmd

        if best_cmd:
            return {
                "success": True,
                "type": "navigation_action",
                "intent": best_cmd["intent"],
                "target_route": best_cmd["route"],
                "recognized_text": transcript,
                "speech_response": best_cmd[f"speech_{language}"] if f"speech_{language}" in best_cmd else best_cmd["speech_en"],
                "action_type": "navigate"
            }

        # Otherwise it is an open conversational query for Arka-assist AI
        return {
            "success": True,
            "type": "conversational_query",
            "intent": "general_farming_query",
            "recognized_text": transcript,
            "action_type": "chat_query"
        }
