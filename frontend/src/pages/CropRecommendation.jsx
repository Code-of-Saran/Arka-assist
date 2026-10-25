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
  Droplets,
  Clock,
  Layers,
  Cpu,
  Loader2,
  ArrowRight
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
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl min-h-[170px] flex flex-col justify-center border border-white/18">
        <img
          src="/assets/images/soil-sprout.jpg"
          alt="Soil & Sprout Agronomy"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D25]/95 via-[#0B6623]/85 to-[#0F3D25]/75 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold border border-white/25 backdrop-blur-md mb-2 shadow-xs">
              <Cpu className="w-3.5 h-3.5 text-[#5BA33C]" />
              <span>Machine Learning Crop Matcher</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              {t('crop_rec_title')}
            </h1>
            <p className="text-xs sm:text-sm text-white/85 mt-1 max-w-2xl font-medium leading-relaxed">
              {t('crop_rec_subtitle')}
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 z-20">
            <span className="text-xs font-bold text-[#D8C7AE] mr-1">
              Presets:
            </span>
            <button
              type="button"
              onClick={() => applyPreset('rice')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/12 hover:bg-white/22 text-white border border-white/20 transition-all cursor-pointer shadow-xs"
            >
              🌾 {t('crop_btn_preset_rice')}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('cotton')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/12 hover:bg-white/22 text-white border border-white/20 transition-all cursor-pointer shadow-xs"
            >
              🌱 {t('crop_btn_preset_cotton')}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('fruits')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/12 hover:bg-white/22 text-white border border-white/20 transition-all cursor-pointer shadow-xs"
            >
              🍇 {t('crop_btn_preset_fruits')}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Inputs (Left) & Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Inputs (Left 5 Cols) */}
        <div className="lg:col-span-5">
          <form onSubmit={handlePredict} className="p-6 rounded-3xl glass-dark border border-white/14 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-xs font-black uppercase tracking-wider text-white">
                Soil & Environmental Metrics
              </h2>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-[#D8C7AE] hover:text-white flex items-center gap-1 font-bold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#5BA33C]" />
                <span>Reset</span>
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold">
                {error}
              </div>
            )}

            {/* Nitrogen */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <label className="text-white">{t('crop_form_nitrogen')}</label>
                <span className="font-mono text-[#5BA33C] font-black">{formData.n} mg/kg</span>
              </div>
              <input
                type="range"
                min="0"
                max="140"
                step="1"
                value={formData.n}
                onChange={(e) => handleChange('n', e.target.value)}
                className="w-full accent-[#5BA33C] h-2 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Phosphorus */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <label className="text-white">{t('crop_form_phosphorus')}</label>
                <span className="font-mono text-[#5BA33C] font-black">{formData.p} mg/kg</span>
              </div>
              <input
                type="range"
                min="0"
                max="145"
                step="1"
                value={formData.p}
                onChange={(e) => handleChange('p', e.target.value)}
                className="w-full accent-[#4F8F5B] h-2 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Potassium */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <label className="text-white">{t('crop_form_potassium')}</label>
                <span className="font-mono text-[#5BA33C] font-black">{formData.k} mg/kg</span>
              </div>
              <input
                type="range"
                min="0"
                max="205"
                step="1"
                value={formData.k}
                onChange={(e) => handleChange('k', e.target.value)}
                className="w-full accent-[#B8A77A] h-2 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* Grid for Temp, Humidity, pH, Rainfall */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
              {/* Temp */}
              <div>
                <label className="block text-[11px] font-bold text-[#D8C7AE] mb-1">
                  {t('crop_form_temp')}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="8"
                  max="48"
                  value={formData.temperature}
                  onChange={(e) => handleChange('temperature', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/40 border border-white/20 font-mono font-bold text-white outline-none focus:border-[#5BA33C]"
                />
              </div>

              {/* Humidity */}
              <div>
                <label className="block text-[11px] font-bold text-[#D8C7AE] mb-1">
                  {t('crop_form_humidity')}
                </label>
                <input
                  type="number"
                  step="1"
                  min="10"
                  max="100"
                  value={formData.humidity}
                  onChange={(e) => handleChange('humidity', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/40 border border-white/20 font-mono font-bold text-white outline-none focus:border-[#5BA33C]"
                />
              </div>

              {/* pH */}
              <div>
                <label className="block text-[11px] font-bold text-[#D8C7AE] mb-1">
                  {t('crop_form_ph')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="3.5"
                  max="9.5"
                  value={formData.ph}
                  onChange={(e) => handleChange('ph', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/40 border border-white/20 font-mono font-bold text-white outline-none focus:border-[#5BA33C]"
                />
              </div>

              {/* Rainfall */}
              <div>
                <label className="block text-[11px] font-bold text-[#D8C7AE] mb-1">
                  {t('crop_form_rainfall')}
                </label>
                <input
                  type="number"
                  step="5"
                  min="10"
                  max="350"
                  value={formData.rainfall}
                  onChange={(e) => handleChange('rainfall', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-black/40 border border-white/20 font-mono font-bold text-white outline-none focus:border-[#5BA33C]"
                />
              </div>
            </div>

            {/* Predict CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer btn-glass-primary shadow-glass hover:scale-[1.01] active:scale-95 transition-all text-white"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{loadingStep || 'Executing Agronomic Model...'}</span>
                </span>
              ) : (
                <>
                  <Sprout className="w-4 h-4 text-white" />
                  <span>{t('crop_btn_predict')}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Panel (Right 7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {loading ? (
            <div className="h-full min-h-[420px] rounded-3xl glass-dark border border-white/14 flex flex-col items-center justify-center p-8 text-center space-y-4 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-[#0B6623]/25 border border-[#5BA33C]/30 flex items-center justify-center text-[#5BA33C]">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isTamil ? 'பயிரை கணக்கிடுகிறது...' : 'Matching Crop Characteristics...'}
                </h3>
                <p className="text-xs text-[#D8C7AE] mt-1">{loadingStep}</p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-5 animate-fade-in-up">
              
              {/* Top Result Card */}
              <div className="p-6 rounded-3xl glass-dark border border-white/14 space-y-5">
                
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#0B6623]/25 border border-[#5BA33C]/35 flex items-center justify-center text-3xl shadow-glass text-white">
                      🌾
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8C7AE]">
                        {t('crop_result_title')}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-white">
                        {isTamil ? result.crop_name_ta : result.crop_name_en}
                      </h2>
                      <span className="inline-block mt-0.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#0B6623]/35 text-[#5BA33C] border border-[#5BA33C]/40">
                        {result.category}
                      </span>
                    </div>
                  </div>

                  <ConfidenceGauge
                    value={result.confidence}
                    size={140}
                    label="Match Rate"
                  />
                </div>

                {/* Agronomic Specifications Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
                  <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10">
                    <div className="flex items-center gap-1.5 text-xs text-[#D8C7AE] mb-0.5 font-bold">
                      <Layers className="w-3.5 h-3.5 text-[#5BA33C]" />
                      <span>{t('crop_result_soil')}</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      {result.soil_type}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10">
                    <div className="flex items-center gap-1.5 text-xs text-[#D8C7AE] mb-0.5 font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#5BA33C]" />
                      <span>{t('crop_result_duration')}</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      {result.growth_duration}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1.5 text-xs text-[#D8C7AE] mb-0.5 font-bold">
                      <Droplets className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>{t('crop_result_water')}</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      {result.water_requirement}
                    </div>
                  </div>
                </div>

                {/* Cultivation Advice */}
                <div className="p-4 rounded-2xl glass-green border border-[#5BA33C]/35">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#5BA33C]" />
                    <span>{t('crop_result_advice')}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium">
                    {isTamil ? result.advice_ta : result.advice_en}
                  </p>
                </div>

              </div>

              {/* Diagrammatic Factor Matching Radar/Bar Matrix */}
              {result.factors && (
                <div className="glass-dark p-6 rounded-3xl border border-white/14">
                  <FactorRadar factors={result.factors} />
                </div>
              )}

              {/* Alternative Crops List */}
              {result.alternatives && result.alternatives.length > 0 && (
                <div className="p-6 rounded-3xl glass-dark border border-white/14 shadow-glass space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">
                    {t('crop_result_alternatives')}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.alternatives.map((alt, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">
                            {isTamil ? alt.name_ta : alt.name_en}
                          </div>
                          <div className="text-[11px] font-semibold text-[#5BA33C]">
                            {alt.category}
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#0B6623]/35 text-[#5BA33C] border border-[#5BA33C]/40">
                          {alt.confidence}% match
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="h-full min-h-[420px] rounded-3xl glass-dark border border-dashed border-white/16 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#0B6623]/25 border border-[#5BA33C]/35 flex items-center justify-center text-[#5BA33C] mb-4 shadow-glass">
                <Sprout className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-white mb-1">
                {isTamil ? 'பரிந்துரை முடிவுகள் இங்கே தோன்றும்' : 'Ready for Agronomic Soil Match'}
              </h3>
              <p className="text-xs sm:text-sm text-[#D8C7AE] max-w-sm font-medium">
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
