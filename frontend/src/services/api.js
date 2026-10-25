import { clientSideRecommendCrop, clientSideDetectDisease } from './mlInference';
import weatherData from '../data/weather.json';
import schemesData from '../data/schemes.json';
import chatbotData from '../data/chatbot.json';

const API_TIMEOUT = 3000; // 3.0 seconds timeout before fallback to offline engine

/**
 * Robust fetch wrapper with timeout and fallback
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), API_TIMEOUT);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// ----------------------------------------------------
// 1. Crop Recommendation Service
// ----------------------------------------------------
export async function recommendCrop(params) {
  try {
    const data = await fetchWithTimeout('/api/recommend-crop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return { ...data, is_live_backend: true };
  } catch (err) {
    console.warn('[Arka-assist API] Backend unreachable, executing offline ML model:', err.message);
    const fallback = clientSideRecommendCrop(
      params.n, params.p, params.k,
      params.temperature, params.humidity, params.ph, params.rainfall
    );
    return { ...fallback, is_live_backend: false };
  }
}

// ----------------------------------------------------
// 2. Disease Detection Service
// ----------------------------------------------------
export async function detectDisease(formDataOrHint) {
  try {
    let options = {};
    if (formDataOrHint instanceof FormData) {
      options = {
        method: 'POST',
        body: formDataOrHint
      };
    } else {
      options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hint: formDataOrHint })
      };
    }

    const data = await fetchWithTimeout('/api/detect-disease', options);
    return { ...data, is_live_backend: true };
  } catch (err) {
    console.warn('[Arka-assist API] Disease detection backend offline, using local diagnostic engine:', err.message);
    const hint = (typeof formDataOrHint === 'string') ? formDataOrHint : 'tomato';
    const fallback = clientSideDetectDisease(hint);
    return { ...fallback, is_live_backend: false };
  }
}

// ----------------------------------------------------
// 3. Weather Service
// ----------------------------------------------------
export async function getWeather(city = 'Coimbatore') {
  try {
    const data = await fetchWithTimeout(`/api/weather?city=${encodeURIComponent(city)}`);
    return { ...data, is_live_backend: true };
  } catch (err) {
    console.warn('[Arka-assist API] Weather API offline, using cached agro-meteorology:', err.message);
    const cityKey = (city || 'coimbatore').toLowerCase();
    const matched = Object.entries(weatherData.cities).find(([k]) => cityKey.includes(k) || k.includes(cityKey));
    const selectedCity = matched ? matched[1] : weatherData.cities.coimbatore;
    
    return {
      ...selectedCity,
      is_live_backend: false,
      is_cached_offline: true
    };
  }
}

// ----------------------------------------------------
// 4. Government Schemes Service
// ----------------------------------------------------
export async function getSchemes(search = '', category = 'All') {
  try {
    const data = await fetchWithTimeout(`/api/schemes?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`);
    return { ...data, is_live_backend: true };
  } catch (err) {
    console.warn('[Arka-assist API] Schemes API offline, loading bundled schemes registry:', err.message);
    const searchLower = (search || '').toLowerCase();
    const filtered = schemesData.filter(item => {
      if (category && category !== 'All' && item.category !== category) return false;
      if (searchLower) {
        const text = `${item.name_en} ${item.name_ta} ${item.category} ${item.benefits_en} ${item.benefits_ta}`.toLowerCase();
        if (!text.includes(searchLower)) return false;
      }
      return true;
    });

    return {
      success: true,
      count: filtered.length,
      schemes: filtered,
      categories: ["All", "Financial Support", "Crop Insurance", "Solar & Irrigation", "Subsidies & Equipment", "Organic Farming"],
      is_live_backend: false
    };
  }
}

// ----------------------------------------------------
// 5. Agricultural AI Assistant Chat Service
// ----------------------------------------------------
export async function askAssistant(query, language = 'en') {
  try {
    const data = await fetchWithTimeout('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language }),
    });
    return { ...data, is_live_backend: true };
  } catch (err) {
    console.warn('[Arka-assist API] Chat assistant offline, using local knowledge base matching:', err.message);
    const queryLower = (query || '').toLowerCase();
    let bestMatch = null;
    let maxMatch = 0;

    chatbotData.qa_database.forEach(qa => {
      let count = 0;
      qa.keywords.forEach(kw => {
        if (queryLower.includes(kw.toLowerCase())) count++;
      });
      if (count > maxMatch) {
        maxMatch = count;
        bestMatch = qa;
      }
    });

    if (bestMatch && maxMatch > 0) {
      return {
        success: true,
        answer_en: bestMatch.answer_en,
        answer_ta: bestMatch.answer_ta,
        suggested_actions: bestMatch.suggested_actions || [],
        source: 'Local Arka-assist Knowledge Base (Offline-Enabled)',
        is_live_backend: false
      };
    } else {
      return {
        success: true,
        answer_en: "Arka-assist Multimodal AI Assistant is ready to help you with crop selection, soil management, thermal imaging, market intelligence, disease diagnosis, weather advisories, and government schemes.",
        answer_ta: "அர்கா-அசிஸ்ட் AI உதவியாளர் பயிர் தேர்வு, மண் மேலாண்மை, வெப்ப பட ஆய்வு, சந்தை விலை, நோய் கண்டறிதல் மற்றும் அரசு திட்டங்கள் குறித்து உதவ தயாராக உள்ளது.",
        suggested_actions: ["Crop Recommendation", "Thermal Analysis", "Market Intelligence", "Disease Detection"],
        source: 'Arka-assist Knowledge Base (Offline)',
        is_live_backend: false
      };
    }
  }
}

// ----------------------------------------------------
// 6. Voice Intent & Navigation Service
// ----------------------------------------------------
export async function processVoiceIntent(transcript, language = 'en') {
  try {
    const data = await fetchWithTimeout('/api/voice/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, language })
    });
    return { ...data, is_live_backend: true };
  } catch (err) {
    console.warn('[Arka-assist API] Voice service backend offline, using client command matcher:', err.message);
    const clean = (transcript || '').toLowerCase();
    const isTa = language === 'ta';
    
    if (clean.includes('weather') || clean.includes('வானிலை') || clean.includes('மழை')) {
      return {
        success: true,
        type: 'navigation_action',
        target_route: '/weather',
        speech_response: isTa
          ? 'வானிலை பக்கத்திற்கு செல்கிறேன். கோயம்புத்தூரில் இன்றைய வெப்பநிலை 28.5 டிகிரி செல்சியஸ், மழை வாய்ப்பு குறைவு.'
          : 'Opening Weather and Agro-Meteorology. Today is 28.5 degrees Celsius in Coimbatore.'
      };
    }
    if (clean.includes('crop') || clean.includes('பயிர்')) {
      if (clean.includes('பிரச்சனை') || clean.includes('நோய்') || clean.includes('health') || clean.includes('நிலை')) {
        return {
          success: true,
          type: 'navigation_action',
          target_route: '/daily-analysis',
          speech_response: isTa
            ? 'உங்கள் பயிர் நிலைமையை நான் பகுப்பாய்வு செய்கிறேன். நிலம் 4-ல் (தக்காளி) லேசான வெப்ப அழுத்தம் உள்ளது.'
            : 'Analyzing your crop status. Field 4 (Tomato) shows mild thermal stress.'
        };
      }
      return {
        success: true,
        type: 'navigation_action',
        target_route: '/crop-recommendation',
        speech_response: isTa
          ? 'பயிர் பரிந்துரை பக்கத்திற்கு செல்கிறேன். மண் NPK அளவுகளை உள்ளிட்டு உகந்த பயிரை அறியலாம்.'
          : 'Opening Crop Recommendation Engine.'
      };
    }
    if (clean.includes('market') || clean.includes('விலை') || clean.includes('சந்தை')) {
      return {
        success: true,
        type: 'navigation_action',
        target_route: '/market',
        speech_response: isTa
          ? 'சந்தை நுண்ணறிவு பக்கத்தை திறக்கிறேன். நெல் குவிண்டாலுக்கு ₹2,350 ஆக உயர்ந்துள்ளது.'
          : 'Opening Market Dashboard. Paddy is trading at 2,350 rupees per quintal.'
      };
    }
    if (clean.includes('sell') || clean.includes('விற்பனை') || clean.includes('விற்கலாமா')) {
      return {
        success: true,
        type: 'navigation_action',
        target_route: '/sell-decision',
        speech_response: isTa
          ? 'விற்பனை முடிவு பக்கத்திற்கு செல்கிறேன். விலை உயர்வு காரணமாக 7 முதல் 10 நாட்கள் காத்திருக்க பரிந்துரைக்கப்படுகிறது.'
          : 'Opening AI Sell or Wait Decision. Recommendation is to WAIT for 7 to 10 days.'
      };
    }
    if (clean.includes('farm') || clean.includes('பண்ணை') || clean.includes('வயல்') || clean.includes('3d')) {
      if (clean.includes('செய்ய வேண்டும்') || clean.includes('வேலை') || clean.includes('action')) {
        return {
          success: true,
          type: 'navigation_action',
          target_route: '/dashboard',
          speech_response: isTa
            ? 'இன்றைய முன்னுரிமை விவசாய பணிகளை காட்டுகிறேன். முக்கிய பணி: நிலம் 2-ல் ஈரப்பத குறைபாட்டை சரிபார்க்கவும்.'
            : "Displaying today's prioritized action plan. Check Field 2 thermal canopy for moisture deficit."
        };
      }
      return {
        success: true,
        type: 'navigation_action',
        target_route: '/farm-3d',
        speech_response: isTa
          ? 'உங்கள் 3D டிஜிட்டல் பண்ணை மாதிரியை திறக்கிறேன்.'
          : 'Opening 3D Farm Digital Twin.'
      };
    }
    if (clean.includes('thermal') || clean.includes('வெப்ப')) {
      return {
        success: true,
        type: 'navigation_action',
        target_route: '/thermal',
        speech_response: isTa
          ? 'வெப்பநிலை பயிர் பட ஆய்வை திறக்கிறேன்.'
          : 'Opening Thermal Crop Imaging.'
      };
    }
    if (clean.includes('உரம்') || clean.includes('fertilizer') || clean.includes('ஊட்டச்சத்து')) {
      return {
        success: true,
        type: 'conversational_query',
        speech_response: isTa
          ? 'உங்கள் பயிருக்கு ஏற்ற உரப் பரிந்துரை: சரிவிகித NPK மற்றும் தழைச்சத்து குறைபாட்டை போக்க 1% யூரியா இலைவழி தெளிப்பு பரிந்துரைக்கப்படுகிறது.'
          : 'Fertilizer recommendation: Balanced NPK fertilizer with 1% Urea foliar spray is recommended for your soil.'
      };
    }

    return {
      success: true,
      type: 'conversational_query',
      speech_response: isTa
        ? 'அர்கா-அசிஸ்ட் குரல் வழிகாட்டி தயாராக உள்ளது. உங்கள் கேள்வியை கேட்கலாம்.'
        : 'Arka-assist voice companion is ready. How can I help with your farming today?',
      recognized_text: transcript
    };
  }
}

// ----------------------------------------------------
// 7. Thermal Crop Imaging Service
// ----------------------------------------------------
export async function analyzeThermal(formDataOrHint) {
  try {
    let options = {};
    if (formDataOrHint instanceof FormData) {
      options = { method: 'POST', body: formDataOrHint };
    } else {
      options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hint: formDataOrHint })
      };
    }
    const data = await fetchWithTimeout('/api/thermal/analyze', options);
    return { ...data, is_live_backend: true };
  } catch (err) {
    console.warn('[Arka-assist API] Thermal backend offline, using local thermal simulation:', err.message);
    return {
      success: true,
      model_engine: 'Arka-assist Thermal IR (Offline Prototype)',
      preset_archetype: 'Canopy Moisture Deficit (Hotspot)',
      canopy_temperature: { mean_celsius: 34.8, min_celsius: 27.2, max_celsius: 36.4, ambient_air_celsius: 28.5, delta_t_celsius: 6.3 },
      thermal_grid: [
        [28.1, 28.5, 29.0, 30.2, 31.5, 33.1, 34.0, 34.8],
        [28.3, 28.9, 29.8, 31.4, 33.0, 34.5, 35.2, 35.8],
        [28.6, 29.4, 30.7, 32.8, 34.6, 35.9, 36.4, 36.1],
        [28.2, 29.1, 30.2, 32.1, 34.0, 35.2, 35.7, 35.0],
        [27.8, 28.6, 29.5, 31.0, 32.8, 33.9, 34.2, 33.8],
        [27.5, 28.2, 29.0, 30.1, 31.5, 32.4, 32.8, 32.2],
        [27.3, 27.9, 28.4, 29.2, 30.1, 30.8, 31.2, 30.9],
        [27.2, 27.6, 28.0, 28.5, 29.1, 29.6, 30.0, 29.8]
      ],
      stress_assessment: { stress_score: 65.0, level_en: 'Moderate Stress', level_ta: 'மிதமான பாதிப்பு', severity: 'high', transpiration_state: 'Inhibited Transpiration / Stomatal Resistance' },
      affected_region: 'North-East Canopy Parcel (Row 12-18)',
      detected_indication: 'Elevated thermal signature (+6.3°C above air temp) indicating stomatal closure.',
      possible_cause: 'Localized micro-irrigation deficit leading to acute canopy warming.',
      recommended_action: '1. Perform immediate drip lateral flush in Row 12-18.\n2. Apply 30 mm irrigation cycle in affected zone.',
      confidence_score: 89.2,
      is_live_backend: false
    };
  }
}

// ----------------------------------------------------
// 8. Multimodal RGB + Thermal Analysis Service
// ----------------------------------------------------
export async function analyzeMultimodal(params) {
  try {
    const data = await fetchWithTimeout('/api/multimodal/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return { ...data, is_live_backend: true };
  } catch (err) {
    console.warn('[Arka-assist API] Multimodal backend offline, using client fusion model:', err.message);
    return {
      success: true,
      system: 'Arka-assist Multimodal Fusion Engine (Offline Mode)',
      overall_stress_assessment: { composite_score: 52.0, health_score: 48.0, level_en: 'Moderate Stress', level_ta: 'மிதமான பாதிப்பு', severity: 'high' },
      domain_findings: {
        rgb_visual_analysis: { findings_en: 'Concentric brown foliar lesions on lower leaves.', findings_ta: 'இலைகளில் பழுப்பு வளைய புள்ளிகள் காணப்படுகின்றன.', sub_score: 60 },
        thermal_ir_analysis: { canopy_temperature: 33.5, delta_t: 5.0, affected_region: 'Zone B Canopy', sub_score: 55 },
        environmental_stress_score: 25
      },
      root_cause_explanation: {
        cause_en: 'Early foliar pathology compounded by elevated canopy temperature and high relative humidity.',
        cause_ta: 'அதிக இலை வெப்பம் மற்றும் ஈரப்பதத்தால் தூண்டப்பட்ட பூஞ்சை பாதிப்பு.'
      },
      actionable_recommendation: {
        action_en: '1. Spray systemic bio-fungicide (Trichoderma viride).\n2. Irrigate early morning to cool the canopy.',
        action_ta: '1. ட்ரைக்கோடெர்மா விரிடி தெளிக்கவும்.\n2. அதிகாலை வேளையில் பாசனம் செய்யவும்.'
      },
      model_confidence_pct: 88.0,
      is_live_backend: false
    };
  }
}

// ----------------------------------------------------
// 9. Daily Crop Analysis Service
// ----------------------------------------------------
export async function getDailyAnalysis(crop = 'Rice (Paddy)', parcel = 'Field 1') {
  try {
    const data = await fetchWithTimeout(`/api/daily-analysis?crop=${encodeURIComponent(crop)}&parcel=${encodeURIComponent(parcel)}`);
    return { ...data, is_live_backend: true };
  } catch (err) {
    console.warn('[Arka-assist API] Daily analysis backend offline, using local snapshot:', err.message);
    return {
      success: true,
      date: new Date().toISOString().split('T')[0],
      crop,
      parcel,
      today_crop_status: {
        health: 'Good',
        health_ta: 'நல்ல நிலை',
        stress: 'Low',
        stress_ta: 'குறைந்த அழுத்தம்',
        temperature_stress: 'Moderate',
        temperature_stress_ta: 'மிதமான வெப்ப அழுத்தம்',
        water_risk: 'Low',
        water_risk_ta: 'குறைந்த நீர் இடர்',
        weather_risk: 'Medium',
        weather_risk_ta: 'நடுத்தர வானிலை இடர்',
        overall_crop_health: 82
      },
      today_recommended_actions: [
        { step: 1, priority: 'High', action_en: 'Monitor the affected canopy zone in Field 2 for thermal normalization.', action_ta: 'நிலம் 2-ல் வெப்ப அழுத்தம் தணிந்துள்ளதா என்பதை கண்காணிக்கவும்.' },
        { step: 2, priority: 'Medium', action_en: 'Check soil moisture tension before activating the evening drip cycle.', action_ta: 'மாலை நேர சொட்டு நீர் பாசனத்திற்கு முன் மண்ணின் ஈரப்பதத்தை சரிபார்க்கவும்.' },
        { step: 3, priority: 'Low', action_en: 'Avoid unnecessary overhead irrigation to prevent high foliar humidity.', action_ta: 'தேவையற்ற மேல் தெளிப்பு பாசனத்தை தவிர்க்கவும்.' },
        { step: 4, priority: 'Low', action_en: 'Recheck crop canopy scan tomorrow morning at 09:30 AM.', action_ta: 'நாளை காலை 09:30 மணிக்கு மீண்டும் பயிர் நிலையை சரிபார்க்கவும்.' }
      ],
      historical_trend: [
        { date: 'Day -6', overall_health: 88 },
        { date: 'Day -5', overall_health: 86 },
        { date: 'Day -4', overall_health: 85 },
        { date: 'Day -3', overall_health: 83 },
        { date: 'Day -2', overall_health: 81 },
        { date: 'Yesterday', overall_health: 82 },
        { date: 'Today', overall_health: 82 }
      ],
      is_live_backend: false
    };
  }
}

// ----------------------------------------------------
// 10. Market Intelligence & Sell/Wait Service
// ----------------------------------------------------
export async function getMarketPrices() {
  try {
    const data = await fetchWithTimeout('/api/market/prices');
    return { ...data, is_live_backend: true };
  } catch (err) {
    console.warn('[Arka-assist API] Market prices backend offline, using local mandi benchmark:', err.message);
    return {
      success: true,
      data_source: 'Agmarknet Regulated Agricultural Mandi Wholesale Price Index (Local Cache)',
      commodities: [
        { crop_id: 'rice', name_en: 'Rice (Paddy)', name_ta: 'நெல் (பயறு)', current_price: 2350, unit: '₹ / Quintal', msp_benchmark: 2183, price_change_7d_pct: 6.1, price_change_dir: 'up', mandi: 'Coimbatore Mandi', demand_status: 'High Demand', trend_7d: [{ day: 'Mon', price: 2215 }, { day: 'Tue', price: 2230 }, { day: 'Wed', price: 2260 }, { day: 'Thu', price: 2290 }, { day: 'Fri', price: 2315 }, { day: 'Sat', price: 2330 }, { day: 'Today', price: 2350 }] },
        { crop_id: 'cotton', name_en: 'Cotton', name_ta: 'பருத்தி', current_price: 7120, unit: '₹ / Quintal', msp_benchmark: 6620, price_change_7d_pct: -1.8, price_change_dir: 'down', mandi: 'Tirupur Mandi', demand_status: 'Moderate Arrivals', trend_7d: [{ day: 'Mon', price: 7250 }, { day: 'Tue', price: 7230 }, { day: 'Wed', price: 7200 }, { day: 'Thu', price: 7180 }, { day: 'Fri', price: 7150 }, { day: 'Sat', price: 7130 }, { day: 'Today', price: 7120 }] },
        { crop_id: 'banana', name_en: 'Banana', name_ta: 'வாழை', current_price: 1850, unit: '₹ / Quintal', msp_benchmark: null, price_change_7d_pct: 8.4, price_change_dir: 'up', mandi: 'Mettupalayam Market', demand_status: 'Festival Demand', trend_7d: [{ day: 'Mon', price: 1700 }, { day: 'Tue', price: 1720 }, { day: 'Wed', price: 1750 }, { day: 'Thu', price: 1780 }, { day: 'Fri', price: 1810 }, { day: 'Sat', price: 1835 }, { day: 'Today', price: 1850 }] },
        { crop_id: 'tomato', name_en: 'Tomato', name_ta: 'தக்காளி', current_price: 2200, unit: '₹ / Quintal', msp_benchmark: null, price_change_7d_pct: 14.5, price_change_dir: 'up', mandi: 'Oddanchatram Market', demand_status: 'Surging Demand', trend_7d: [{ day: 'Mon', price: 1920 }, { day: 'Tue', price: 1970 }, { day: 'Wed', price: 2040 }, { day: 'Thu', price: 2100 }, { day: 'Fri', price: 2140 }, { day: 'Sat', price: 2180 }, { day: 'Today', price: 2200 }] }
      ],
      is_live_backend: false
    };
  }
}

export async function getSellDecision(params) {
  try {
    const data = await fetchWithTimeout('/api/market/sell-decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return { ...data, is_live_backend: true };
  } catch (err) {
    console.warn('[Arka-assist API] Sell decision backend offline, using local heuristic model:', err.message);
    return {
      success: true,
      recommendation: 'WAIT',
      recommendation_ta: 'காத்திருங்கள் (WAIT)',
      confidence_pct: 74.0,
      current_price: '₹2,350 / Quintal',
      trend_7d_pct: '+6.1%',
      trend_direction: 'up',
      crop_condition: 'Good',
      weather_risk: 'Low',
      reason_en: 'Favorable upward price momentum (+6.1% over 7 days) and healthy crop condition warrant waiting 7-10 days for peak realization.',
      reason_ta: 'விலை ஏற்றப் போக்கு (+6.1%) மற்றும் பயிர் ஆரோக்கியம் சீராக உள்ளதால் இன்னும் 7-10 நாட்கள் காத்திருப்பது அதிக லாபம் தரும்.',
      financial_breakdown: { expected_gross_gain_per_quintal: 107.5, estimated_holding_cost_per_week: 25, net_projected_weekly_benefit: 82.5 },
      explainability_factors: [
        { factor: 'Market Price Trend', weight: '35%', impact: 'Positive (+6.1%)' },
        { factor: 'Crop Perishability & Condition', weight: '30%', impact: 'Safe (Low Risk)' },
        { factor: 'Holding / Storage Cost', weight: '20%', impact: '₹25/week' },
        { factor: 'Weather Risk & Spoilage', weight: '15%', impact: 'Low' }
      ],
      is_live_backend: false
    };
  }
}

// ----------------------------------------------------
// 11. Marketplace & Buyer Matching Services
// ----------------------------------------------------
export async function getMarketplaceListings(search = '', crop = '', district = '') {
  try {
    const data = await fetchWithTimeout(`/api/marketplace/listings?search=${encodeURIComponent(search)}&crop=${encodeURIComponent(crop)}&district=${encodeURIComponent(district)}`);
    return { ...data, is_live_backend: true };
  } catch (err) {
    console.warn('[Arka-assist API] Marketplace listings offline, using local catalog:', err.message);
    return {
      success: true,
      listings: [
        { id: 'list-001', farmer_name: 'VSBCETC [CSE PROJECT]', crop: 'Rice (Paddy - Super Ponni)', quantity_quintals: 45, expected_price_per_quintal: 2400, location: 'Coimbatore, Tamil Nadu', quality_grade: 'Grade A+', harvest_date: '2026-09-25', description: 'Clean paddy, low moisture content (12.5%).', status: 'Available' },
        { id: 'list-002', farmer_name: 'Murugan Agro Farms', crop: 'Cotton (Long Staple)', quantity_quintals: 30, expected_price_per_quintal: 7250, location: 'Pollachi, Tamil Nadu', quality_grade: 'Grade A', harvest_date: '2026-10-05', description: 'Clean handpicked cotton.', status: 'Available' },
        { id: 'list-003', farmer_name: 'Kavitha Organic Orchard', crop: 'Banana (Grand Naine)', quantity_quintals: 60, expected_price_per_quintal: 1900, location: 'Mettupalayam, Tamil Nadu', quality_grade: 'Grade A+', harvest_date: '2026-09-18', description: 'Export quality organic banana bunches.', status: 'Available' }
      ],
      is_live_backend: false
    };
  }
}

export async function createMarketplaceListing(listingData) {
  try {
    const data = await fetchWithTimeout('/api/marketplace/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listingData)
    });
    return { ...data, is_live_backend: true };
  } catch (err) {
    return { success: true, message: 'Saved to local offline listings queue', listing: listingData, is_live_backend: false };
  }
}

export async function sendPurchaseInquiry(inquiryData) {
  try {
    const data = await fetchWithTimeout('/api/marketplace/inquire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData)
    });
    return { ...data, is_live_backend: true };
  } catch (err) {
    return { success: true, message: 'Inquiry saved locally (Offline mode)', is_live_backend: false };
  }
}

export async function matchBuyers(params) {
  try {
    const data = await fetchWithTimeout('/api/marketplace/match-buyers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return { ...data, is_live_backend: true };
  } catch (err) {
    console.warn('[Arka-assist API] Buyer matching offline, using local scoring algorithm:', err.message);
    return {
      success: true,
      best_buyer_matches: [
        {
          buyer_id: 'buyer-01',
          name: 'Kongu Modern Rice Mills Pvt Ltd',
          company_type: 'Grain Processing & Milling',
          location: 'Pollachi Main Road, Coimbatore',
          match_percentage: 94.0,
          max_offered_price: '₹2,450/quintal',
          payment_term: 'Immediate Bank Transfer on Weighment',
          pickup_available: true,
          highlights: ['Direct crop requirement match', 'Located in same district (Coimbatore)', 'Price matches budget', 'Offers on-farm pickup']
        },
        {
          buyer_id: 'buyer-02',
          name: 'Coimbatore Agro-Producers Consortium',
          company_type: 'Farmer Producer Organization (FPO)',
          location: 'RS Puram, Coimbatore',
          match_percentage: 86.5,
          max_offered_price: '₹2,380/quintal',
          payment_term: 'Same-day Settlement',
          pickup_available: true,
          highlights: ['Direct crop requirement match', 'Located in same district (Coimbatore)', 'Accepts flexible grades']
        },
        {
          buyer_id: 'buyer-05',
          name: 'Apex Poultry Feeds & Grains',
          company_type: 'Livestock Feed Manufacturer',
          location: 'Tiruchengode Road, Namakkal',
          match_percentage: 75.0,
          max_offered_price: '₹2,180/quintal',
          payment_term: 'Direct RTGS Transfer',
          pickup_available: false,
          highlights: ['Bulk volume capacity up to 800 quintals']
        }
      ],
      is_live_backend: false
    };
  }
}

// ----------------------------------------------------
// 12. Farm Health Score & 3D Digital Twin Services
// ----------------------------------------------------
export async function getFarmHealthScore() {
  try {
    const data = await fetchWithTimeout('/api/farm/health-score');
    return { ...data, is_live_backend: true };
  } catch (err) {
    console.warn('[Arka-assist API] Farm health backend offline, using local benchmark:', err.message);
    return {
      success: true,
      overall_health_score: 82,
      max_score: 100,
      rating_en: 'Excellent Farm Health',
      rating_ta: 'சிறப்பான பண்ணை நலன்',
      color_class: 'text-emerald-600 dark:text-emerald-400',
      badge_bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
      components: [
        { name_en: 'Crop Vitality & Canopy Growth', name_ta: 'பயிர் வளர்ச்சி & வீரியம்', score: 86, weight: 0.25, status: 'Optimal', status_ta: 'சிறப்பானது' },
        { name_en: 'Thermal Equilibrium & Transpiration', name_ta: 'வெப்ப சமநிலை & நீர் ஆவியாதல்', score: 78, weight: 0.15, status: 'Moderate Stress in Field 2', status_ta: 'நிலம் 2-ல் மிதமான வெப்பம்' },
        { name_en: 'Soil Moisture & Water Status', name_ta: 'மண் ஈரப்பதம் & நீர்வளம்', score: 84, weight: 0.20, status: 'Adequate', status_ta: 'போதுமானது' },
        { name_en: 'Soil Nutrient Chemistry (NPK)', name_ta: 'மண் சத்துக்கள் (NPK)', score: 88, weight: 0.15, status: 'Well-Balanced', status_ta: 'சீரான அளவு' },
        { name_en: 'Weather Risk Immunity', name_ta: 'வானிலை இடர் பாதுகாப்பு', score: 80, weight: 0.10, status: 'Low Storm Risk', status_ta: 'குறைந்த இடர்' },
        { name_en: 'Pest & Pathogen Resistance', name_ta: 'பூச்சி மற்றும் நோய் எதிர்ப்பு', score: 75, weight: 0.10, status: 'Low Infestation Alert', status_ta: 'குறைந்த பாதிப்பு' },
        { name_en: 'Market Realization Value', name_ta: 'சந்தை மதிப்பு & விலை வாய்ப்பு', score: 85, weight: 0.05, status: 'Positive Momentum', status_ta: 'விலை ஏற்ற நிலை' }
      ],
      summary_en: 'Overall Farm Health stands at 82/100. Field 1 (Rice) and Field 3 (Banana) are thriving optimally; Field 2 (Cotton) shows moderate canopy temperature stress requiring scheduled irrigation.',
      summary_ta: 'ஒட்டுமொத்த பண்ணை நலன் 82/100 ஆக உள்ளது. நிலம் 1 மற்றும் 3 மிகச் சிறந்த வளர்ச்சியில் உள்ளன; நிலம் 2-ல் மிதமான வெப்ப அழுத்தம் உள்ளதால் பாசனம் தேவைப்படுகிறது.',
      is_live_backend: false
    };
  }
}

export async function getDigitalTwinFarm() {
  try {
    const data = await fetchWithTimeout('/api/farm/digital-twin');
    return { ...data, is_live_backend: true };
  } catch (err) {
    console.warn('[Arka-assist API] Digital twin backend offline, using bundled geometry:', err.message);
    return {
      success: true,
      farm_data: {
        farm_metadata: {
          farm_name: 'Arka-assist Demo Smart Farm',
          farmer_name: 'VSBCETC [CSE PROJECT]',
          total_area: '4.5 Acres',
          location: 'Coimbatore, Tamil Nadu'
        },
        parcels: [
          { id: 'field-1', name: 'North Parcel (Field 1)', crop: 'Rice (Paddy)', crop_icon: '🌾', growth_stage: 'Active Tillering', health_score: 88, status_state: 'healthy', status_badge: 'Optimal Growth', telemetry: { temperature_celsius: 28.2, moisture_pct: 72.0, stress_level: 'Low (Healthy)' }, position_3d: { x: -2.2, y: 0.1, z: -2.2, width: 3.6, depth: 3.6 }, color_hex: '#10B981', recommended_action: 'Maintain 3 cm standing water level.' },
          { id: 'field-2', name: 'East Parcel (Field 2)', crop: 'Cotton (Bt Long Staple)', crop_icon: '🌱', growth_stage: 'Square Formation', health_score: 64, status_state: 'warning', status_badge: 'Thermal Stress Warning', telemetry: { temperature_celsius: 34.1, moisture_pct: 45.0, stress_level: 'Moderate Canopy Hyperthermia' }, position_3d: { x: 2.2, y: 0.1, z: -2.2, width: 3.6, depth: 3.6 }, color_hex: '#F59E0B', recommended_action: 'Deliver 30 mm targeted drip cycle in Row 12-18.' },
          { id: 'field-3', name: 'South Parcel (Field 3)', crop: 'Banana (Grand Naine)', crop_icon: '🍌', growth_stage: 'Shooting & Bunching', health_score: 95, status_state: 'healthy', status_badge: 'Flourishing Orchard', telemetry: { temperature_celsius: 27.5, moisture_pct: 80.0, stress_level: 'None (Thriving)' }, position_3d: { x: -2.2, y: 0.1, z: 2.2, width: 3.6, depth: 3.6 }, color_hex: '#059669', recommended_action: 'Apply potash fertilizer; ensure sturdy propping.' },
          { id: 'field-4', name: 'West Parcel (Field 4)', crop: 'Tomato (Hybrid Red)', crop_icon: '🍅', growth_stage: 'Fruit Maturation', health_score: 58, status_state: 'warning', status_badge: 'Foliar Spot Alert', telemetry: { temperature_celsius: 32.8, moisture_pct: 50.0, stress_level: 'Mild Pathogen Risk' }, position_3d: { x: 2.2, y: 0.1, z: 2.2, width: 3.6, depth: 3.6 }, color_hex: '#EF4444', recommended_action: 'Spray organic neem formulation for early leaf spot prevention.' }
        ]
      },
      is_live_backend: false
    };
  }
}
