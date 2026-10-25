import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getSellDecision } from '../services/api';
import {
  Scale,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Store,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const SellWaitPage = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';
  const [searchParams] = useSearchParams();

  const [crop, setCrop] = useState(searchParams.get('crop') || 'rice');
  const [condition, setCondition] = useState('Good');
  const [daysToPerish, setDaysToPerish] = useState(21);
  const [thermalStress, setThermalStress] = useState('Low');
  const [weatherRisk, setWeatherRisk] = useState('Low');
  const [storageAvailable, setStorageAvailable] = useState(true);

  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(false);

  const evaluateDecision = async () => {
    setLoading(true);
    try {
      const data = await getSellDecision({
        crop,
        condition,
        days_to_perish: daysToPerish,
        thermal_stress: thermalStress,
        weather_risk: weatherRisk,
        storage_available: storageAvailable
      });
      setDecision(data);
    } catch (err) {
      console.error('Sell/wait evaluation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    evaluateDecision();
  }, [crop, condition, daysToPerish, thermalStress, weatherRisk, storageAvailable]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl min-h-[170px] flex flex-col justify-center border border-white/18">
        <img
          src="/assets/images/harvest-mandi.jpg"
          alt="Explainable Harvest Timing Engine"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D25]/95 via-[#0B6623]/82 to-[#0F3D25]/75 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold mb-2 border border-white/25 backdrop-blur-md shadow-xs">
              <Scale className="w-3.5 h-3.5 text-[#5BA33C]" />
              <span>Explainable Economic Harvest Timing Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              {t('sell_wait_title')}
            </h1>
            <p className="text-xs sm:text-sm text-white/85 mt-1 max-w-2xl leading-relaxed font-medium">
              {t('sell_wait_subtitle')}
            </p>
          </div>

          <Link
            to="/marketplace"
            className="self-start sm:self-center flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold btn-glass-primary shadow-glass transition-all cursor-pointer"
          >
            <Store className="w-4 h-4 text-white" />
            <span>{isTamil ? 'சந்தை தளத்தில் விற்க' : 'List in Marketplace'}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

      {/* Input Parameters Controls */}
      <div className="p-6 rounded-3xl glass-dark border border-white/14 space-y-4">
        <div className="text-[10px] font-black uppercase tracking-wider text-[#D8C7AE] flex items-center justify-between border-b border-white/10 pb-2">
          <span>{isTamil ? 'முடிவெடுக்கும் காரணிகள்' : 'Economic & Physiological Inputs'}</span>
          <span className="font-mono text-[11px] text-[#5BA33C] font-bold">Heuristic Engine Calibration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          
          {/* Crop Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-white">Select Crop Commodity:</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/20 text-white font-bold cursor-pointer outline-none focus:border-[#5BA33C]"
            >
              <option value="rice" className="bg-[#0b1a11] text-white">Rice (Paddy - Common)</option>
              <option value="cotton" className="bg-[#0b1a11] text-white">Cotton (Medium Staple)</option>
              <option value="banana" className="bg-[#0b1a11] text-white">Banana (Grand Naine)</option>
              <option value="tomato" className="bg-[#0b1a11] text-white">Tomato (Hybrid Red)</option>
            </select>
          </div>

          {/* Crop Condition */}
          <div className="space-y-1.5">
            <label className="font-bold text-white">Canopy Physical Condition:</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/20 text-white font-bold cursor-pointer outline-none focus:border-[#5BA33C]"
            >
              <option value="Good" className="bg-[#0b1a11] text-white">Good / Prime Turgor (Optimal)</option>
              <option value="Moderate" className="bg-[#0b1a11] text-white">Moderate / Slight Staining</option>
              <option value="Poor" className="bg-[#0b1a11] text-white">Poor / Showing Early Necrosis</option>
            </select>
          </div>

          {/* Estimated Days to Perish */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center font-bold text-white">
              <span>Shelf-Life Remaining:</span>
              <span className="font-mono text-[#5BA33C] font-black">{daysToPerish} Days</span>
            </div>
            <input
              type="range"
              min="3"
              max="60"
              value={daysToPerish}
              onChange={(e) => setDaysToPerish(parseInt(e.target.value))}
              className="w-full accent-[#5BA33C] cursor-pointer"
            />
          </div>

          {/* Thermal Stress */}
          <div className="space-y-1.5">
            <label className="font-bold text-white">Canopy Thermal Stress Level:</label>
            <select
              value={thermalStress}
              onChange={(e) => setThermalStress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/20 text-white font-bold cursor-pointer outline-none focus:border-[#5BA33C]"
            >
              <option value="Low" className="bg-[#0b1a11] text-white">Low Stress (Transpiration Active)</option>
              <option value="Moderate" className="bg-[#0b1a11] text-white">Moderate (+3.5°C Canopy Hotspot)</option>
              <option value="High" className="bg-[#0b1a11] text-white">High Deficit (Severe Vascular Wilt)</option>
            </select>
          </div>

          {/* Weather Risk */}
          <div className="space-y-1.5">
            <label className="font-bold text-white">Forecast Precipitation Risk:</label>
            <select
              value={weatherRisk}
              onChange={(e) => setWeatherRisk(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/20 text-white font-bold cursor-pointer outline-none focus:border-[#5BA33C]"
            >
              <option value="Low" className="bg-[#0b1a11] text-white">Low / Clear Spray Window</option>
              <option value="Moderate" className="bg-[#0b1a11] text-white">Moderate / Humid Fog</option>
              <option value="High" className="bg-[#0b1a11] text-white">High / Heavy Monsoon Downpour</option>
            </select>
          </div>

          {/* Storage Availability */}
          <div className="space-y-1.5 flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-white p-2.5 rounded-2xl bg-white/6 border border-white/12">
              <input
                type="checkbox"
                checked={storageAvailable}
                onChange={(e) => setStorageAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-[#0B6623] accent-[#5BA33C]"
              />
              <span>Secure On-Farm Warehouse Storage Available</span>
            </label>
          </div>

        </div>
      </div>

      {/* Decision Output Workspace */}
      {decision && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Decision Banner */}
          <div className="lg:col-span-6 p-6 rounded-3xl glass-dark border border-white/14 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8C7AE]">
                Recommended Action
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#0B6623]/35 text-[#5BA33C] border border-[#5BA33C]/40">
                {decision.confidence_score}% Confidence
              </span>
            </div>

            <div className="p-6 rounded-2xl bg-white/6 border border-white/12 text-center space-y-2">
              <div className={`text-4xl sm:text-5xl font-black tracking-tight font-mono ${
                decision.decision === 'HOLD' || decision.decision === 'WAIT' ? 'text-[#5BA33C]' : 'text-[#C46F52]'
              }`}>
                {decision.decision === 'HOLD' || decision.decision === 'WAIT' ? 'WAIT (HOLD)' : 'SELL NOW'}
              </div>
              <p className="text-xs text-[#D8C7AE] font-medium max-w-sm mx-auto">
                {isTamil ? decision.recommendation_summary_ta : decision.recommendation_summary_en}
              </p>
            </div>

            {/* Financial Telemetry */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10 text-center">
                <span className="text-[10px] text-[#D8C7AE] uppercase font-bold block">Current Mandi</span>
                <span className="text-lg font-black text-white font-mono mt-0.5 block">
                  ₹{decision.current_price}
                </span>
                <span className="text-[10px] text-[#D8C7AE]/70">per quintal</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10 text-center">
                <span className="text-[10px] text-[#D8C7AE] uppercase font-bold block">Projected Peak</span>
                <span className="text-lg font-black text-[#5BA33C] font-mono mt-0.5 block">
                  ₹{decision.projected_price}
                </span>
                <span className="text-[10px] text-[#5BA33C] font-semibold">+{decision.price_trajectory_7d_pct}%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10 text-center">
                <span className="text-[10px] text-[#D8C7AE] uppercase font-bold block">Net Expected Gain</span>
                <span className="text-lg font-black text-white font-mono mt-0.5 block">
                  ₹{decision.expected_net_gain_per_quintal}
                </span>
                <span className="text-[10px] text-[#D8C7AE]/70">after holding</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-[#D8C7AE]">
              <AlertCircle className="w-4 h-4 text-[#5BA33C] shrink-0 mt-0.5" />
              <span>Recommended Holding Window: <strong className="text-white font-bold">{decision.recommended_holding_days} Days</strong></span>
            </div>

          </div>

          {/* Decision Rationale & Sensitivity Breakdown */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-6 rounded-3xl glass-dark border border-white/14 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5 pb-2 border-b border-white/10">
                <ShieldCheck className="w-4 h-4 text-[#5BA33C]" />
                <span>Explainable Decision Vectors</span>
              </h3>

              <div className="space-y-3 text-xs">
                {decision.reasoning_vectors?.map((vec, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/6 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{vec.factor}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        vec.sentiment === 'positive' ? 'bg-[#5BA33C]/25 text-[#5BA33C]' :
                        vec.sentiment === 'neutral' ? 'bg-amber-500/25 text-amber-300' :
                        'bg-[#C46F52]/25 text-[#C46F52]'
                      }`}>
                        {vec.impact}
                      </span>
                    </div>
                    <p className="text-[#D8C7AE] leading-relaxed">
                      {vec.explanation}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[10.5px] text-[#D8C7AE]/75 leading-relaxed">
                Economic calculations incorporate daily mandi arrivals, wholesale Agmarknet momentum, and shelf-life decay factors.
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default SellWaitPage;
