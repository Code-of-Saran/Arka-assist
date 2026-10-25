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
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl min-h-[170px] flex flex-col justify-center border border-white/18">
        <img
          src="/assets/images/crop-fields.jpg"
          alt="RGB + Thermal Multimodal Analysis"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D25]/95 via-[#0B6623]/85 to-[#0F3D25]/75 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold mb-2 border border-white/25 backdrop-blur-md shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#5BA33C]" />
              <span>{isTamil ? 'மல்டிமாடல் AI ஒருங்கிணைப்பு' : 'Multimodal Vision + Sensor Fusion'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              {t('multimodal_title')}
            </h1>
            <p className="text-xs sm:text-sm text-white/85 mt-1 max-w-2xl leading-relaxed font-medium">
              {t('multimodal_subtitle')}
            </p>
          </div>

          <button
            onClick={handleRunFusion}
            type="button"
            className="self-start sm:self-center flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold btn-glass-primary shadow-glass transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
            <span>{t('multimodal_fuse_btn')}</span>
          </button>
        </div>
      </div>

      {/* 5 Multimodal Channel Cards:
          RGB -> green (#5BA33C / #0B6623)
          Thermal -> terracotta (#C46F52)
          Crop -> green / neutral
          Soil -> brown/khaki (#B8A77A)
          Meteorology -> muted gold (#D97706)
      */}
      <div className="p-6 rounded-3xl glass-dark border border-white/14 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h2 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#5BA33C]" />
            <span>{isTamil ? 'பல்நோக்கு உள்ளீட்டு காரணிகள்' : 'Fused Multimodal Data Channels'}</span>
          </h2>
          <span className="text-[10px] font-mono font-bold text-[#5BA33C] px-2.5 py-0.5 rounded-full bg-white/6 border border-white/12">
            5 Active Streams
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          
          {/* 1. RGB Channel (Green Accent) */}
          <div className="p-4 rounded-2xl bg-white/6 border border-[#5BA33C]/35 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Camera className="w-4 h-4 text-[#5BA33C]" />
              <span>1. RGB Visible</span>
            </div>
            <select
              value={rgbHint}
              onChange={(e) => setRgbHint(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl text-xs bg-black/40 text-white border border-white/20 font-medium outline-none"
            >
              <option value="leaf_spot" className="bg-[#0b1a11] text-white">Foliar Spot / Blight</option>
              <option value="healthy_leaf" className="bg-[#0b1a11] text-white">Healthy Green Leaf</option>
              <option value="chlorosis_yellow" className="bg-[#0b1a11] text-white">Nitrogen Chlorosis</option>
              <option value="pest_chewing" className="bg-[#0b1a11] text-white">Pest Foliar Damage</option>
            </select>
            <div className="text-[10px] text-[#D8C7AE] font-medium">Lamina color & lesion analysis</div>
          </div>

          {/* 2. Thermal IR (Terracotta Accent) */}
          <div className="p-4 rounded-2xl bg-white/6 border border-[#C46F52]/35 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C46F52]">
              <Flame className="w-4 h-4 text-[#C46F52]" />
              <span>2. Thermal IR</span>
            </div>
            <select
              value={thermalHint}
              onChange={(e) => setThermalHint(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl text-xs bg-black/40 text-white border border-white/20 font-medium outline-none"
            >
              <option value="moisture_stress" className="bg-[#0b1a11] text-white">Canopy Hotspot (+6.3°C)</option>
              <option value="healthy_canopy" className="bg-[#0b1a11] text-white">Normal Transpiration (-1.7°C)</option>
              <option value="vascular_pathology" className="bg-[#0b1a11] text-white">Vascular Occlusion (+4.7°C)</option>
              <option value="salinity_stress" className="bg-[#0b1a11] text-white">Marginal Osmotic Burn</option>
            </select>
            <div className="text-[10px] text-[#D8C7AE] font-medium">Stomatal cooling differential</div>
          </div>

          {/* 3. Crop & Stage */}
          <div className="p-4 rounded-2xl bg-white/6 border border-white/12 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Sprout className="w-4 h-4 text-[#5BA33C]" />
              <span>3. Crop & Stage</span>
            </div>
            <select
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl text-xs bg-black/40 text-white border border-white/20 font-medium outline-none"
            >
              <option value="Rice (Paddy)" className="bg-[#0b1a11] text-white">Rice (Paddy)</option>
              <option value="Cotton" className="bg-[#0b1a11] text-white">Cotton</option>
              <option value="Banana" className="bg-[#0b1a11] text-white">Banana</option>
              <option value="Tomato" className="bg-[#0b1a11] text-white">Tomato</option>
              <option value="Maize" className="bg-[#0b1a11] text-white">Maize</option>
            </select>
            <select
              value={cropStage}
              onChange={(e) => setCropStage(e.target.value)}
              className="w-full px-2.5 py-1 rounded-xl text-[11px] bg-black/40 text-white border border-white/20 font-medium outline-none"
            >
              <option value="Vegetative" className="bg-[#0b1a11] text-white">Vegetative</option>
              <option value="Active Tillering" className="bg-[#0b1a11] text-white">Tillering / Branching</option>
              <option value="Flowering" className="bg-[#0b1a11] text-white">Flowering (Critical)</option>
              <option value="Fruiting" className="bg-[#0b1a11] text-white">Fruiting / Grain Fill</option>
            </select>
          </div>

          {/* 4. Soil Condition (Brown / Khaki Accent) */}
          <div className="p-4 rounded-2xl bg-white/6 border border-[#B8A77A]/35 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#D8C7AE]">
              <Droplets className="w-4 h-4 text-[#B8A77A]" />
              <span>4. Soil Sensors</span>
            </div>
            <div className="text-[11px] flex justify-between text-[#D8C7AE] font-medium">
              <span>Moisture:</span>
              <span className="font-bold font-mono text-white">{soilMoisture}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(Number(e.target.value))}
              className="w-full accent-[#5BA33C] cursor-pointer"
            />
            <div className="text-[11px] flex justify-between text-[#D8C7AE] font-medium">
              <span>pH Level:</span>
              <span className="font-bold font-mono text-white">{soilPh}</span>
            </div>
          </div>

          {/* 5. Meteorology (Muted Gold Accent) */}
          <div className="p-4 rounded-2xl bg-white/6 border border-amber-400/35 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <CloudSun className="w-4 h-4 text-amber-300" />
              <span>5. Meteorology</span>
            </div>
            <div className="text-[11px] flex justify-between text-[#D8C7AE] font-medium">
              <span>Air Temp:</span>
              <span className="font-bold font-mono text-white">{airTemp}°C</span>
            </div>
            <input
              type="range"
              min="15"
              max="45"
              value={airTemp}
              onChange={(e) => setAirTemp(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="text-[11px] flex justify-between text-[#D8C7AE] font-medium">
              <span>Humidity:</span>
              <span className="font-bold font-mono text-white">{humidity}%</span>
            </div>
          </div>

        </div>
      </div>

      {/* Multimodal Assessment Results */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Stress Result Card */}
          <div className="lg:col-span-7 p-6 rounded-3xl glass-dark border border-white/14 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8C7AE]">
                  {t('multimodal_stress_result')}
                </span>
                <div className="text-2xl font-black text-white mt-0.5">
                  {isTamil ? result.overall_stress_assessment?.level_ta : result.overall_stress_assessment?.level_en}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-[#5BA33C]">
                  Fused Health Index
                </span>
                <div className="text-2xl font-black text-[#5BA33C] font-mono">
                  {result.overall_stress_assessment?.health_score}/100
                </div>
              </div>
            </div>

            {/* Cross-Domain Findings Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-white/6 border border-[#5BA33C]/35">
                <span className="font-bold text-[#5BA33C] block mb-1">
                  🌿 RGB Visual Pathology:
                </span>
                <p className="text-white/90 leading-relaxed font-medium">
                  {isTamil ? result.domain_findings?.rgb_visual_analysis?.findings_ta : result.domain_findings?.rgb_visual_analysis?.findings_en}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/6 border border-[#C46F52]/40">
                <span className="font-bold text-[#C46F52] block mb-1">
                  🔥 Thermal Canopy State:
                </span>
                <p className="text-white/90 leading-relaxed font-medium">
                  Canopy: {result.domain_findings?.thermal_ir_analysis?.canopy_temperature}°C (ΔT: +{result.domain_findings?.thermal_ir_analysis?.delta_t}°C). Region: {result.domain_findings?.thermal_ir_analysis?.affected_region}
                </p>
              </div>
            </div>

            {/* Root Cause Explanation */}
            <div className="text-xs space-y-1 pt-2 border-t border-white/10">
              <span className="font-black text-white uppercase text-[10px] tracking-wider block">
                {isTamil ? 'காரண விளக்கம்' : 'Fused Root Cause Explanation'}:
              </span>
              <p className="text-white/90 leading-relaxed font-medium">
                {isTamil ? result.root_cause_explanation?.cause_ta : result.root_cause_explanation?.cause_en}
              </p>
            </div>

            {/* Prioritized Treatment Plan */}
            <div className="p-4 rounded-2xl glass-green border border-[#5BA33C]/35 text-xs space-y-1.5">
              <span className="font-bold text-white uppercase text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#5BA33C]" />
                <span>{t('multimodal_remedy')}</span>
              </span>
              <p className="text-white/95 leading-relaxed whitespace-pre-line font-medium">
                {isTamil ? result.actionable_recommendation?.action_ta : result.actionable_recommendation?.action_en}
              </p>
            </div>

          </div>

          {/* Right Column: Model Architecture Details & Confidence */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl glass-dark border border-white/14 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5BA33C]" />
                <span>Multimodal Fusion Confidence</span>
              </h3>

              <div className="flex items-center justify-between my-2">
                <div className="text-3xl font-black text-[#5BA33C] font-mono">
                  {result.model_confidence_pct}%
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0B6623]/35 text-[#5BA33C] border border-[#5BA33C]/40">
                  High Precision
                </span>
              </div>

              <div className="space-y-3 text-xs pt-3 border-t border-white/10">
                <div className="flex justify-between items-center text-white font-medium">
                  <span className="text-[#D8C7AE]">RGB Weight</span>
                  <span className="font-mono font-bold text-[#5BA33C]">35%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#5BA33C] rounded-full" style={{ width: '35%' }} />
                </div>

                <div className="flex justify-between items-center pt-1 text-white font-medium">
                  <span className="text-[#D8C7AE]">Thermal IR Weight</span>
                  <span className="font-mono font-bold text-[#C46F52]">40%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#C46F52] rounded-full" style={{ width: '40%' }} />
                </div>

                <div className="flex justify-between items-center pt-1 text-white font-medium">
                  <span className="text-[#D8C7AE]">Meteorology & Soil</span>
                  <span className="font-mono font-bold text-amber-300">25%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              <div className="pt-2 text-[10.5px] text-[#D8C7AE] leading-relaxed">
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
