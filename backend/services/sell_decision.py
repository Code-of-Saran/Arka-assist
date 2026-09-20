"""
ARKA-ASSIST — AI Sell / Wait Decision Engine
Calculates explainable recommendations (SELL NOW vs. WAIT) by evaluating price momentum,
crop post-harvest perishability, thermal stress, meteorological risk, and storage holding costs.
"""

from services.market_service import MarketService

class SellDecisionEngine:
    def __init__(self):
        self.market_service = MarketService()

    def evaluate_decision(self, crop_key="rice", crop_condition="Good",
                          days_to_perish=21, thermal_stress="Low",
                          weather_risk="Low", storage_available=True):
        """
        Multivariate decision matrix:
        1. Market Momentum (Weight 35%): Positive upward trend favors WAIT; negative trend favors SELL NOW.
        2. Crop Perishability & Condition (Weight 30%): Fragile/stressed crop forces SELL NOW to avoid rot.
        3. Holding Cost & Spoilage (Weight 20%): High storage cost erodes expected price gain.
        4. Weather Risk (Weight 15%): Rain/humidity increases post-harvest fungal spoilage risk.
        """
        market_info = self.market_service.get_crop_market(crop_key)["commodity"]
        current_price = market_info["current_price"]
        trend_7d_pct = market_info["price_change_7d_pct"]
        holding_cost = market_info["holding_cost_per_week"]
        is_perishable = market_info["category"] in ["Horticulture", "Vegetable"]

        # 1. Price Momentum Score (Positive = favors WAIT, Negative = favors SELL NOW)
        # Expected price trajectory over next 7 days
        expected_price_gain = round(current_price * (trend_7d_pct / 100.0) * 0.75, 1)
        net_gain_after_holding = round(expected_price_gain - holding_cost, 1)

        # 2. Risk Scoring (0-100, where higher means higher risk of waiting)
        wait_risk = 20.0

        cond_clean = (crop_condition or "Good").lower()
        if "poor" in cond_clean or "severe" in cond_clean:
            wait_risk += 50.0
        elif "moderate" in cond_clean:
            wait_risk += 25.0

        if is_perishable:
            wait_risk += 25.0
            if days_to_perish < 7:
                wait_risk += 35.0

        if "mod" in (thermal_stress or "").lower() or "high" in (thermal_stress or "").lower():
            wait_risk += 15.0

        if "high" in (weather_risk or "").lower() or "rain" in (weather_risk or "").lower():
            wait_risk += 20.0

        if not storage_available:
            wait_risk += 30.0

        # Decision Synthesis
        recommendation = "WAIT"
        rec_ta = "காத்திருங்கள் (WAIT)"
        confidence = 74.0
        reason_en = ""
        reason_ta = ""

        # If net financial gain is negative or wait risk is critical (>65%), SELL NOW
        if net_gain_after_holding <= 0 or wait_risk >= 65.0:
            recommendation = "SELL NOW"
            rec_ta = "உடனே விற்கவும் (SELL NOW)"
            confidence = min(92.0, max(68.0, round(50.0 + (wait_risk / 2.0), 1)))
            if is_perishable and days_to_perish < 7:
                reason_en = f"Crop perishability risk is elevated (shelf life ~{days_to_perish} days). Immediate sale at ₹{current_price}/quintal secures capital and avoids post-harvest rot."
                reason_ta = f"பயிர் விரைவில் அழுகும் வாய்ப்புள்ளது (வாழ்நாள் ~{days_to_perish} நாட்கள்). தற்போதைய சந்தை விலையில் (₹{current_price}) உடனே விற்பது இழப்பை தவிர்க்கும்."
            elif net_gain_after_holding <= 0:
                reason_en = f"Price trend is soft ({trend_7d_pct}%), and weekly storage holding cost (₹{holding_cost}/quintal) will diminish net returns."
                reason_ta = f"விலை சரிவு ({trend_7d_pct}%) மற்றும் சேமிப்பு வாடகை (₹{holding_cost}/வாரம்) நிகர லாபத்தை குறைக்கும்."
            else:
                reason_en = "Crop condition and weather risks outweigh modest market gains. Immediate offloading is advisable."
                reason_ta = "பயிர் நிலை மற்றும் வானிலை அபாயங்கள் காரணமாக உடனே சந்தைப்படுத்துவது சிறந்தது."
        else:
            recommendation = "WAIT"
            rec_ta = "காத்திருங்கள் (WAIT)"
            confidence = min(90.0, max(70.0, round(65.0 + (trend_7d_pct * 1.5), 1)))
            reason_en = f"Favorable upward price momentum (+{trend_7d_pct}% over 7 days) and healthy crop condition warrant waiting 7-10 days for peak realization."
            reason_ta = f"விலை ஏற்றப் போக்கு (+{trend_7d_pct}%) மற்றும் பயிர் ஆரோக்கியம் சீராக உள்ளதால் இன்னும் 7-10 நாட்கள் காத்திருப்பது அதிக லாபம் தரும்."

        return {
            "success": True,
            "system": "Arka-assist AI Decision Support Engine",
            "disclaimer": "AI decision support guidance based on econometric indicators; not a guaranteed financial prediction.",
            "crop_evaluated": market_info["name_en"],
            "current_price": f"₹{current_price} / Quintal",
            "current_price_num": current_price,
            "trend_7d_pct": f"{'+' if trend_7d_pct > 0 else ''}{trend_7d_pct}%",
            "trend_direction": market_info["price_change_dir"],
            "crop_condition": crop_condition,
            "weather_risk": weather_risk,
            "recommendation": recommendation,
            "recommendation_ta": rec_ta,
            "confidence_pct": confidence,
            "reason_en": reason_en,
            "reason_ta": reason_ta,
            "financial_breakdown": {
                "expected_gross_gain_per_quintal": expected_price_gain,
                "estimated_holding_cost_per_week": holding_cost,
                "net_projected_weekly_benefit": net_gain_after_holding
            },
            "explainability_factors": [
                {"factor": "Market Price Trend", "weight": "35%", "impact": "Positive" if trend_7d_pct > 0 else "Negative"},
                {"factor": "Crop Perishability & Condition", "weight": "30%", "impact": "Safe" if wait_risk < 50 else "High Risk"},
                {"factor": "Holding / Storage Cost", "weight": "20%", "impact": f"₹{holding_cost}/week"},
                {"factor": "Weather Risk & Spoilage", "weight": "15%", "impact": weather_risk}
            ]
        }
