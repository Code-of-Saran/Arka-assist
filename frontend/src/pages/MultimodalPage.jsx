import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { analyzeMultimodal } from '../services/api';
import {
  Layers,
  Sparkles,
  Camera,
  Flame,
  CloudSun,
  Droplets,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

const MultimodalPage = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const [cropName, setCropName] = useState('Rice (Paddy)');
  const [cropStage, setCropStage] = useState('Active Tillering');
  const [rgbHint, setRgbHint] = useState('leaf_spot');
  const [thermalHint, setThermalHint] = useState('moisture_stress');
  const [soilMoisture, setSoilMoisture] = useState(48.0);
  const [soilPh, setSoilPh] = useState(6.5);
  const [airTemp, setAirTemp] = useState(28.5);
  const [humidity, setHumidity] = useState(65.0);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRunFusion = async () => {
    setLoading(true);
    try {
      const data = await analyzeMultimodal({
        crop_name: cropName,
        crop_stage: cropStage,
        rgb_hint: rgbHint,
        thermal_hint: thermalHint,
        soil_moisture: soilMoisture,
        soil_ph: soilPh,
        air_temp: airTemp,
        humidity: humidity
      });
      setResult(data);
    } catch (err) {
      console.error('Multimodal fusion error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleRunFusion();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-forest-900 via-teal-950 to-stone-900 text-white shadow-soft-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-500/20 text-leaf-300 text-xs font-bold mb-2 border border-leaf-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTamil ? 'மல்டிமாடல் AI ஒருங்கிணைப்பு' : 'Multimodal Vision + Sensor Fusion'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('multimodal_title')}
            </h1>
            <p className="text-xs sm:text-sm text-forest-200 mt-1 max-w-2xl leading-relaxed">
              {t('multimodal_subtitle')}
            </p>
          </div>

          <button
            onClick={handleRunFusion}
            type="button"
            className="self-start sm:self-center flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-leaf-600 hover:bg-leaf-700 text-white shadow-md transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{t('multimodal_fuse_btn')}</span>
          </button>
        </div>
      </div>

      {/* 5 Multimodal Input Dimensions */}
      <div className="p-6 rounded-2xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-darkbg-border">
          <h2 className="text-sm font-bold uppercase tracking-wider text-forest-950 dark:text-cream-50 flex items-center gap-2">
            <Layers className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
            <span>{isTamil ? 'பல்நோக்கு உள்ளீட்டு காரணிகள்' : 'Fused Multimodal Data Channels'}</span>
          </h2>
          <span className="text-xs font-bold text-forest-700 dark:text-leaf-400">5 Active Streams</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* 1. RGB Crop Image */}
          <div className="p-4 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-forest-900 dark:text-cream-100">
              <Camera className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
              <span>1. RGB Visual Channel</span>
            </div>
            <select
              value={rgbHint}
              onChange={(e) => setRgbHint(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border text-forest-950 dark:text-cream-50"
            >
              <option value="leaf_spot">Foliar Spot / Blight</option>
              <option value="healthy_leaf">Healthy Green Leaf</option>
              <option value="chlorosis_yellow">Nitrogen Chlorosis</option>
              <option value="pest_chewing">Pest Foliar Damage</option>
            </select>
            <div className="text-[10px] text-earth-500 dark:text-darkbg-muted">Lamina color & lesion analysis</div>
          </div>

          {/* 2. Thermal Crop Image */}
          <div className="p-4 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900 dark:text-orange-300">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>2. Thermal IR Channel</span>
            </div>
            <select
              value={thermalHint}
              onChange={(e) => setThermalHint(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border text-forest-950 dark:text-cream-50"
            >
              <option value="moisture_stress">Canopy Hotspot (+6.3°C)</option>
              <option value="healthy_canopy">Normal Transpiration (-1.7°C)</option>
              <option value="vascular_pathology">Vascular Occlusion (+4.7°C)</option>
              <option value="salinity_stress">Marginal Osmotic Burn</option>
            </select>
            <div className="text-[10px] text-earth-500 dark:text-darkbg-muted">Stomatal cooling differential</div>
          </div>

          {/* 3. Crop & Stage */}
          <div className="p-4 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-leaf-900 dark:text-leaf-300">
              <Sprout className="w-4 h-4 text-leaf-600" />
              <span>3. Crop & Stage</span>
            </div>
            <select
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border text-forest-950 dark:text-cream-50"
            >
              <option value="Rice (Paddy)">Rice (Paddy)</option>
              <option value="Cotton">Cotton</option>
              <option value="Banana">Banana</option>
              <option value="Tomato">Tomato</option>
              <option value="Maize">Maize</option>
            </select>
            <select
              value={cropStage}
              onChange={(e) => setCropStage(e.target.value)}
              className="w-full px-2.5 py-1 rounded-lg text-[11px] bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border text-forest-950 dark:text-cream-50"
            >
              <option value="Vegetative">Vegetative</option>
              <option value="Active Tillering">Tillering / Branching</option>
              <option value="Flowering">Flowering (Critical)</option>
              <option value="Fruiting">Fruiting / Grain Fill</option>
            </select>
          </div>

          {/* 4. Soil Condition */}
          <div className="p-4 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900 dark:text-teal-300">
              <Droplets className="w-4 h-4 text-teal-600" />
              <span>4. Soil Sensors</span>
            </div>
            <div className="text-[11px] flex justify-between">
              <span>Moisture:</span>
              <span className="font-bold">{soilMoisture}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(Number(e.target.value))}
              className="w-full accent-forest-600"
            />
            <div className="text-[11px] flex justify-between">
              <span>pH Level:</span>
              <span className="font-bold">{soilPh}</span>
            </div>
          </div>

          {/* 5. Weather Telemetry */}
          <div className="p-4 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
              <CloudSun className="w-4 h-4 text-amber-600" />
              <span>5. Meteorology</span>
            </div>
            <div className="text-[11px] flex justify-between">
              <span>Air Temp:</span>
              <span className="font-bold">{airTemp}°C</span>
            </div>
            <input
              type="range"
              min="15"
              max="45"
              value={airTemp}
              onChange={(e) => setAirTemp(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
            <div className="text-[11px] flex justify-between">
              <span>Humidity:</span>
              <span className="font-bold">{humidity}%</span>
            </div>
          </div>

        </div>
      </div>

      {/* Multimodal Assessment Results */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Stress Result Card */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-darkbg-border">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted">
                  {t('multimodal_stress_result')}
                </span>
                <div className="text-2xl font-black text-forest-950 dark:text-cream-50">
                  {isTamil ? result.overall_stress_assessment?.level_ta : result.overall_stress_assessment?.level_en}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-earth-500 dark:text-darkbg-muted">
                  Fused Health Index
                </span>
                <div className="text-2xl font-black text-forest-700 dark:text-leaf-400 font-mono">
                  {result.overall_stress_assessment?.health_score}/100
                </div>
              </div>
            </div>

            {/* Cross-Domain Findings Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-forest-50/60 dark:bg-forest-950/40 border border-forest-200/60 dark:border-forest-800">
                <span className="font-bold text-forest-900 dark:text-leaf-300 block mb-1">
                  🌿 RGB Visual Pathology:
                </span>
                <p className="text-earth-700 dark:text-cream-200/90 leading-relaxed">
                  {isTamil ? result.domain_findings?.rgb_visual_analysis?.findings_ta : result.domain_findings?.rgb_visual_analysis?.findings_en}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-orange-50/60 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800">
                <span className="font-bold text-orange-900 dark:text-orange-300 block mb-1">
                  🔥 Thermal Canopy State:
                </span>
                <p className="text-earth-700 dark:text-cream-200/90 leading-relaxed">
                  Canopy: {result.domain_findings?.thermal_ir_analysis?.canopy_temperature}°C (ΔT: +{result.domain_findings?.thermal_ir_analysis?.delta_t}°C). Region: {result.domain_findings?.thermal_ir_analysis?.affected_region}
                </p>
              </div>
            </div>

            {/* Root Cause Explanation */}
            <div className="text-xs space-y-1 pt-2 border-t border-cream-200 dark:border-darkbg-border">
              <span className="font-bold text-forest-950 dark:text-cream-100 uppercase text-[11px]">
                {isTamil ? 'காரண விளக்கம்' : 'Fused Root Cause Explanation'}:
              </span>
              <p className="text-earth-800 dark:text-cream-200 leading-relaxed font-medium">
                {isTamil ? result.root_cause_explanation?.cause_ta : result.root_cause_explanation?.cause_en}
              </p>
            </div>

            {/* Prioritized Treatment Plan */}
            <div className="p-4 rounded-xl bg-leaf-50 dark:bg-leaf-950/40 border border-leaf-200 dark:border-leaf-800 text-xs space-y-2">
              <span className="font-bold text-forest-950 dark:text-leaf-300 uppercase text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-leaf-600 dark:text-leaf-400" />
                <span>{t('multimodal_remedy')}</span>
              </span>
              <p className="text-earth-800 dark:text-cream-100 leading-relaxed whitespace-pre-line">
                {isTamil ? result.actionable_recommendation?.action_ta : result.actionable_recommendation?.action_en}
              </p>
            </div>

          </div>

          {/* Right Column: Model Architecture Details & Confidence */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-earth-600 dark:text-darkbg-muted flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
                <span>Multimodal Fusion Confidence</span>
              </h3>

              <div className="flex items-center justify-between my-2">
                <div className="text-3xl font-black text-forest-950 dark:text-cream-50 font-mono">
                  {result.model_confidence_pct}%
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-leaf-100 dark:bg-leaf-950/60 text-leaf-800 dark:text-leaf-300 border border-leaf-300 dark:border-leaf-800">
                  High Precision
                </span>
              </div>

              <div className="space-y-2.5 text-xs pt-3 border-t border-cream-200 dark:border-darkbg-border">
                <div className="flex justify-between items-center">
                  <span className="text-earth-700 dark:text-darkbg-muted">RGB Weight</span>
                  <span className="font-mono font-bold">35%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-cream-200 dark:bg-darkbg-surface overflow-hidden">
                  <div className="h-full bg-forest-600 rounded-full" style={{ width: '35%' }} />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-earth-700 dark:text-darkbg-muted">Thermal IR Weight</span>
                  <span className="font-mono font-bold">40%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-cream-200 dark:bg-darkbg-surface overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: '40%' }} />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-earth-700 dark:text-darkbg-muted">Meteorology & Soil</span>
                  <span className="font-mono font-bold">25%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-cream-200 dark:bg-darkbg-surface overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div className="pt-3 text-[11px] text-earth-600 dark:text-darkbg-muted leading-relaxed">
                {result.data_integrity_notice}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default MultimodalPage;
