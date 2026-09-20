import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getSellDecision } from '../services/api';
import {
  Scale,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Info,
  Store,
  RefreshCw,
  HelpCircle
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
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl min-h-[180px] flex flex-col justify-center">
        <img
          src="/assets/images/market-produce.jpg"
          alt="AI Econometric Harvest Timing Engine"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/85 to-forest-950/40 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/30 text-amber-300 text-xs font-bold mb-2 border border-amber-500/40 backdrop-blur-md">
              <Scale className="w-3.5 h-3.5" />
              <span>AI Economic Harvest Timing Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
              {t('sell_wait_title')}
            </h1>
            <p className="text-xs sm:text-sm text-cream-100/90 mt-1 max-w-2xl leading-relaxed font-medium">
              {t('sell_wait_subtitle')}
            </p>
          </div>

        <Link
          to="/marketplace"
          className="btn-agro-sell self-start sm:self-center flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold shadow-md cursor-pointer"
        >
          <Store className="w-4 h-4" />
          <span>{isTamil ? 'சந்தை தளத்தில் விற்க' : 'List in Marketplace'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>

      {/* Input Parameters Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-earth-600 dark:text-darkbg-muted flex items-center justify-between border-b border-cream-200 dark:border-darkbg-border pb-2">
          <span>{isTamil ? 'முடிவெடுக்கும் காரணிகள்' : 'Economic & Physiological Inputs'}</span>
          <span className="font-mono text-[11px] text-forest-700 dark:text-leaf-400 font-bold">Live Calibration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          
          {/* Crop Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-forest-950 dark:text-cream-100">Select Crop Commodity:</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-forest-950 dark:text-cream-50 font-bold cursor-pointer"
            >
              <option value="rice">Rice (Paddy)</option>
              <option value="cotton">Cotton</option>
              <option value="banana">Banana</option>
              <option value="tomato">Tomato</option>
              <option value="maize">Maize</option>
            </select>
          </div>

          {/* Crop Condition */}
          <div className="space-y-1.5">
            <label className="font-bold text-forest-950 dark:text-cream-100">Current Crop Condition:</label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-forest-950 dark:text-cream-50 font-bold cursor-pointer"
            >
              <option value="Good">Good (Healthy / Stable)</option>
              <option value="Fair">Moderate / Minor Blemishes</option>
              <option value="Poor">Poor / Disease / Rotting Risk</option>
            </select>
          </div>

          {/* Shelf Life Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-bold text-forest-950 dark:text-cream-100">Days to Perish (Shelf Life):</label>
              <span className="font-mono font-bold text-forest-700 dark:text-leaf-400">{daysToPerish} Days</span>
            </div>
            <input
              type="range"
              min="2"
              max="60"
              value={daysToPerish}
              onChange={(e) => setDaysToPerish(Number(e.target.value))}
              className="w-full accent-forest-600 h-2 bg-cream-200 dark:bg-darkbg-surface rounded-lg cursor-pointer"
            />
          </div>

          {/* Thermal Stress */}
          <div className="space-y-1.5">
            <label className="font-bold text-forest-950 dark:text-cream-100">Thermal Stress Level:</label>
            <select
              value={thermalStress}
              onChange={(e) => setThermalStress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-forest-950 dark:text-cream-50 font-bold cursor-pointer"
            >
              <option value="Low">Low / Normal Transpiration</option>
              <option value="Moderate">Moderate Canopy Heating</option>
              <option value="High">Severe Thermal Deficit</option>
            </select>
          </div>

          {/* Weather Risk */}
          <div className="space-y-1.5">
            <label className="font-bold text-forest-950 dark:text-cream-100">Weather / Rain Spoilage Risk:</label>
            <select
              value={weatherRisk}
              onChange={(e) => setWeatherRisk(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-forest-950 dark:text-cream-50 font-bold cursor-pointer"
            >
              <option value="Low">Low (Clear skies)</option>
              <option value="Medium">Medium (Scattered Rain Alert)</option>
              <option value="High">High (Continuous Downpour Expected)</option>
            </select>
          </div>

          {/* Storage Availability */}
          <div className="space-y-1.5 flex flex-col justify-end">
            <label className="font-bold text-forest-950 dark:text-cream-100 flex items-center justify-between cursor-pointer">
              <span>Secure Storage Available:</span>
              <input
                type="checkbox"
                checked={storageAvailable}
                onChange={(e) => setStorageAvailable(e.target.checked)}
                className="w-4 h-4 accent-forest-600 rounded cursor-pointer"
              />
            </label>
            <div className="text-[11px] text-earth-500 dark:text-darkbg-muted font-medium">
              {storageAvailable ? 'Warehousing / aeration available' : 'Open field / vulnerable to weather'}
            </div>
          </div>

        </div>
      </div>

      {/* Decision Results */}
      {decision && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Decision Banner */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-5">
            
            {/* Clear Decision Output Box */}
            <div className={`p-6 rounded-3xl border-2 flex items-center justify-between shadow-sm ${
              decision.recommendation === 'WAIT'
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500/50 text-emerald-950 dark:text-emerald-100'
                : 'bg-orange-50/80 dark:bg-orange-950/40 border-orange-500/50 text-orange-950 dark:text-orange-100'
            }`}>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-earth-600 dark:text-darkbg-muted block mb-1">
                  AI DECISION RECOMMENDATION
                </span>
                <div className={`text-4xl sm:text-5xl font-black tracking-tight ${
                  decision.recommendation === 'WAIT' ? 'text-emerald-700 dark:text-emerald-300' : 'text-orange-700 dark:text-orange-300'
                }`}>
                  {decision.recommendation === 'WAIT' ? '⏳ WAIT' : '🚀 SELL NOW'}
                </div>
                <span className="text-xs font-bold text-earth-700 dark:text-cream-200 mt-1 block">
                  {isTamil ? decision.recommendation_ta : (decision.recommendation === 'WAIT' ? 'Hold harvest for 7 to 10 days' : 'Sell crop immediately at current mandi prices')}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-earth-600 dark:text-darkbg-muted block">
                  AI Confidence Rate
                </span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-forest-800 dark:text-leaf-300">
                  {decision.confidence_pct}%
                </div>
                <span className="text-[10px] font-semibold text-earth-500 dark:text-darkbg-muted block mt-0.5">
                  AI Estimate
                </span>
              </div>
            </div>

            {/* Current Price & Momentum Bar */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border text-xs">
              <div>
                <span className="text-earth-600 dark:text-darkbg-muted block font-medium">Current Mandi Price:</span>
                <span className="text-lg font-black text-forest-950 dark:text-cream-50 font-mono">
                  {decision.current_price}
                </span>
              </div>
              <div className="text-right">
                <span className="text-earth-600 dark:text-darkbg-muted block font-medium">7-Day Momentum:</span>
                <span className={`text-lg font-black font-mono ${
                  decision.trend_direction === 'up' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {decision.trend_7d_pct} ({decision.trend_direction})
                </span>
              </div>
            </div>

            {/* Reason Explanation */}
            <div className="text-xs space-y-2">
              <span className="font-bold text-forest-950 dark:text-cream-100 uppercase text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
                <span>Why this decision? (AI Rationale):</span>
              </span>
              <div className="text-xs sm:text-sm font-medium text-earth-900 dark:text-cream-100 leading-relaxed bg-cream-50/70 dark:bg-darkbg-surface p-4 rounded-2xl border border-cream-200 dark:border-darkbg-border">
                {isTamil ? decision.reason_ta : decision.reason_en}
              </div>
            </div>

            {/* Projected Financial Benefit */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border">
                <span className="text-[10px] text-earth-500 dark:text-darkbg-muted block font-bold uppercase">Gross Gain</span>
                <span className="font-bold font-mono text-emerald-600 text-sm">
                  +₹{decision.financial_breakdown?.expected_gross_gain_per_quintal}/qtl
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border">
                <span className="text-[10px] text-earth-500 dark:text-darkbg-muted block font-bold uppercase">Holding Cost</span>
                <span className="font-bold font-mono text-rose-600 text-sm">
                  -₹{decision.financial_breakdown?.estimated_holding_cost_per_week}/wk
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border">
                <span className="text-[10px] text-earth-500 dark:text-darkbg-muted block font-bold uppercase">Net Benefit</span>
                <span className="font-bold font-mono text-forest-800 dark:text-leaf-300 text-sm">
                  ₹{decision.financial_breakdown?.net_projected_weekly_benefit}/qtl
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Factor Weights & AI Estimate Disclaimer */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-earth-600 dark:text-darkbg-muted flex items-center gap-1.5 pb-2 border-b border-cream-200 dark:border-darkbg-border">
                <Scale className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
                <span>AI Factor Weight Analysis</span>
              </h3>

              <div className="space-y-3 text-xs">
                {decision.explainability_factors?.map((f, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-forest-950 dark:text-cream-50">{f.factor}</span>
                      <span className="font-mono text-xs font-bold text-forest-700 dark:text-leaf-300">Weight: {f.weight}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-earth-700 dark:text-cream-200 font-medium">
                      <span>Observed State:</span>
                      <span className="font-bold text-forest-800 dark:text-leaf-300">{f.impact}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Explicit Disclaimer Notice */}
              <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2.5 leading-relaxed font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  <strong>AI Estimate Disclaimer:</strong> Market predictions and recommendations are model estimates based on historical mandi trends. They do not guarantee future commodity prices or financial returns.
                </span>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default SellWaitPage;

