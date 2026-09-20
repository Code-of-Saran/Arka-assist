import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { recommendCrop } from '../services/api';
import { saveCropPredictionHistory } from '../services/offlineStorage';
import ConfidenceGauge from '../components/ConfidenceGauge';
import FactorRadar from '../components/FactorRadar';
import confetti from 'canvas-confetti';
import {
  Sprout,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Droplets,
  Clock,
  Layers,
  Thermometer,
  CloudRain,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Loader2
} from 'lucide-react';

const PRESETS = {
  rice: {
    label_en: "Paddy (Delta Region)",
    label_ta: "நெல் (டெல்டா பகுதி)",
    values: { n: 80, p: 48, k: 40, temp: 24, hum: 82, ph: 6.4, rain: 235 }
  },
  cotton: {
    label_en: "Cotton (Black Soil)",
    label_ta: "பருத்தி (கரிசல் நிலம்)",
    values: { n: 118, p: 46, k: 19, temp: 24, hum: 80, ph: 6.9, rain: 80 }
  },
  fruits: {
    label_en: "Fruits / Orchard (Grapes)",
    label_ta: "பழத்தோட்டம் (திராட்சை)",
    values: { n: 23, p: 133, k: 201, temp: 24, hum: 82, ph: 6.0, rain: 69 }
  }
};

const CropRecommendation = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  // Input states with realistic defaults
  const [formData, setFormData] = useState({
    n: 80,
    p: 48,
    k: 40,
    temperature: 24,
    humidity: 82,
    ph: 6.4,
    rainfall: 235
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');

  const handleChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const applyPreset = (presetKey) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      setFormData({
        n: preset.values.n,
        p: preset.values.p,
        k: preset.values.k,
        temperature: preset.values.temp,
        humidity: preset.values.hum,
        ph: preset.values.ph,
        rainfall: preset.values.rain
      });
    }
  };

  const handleReset = () => {
    setFormData({
      n: 70,
      p: 45,
      k: 40,
      temperature: 25,
      humidity: 70,
      ph: 6.5,
      rainfall: 120
    });
    setResult(null);
    setError('');
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Multi-step loading state sequence
    setLoadingStep(isTamil ? 'மண் N-P-K அளவுகளை சரிபார்க்கிறது...' : 'Analyzing soil N-P-K parameters...');
    setTimeout(() => {
      setLoadingStep(isTamil ? 'வானிலை & மழைப்பொழிவு ஒப்பிடுகிறது...' : 'Comparing rainfall & climate conditions...');
    }, 600);

    try {
      const response = await recommendCrop(formData);
      setTimeout(() => {
        setResult(response);
        saveCropPredictionHistory(response);

        if (response.confidence >= 85) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 }
            });
          } catch (err) {
            // Ignore
          }
        }
        setLoading(false);
      }, 1100);
    } catch (err) {
      setError(err.message || 'Failed to generate recommendation');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl min-h-[180px] flex flex-col justify-center">
        <img
          src="/assets/images/crop-fields.jpg"
          alt="Lush Crop Fields"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/85 to-forest-950/40 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-500/30 text-leaf-300 text-xs font-bold border border-leaf-500/40 backdrop-blur-md mb-2">
              <Cpu className="w-4 h-4" />
              <span>Machine Learning Crop Matcher</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {t('crop_rec_title')}
            </h1>
            <p className="text-xs sm:text-sm text-cream-100/90 mt-1 max-w-2xl font-medium">
              {t('crop_rec_subtitle')}
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 z-20">
            <span className="text-xs font-bold text-cream-200 mr-1">
              Presets:
            </span>
            <button
              type="button"
              onClick={() => applyPreset('rice')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              🌾 {t('crop_btn_preset_rice')}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('cotton')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              🌱 {t('crop_btn_preset_cotton')}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('fruits')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
            >
              🍇 {t('crop_btn_preset_fruits')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Inputs (Left) & Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Inputs (Left 5 Cols) */}
        <div className="lg:col-span-5">
          <form onSubmit={handlePredict} className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-darkbg-border">
              <h2 className="text-xs font-bold uppercase tracking-wider text-earth-800 dark:text-cream-100">
                Soil & Environmental Metrics
              </h2>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-earth-600 dark:text-darkbg-muted hover:text-earth-900 dark:hover:text-cream-100 flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Nitrogen */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <label className="text-earth-800 dark:text-cream-100">{t('crop_form_nitrogen')}</label>
                <span className="font-mono text-forest-700 dark:text-leaf-300 font-bold">{formData.n} mg/kg</span>
              </div>
              <input
                type="range"
                min="0"
                max="140"
                step="1"
                value={formData.n}
                onChange={(e) => handleChange('n', e.target.value)}
                className="w-full accent-forest-600 h-2.5 bg-cream-200 dark:bg-darkbg-surface rounded-lg cursor-pointer"
              />
            </div>

            {/* Phosphorus */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <label className="text-earth-800 dark:text-cream-100">{t('crop_form_phosphorus')}</label>
                <span className="font-mono text-forest-700 dark:text-leaf-300 font-bold">{formData.p} mg/kg</span>
              </div>
              <input
                type="range"
                min="0"
                max="145"
                step="1"
                value={formData.p}
                onChange={(e) => handleChange('p', e.target.value)}
                className="w-full accent-forest-600 h-2.5 bg-cream-200 dark:bg-darkbg-surface rounded-lg cursor-pointer"
              />
            </div>

            {/* Potassium */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <label className="text-earth-800 dark:text-cream-100">{t('crop_form_potassium')}</label>
                <span className="font-mono text-forest-700 dark:text-leaf-300 font-bold">{formData.k} mg/kg</span>
              </div>
              <input
                type="range"
                min="0"
                max="205"
                step="1"
                value={formData.k}
                onChange={(e) => handleChange('k', e.target.value)}
                className="w-full accent-forest-600 h-2.5 bg-cream-200 dark:bg-darkbg-surface rounded-lg cursor-pointer"
              />
            </div>

            {/* Grid for Temp, Humidity, pH, Rainfall */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-cream-200 dark:border-darkbg-border">
              {/* Temp */}
              <div>
                <label className="block text-[11px] font-bold text-earth-800 dark:text-cream-100 mb-1">
                  {t('crop_form_temp')}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="8"
                  max="48"
                  value={formData.temperature}
                  onChange={(e) => handleChange('temperature', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-earth-900 dark:text-cream-50 font-mono font-bold"
                />
              </div>

              {/* Humidity */}
              <div>
                <label className="block text-[11px] font-bold text-earth-800 dark:text-cream-100 mb-1">
                  {t('crop_form_humidity')}
                </label>
                <input
                  type="number"
                  step="1"
                  min="10"
                  max="100"
                  value={formData.humidity}
                  onChange={(e) => handleChange('humidity', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-earth-900 dark:text-cream-50 font-mono font-bold"
                />
              </div>

              {/* pH */}
              <div>
                <label className="block text-[11px] font-bold text-earth-800 dark:text-cream-100 mb-1">
                  {t('crop_form_ph')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="3.5"
                  max="9.5"
                  value={formData.ph}
                  onChange={(e) => handleChange('ph', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-earth-900 dark:text-cream-50 font-mono font-bold"
                />
              </div>

              {/* Rainfall */}
              <div>
                <label className="block text-[11px] font-bold text-earth-800 dark:text-cream-100 mb-1">
                  {t('crop_form_rainfall')}
                </label>
                <input
                  type="number"
                  step="5"
                  min="10"
                  max="350"
                  value={formData.rainfall}
                  onChange={(e) => handleChange('rainfall', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-earth-900 dark:text-cream-50 font-mono font-bold"
                />
              </div>
            </div>

            {/* Predict CTA */}
            <button
              type="submit"
              disabled={loading}
              className="btn-agro-primary w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{loadingStep || 'Executing Agronomic Model...'}</span>
                </span>
              ) : (
                <>
                  <Sprout className="w-4 h-4" />
                  <span>{t('crop_btn_predict')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Panel (Right 7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {loading ? (
            /* Animated Loading State */
            <div className="h-full min-h-[420px] rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col items-center justify-center p-8 text-center space-y-4 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-forest-100 dark:bg-darkbg-surface flex items-center justify-center text-forest-600 dark:text-leaf-400">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-forest-950 dark:text-cream-50">
                  {isTamil ? 'பயிரை கணக்கிடுகிறது...' : 'Matching Crop Characteristics...'}
                </h3>
                <p className="text-xs text-earth-600 dark:text-darkbg-muted mt-1">{loadingStep}</p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-6 animate-fade-in-up">
              
              {/* Top Result Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft">
                
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cream-200 dark:border-darkbg-border">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forest-600 to-leaf-500 flex items-center justify-center text-3xl shadow-glow-green text-white">
                      🌾
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-earth-600 dark:text-darkbg-muted">
                        {t('crop_result_title')}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-cream-50">
                        {isTamil ? result.crop_name_ta : result.crop_name_en}
                      </h2>
                      <span className="inline-block mt-0.5 px-3 py-0.5 rounded-full text-xs font-bold bg-leaf-100 dark:bg-darkbg-surface text-leaf-800 dark:text-leaf-300 border border-leaf-300 dark:border-darkbg-border">
                        {result.category}
                      </span>
                    </div>
                  </div>

                  {/* SVG Confidence Gauge */}
                  <ConfidenceGauge
                    value={result.confidence}
                    size={140}
                    label="Match Rate"
                  />
                </div>

                {/* Agronomic Specifications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5">
                  <div className="p-3.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200/80 dark:border-darkbg-border">
                    <div className="flex items-center gap-1.5 text-xs text-earth-600 dark:text-darkbg-muted mb-0.5 font-medium">
                      <Layers className="w-3.5 h-3.5 text-forest-600" />
                      <span>{t('crop_result_soil')}</span>
                    </div>
                    <div className="text-xs font-bold text-forest-950 dark:text-cream-50">
                      {result.soil_type}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200/80 dark:border-darkbg-border">
                    <div className="flex items-center gap-1.5 text-xs text-earth-600 dark:text-darkbg-muted mb-0.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-leaf-600" />
                      <span>{t('crop_result_duration')}</span>
                    </div>
                    <div className="text-xs font-bold text-forest-950 dark:text-cream-50">
                      {result.growth_duration}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200/80 dark:border-darkbg-border col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1.5 text-xs text-earth-600 dark:text-darkbg-muted mb-0.5 font-medium">
                      <Droplets className="w-3.5 h-3.5 text-sky-500" />
                      <span>{t('crop_result_water')}</span>
                    </div>
                    <div className="text-xs font-bold text-forest-950 dark:text-cream-50">
                      {result.water_requirement}
                    </div>
                  </div>
                </div>

                {/* Cultivation Advice */}
                <div className="p-4 rounded-2xl bg-forest-50/80 dark:bg-darkbg-surface border border-forest-200/80 dark:border-darkbg-border">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-leaf-300 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-leaf-600" />
                    <span>{t('crop_result_advice')}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-earth-800 dark:text-cream-200/90 leading-relaxed font-medium">
                    {isTamil ? result.advice_ta : result.advice_en}
                  </p>
                </div>

              </div>

              {/* Diagrammatic Factor Matching Radar/Bar Matrix */}
              {result.factors && (
                <FactorRadar factors={result.factors} />
              )}

              {/* Alternative Crops List */}
              {result.alternatives && result.alternatives.length > 0 && (
                <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-earth-700 dark:text-darkbg-muted mb-3">
                    {t('crop_result_alternatives')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.alternatives.map((alt, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200/80 dark:border-darkbg-border flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-forest-950 dark:text-cream-50">
                            {isTamil ? alt.name_ta : alt.name_en}
                          </div>
                          <div className="text-[11px] text-earth-600 dark:text-darkbg-muted">
                            {alt.category}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cream-200 dark:bg-darkbg-border text-earth-800 dark:text-cream-100">
                          {alt.confidence}% match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* Empty state placeholder before prediction */
            <div className="h-full min-h-[420px] rounded-3xl bg-white/60 dark:bg-darkbg-card/60 border border-dashed border-cream-300 dark:border-darkbg-border flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-cream-100 dark:bg-darkbg-surface flex items-center justify-center text-earth-500 dark:text-darkbg-muted mb-4 shadow-inner">
                <Sprout className="w-8 h-8 text-leaf-600" />
              </div>
              <h3 className="text-lg font-bold text-forest-950 dark:text-cream-50 mb-1">
                {isTamil ? 'பரிந்துரை முடிவுகள் இங்கே தோன்றும்' : 'Ready for Agronomic Soil Match'}
              </h3>
              <p className="text-xs sm:text-sm text-earth-600 dark:text-darkbg-muted max-w-sm">
                {isTamil
                  ? 'மண் சத்துக்களை உள்ளிட்டு "பயிர் பரிந்துரை செய்" பொத்தானை அழுத்தவும்.'
                  : 'Adjust soil NPK and climate sliders on the left or select a preset, then click recommend to generate full agronomic analysis.'}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default CropRecommendation;

