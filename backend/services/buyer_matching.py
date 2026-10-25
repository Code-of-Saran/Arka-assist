"""
ARKA-ASSIST — Transparent Farmer to Buyer Matching Service
Ranks verified institutional buyers and agri-producers using an explainable,
multi-criteria compatibility algorithm.

Data Integrity & Honesty:
- Buyer records are explicitly flagged as DEMO_DATA / SIMULATED profiles
- Matching algorithm is 100% explainable rule-based scoring (RULE_BASED)
- Detailed score breakdown (Crop, Volume, Proximity, Timing, Quality) with explicit match reasons
"""

DEMO_BUYER_PROFILES = [
    {
        "id": "buyer-01",
        "name": "Kongu Modern Rice Mills Pvt Ltd (Demo)",
        "company_type": "Grain Processing & Milling",
        "target_crops": ["rice", "paddy"],
        "min_quantity_quintals": 20,
        "max_quantity_quintals": 500,
        "price_expectation_per_quintal": 2450,
        "preferred_district": "Coimbatore",
        "location": "Pollachi Main Road, Coimbatore",
        "delivery_window": "3 to 5 business days",
        "quality_requirements": "Grade A (Moisture < 14%, Impurities < 2%)",
        "min_quality_grade": "Grade A",
        "pickup_service": True,
        "payment_term": "Immediate Bank Transfer on Weighment",
        "data_source": "DEMO_DATA"
    },
    {
        "id": "buyer-02",
        "name": "Coimbatore Agro-Producers Consortium (Demo)",
        "company_type": "Farmer Producer Organization (FPO)",
        "target_crops": ["rice", "maize", "cotton", "banana", "tomato"],
        "min_quantity_quintals": 10,
        "max_quantity_quintals": 300,
        "price_expectation_per_quintal": 2380,
        "preferred_district": "Coimbatore",
        "location": "RS Puram, Coimbatore",
        "delivery_window": "1 to 3 business days",
        "quality_requirements": "Grade B or above (Accepts fair average quality)",
        "min_quality_grade": "Grade B",
        "pickup_service": True,
        "payment_term": "Same-day Settlement",
        "data_source": "DEMO_DATA"
    },
    {
        "id": "buyer-03",
        "name": "Tirupur Eco-Cotton Spinners (Demo)",
        "company_type": "Textile Ginning & Spinning Mill",
        "target_crops": ["cotton"],
        "min_quantity_quintals": 15,
        "max_quantity_quintals": 400,
        "price_expectation_per_quintal": 7350,
        "preferred_district": "Tirupur",
        "location": "Avinashi Road, Tirupur",
        "delivery_window": "Weekly procurement schedule",
        "quality_requirements": "Grade A (Staple length > 28mm, Trash < 3%)",
        "min_quality_grade": "Grade A",
        "pickup_service": True,
        "payment_term": "48-Hour Electronic Clearing",
        "data_source": "DEMO_DATA"
    },
    {
        "id": "buyer-04",
        "name": "Nilgiri Fresh Organics Ltd (Demo)",
        "company_type": "Horticulture Cold Chain Exporter",
        "target_crops": ["banana", "tomato", "fruits"],
        "min_quantity_quintals": 15,
        "max_quantity_quintals": 120,
        "price_expectation_per_quintal": 1950,
        "preferred_district": "Coimbatore",
        "location": "Mettupalayam Highway, Coimbatore",
        "delivery_window": "24 to 48 hours (Cold-chain dispatch)",
        "quality_requirements": "Grade A+ (Uniform color, pesticide residue certified)",
        "min_quality_grade": "Grade A+",
        "pickup_service": True,
        "payment_term": "Instant Spot Payment",
        "data_source": "DEMO_DATA"
    },
    {
        "id": "buyer-05",
        "name": "Apex Poultry Feeds & Grains (Demo)",
        "company_type": "Livestock Feed Manufacturer",
        "target_crops": ["maize", "rice"],
        "min_quantity_quintals": 25,
        "max_quantity_quintals": 800,
        "price_expectation_per_quintal": 2180,
        "preferred_district": "Namakkal",
        "location": "Tiruchengode Road, Namakkal",
        "delivery_window": "Within 7 business days",
        "quality_requirements": "Grade B (Moisture < 15%)",
        "min_quality_grade": "Grade B",
        "pickup_service": False,
        "payment_term": "Direct RTGS Transfer",
        "data_source": "DEMO_DATA"
    }
]

class BuyerMatchingService:
    def __init__(self):
        self.buyers = DEMO_BUYER_PROFILES

    def match_buyers(self, crop_name="Rice (Paddy)", quantity_quintals=45,
                     expected_price=2400, district="Coimbatore", quality_grade="Grade A+"):
        """
        Transparent matching algorithm:
        1. Crop match (30%)
        2. Quantity range match (25%)
        3. Proximity / Location match (20%)
        4. Price alignment (15%)
        5. Quality compatibility (10%)
        """
        crop_clean = crop_name.lower()
        district_clean = district.lower()
        scored_buyers = []

        for buyer in self.buyers:
            # 1. Crop Match
            crop_match = any(tc in crop_clean or crop_clean in tc for tc in buyer["target_crops"])
            crop_score = 30.0 if crop_match else 0.0

            # If crop does not match at all, omit or heavily penalize
            if not crop_match:
                continue

            # 2. Quantity Match
            q_min = buyer["min_quantity_quintals"]
            q_max = buyer["max_quantity_quintals"]
            if q_min <= quantity_quintals <= q_max:
                quantity_score = 25.0
            elif quantity_quintals < q_min:
                quantity_score = max(5.0, 25.0 - ((q_min - quantity_quintals) * 0.5))
            else:
                quantity_score = max(10.0, 25.0 - ((quantity_quintals - q_max) * 0.05))

            # 3. Location Proximity
            buyer_dist = buyer["preferred_district"].lower()
            if buyer_dist in district_clean or district_clean in buyer_dist:
                location_score = 20.0
            else:
                location_score = 10.0

            # 4. Price Alignment
            buyer_offered = buyer["price_expectation_per_quintal"]
            if buyer_offered >= expected_price:
                price_score = 15.0
            else:
                price_diff_pct = (expected_price - buyer_offered) / expected_price
                price_score = max(0.0, round(15.0 * (1.0 - price_diff_pct), 1))

            # 5. Quality Compatibility
            grade_hierarchy = {"Grade B": 1, "Grade A": 2, "Grade A+": 3}
            req_rank = grade_hierarchy.get(buyer["min_quality_grade"], 1)
            offer_rank = grade_hierarchy.get(quality_grade, 2)
            quality_score = 10.0 if offer_rank >= req_rank else 4.0

            total_score = round(crop_score + quantity_score + location_score + price_score + quality_score, 1)

            # Explicit reason string (Phase 11 Requirement)
            reasons = [
                f"Matched because buyer procures {crop_name}",
                f"requires {q_min}–{q_max} quintals (offering: {quantity_quintals} q)",
                f"located in {buyer['preferred_district']} ({'within local district' if location_score == 20 else 'neighboring district'})"
            ]
            match_reason = "; ".join(reasons) + "."

            scored_buyers.append({
                "buyer_id": buyer["id"],
                "name": buyer["name"],
                "company_type": buyer["company_type"],
                "match_score": total_score,
                "match_score_pct": f"{total_score}%",
                "match_reason": match_reason,
                "score_breakdown": {
                    "crop_match_score": crop_score,
                    "quantity_score": quantity_score,
                    "location_score": location_score,
                    "price_score": price_score,
                    "quality_score": quality_score
                },
                "buyer_offering_price": buyer_offered,
                "expected_price": expected_price,
                "preferred_district": buyer["preferred_district"],
                "location": buyer["location"],
                "delivery_window": buyer["delivery_window"],
                "quality_requirements": buyer["quality_requirements"],
                "pickup_service": buyer["pickup_service"],
                "payment_term": buyer["payment_term"],
                "data_source": buyer["data_source"]
            })

        scored_buyers.sort(key=lambda x: x["match_score"], reverse=True)

        return {
            "success": True,
            "status_type": "RULE_BASED",
            "model_engine": "Arka-assist Transparent Matching Rule Engine (v2.0)",
            "data_notice": "Institutional buyer profiles are demo datasets for testing agricultural matchmaking algorithms.",
            "total_matches": len(scored_buyers),
            "matched_buyers": scored_buyers,
            "best_buyer_matches": scored_buyers
        }
