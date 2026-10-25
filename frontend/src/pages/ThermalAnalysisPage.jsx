import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { analyzeThermal } from '../services/api';
import {
  Flame,
  Thermometer,
  Layers,
  CheckCircle2,
  Info,
  RefreshCw,
  Camera,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  Eye
} from 'lucide-react';

const ThermalAnalysisPage = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const [selectedPreset, setSelectedPreset] = useState('moisture_stress');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState('');
  const [hoveredCell, setHoveredCell] = useState(null);
  const [uploadedThermalImage, setUploadedThermalImage] = useState(null);
  const [uploadedRgbImage, setUploadedRgbImage] = useState(null);
  const [activeThermalFile, setActiveThermalFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const presets = [
    { id: 'moisture_stress', label: isTamil ? 'நீர் பற்றாக்குறை (வெப்ப பகுதி)' : 'Moisture Deficit (Hotspot)', icon: '🔥' },
    { id: 'healthy_canopy', label: isTamil ? 'ஆரோக்கியமான பயிர் கனோபி' : 'Healthy Canopy (Cooling)', icon: '🌿' },
    { id: 'vascular_pathology', label: isTamil ? 'வாடல் நோய் / தண்டு பாதிப்பு' : 'Vascular Wilt / Blight', icon: '🍂' },
    { id: 'salinity_stress', label: isTamil ? 'உவர் மண் / வேர் அழுத்தம்' : 'Salinity / Root Stress', icon: '🧂' }
  ];

  const runAnalysis = async (presetKey = selectedPreset, file = activeThermalFile) => {
    setLoading(true);
    setLoadingStep(isTamil ? 'பயிர் அகச்சிவப்பு படங்களை பகுப்பாய்வு செய்கிறது...' : 'Analyzing crop infrared canopy...');

    try {
      let data;
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('hint', file.name);
        formData.append('ambient_temp', 28.5);
        formData.append('soil_moisture', 50.0);
        data = await analyzeThermal(formData);
      } else {
        data = await analyzeThermal(presetKey);
      }
      setAnalysisData(data);
    } catch (err) {
      console.error('Thermal analysis failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis('moisture_stress', null);
  }, []);

  const handleThermalFileUpload = (file) => {
    if (!file) return;
    setActiveThermalFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedThermalImage(e.target.result);
      runAnalysis(selectedPreset, file);
    };
    reader.readAsDataURL(file);
  };

  const handleRgbFileUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedRgbImage(e.target.result);
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
      handleThermalFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Scientific False-Color Heatmap Palette (Preserved accurate for scientific thermography)
  const getCellColor = (temp) => {
    const tVal = parseFloat(temp);
    if (tVal < 26.0) return 'bg-[#165B33] text-white';
    if (tVal < 28.0) return 'bg-[#2E7D44] text-white';
    if (tVal < 30.0) return 'bg-[#5BA33C] text-white font-bold';
    if (tVal < 33.0) return 'bg-[#D97706] text-white font-bold';
    return 'bg-[#EA580C] text-white font-black animate-pulse shadow-[0_0_10px_rgba(234,88,12,0.8)]';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header Banner with Liquid Glass & Dark Forest Image */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl min-h-[170px] flex flex-col justify-center border border-white/18">
        <img
          src="/assets/images/crop-fields.jpg"
          alt="Thermal Infrared Aerial Scan"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D25]/95 via-[#0B6623]/82 to-[#0F3D25]/75 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold mb-2 border border-white/25 backdrop-blur-md shadow-xs">
              <Flame className="w-3.5 h-3.5 text-[#C46F52]" />
              <span>Thermal Crop Diagnostic Foundation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {t('thermal_title')}
            </h1>
            <p className="text-xs sm:text-sm text-white/85 mt-1 max-w-2xl font-medium leading-relaxed">
              {t('thermal_subtitle')}
            </p>
          </div>

          <button
            onClick={() => runAnalysis(selectedPreset, activeThermalFile)}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/12 hover:bg-white/20 text-white border border-white/20 text-xs font-bold shadow-glass transition-all cursor-pointer self-start sm:self-auto backdrop-blur-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#5BA33C] ${loading ? 'animate-spin' : ''}`} />
            <span>{isTamil ? 'மீண்டும் புதுப்பி' : 'Re-Scan Canopy'}</span>
          </button>
        </div>
      </div>

      {/* Preset & Dual-Image Upload Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Presets List */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-dark border border-white/14 space-y-3">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#D8C7AE] flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#5BA33C]" />
              <span>{isTamil ? 'மாதிரி வெப்ப படங்களை தேர்வு செய்க' : 'Thermal Scan Archetypes'}</span>
            </div>
            <span className="text-[10px] text-[#5BA33C] font-mono font-bold">Demos</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset.id);
                  setActiveThermalFile(null);
                  setUploadedThermalImage(null);
                  runAnalysis(preset.id, null);
                }}
                type="button"
                className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                  selectedPreset === preset.id && !activeThermalFile
                    ? 'bg-[#0B6623] border-[#5BA33C]/60 text-white shadow-glass font-bold'
                    : 'bg-white/6 text-white/90 border-white/10 hover:bg-white/12'
                }`}
              >
                <span className="text-2xl">{preset.icon}</span>
                <div>
                  <div className="text-xs font-bold">{preset.label}</div>
                  <div className={`text-[10px] mt-0.5 ${selectedPreset === preset.id && !activeThermalFile ? 'text-[#D8C7AE]' : 'text-[#D8C7AE]/70'}`}>
                    {preset.id === selectedPreset && !activeThermalFile ? (isTamil ? 'செயலில் உள்ளது' : 'Active Preset') : (isTamil ? 'பார்வையிட கிளிக்' : 'Click to Load')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dual Upload (Thermal + RGB Side-by-Side Ingestion) */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Thermal Image Upload Dropzone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`p-5 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer glass-dark ${
              dragActive || activeThermalFile
                ? 'border-[#5BA33C] bg-white/10'
                : 'border-white/20 hover:border-[#5BA33C]'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleThermalFileUpload(e.target.files[0])}
              className="hidden"
              id="thermal-image-input"
            />
            <label htmlFor="thermal-image-input" className="cursor-pointer space-y-2 w-full">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#C46F52]/20 border border-[#C46F52]/35 text-[#C46F52] flex items-center justify-center shadow-inner">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {uploadedThermalImage ? 'Thermal Scan Uploaded' : 'Upload Thermal Image'}
                </span>
                <span className="text-[10px] text-[#D8C7AE] block mt-0.5 font-medium">
                  {activeThermalFile ? activeThermalFile.name : 'FLIR / Drone IR Image file'}
                </span>
              </div>
            </label>
          </div>

          {/* Optional RGB Visual Companion */}
          <div className="p-5 rounded-3xl border-2 border-dashed border-white/20 hover:border-[#5BA33C] glass-dark flex flex-col items-center justify-center text-center cursor-pointer transition-all">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleRgbFileUpload(e.target.files[0])}
              className="hidden"
              id="rgb-image-input"
            />
            <label htmlFor="rgb-image-input" className="cursor-pointer space-y-2 w-full">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#0B6623]/25 border border-[#5BA33C]/30 text-[#5BA33C] flex items-center justify-center shadow-inner">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {uploadedRgbImage ? 'RGB Companion Attached' : 'Attach RGB Visual Photo'}
                </span>
                <span className="text-[10px] text-[#D8C7AE] block mt-0.5 font-medium">
                  Side-by-side visual comparison
                </span>
              </div>
            </label>
          </div>

        </div>

      </div>

      {/* Side-by-Side Dual Image Visual Preview */}
      {(uploadedThermalImage || uploadedRgbImage) && (
        <div className="p-6 rounded-3xl glass-dark border border-white/14 space-y-3">
          <div className="text-[10px] font-black uppercase tracking-wider text-[#D8C7AE] flex items-center justify-between">
            <span>RGB / Thermal Side-by-Side Multi-Band Ingestion</span>
            <span className="text-[11px] font-bold text-[#5BA33C]">Field Pair View</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border border-white/14 bg-black/50 aspect-video flex items-center justify-center relative shadow-glass">
              {uploadedThermalImage ? (
                <img src={uploadedThermalImage} alt="Thermal Ingestion" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-white/70">No thermal file selected</span>
              )}
              <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-[#C46F52]/90 backdrop-blur-md text-[10px] text-white font-mono shadow-sm">
                THERMAL IR CHANNEL
              </span>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/14 bg-black/50 aspect-video flex items-center justify-center relative shadow-glass">
              {uploadedRgbImage ? (
                <img src={uploadedRgbImage} alt="RGB Visual Foliage" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-white/70">Optional RGB comparison photo not attached</span>
              )}
              <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-[#0B6623]/90 backdrop-blur-md text-[10px] text-white font-mono shadow-sm">
                RGB VISIBLE CHANNEL
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Analysis Display */}
      {loading ? (
        <div className="p-12 rounded-3xl glass-dark border border-white/14 flex flex-col items-center justify-center text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-[#0B6623]/25 border border-[#5BA33C]/30 text-[#5BA33C] flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#5BA33C]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{loadingStep}</h3>
            <p className="text-xs text-[#D8C7AE] mt-1">
              Extracting spatial luminance gradients and relative canopy differentials...
            </p>
          </div>
        </div>
      ) : analysisData && (
        <div className="space-y-6">
          
          {/* Status & Uncalibrated Thermography Notice Banner */}
          <div className="p-4 rounded-2xl glass-dark border border-white/14 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5BA33C]" />
              <span className="font-bold text-white">Analysis Mode:</span>
              <span className="px-2.5 py-0.5 rounded-full font-mono font-bold bg-[#0B6623]/35 border border-[#5BA33C]/40 text-[#5BA33C]">
                {analysisData.status_type || 'RULE_BASED'}
              </span>
              <span className="text-[#D8C7AE] font-medium">({analysisData.analysis_type || 'Image-based relative thermal analysis'})</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Uncalibrated optical heatmap. Relative stress profiles scaled from ambient air temperature.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up">
            
            {/* Left Column: Interactive 8x8 Thermal Colormap Grid */}
            <div className="lg:col-span-6 p-6 rounded-3xl glass-dark border border-white/14 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-[#C46F52]" />
                    <span>{isTamil ? 'கனோபி வெப்ப வரைபடம்' : 'Interactive Thermal Heatmap'}</span>
                  </h2>
                  <span className="text-[11px] text-[#D8C7AE]">8×8 Spatial Canopy Sectors (Hover to inspect cells)</span>
                </div>
                
                {hoveredCell !== null && (
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#0B6623] text-white shadow-glass">
                    {hoveredCell}°C
                  </span>
                )}
              </div>

              {/* Heatmap Visual Matrix */}
              <div className="p-4 rounded-3xl bg-black/60 border border-white/12 shadow-inner">
                <div className="grid grid-cols-8 gap-1.5 aspect-square max-w-sm mx-auto">
                  {analysisData.thermal_grid?.map((row, rIdx) =>
                    row.map((cellTemp, cIdx) => (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        onMouseEnter={() => setHoveredCell(cellTemp)}
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`rounded-md flex items-center justify-center text-[10px] cursor-pointer transition-all hover:scale-115 shadow-xs ${getCellColor(
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
              <div className="flex items-center justify-between pt-2 text-[10px] font-mono text-[#D8C7AE] font-semibold">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-[#165B33] inline-block shadow-xs" /> 24°C (Cool)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-[#5BA33C] inline-block shadow-xs" /> 28°C (Optimal)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-[#D97706] inline-block shadow-xs" /> 32°C (Warning)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-[#EA580C] inline-block shadow-xs" /> 36°C+ (Severe)
                </span>
              </div>

              {/* Micro-climate Temperature Telemetry Bar */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10 text-center">
                  <div className="text-[10px] font-bold text-[#D8C7AE] uppercase">Mean Canopy</div>
                  <div className="text-xl font-black text-white font-mono">
                    {analysisData.canopy_temperature?.mean_celsius}°C
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10 text-center">
                  <div className="text-[10px] font-bold text-[#D8C7AE] uppercase">Ambient Air</div>
                  <div className="text-xl font-black text-white font-mono">
                    {analysisData.canopy_temperature?.ambient_air_celsius}°C
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10 text-center">
                  <div className="text-[10px] font-bold text-[#D8C7AE] uppercase">Canopy Delta ΔT</div>
                  <div className={`text-xl font-black font-mono ${
                    analysisData.canopy_temperature?.delta_t_celsius > 2 ? 'text-[#C46F52]' : 'text-[#5BA33C]'
                  }`}>
                    +{analysisData.canopy_temperature?.delta_t_celsius}°C
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Agronomic Diagnostics & Action Recommendations */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Stress Status Card */}
              <div className="p-6 rounded-3xl glass-dark border border-white/14 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#D8C7AE]">
                      {t('thermal_stress_level')}
                    </div>
                    <div className="text-2xl font-black text-white mt-0.5">
                      {isTamil ? analysisData.stress_assessment?.level_ta : analysisData.stress_assessment?.level_en}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#D8C7AE]">
                      {t('thermal_stress_score')}
                    </div>
                    <div className="text-2xl font-black font-mono text-[#C46F52] mt-0.5">
                      {analysisData.stress_assessment?.stress_score} / 100
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#D8C7AE]">{t('thermal_affected_zone')}:</span>
                  <span className="font-bold text-white">{analysisData.affected_region}</span>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="p-4 rounded-2xl bg-white/6 border border-white/10">
                    <div className="text-[10px] font-black text-[#D8C7AE] uppercase tracking-wider mb-1">
                      {t('thermal_detection_title')}
                    </div>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                      {analysisData.detected_indication}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/6 border border-white/10">
                    <div className="text-[10px] font-black text-[#D8C7AE] uppercase tracking-wider mb-1">
                      {t('thermal_cause_title')}
                    </div>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                      {analysisData.possible_cause}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl glass-green border border-[#5BA33C]/35">
                    <div className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#5BA33C]" />
                      <span>{t('thermal_action_title')}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium whitespace-pre-line">
                      {analysisData.recommended_action}
                    </p>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2 text-[10.5px] text-[#D8C7AE]">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#5BA33C]" />
                  <p>{analysisData.data_integrity_notice}</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ThermalAnalysisPage;
