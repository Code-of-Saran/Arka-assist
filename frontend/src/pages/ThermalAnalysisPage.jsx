import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { analyzeThermal } from '../services/api';
import {
  Flame,
  Thermometer,
  Layers,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Info,
  RefreshCw,
  Droplet,
  Upload,
  Camera,
  Loader2,
  ArrowRight
} from 'lucide-react';

const ThermalAnalysisPage = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const [selectedPreset, setSelectedPreset] = useState('moisture_stress');
  const [ambientTemp, setAmbientTemp] = useState(28.5);
  const [soilMoisture, setSoilMoisture] = useState(48.0);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState('');
  const [hoveredCell, setHoveredCell] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const presets = [
    { id: 'moisture_stress', label: isTamil ? 'நீர் பற்றாக்குறை (வெப்ப பகுதி)' : 'Moisture Deficit (Hotspot)', icon: '🔥' },
    { id: 'healthy_canopy', label: isTamil ? 'ஆரோக்கியமான பயிர் கனோபி' : 'Healthy Canopy (Cooling)', icon: '🌿' },
    { id: 'vascular_pathology', label: isTamil ? 'வாடல் நோய் / தண்டு பாதிப்பு' : 'Vascular Wilt / Blight', icon: '🍂' },
    { id: 'salinity_stress', label: isTamil ? 'உவர் மண் / வேர் அழுத்தம்' : 'Salinity / Root Stress', icon: '🧂' }
  ];

  const runAnalysis = async (presetKey = selectedPreset) => {
    setLoading(true);
    setLoadingStep(isTamil ? 'பயிர் படங்களை பதிவேற்றுகிறது...' : 'Analyzing crop visual canopy...');
    
    setTimeout(() => {
      setLoadingStep(isTamil ? 'வெப்பநிலை அழுத்த நிலைகளை சரிபார்க்கிறது...' : 'Checking thermal information...');
    }, 500);

    setTimeout(() => {
      setLoadingStep(isTamil ? 'பண்ணை சூழ்நிலைகளுடன் ஒப்பிடுகிறது...' : 'Comparing farm conditions...');
    }, 1000);

    setTimeout(() => {
      setLoadingStep(isTamil ? 'பரிந்துரைகளை உருவாக்குகிறது...' : 'Generating recommendations...');
    }, 1500);

    try {
      const data = await analyzeThermal(presetKey);
      setTimeout(() => {
        setAnalysisData(data);
        setLoading(false);
      }, 1900);
    } catch (err) {
      console.error('Thermal analysis failed:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis('moisture_stress');
  }, []);

  const handleImageUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      runAnalysis(selectedPreset);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  // Helper to color-code thermal colormap cells (24°C to 38°C)
  const getCellColor = (temp) => {
    const tVal = parseFloat(temp);
    if (tVal < 26.0) return 'bg-blue-600 text-white';
    if (tVal < 28.0) return 'bg-teal-500 text-white';
    if (tVal < 30.0) return 'bg-emerald-500 text-white';
    if (tVal < 32.5) return 'bg-amber-400 text-stone-950 font-bold';
    if (tVal < 35.0) return 'bg-orange-500 text-white font-bold';
    return 'bg-rose-600 text-white font-bold animate-pulse';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl min-h-[180px] flex flex-col justify-center">
        <img
          src="/assets/images/thermal-field.jpg"
          alt="Thermal Drone Canopy Infrared Scanner"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/85 to-forest-950/40 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/30 text-orange-300 text-xs font-bold mb-2 border border-orange-500/40 backdrop-blur-md">
              <Flame className="w-3.5 h-3.5" />
              <span>{isTamil ? 'அகச்சிவப்பு வெப்ப தொழில்நுட்பம்' : 'Infrared Thermography'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
              {t('thermal_title')}
            </h1>
            <p className="text-xs sm:text-sm text-cream-100/90 mt-1 max-w-2xl leading-relaxed font-medium">
              {t('thermal_subtitle')}
            </p>
          </div>

          <button
            onClick={() => runAnalysis(selectedPreset)}
            type="button"
            className="btn-agro-primary self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md cursor-pointer hover:scale-105 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{isTamil ? 'மீண்டும் ஆய்வு செய்' : 'Re-Scan Canopy'}</span>
          </button>
        </div>
      </div>

      {/* Preset & Upload Dropzone Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Presets List */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-earth-600 dark:text-darkbg-muted flex items-center gap-1.5 pb-2 border-b border-cream-200 dark:border-darkbg-border">
            <Layers className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
            <span>{isTamil ? 'மாதிரி வெப்ப படங்களை தேர்வு செய்க' : 'Select Thermal Scan Archetype'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset.id);
                  runAnalysis(preset.id);
                }}
                type="button"
                className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  selectedPreset === preset.id
                    ? 'bg-forest-50 dark:bg-forest-950/60 border-forest-600 dark:border-leaf-500 shadow-sm'
                    : 'bg-cream-50/50 dark:bg-darkbg-surface border-cream-200 dark:border-darkbg-border hover:border-forest-400'
                }`}
              >
                <span className="text-2xl">{preset.icon}</span>
                <div>
                  <div className="text-xs font-bold text-forest-950 dark:text-cream-50">{preset.label}</div>
                  <div className="text-[10px] text-earth-500 dark:text-darkbg-muted mt-0.5">
                    {preset.id === selectedPreset ? (isTamil ? 'செயலில் உள்ளது' : 'Active Preset') : (isTamil ? 'பார்வையிட கிளிக்' : 'Click to Load')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Drag & Drop Image Upload Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`lg:col-span-5 p-6 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
            dragActive
              ? 'border-forest-500 bg-forest-50/60 dark:bg-forest-950/40'
              : 'border-cream-300 dark:border-darkbg-border bg-white dark:bg-darkbg-card'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files[0])}
            className="hidden"
            id="thermal-image-input"
          />
          <label htmlFor="thermal-image-input" className="cursor-pointer space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center shadow-inner">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-forest-950 dark:text-cream-50 block">
                {uploadedImage ? (isTamil ? 'புதிய வெப்ப படம் பதிவேற்ற' : 'Change Thermal Image') : (isTamil ? 'வெப்ப படம் பதிவேற்றுக' : 'Upload Thermal Image')}
              </span>
              <span className="text-[11px] text-earth-600 dark:text-darkbg-muted block mt-0.5">
                Drag and drop FLIR / IR thermal photo or click to browse
              </span>
            </div>
          </label>
        </div>

      </div>

      {/* Main Analysis Display */}
      {loading ? (
        /* Multi-Stage Animated Loader */
        <div className="p-12 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-forest-950 dark:text-cream-50">{loadingStep}</h3>
            <p className="text-xs text-earth-600 dark:text-darkbg-muted mt-1">
              Processing thermal infrared telemetry and transpiration indicators...
            </p>
          </div>
        </div>
      ) : analysisData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up">
          
          {/* Left Column: Interactive 8x8 Thermal Colormap Grid */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-darkbg-border">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-forest-950 dark:text-cream-50 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  <span>{isTamil ? 'கனோபி வெப்ப வரைபடம்' : 'Interactive Thermal Heatmap'}</span>
                </h2>
                <span className="text-[11px] text-earth-600 dark:text-darkbg-muted">Ironbow False-Color Palette (Hover to inspect pixels)</span>
              </div>
              
              {hoveredCell !== null && (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-orange-100 text-orange-950 border border-orange-300">
                  {hoveredCell}°C
                </span>
              )}
            </div>

            {/* Heatmap Visual Matrix */}
            <div className="p-4 rounded-3xl bg-stone-950/90 border border-stone-800 shadow-inner">
              <div className="grid grid-cols-8 gap-1.5 aspect-square max-w-sm mx-auto">
                {analysisData.thermal_grid?.map((row, rIdx) =>
                  row.map((cellTemp, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      onMouseEnter={() => setHoveredCell(cellTemp)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`rounded-md flex items-center justify-center text-[10px] cursor-pointer transition-transform hover:scale-110 shadow-sm ${getCellColor(
                        cellTemp
                      )}`}
                      title={`Row ${rIdx + 1}, Col ${cIdx + 1}: ${cellTemp}°C`}
                    >
                      {cellTemp}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Color scale legend */}
            <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-earth-600 dark:text-darkbg-muted">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> 24°C (Cool)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> 28°C (Optimal)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-400 inline-block" /> 32°C (Warning)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-rose-600 inline-block" /> 36°C+ (Severe)
              </span>
            </div>

            {/* Micro-climate Temperature Telemetry Bar */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border text-center">
                <div className="text-[10px] font-bold text-earth-600 dark:text-darkbg-muted uppercase">Mean Canopy</div>
                <div className="text-xl font-black text-forest-950 dark:text-cream-50 font-mono">
                  {analysisData.canopy_temperature?.mean_celsius}°C
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border text-center">
                <div className="text-[10px] font-bold text-earth-600 dark:text-darkbg-muted uppercase">Ambient Air</div>
                <div className="text-xl font-black text-forest-950 dark:text-cream-50 font-mono">
                  {analysisData.canopy_temperature?.ambient_air_celsius}°C
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border text-center">
                <div className="text-[10px] font-bold text-earth-600 dark:text-darkbg-muted uppercase">Canopy Delta ΔT</div>
                <div className={`text-xl font-black font-mono ${
                  analysisData.canopy_temperature?.delta_t_celsius > 2 ? 'text-rose-600' : 'text-emerald-600'
                }`}>
                  +{analysisData.canopy_temperature?.delta_t_celsius}°C
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Agronomic Diagnostics & Action Recommendations */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Stress Status Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted">
                    {t('thermal_stress_level')}
                  </div>
                  <div className="text-2xl font-black text-forest-950 dark:text-cream-50 mt-0.5">
                    {isTamil ? analysisData.stress_assessment?.level_ta : analysisData.stress_assessment?.level_en}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase text-earth-500 dark:text-darkbg-muted">
                    {t('thermal_confidence')}
                  </div>
                  <div className="text-xl font-black text-forest-700 dark:text-leaf-400 font-mono">
                    {analysisData.confidence_score}%
                  </div>
                </div>
              </div>

              {/* Affected Region */}
              <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-200 block mb-0.5">
                  📍 {t('thermal_affected_region')}:
                </span>
                <span className="text-amber-800 dark:text-amber-300 font-medium">
                  {analysisData.affected_region}
                </span>
              </div>

              {/* Detected Indication */}
              <div className="text-xs space-y-1">
                <span className="font-bold text-forest-950 dark:text-cream-100 uppercase text-[11px]">
                  {isTamil ? 'கண்டறியப்பட்ட அறிகுறி' : 'Detected Thermal Indication'}:
                </span>
                <p className="text-earth-700 dark:text-cream-200/90 leading-relaxed font-medium">
                  {analysisData.detected_indication}
                </p>
              </div>

              {/* Possible Cause */}
              <div className="text-xs space-y-1 pt-2 border-t border-cream-200 dark:border-darkbg-border">
                <span className="font-bold text-forest-950 dark:text-cream-100 uppercase text-[11px]">
                  {t('thermal_possible_reason')}:
                </span>
                <p className="text-earth-700 dark:text-cream-200/90 leading-relaxed">
                  {analysisData.possible_cause}
                </p>
              </div>

              {/* Recommended Action */}
              <div className="p-4 rounded-2xl bg-forest-50 dark:bg-forest-950/40 border border-forest-200 dark:border-forest-800 text-xs space-y-1.5">
                <span className="font-bold text-forest-900 dark:text-leaf-300 uppercase text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
                  <span>{t('thermal_recommended_action')}</span>
                </span>
                <p className="text-earth-800 dark:text-cream-100 leading-relaxed whitespace-pre-line font-medium">
                  {analysisData.recommended_action}
                </p>
              </div>

              {/* Prototype Disclaimer */}
              <div className="p-3.5 rounded-2xl bg-cream-100/80 dark:bg-darkbg-surface text-[11px] text-earth-600 dark:text-darkbg-muted flex items-start gap-2 border border-cream-200 dark:border-darkbg-border">
                <Info className="w-4 h-4 shrink-0 text-earth-500 mt-0.5" />
                <span>{analysisData.data_integrity_notice}</span>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default ThermalAnalysisPage;

