# Arka-assist
### A Multimodal AI-Based Farm Intelligence and Decision Support System

An offline-first, multilingual, multimodal AI-driven digital agriculture intelligence and decision platform designed to empower farmers and agricultural extension workers with predictive crop selection, thermal stress detection, multimodal visual-thermal diagnostics, agro-meteorological advisories, daily farm intelligence, market decision analysis (Sell vs. Wait), buyer matching marketplace, and conversational voice guidance in both English and Tamil.

---

## 🌟 Key Capabilities

1. **Multimodal AI Crop Intelligence & Stress Diagnostics**:
   - **Thermal Imaging & Canopy $\Delta T$**: Computes Crop Water Stress Index (CWSI) and Canopy-to-Air Temperature Difference ($\Delta T = T_c - T_a$), pinpointing transpiration stress and localized hotspot micro-climates.
   - **5-Channel Multimodal Fusion**: Fuses visible RGB leaf symptoms, thermal IR radiance, phenological growth stage, real-time soil moisture, and atmospheric rainfall for holistically quantified risk scores.
2. **Smart Crop Recommendation Engine (Random Forest ML)**:
   - Machine learning inference matching soil chemistry ($N, P, K$, pH) and climate metrics (temperature, humidity, precipitation) across 22 crops with 98.41% accuracy.
   - **Trained Artifacts**: `crop_model.joblib`, `crop_scaler.joblib`, `crop_features.joblib`, and `label_encoder.joblib`.
   - **Dual Output**: Actionable agronomic guide + SVG radial confidence gauge + Factor match radar matrix.
3. **Daily Farm Intelligence & Action Plan**:
   - 24-hour synchronized agronomic overview synthesizing soil status, canopy stress, weather alerts, and 4 prioritized daily farm action items.
   - 7-day retrospective trend tracking for soil moisture, canopy temperature, and humidity.
4. **Daily Market Intelligence & AI Sell vs. Wait Engine**:
   - Live Agmarknet wholesale mandi prices, modal price trends, and arrivals across Tamil Nadu and national markets.
   - **AI Sell/Wait Decision Engine**: Multi-factor decision matrix evaluating market price trends, local storage perishability, weather risk, and buyer demand elasticity to recommend `SELL_NOW` or `HOLD_WAIT` with explainable factor weight breakdown.
5. **Farmer-to-Buyer Direct Marketplace & AI Buyer Matching**:
   - Direct commodity listing catalog for farmers to publish produce with price expectations, variety, and harvest dates.
   - **AI Buyer Matcher**: Multi-parameter compatibility ranking scoring price alignment, logistics proximity, payment speed, and volume match for verified institutional and wholesale buyers.
6. **3D Interactive Digital Farm Twin**:
   - High-fidelity isometric 3D canvas farm parcel visualizer with real-time parcel telemetry (Canopy temp, Soil moisture, Health grade, Crop stage).
   - **Composite Farm Health Score (0-100)**: Multi-dimensional health index aggregating water stress, nutrient balance, disease risk, pest pressure, market readiness, weather safety, and soil vitality.
7. **Bilingual Conversational Voice Assistant & Intent Navigation**:
   - Full Web Speech Recognition (STT) and Speech Synthesis (TTS) in English and Tamil (தமிழ்).
   - Natural language intent parser directing farmers seamlessly across platform modules ("Show me thermal analysis" -> `/thermal`, "விற்பனை முடிவுகள் காட்டு" -> `/sell-decision`).
8. **Visual Plant Pathology & Disease Detection**:
   - Visual leaf pathology scanner with bounding box region overlays and severity level rating (Healthy, Mild, Moderate, Severe) with organic and chemical remedies.
9. **Agro-Meteorological Advisory**:
   - Real-time district forecasts paired with irrigation schedules, pesticide spray windows, and flood hazards.
10. **Government Welfare Schemes Directory**:
    - Searchable directory of Central & Tamil Nadu agricultural subsidies (PM-KISAN, PMFBY, PM-KUSUM, TN Micro-Irrigation 100% Subsidy, SMAM, PKVY).
11. **100% Offline PWA Operation**:
    - Service Worker caching and bundled local fallback datasets guaranteeing zero broken screens without internet connectivity.

---

## 📁 Folder Structure

```
Arka-assist/
├── index.py                      # Single-file master entrypoint (python index.py)
├── index.js                      # Node.js single-file launcher (node index.js / npm start)
├── run.bat                       # Windows 1-click double-clickable launcher
├── start_system.py               # System launcher for both backend & frontend
├── test_system.py                # Complete 20-point E2E verification test suite
├── README.md                     # Comprehensive documentation & architecture guide
│
├── backend/
│   ├── app.py                    # Flask REST API entrypoint & 18 active routes
│   ├── config.py                 # Backend configuration & Arka-assist metadata
│   ├── requirements.txt          # Python dependencies (Flask, Scikit-learn, joblib, etc.)
│   ├── train_model.py            # Random Forest ML model training script
│   ├── models/                   # Serialized ML model artifacts (.joblib)
│   │   ├── crop_model.joblib
│   │   ├── crop_scaler.joblib
│   │   ├── crop_features.joblib
│   │   └── label_encoder.joblib
│   └── services/
│       ├── crop_service.py       # Scikit-learn crop recommendation engine
│       ├── disease_service.py    # CV leaf pathology diagnostic engine
│       ├── weather_service.py    # Agro-meteorology & advisory generator
│       ├── scheme_service.py     # Government schemes catalog & search
│       ├── chatbot_service.py    # Bilingual farm-context agronomic assistant
│       ├── thermal_service.py    # Thermal colormap, delta-T & CWSI stress
│       ├── multimodal_analysis.py# 5-channel visual+thermal+soil fusion
│       ├── daily_analysis.py     # 24-hr status & prioritized action items
│       ├── market_service.py     # Agmarknet wholesale mandi prices & trends
│       ├── sell_decision.py      # AI Sell vs Wait explainable decision engine
│       ├── marketplace_service.py# Crop catalog listings & inquiries
│       ├── buyer_matching.py     # Multi-factor buyer compatibility ranking
│       ├── farm_health_service.py# 0-100 composite farm health score
│       ├── farm_twin.py          # 3D digital farm twin parcel telemetry
│       ├── stress_analysis.py    # Normalized crop stress evaluation
│       └── voice_service.py      # Speech intent parsing & bilingual TTS responses
│
└── frontend/
    ├── index.html                # App HTML shell with Google Fonts & PWA links
    ├── package.json              # React, Vite, Tailwind CSS, Lucide, Recharts
    ├── vite.config.js            # Vite bundler & API proxy configuration
    ├── tailwind.config.js        # Agriculture-tailored color palette
    ├── postcss.config.js         # PostCSS configuration
    ├── start_dev.py              # Vite dev server runner
    ├── public/
    │   ├── manifest.json         # PWA Web App Manifest
    │   ├── sw.js                 # Offline Service Worker
    │   └── leaf.svg              # SVG application logo
    └── src/
        ├── App.jsx               # App routing, layout & offline notification banner
        ├── main.jsx              # React DOM entrypoint
        ├── index.css             # Tailwind directives & CSS variables
        ├── context/
        │   ├── LanguageContext.jsx   # English & Tamil dictionary switcher
        │   ├── ThemeContext.jsx      # Light / Dark theme switcher
        │   ├── OfflineContext.jsx    # Real-time online/offline listener & test toggle
        │   └── AuthContext.jsx       # Demo auth & profile state
        ├── i18n/
        │   ├── en.json           # Complete English translations (192 keys)
        │   └── ta.json           # Complete Tamil (தமிழ்) translations (192 keys)
        ├── data/
        │   ├── crops.json        # Offline agronomic crop profiles
        │   ├── diseases.json     # Offline disease symptoms & remedies
        │   ├── schemes.json      # Offline government schemes directory
        │   ├── weather.json      # Offline weather forecasts & advisories
        │   └── chatbot.json      # Offline chatbot Q&A knowledge base
        ├── services/
        │   ├── api.js            # Hybrid API layer (Flask first -> Local fallback)
        │   ├── mlInference.js    # Client-side deterministic ML engine
        │   ├── voiceNavigation.js# Web Speech STT/TTS & voice router
        │   └── offlineStorage.js # LocalStorage history & activity logger
        ├── components/
        │   ├── Navbar.jsx        # Responsive navigation with voice launcher & badges
        │   ├── Sidebar.jsx       # Grouped workflow modules & offline engine pill
        │   ├── Footer.jsx        # Arka-assist footer & copyright
        │   ├── VoiceAssistantModal.jsx # Voice assistant modal with live waveform & TTS
        │   ├── ConfidenceGauge.jsx # SVG radial animated confidence gauge
        │   ├── FactorRadar.jsx   # Factor match comparison matrix
        │   ├── LeafOverlay.jsx   # Interactive visual leaf annotation overlay
        │   └── ProtectedRoute.jsx# Route authentication guard
        └── pages/
            ├── LandingPage.jsx   # Animated hero showcase & features
            ├── LoginPage.jsx     # Login & one-click demo access
            ├── Dashboard.jsx     # Unified Command Center with Health Score & actions
            ├── CropRecommendation.jsx # NPK sliders & dual recommendation output
            ├── DiseaseDetection.jsx   # Leaf upload & visual pathology report
            ├── WeatherPage.jsx   # Forecast & spray/irrigation advisories
            ├── SchemesPage.jsx   # Searchable agricultural subsidies
            ├── ChatbotPage.jsx   # AI assistant with prompt chips & voice mode
            ├── ThermalAnalysisPage.jsx# Thermal colormap & canopy delta-T metrics
            ├── MultimodalPage.jsx     # 5-channel fusion risk diagnosis
            ├── DailyAnalysisPage.jsx  # Daily status & prioritized action plan
            ├── MarketDashboardPage.jsx# Agmarknet mandi prices & 7-day trend
            ├── SellWaitPage.jsx       # AI Sell vs Wait decision engine
            ├── MarketplacePage.jsx    # Farmer-to-buyer crop catalog
            ├── BuyerMatchingPage.jsx  # Ranked buyer compatibility cards
            ├── Farm3DPage.jsx         # Interactive 3D Canvas farm twin
            ├── WorkflowPage.jsx  # System architecture & decision pipeline
            └── ProfilePage.jsx   # Farmer profile & farm acreage configuration
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Python 3.10+** (Tested on Python 3.14)
- **Node.js 18+** & **npm**

### Step 1: Train the Machine Learning Models (Optional - Pre-trained models included)
```bash
cd backend
python train_model.py
```
*Generates all 4 model files in `backend/models/`: `crop_model.joblib`, `crop_scaler.joblib`, `crop_features.joblib`, `label_encoder.joblib`.*

### Step 2: Run the Entire System with a Single Command
From the project root, run any of the following:

**Using Python:**
```bash
python index.py
```

**Using Node / npm:**
```bash
npm start
# or: node index.js
```

**On Windows (1-Click):**
Double-click `run.bat` or execute `run.bat` in the command prompt.

### Alternatively, Run Individually:

**Backend:**
```bash
cd backend
python app.py
```
*(Runs on `http://127.0.0.1:5000`)*

**Frontend:**
```bash
cd frontend
python start_dev.py
```
*(Runs on `http://localhost:5173`)*

---

## 🔑 Demo Credentials
- **Username**: `farmer`
- **Password**: `arka-assist`
- *Or click the instant "Demo Login (One-Click)" button on the login page.*

---

## 🧪 E2E Verification Test Suite
To verify the complete system across all 20 checkpoints:
```bash
python test_system.py
```

---

## 🛠️ Implementation Integrity & Badging
All features maintain transparent data integrity:
- **ML Crop Recommendation**: Real trained Random Forest ML model on 22 agronomic crops (98.41% accuracy).
- **Thermal Imaging & Sensor Telemetry**: Transparently flagged with simulation and prototype tags; provides scientifically grounded formulas ($CWSI$, $\Delta T = T_c - T_a$) and agronomic mitigation actions.
- **Market Prices**: Live Agmarknet wholesale mandi references with 7-day trends and arrivals.
- **Sell vs Wait**: Explainable algorithmic scoring based on price momentum, perishability, and weather risk.
- **Voice System**: Native Web Speech API with fallback natural language parsing in English and Tamil.
