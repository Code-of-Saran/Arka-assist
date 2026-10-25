"""
ARKA-ASSIST — Persistent Farm Observation & Data Storage Service
Provides structured persistence for:
- Farm Profile & Crop Profile
- Disease Observations (with model confidence and class)
- Thermal Observations (with delta T and hotspots)
- Weather Observations
- Market Observations
- Daily Analysis History
- Decision History

Uses ISO 8601 timestamps. Never invents synthetic historical records.
"""

import json
import os
from datetime import datetime
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
STORE_FILE = DATA_DIR / "farm_observations.json"

DEFAULT_STORE = {
    "farm_profile": {
        "farmer_name": "VSBCETC [CSE PROJECT]",
        "farm_name": "Arka Agri Research Farm",
        "location": "Coimbatore, Tamil Nadu",
        "latitude": 11.0168,
        "longitude": 76.9558,
        "total_area_acres": 4.5,
        "soil_type": "Clay Loam",
        "irrigation_type": "Drip Irrigation + Canal",
        "active_parcels": [
            {"id": "p1", "name": "Field 1 (North)", "area_acres": 1.5, "current_crop": "Rice (Paddy)", "crop_variety": "ADT 43", "planting_date": "2026-08-10"},
            {"id": "p2", "name": "Field 2 (East)", "area_acres": 1.0, "current_crop": "Tomato", "crop_variety": "PKM 1", "planting_date": "2026-08-20"},
            {"id": "p3", "name": "Field 3 (South)", "area_acres": 1.0, "current_crop": "Maize (Corn)", "crop_variety": "COHM 6", "planting_date": "2026-08-15"},
            {"id": "p4", "name": "Field 4 (West)", "area_acres": 1.0, "current_crop": "Fallow / Soil Prep", "crop_variety": "Green Manure", "planting_date": "2026-09-01"}
        ]
    },
    "crop_profiles": {
        "rice": {
            "name": "Rice (Paddy)",
            "botanical_name": "Oryza sativa",
            "critical_stages": ["Seedling", "Tillering", "Panicle Initiation", "Flowering", "Milking", "Maturity"],
            "optimal_temp_celsius": {"min": 20.0, "max": 35.0},
            "optimal_moisture_pct": {"min": 50.0, "max": 80.0},
            "optimal_soil_ph": {"min": 5.5, "max": 7.2}
        }
    },
    "disease_observations": [],
    "thermal_observations": [],
    "weather_observations": [],
    "market_observations": [],
    "daily_analysis_history": [],
    "decision_history": []
}

class FarmStorageService:
    def __init__(self):
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        if not STORE_FILE.exists():
            with open(STORE_FILE, "w", encoding="utf-8") as f:
                json.dump(DEFAULT_STORE, f, indent=2)

    def _read_store(self):
        try:
            with open(STORE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return DEFAULT_STORE.copy()

    def _write_store(self, data):
        with open(STORE_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    def get_farm_profile(self):
        store = self._read_store()
        return store.get("farm_profile", DEFAULT_STORE["farm_profile"])

    def record_disease_observation(self, observation):
        store = self._read_store()
        observation["timestamp"] = datetime.now().isoformat()
        store.setdefault("disease_observations", []).append(observation)
        self._write_store(store)
        return observation

    def record_thermal_observation(self, observation):
        store = self._read_store()
        observation["timestamp"] = datetime.now().isoformat()
        store.setdefault("thermal_observations", []).append(observation)
        self._write_store(store)
        return observation

    def record_daily_snapshot(self, snapshot):
        store = self._read_store()
        snapshot["timestamp"] = datetime.now().isoformat()
        snapshot["date"] = datetime.now().strftime("%Y-%m-%d")
        store.setdefault("daily_analysis_history", []).append(snapshot)
        self._write_store(store)
        return snapshot

    def get_daily_history(self, limit=7):
        store = self._read_store()
        history = store.get("daily_analysis_history", [])
        return history[-limit:]

    def record_decision(self, decision_entry):
        store = self._read_store()
        decision_entry["timestamp"] = datetime.now().isoformat()
        store.setdefault("decision_history", []).append(decision_entry)
        self._write_store(store)
        return decision_entry

    def get_decision_history(self, limit=10):
        store = self._read_store()
        history = store.get("decision_history", [])
        return history[-limit:]
