"""
ARKA-ASSIST — AI Buyer Matching Engine
Ranks potential wholesale agro-buyers using a multi-factor transparent scoring algorithm
incorporating crop suitability, volume capacity, geographic proximity, price alignment,
and quality standards.
"""

VERIFIED_BUYERS = [
    {
        "id": "buyer-01",
        "name": "Kongu Modern Rice Mills Pvt Ltd",
        "company_type": "Grain Processing & Milling",
        "target_crops": ["rice", "paddy"],
        "min_quantity_quintals": 20,
        "max_quantity_quintals": 500,
        "max_price_per_quintal": 2450,
        "preferred_district": "Coimbatore",
        "location": "Pollachi Main Road, Coimbatore",
        "min_quality_grade": "Grade A",
        "pickup_service": True,
        "payment_term": "Immediate Bank Transfer on Weighment"
    },
    {
        "id": "buyer-02",
        "name": "Coimbatore Agro-Producers Consortium",
        "company_type": "Farmer Producer Organization (FPO)",
        "target_crops": ["rice", "maize", "cotton", "banana", "tomato"],
        "min_quantity_quintals": 10,
        "max_quantity_quintals": 300,
        "max_price_per_quintal": 2380,
        "preferred_district": "Coimbatore",
        "location": "RS Puram, Coimbatore",
        "min_quality_grade": "Grade B",
        "pickup_service": True,
        "payment_term": "Same-day Settlement"
    },
    {
        "id": "buyer-03",
        "name": "Tirupur Eco-Cotton Spinners",
        "company_type": "Textile Ginning & Spinning Mill",
        "target_crops": ["cotton"],
        "min_quantity_quintals": 15,
        "max_quantity_quintals": 400,
        "max_price_per_quintal": 7350,
        "preferred_district": "Tirupur",
        "location": "Avinashi Road, Tirupur",
        "min_quality_grade": "Grade A",
        "pickup_service": True,
        "payment_term": "48-Hour Electronic Clearing"
    },
    {
        "id": "buyer-04",
        "name": "Nilgiri Fresh Organics Ltd",
        "company_type": "Horticulture Cold Chain Exporter",
        "target_crops": ["banana", "tomato", "fruits"],
        "min_quantity_quintals": 15,
        "max_quantity_quintals": 120,
        "max_price_per_quintal": 1950,
        "preferred_district": "Coimbatore",
        "location": "Mettupalayam Highway, Coimbatore",
        "min_quality_grade": "Grade A+",
        "pickup_service": True,
        "payment_term": "Instant Spot Payment"
    },
    {
        "id": "buyer-05",
        "name": "Apex Poultry Feeds & Grains",
        "company_type": "Livestock Feed Manufacturer",
        "target_crops": ["maize", "rice"],
        "min_quantity_quintals": 25,
        "max_quantity_quintals": 800,
        "max_price_per_quintal": 2180,
        "preferred_district": "Namakkal",
        "location": "Tiruchengode Road, Namakkal",
        "min_quality_grade": "Grade B",
        "pickup_service": False,
        "payment_term": "Direct RTGS Transfer"
    }
]

class BuyerMatchingService:
    def match_buyers(self, crop_name="Rice (Paddy)", quantity_quintals=45,
                     expected_price=2400, district="Coimbatore", quality_grade="Grade A+"):
        """
        Calculates weighted match score for each buyer:
        - Crop Compatibility (30%)
        - Quantity Fit (20%)
        - Distance / District Proximity (20%)
        - Price Alignment (15%)
        - Quality Grade Compatibility (15%)
        """
        crop_clean = crop_name.lower()
        district_clean = district.lower()
        scored_buyers = []

        for buyer in VERIFIED_BUYERS:
            # 1. Crop compatibility (30 pts)
            crop_score = 0.0
            for tc in buyer["target_crops"]:
                if tc in crop_clean or crop_clean in tc:
                    crop_score = 30.0
                    break
            if crop_score == 0:
                continue # Skip completely incompatible buyers

            # 2. Quantity compatibility (20 pts)
            qty = float(quantity_quintals)
            if buyer["min_quantity_quintals"] <= qty <= buyer["max_quantity_quintals"]:
                qty_score = 20.0
            elif qty < buyer["min_quantity_quintals"]:
                qty_score = max(5.0, 20.0 - (buyer["min_quantity_quintals"] - qty))
            else:
                qty_score = 15.0 # Exceeds max, but buyers usually accept partial

            # 3. Distance / Location proximity (20 pts)
            if district_clean in buyer["preferred_district"].lower():
                dist_score = 20.0
            elif "tamil nadu" in buyer["location"].lower():
                dist_score = 14.0
            else:
                dist_score = 8.0

            # 4. Price compatibility (15 pts)
            exp_p = float(expected_price)
            max_p = float(buyer["max_price_per_quintal"])
            if max_p >= exp_p:
                price_score = 15.0
            else:
                diff_pct = (exp_p - max_p) / exp_p
                price_score = max(2.0, 15.0 - (diff_pct * 30.0))

            # 5. Quality compatibility (15 pts)
            if "A+" in quality_grade:
                quality_score = 15.0 # Highest grade satisfies all buyers
            elif "A" in quality_grade and buyer["min_quality_grade"] in ["Grade A", "Grade B"]:
                quality_score = 15.0
            elif "B" in quality_grade and buyer["min_quality_grade"] == "Grade B":
                quality_score = 13.0
            else:
                quality_score = 8.0

            total_match = round(crop_score + qty_score + dist_score + price_score + quality_score, 1)

            # Generate explainability reasons
            highlights = []
            if crop_score == 30.0:
                highlights.append("Direct crop requirement match")
            if dist_score == 20.0:
                highlights.append(f"Located in same district ({buyer['preferred_district']})")
            if price_score == 15.0:
                highlights.append(f"Price matches budget (Max offer: ₹{buyer['max_price_per_quintal']})")
            if buyer["pickup_service"]:
                highlights.append("Offers on-farm harvest pickup")

            scored_buyers.append({
                "buyer_id": buyer["id"],
                "name": buyer["name"],
                "company_type": buyer["company_type"],
                "location": buyer["location"],
                "match_percentage": total_match,
                "max_offered_price": f"₹{buyer['max_price_per_quintal']}/quintal",
                "payment_term": buyer["payment_term"],
                "pickup_available": buyer["pickup_service"],
                "score_breakdown": {
                    "crop_compatibility": f"{crop_score}/30",
                    "quantity_fit": f"{round(qty_score, 1)}/20",
                    "proximity": f"{dist_score}/20",
                    "price_alignment": f"{round(price_score, 1)}/15",
                    "quality_fit": f"{round(quality_score, 1)}/15"
                },
                "highlights": highlights
            })

        # Rank by match score descending
        scored_buyers.sort(key=lambda x: x["match_percentage"], reverse=True)

        return {
            "success": True,
            "system": "Arka-assist AI Buyer Matching Algorithm",
            "scoring_weights": "Crop (30%) + Quantity (20%) + Distance (20%) + Price (15%) + Quality (15%)",
            "total_matches_found": len(scored_buyers),
            "best_buyer_matches": scored_buyers
        }
