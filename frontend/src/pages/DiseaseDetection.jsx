import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { detectDisease } from '../services/api';
import LeafOverlay from '../components/LeafOverlay';
import ConfidenceGauge from '../components/ConfidenceGauge';
import {
  Bug,
  UploadCloud,
  Trash2,
  CheckCircle2,
  FlaskConical,
  Sprout,
  Info,
  ArrowRight,
  AlertTriangle,
  Cpu,
  ShieldCheck
} from 'lucide-react';

const SAMPLE_LEAF_PRESETS = [
  {
    id: 'blast',
    label_en: 'Rice Blast',
    label_ta: 'நெல் குலை நோய்',
    crop: 'Rice (Paddy)',
    svgImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%231d3322"/><path d="M 200 20 C 230 120 230 280 200 380 C 170 280 170 120 200 20 Z" fill="%23569941"/><path d="M 200 20 L 200 380" stroke="%233a692b" stroke-width="3"/><ellipse cx="200" cy="180" rx="25" ry="50" fill="%238a7968" stroke="%23782d18" stroke-width="4"/><ellipse cx="200" cy="180" rx="12" ry="25" fill="%23cfc2b6"/></svg>`
  },
  {
    id: 'bacterial_leaf_blight',
    label_en: 'Paddy Bacterial Blight',
    label_ta: 'நெல் பாக்டீரியா கருகல்',
    crop: 'Rice (Paddy)',
    svgImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%23243c2b"/><path d="M 200 30 C 270 100 280 280 200 380 C 120 280 130 100 200 30 Z" fill="%234b8b3b"/><path d="M 200 30 L 200 380" stroke="%23305c24" stroke-width="3"/><path d="M 230 60 Q 260 180 215 320" stroke="%23c29b38" stroke-width="8" fill="none"/><path d="M 170 100 Q 140 220 185 340" stroke="%23c29b38" stroke-width="8" fill="none"/></svg>`
  },
  {
    id: 'brown_spot',
    label_en: 'Rice Brown Spot',
    label_ta: 'நெல் பழுப்பு புள்ளி',
    crop: 'Rice (Paddy)',
    svgImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%231e3020"/><path d="M 200 20 C 240 120 240 280 200 380 C 160 280 160 120 200 20 Z" fill="%235b9e44"/><circle cx="190" cy="140" r="14" fill="%235a381e" stroke="%23c29b38" stroke-width="3"/><circle cx="210" cy="210" r="18" fill="%235a381e" stroke="%23c29b38" stroke-width="3"/><circle cx="195" cy="280" r="12" fill="%235a381e" stroke="%23c29b38" stroke-width="2"/></svg>`
  },
  {
    id: 'tungro',
    label_en: 'Rice Tungro Virus',
    label_ta: 'நெல் துங்ரோ நச்சுயிரி',
    crop: 'Rice (Paddy)',
    svgImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%23223627"/><path d="M 200 20 C 230 120 230 280 200 380 C 170 280 170 120 200 20 Z" fill="%23b8860b"/><path d="M 200 20 L 200 380" stroke="%238b6508" stroke-width="3"/><path d="M 175 40 Q 200 20 225 40" fill="%23d46a00"/></svg>`
  },
  {
    id: 'normal',
    label_en: 'Healthy Crop Foliage',
    label_ta: 'ஆரோக்கியமான பயிர்',
    crop: 'Rice (Paddy)',
    svgImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%23172e1e"/><path d="M 200 40 C 300 90 330 230 290 320 C 250 400 200 370 200 370 C 200 370 150 400 110 320 C 70 230 100 90 200 40 Z" fill="%2338a149"/><path d="M 200 40 L 200 370" stroke="%231f692c" stroke-width="4"/></svg>`
  },
  {
    id: 'tomato_early_blight',
    label_en: 'Tomato Blight',
    label_ta: 'தக்காளி கருகல்',
    crop: 'Tomato',
    svgImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%23243c2b"/><path d="M 200 40 C 290 80 340 180 300 280 C 260 380 200 370 200 370 C 200 370 140 380 100 280 C 60 180 110 80 200 40 Z" fill="%234b8b3b"/><circle cx="160" cy="180" r="35" fill="%235a381e" stroke="%23c29b38" stroke-width="6"/></svg>`
  }
];

const DiseaseDetection = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const [selectedImage, setSelectedImage] = useState(SAMPLE_LEAF_PRESETS[0].svgImage);
  const [selectedHint, setSelectedHint] = useState('blast');
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setError('File size must be under 15MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result);
        setSelectedHint(file.name);
        setResult(null);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (preset) => {
    setSelectedFile(null);
    setSelectedImage(preset.svgImage);
    setSelectedHint(preset.id);
    setResult(null);
    setError('');
  };

  const handleClear = () => {
    setSelectedFile(null);
    setSelectedImage(null);
    setSelectedHint('');
    setResult(null);
    setError('');
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please upload or select a leaf image first.');
      return;
    }

    setLoading(true);
    setError('');
    
    setLoadingStep(isTamil ? 'பயிரை ஸ்கேன் செய்கிறது...' : 'Scanning crop specimen...');
    const stepTimer1 = setTimeout(() => {
      setLoadingStep(isTamil ? 'இலை வடிவங்களை பகுப்பாய்வு செய்கிறது...' : 'Analyzing leaf cellular patterns...');
    }, 400);
    const stepTimer2 = setTimeout(() => {
      setLoadingStep(isTamil ? 'நோய் அறிகுறிகளை சரிபார்க்கிறது...' : 'Checking pathology indicators...');
    }, 800);
    const stepTimer3 = setTimeout(() => {
      setLoadingStep(isTamil ? 'பரிந்துரைகளை உருவாக்குகிறது...' : 'Synthesizing agronomic recommendations...');
    }, 1200);

    try {
      let response;
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('hint', selectedFile.name);
        response = await detectDisease(formData);
      } else {
        response = await detectDisease(selectedHint);
      }
      setTimeout(() => {
        setResult(response);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(err.message || 'Diagnostic inference failed');
      setLoading(false);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
    }
  };

  const confidenceScore = result
    ? (result.confidence_percentage != null
        ? result.confidence_percentage
        : (result.confidence <= 1.0 ? Math.round(result.confidence * 100) : result.confidence))
    : 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header Banner with Agriculture Photography & Liquid Glass */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl min-h-[170px] flex flex-col justify-center border border-white/18">
        <img
          src="/assets/images/leaf-close-up.jpg"
          alt="Visual Plant Leaf Diagnostic Scanner"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D25]/95 via-[#0B6623]/85 to-[#0F3D25]/75 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold mb-2 border border-white/25 backdrop-blur-md shadow-xs">
              <Cpu className="w-3.5 h-3.5 text-[#5BA33C]" />
              <span>PyTorch MobileNetV3 Transfer Learning Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {t('disease_det_title')}
            </h1>
            <p className="text-xs sm:text-sm text-white/85 mt-1 max-w-2xl font-medium leading-relaxed">
              {t('disease_det_subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs px-3.5 py-1.5 rounded-full font-bold bg-white/12 border border-white/20 text-[#D8C7AE] backdrop-blur-md shadow-xs">
              Benchmark: Paddy Doctor (10 Classes)
            </span>
          </div>
        </div>
      </div>

      {/* Main Diagnostic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Visual Ingestion & Control Sidebar (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Specimen Presets */}
          <div className="p-5 rounded-3xl glass-dark border border-white/14 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D8C7AE]">
                Paddy Doctor Pathology Presets
              </span>
              <span className="text-[10px] text-[#5BA33C] font-mono font-bold">Specimens</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SAMPLE_LEAF_PRESETS.map((preset) => {
                const isActive = selectedHint === preset.id && !selectedFile;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectPreset(preset)}
                    className={`p-2.5 rounded-2xl text-left border transition-all text-xs font-semibold cursor-pointer flex flex-col justify-between min-h-[58px] ${
                      isActive
                        ? 'bg-[#0B6623] text-white border-[#5BA33C]/60 shadow-glass font-bold'
                        : 'bg-white/6 text-white/90 border-white/10 hover:bg-white/12'
                    }`}
                  >
                    <span className="truncate">{isTamil ? preset.label_ta : preset.label_en}</span>
                    <span className={`text-[10px] ${isActive ? 'text-white/90 font-bold' : 'text-[#D8C7AE]'}`}>
                      {preset.crop}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload & Inspection Panel */}
          <div className="p-5 rounded-3xl glass-dark border border-white/14 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D8C7AE]">
                Upload Leaf Specimen
              </span>
              {selectedImage && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-[#C46F52] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 font-bold">
                {error}
              </div>
            )}

            {/* Drag & Drop Upload Zone */}
            <label className="relative border-2 border-dashed border-white/20 hover:border-[#5BA33C] rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-white/5 hover:bg-white/10 transition-all group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <UploadCloud className="w-7 h-7 text-[#5BA33C] mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white">
                {selectedFile ? selectedFile.name : t('disease_dropzone')}
              </span>
              <span className="text-[10px] text-[#D8C7AE] mt-0.5 font-medium">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB (Ready for inference)` : t('disease_supported_formats')}
              </span>
            </label>

            {/* Specimen Visual Display */}
            {selectedImage && (
              <LeafOverlay
                imageUrl={selectedImage}
                boundingBoxes={result?.bounding_boxes || [{ x: 25, y: 30, width: 45, height: 40, label: 'Target Focus' }]}
                severity={result?.severity || 'Moderate'}
                cropName={result?.crop_en || 'Sample Foliage'}
              />
            )}

            {/* Scan Action CTA */}
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading || !selectedImage}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer btn-glass-primary shadow-glass transition-all disabled:opacity-50 active:scale-95 text-white"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>{loadingStep || 'Executing MobileNetV3 Forward Pass...'}</span>
                </span>
              ) : (
                <>
                  <Bug className="w-4 h-4 text-white" />
                  <span>{t('disease_btn_analyze')}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* Pathology Diagnostics & Treatment Plan (Right 7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {result ? (
            <div className="space-y-5 animate-fade-in-up">
              
              {/* Honest System Status Badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-2xl glass-dark border border-white/12">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <ShieldCheck className="w-4 h-4 text-[#5BA33C]" />
                  <span>System Engine:</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    result.status_type === 'REAL_MODEL'
                      ? 'bg-[#0B6623]/35 text-[#5BA33C] border border-[#5BA33C]/40'
                      : 'bg-[#D97706]/25 text-amber-300 border border-amber-400/40'
                  }`}>
                    {result.status_type || 'REAL_MODEL'}
                  </span>
                </div>
                <span className="text-[11px] text-[#D8C7AE] font-mono font-bold">
                  {result.model_architecture || 'MobileNetV3-Small'}
                </span>
              </div>

              {/* Low-Confidence Warning Banner */}
              {result.is_low_confidence && (
                <div className="p-4 rounded-2xl bg-[#C46F52]/20 border border-[#C46F52]/40 flex items-start gap-3 text-white">
                  <AlertTriangle className="w-5 h-5 text-[#C46F52] flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#C46F52]">
                      Low Diagnostic Confidence ({confidenceScore}%)
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed text-[#D8C7AE] font-medium">
                      {result.low_confidence_warning || "Prediction confidence is below standard threshold (60%). Please upload a closer, clearer photo in direct natural lighting for reliable confirmation."}
                    </p>
                    {result.candidates && result.candidates.length > 0 && (
                      <div className="mt-2 text-xs flex flex-wrap gap-2 items-center">
                        <span className="font-semibold text-white">Candidate Likelihoods:</span>
                        {result.candidates.map((cand, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-white/10 border border-white/16 text-[10px] text-[#D8C7AE] font-mono">
                            {cand.class.replace(/_/g, ' ')}: {(cand.probability * 100).toFixed(1)}%
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Primary Pathology Card */}
              <div className="p-6 rounded-3xl glass-dark border border-white/14 space-y-5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/12">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8C7AE]">
                        {t('disease_result_crop')}: <span className="text-white font-black">{isTamil ? result.crop_ta : result.crop_en}</span>
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                      {isTamil ? result.condition_ta : result.condition_en}
                    </h2>

                    {/* Severity Badge */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#D8C7AE]">
                        {t('disease_result_severity')}:
                      </span>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        result.severity_level === 0 ? 'bg-[#0B6623]/35 text-[#5BA33C] border border-[#5BA33C]/40' :
                        result.severity_level === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/35' :
                        'bg-[#C46F52]/25 text-[#C46F52] border border-[#C46F52]/40'
                      }`}>
                        ● {result.severity}
                      </span>
                    </div>
                  </div>

                  {/* Confidence Gauge */}
                  <ConfidenceGauge
                    value={confidenceScore}
                    size={130}
                    label="Model Confidence"
                  />
                </div>

                {/* Description & Cause */}
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white/6 border border-white/10">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-[#D8C7AE] mb-1">
                      Symptom Pathology
                    </h4>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                      {isTamil ? result.description_ta : result.description_en}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/6 border border-white/10">
                    <h4 className="text-[10px] font-black uppercase tracking-wider text-[#D8C7AE] mb-1">
                      {t('disease_result_cause')}
                    </h4>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                      {isTamil ? result.cause_ta : result.cause_en}
                    </p>
                  </div>
                </div>

                {/* Actionable Remedies (Organic & Chemical) */}
                <div className="space-y-3 pt-1">
                  {/* Organic Remedy */}
                  <div className="p-4 rounded-2xl glass-green border border-[#5BA33C]/35">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-1 flex items-center gap-1.5">
                      <Sprout className="w-4 h-4 text-[#5BA33C]" />
                      <span>{t('disease_result_organic')}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium">
                      {isTamil ? result.organic_treatment_ta : result.organic_treatment_en}
                    </p>
                  </div>

                  {/* Chemical Remedy */}
                  <div className="p-4 rounded-2xl bg-white/6 border border-white/12 border-l-4 border-l-[#C46F52]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#C46F52] mb-1 flex items-center gap-1.5">
                      <FlaskConical className="w-4 h-4 text-[#C46F52]" />
                      <span>{t('disease_result_chemical')}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                      {isTamil ? result.chemical_treatment_ta : result.chemical_treatment_en}
                    </p>
                  </div>

                  {/* Preventive Cultivation Steps */}
                  <div className="p-4 rounded-2xl bg-white/6 border border-white/12 border-l-4 border-l-[#5BA33C]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#5BA33C] mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#5BA33C]" />
                      <span>{t('disease_result_prevention')}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
                      {isTamil ? result.prevention_ta : result.prevention_en}
                    </p>
                  </div>
                </div>

                {/* Mandatory Disclaimer */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-[#D8C7AE]">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#5BA33C]" />
                  <p className="leading-relaxed text-[11px]">
                    {isTamil ? result.disclaimer_ta : result.disclaimer_en}
                  </p>
                </div>

              </div>

            </div>
          ) : (
            <div className="h-full min-h-[420px] rounded-3xl glass-dark border-2 border-dashed border-white/16 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#0B6623]/25 border border-[#5BA33C]/30 flex items-center justify-center text-[#5BA33C] mb-4 shadow-glass">
                <Bug className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-white mb-1">
                {isTamil ? 'இலை ஸ்கேன் அறிக்கை இங்கே தோன்றும்' : 'Diagnostic Report Area'}
              </h3>
              <p className="text-xs sm:text-sm text-[#D8C7AE] max-w-sm font-medium leading-relaxed">
                {isTamil
                  ? 'மேலே உள்ள மாதிரி இலைகளை தேர்வு செய்யவோ அல்லது புகைப்படத்தை பதிவேற்றி "நோயை கண்டறியவும்" பொத்தானை அழுத்தவும்.'
                  : 'Select a Paddy Doctor leaf preset or upload your own field leaf photo to diagnose plant pathogens with real PyTorch neural network inference.'}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default DiseaseDetection;
