"""
ARKA-ASSIST — Farmer to Buyer Marketplace Service
Manages farmer crop listings, buyer browsing catalogs, search filters,
and purchase inquiry messages.
"""

from datetime import datetime

# Active marketplace crop listings catalog
LISTINGS_DATABASE = [
    {
        "id": "list-001",
        "farmer_name": "VSBCETC [CSE PROJECT]",
        "crop": "Rice (Paddy - Super Ponni)",
        "quantity_quintals": 45,
        "expected_price_per_quintal": 2400,
        "location": "Coimbatore, Tamil Nadu",
        "district": "Coimbatore",
        "quality_grade": "Grade A+ (Premium Grain)",
        "harvest_date": "2026-09-25",
        "description": "Naturally cultivated paddy with low moisture content (12.5%). Golden grain appearance with excellent milling recovery.",
        "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
        "status": "Available",
        "created_at": "2026-09-07"
    },
    {
        "id": "list-002",
        "farmer_name": "Murugan Agro Farms",
        "crop": "Cotton (Long Staple Bunny)",
        "quantity_quintals": 30,
        "expected_price_per_quintal": 7250,
        "location": "Pollachi, Tamil Nadu",
        "district": "Coimbatore",
        "quality_grade": "Grade A",
        "harvest_date": "2026-10-05",
        "description": "Clean, hand-picked seed cotton with zero trash content and 32mm staple length.",
        "image_url": "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80",
        "status": "Available",
        "created_at": "2026-09-06"
    },
    {
        "id": "list-003",
        "farmer_name": "Kavitha Organic Orchard",
        "crop": "Banana (Grand Naine)",
        "quantity_quintals": 60,
        "expected_price_per_quintal": 1900,
        "location": "Mettupalayam, Tamil Nadu",
        "district": "Coimbatore",
        "quality_grade": "Grade A+ Export Quality",
        "harvest_date": "2026-09-18",
        "description": "Uniform bunches, pesticide-free organic certification in progress. Ready for prompt wholesale pickup.",
        "image_url": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80",
        "status": "Available",
        "created_at": "2026-09-08"
    },
    {
        "id": "list-004",
        "farmer_name": "Senthil Kumar",
        "crop": "Tomato (Hybrid Red)",
        "quantity_quintals": 25,
        "expected_price_per_quintal": 2250,
        "location": "Kinathukadavu, Tamil Nadu",
        "district": "Coimbatore",
        "quality_grade": "Grade A",
        "harvest_date": "2026-09-12",
        "description": "Firm, deep red tomatoes ideal for wholesale retail and institutional kitchen processing.",
        "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
        "status": "Available",
        "created_at": "2026-09-08"
    }
]

# In-memory inquiry records
INQUIRIES_DATABASE = []

class MarketplaceService:
    def get_listings(self, search="", crop="", district=""):
        """Filters marketplace listings based on query parameters."""
        results = []
        s_clean = (search or "").lower()
        c_clean = (crop or "").lower()
        d_clean = (district or "").lower()

        for item in LISTINGS_DATABASE:
            if c_clean and c_clean != "all" and c_clean not in item["crop"].lower():
                continue
            if d_clean and d_clean != "all" and d_clean not in item["district"].lower():
                continue
            if s_clean:
                text = f"{item['crop']} {item['farmer_name']} {item['location']} {item['description']}".lower()
                if s_clean not in text:
                    continue
            results.append(item)

        return {
            "success": True,
            "count": len(results),
            "listings": results
        }

    def add_listing(self, data):
        """Creates a new farmer crop listing."""
        new_id = f"list-{len(LISTINGS_DATABASE) + 1:03d}"
        new_item = {
            "id": new_id,
            "farmer_name": data.get("farmer_name", "VSBCETC [CSE PROJECT]"),
            "crop": data.get("crop", "Rice (Paddy)"),
            "quantity_quintals": float(data.get("quantity_quintals", 10)),
            "expected_price_per_quintal": float(data.get("expected_price_per_quintal", 2000)),
            "location": data.get("location", "Coimbatore, Tamil Nadu"),
            "district": data.get("district", "Coimbatore"),
            "quality_grade": data.get("quality_grade", "Grade A"),
            "harvest_date": data.get("harvest_date", datetime.now().strftime("%Y-%m-%d")),
            "description": data.get("description", "Quality agricultural harvest available for direct purchase."),
            "image_url": data.get("image_url", "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"),
            "status": "Available",
            "created_at": datetime.now().strftime("%Y-%m-%d")
        }
        LISTINGS_DATABASE.insert(0, new_item)
        return {"success": True, "message": "Crop listing published successfully", "listing": new_item}

    def record_inquiry(self, inquiry_data):
        """Records a buyer purchase inquiry (no real financial payment)."""
        inquiry_id = f"inq-{len(INQUIRIES_DATABASE) + 1:04d}"
        record = {
            "id": inquiry_id,
            "listing_id": inquiry_data.get("listing_id"),
            "buyer_name": inquiry_data.get("buyer_name", "Prospective Agro Buyer"),
            "buyer_phone": inquiry_data.get("buyer_phone", "+91 98765 43210"),
            "offered_price": inquiry_data.get("offered_price"),
            "quantity_needed": inquiry_data.get("quantity_needed"),
            "message": inquiry_data.get("message", "Interested in purchasing your harvest."),
            "timestamp": datetime.now().isoformat()
        }
        INQUIRIES_DATABASE.append(record)
        return {
            "success": True,
            "inquiry_id": inquiry_id,
            "message": "Your purchase inquiry has been transmitted to the farmer. They will contact you directly."
        }
