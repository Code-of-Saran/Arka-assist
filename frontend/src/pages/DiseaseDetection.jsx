import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { detectDisease } from '../services/api';
import LeafOverlay from '../components/LeafOverlay';
import ConfidenceGauge from '../components/ConfidenceGauge';
import {
  Bug,
  UploadCloud,
  FileImage,
  Trash2,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FlaskConical,
  Sprout,
  Info,
  ArrowRight
} from 'lucide-react';

const SAMPLE_LEAF_PRESETS = [
  {
    id: 'tomato_early_blight',
    label_en: 'Tomato Blight',
    label_ta: 'தக்காளி கருகல்',
    crop: 'Tomato',
    // SVG Data URI for realistic offline leaf representation
    svgImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%23243c2b"/><path d="M 200 40 C 290 80 340 180 300 280 C 260 380 200 370 200 370 C 200 370 140 380 100 280 C 60 180 110 80 200 40 Z" fill="%234b8b3b"/><path d="M 200 40 L 200 370" stroke="%23305c24" stroke-width="4"/><circle cx="160" cy="180" r="35" fill="%235a381e" stroke="%23c29b38" stroke-width="6"/><circle cx="160" cy="180" r="20" fill="%233a2211"/><circle cx="240" cy="240" r="22" fill="%235a381e" stroke="%23c29b38" stroke-width="4"/><circle cx="220" cy="130" r="14" fill="%235a381e" stroke="%23c29b38" stroke-width="3"/></svg>`
  },
  {
    id: 'potato_late_blight',
    label_en: 'Potato Late Blight',
    label_ta: 'உருளை கருகல்',
    crop: 'Potato',
    svgImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%23223627"/><path d="M 200 50 C 310 100 330 240 280 320 C 230 400 200 360 200 360 C 200 360 170 400 120 320 C 70 240 90 100 200 50 Z" fill="%23437c35"/><path d="M 200 50 L 200 360" stroke="%23274e1e" stroke-width="4"/><path d="M 140 120 Q 220 160 250 250 Q 180 280 130 200 Z" fill="%232c1c14" opacity="0.9"/><circle cx="180" cy="200" r="45" fill="%231a0e08" opacity="0.85"/></svg>`
  },
  {
    id: 'rice_blast',
    label_en: 'Rice Blast',
    label_ta: 'நெல் குலை நோய்',
    crop: 'Rice',
    svgImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%231d3322"/><path d="M 200 20 C 230 120 230 280 200 380 C 170 280 170 120 200 20 Z" fill="%23569941"/><path d="M 200 20 L 200 380" stroke="%233a692b" stroke-width="3"/><ellipse cx="200" cy="180" rx="25" ry="50" fill="%238a7968" stroke="%23782d18" stroke-width="4"/><ellipse cx="200" cy="180" rx="12" ry="25" fill="%23cfc2b6"/></svg>`
  },
  {
    id: 'corn_rust',
    label_en: 'Corn Rust',
    label_ta: 'மக்காச்சோள துரு',
    crop: 'Corn',
    svgImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%231e3020"/><path d="M 200 30 C 270 100 280 280 200 380 C 120 280 130 100 200 30 Z" fill="%235b9e44"/><path d="M 200 30 L 200 380" stroke="%233e6f2c" stroke-width="3"/><ellipse cx="170" cy="160" rx="8" ry="16" fill="%23b85d18"/><ellipse cx="230" cy="200" rx="10" ry="18" fill="%23b85d18"/><ellipse cx="180" cy="250" rx="9" ry="15" fill="%23b85d18"/><ellipse cx="220" cy="120" rx="7" ry="12" fill="%23b85d18"/></svg>`
  },
  {
    id: 'healthy_crop',
    label_en: 'Healthy Foliage',
    label_ta: 'ஆரோக்கியமான இலை',
    crop: 'Plant',
    svgImage: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="%23172e1e"/><path d="M 200 40 C 300 90 330 230 290 320 C 250 400 200 370 200 370 C 200 370 150 400 110 320 C 70 230 100 90 200 40 Z" fill="%2338a149"/><path d="M 200 40 L 200 370" stroke="%231f692c" stroke-width="4"/><path d="M 200 140 Q 250 110 270 120" stroke="%231f692c" stroke-width="2.5" fill="none"/><path d="M 200 200 Q 150 170 130 180" stroke="%231f692c" stroke-width="2.5" fill="none"/><path d="M 200 260 Q 250 230 260 240" stroke="%231f692c" stroke-width="2.5" fill="none"/></svg>`
  }
];

const DiseaseDetection = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const [selectedImage, setSelectedImage] = useState(SAMPLE_LEAF_PRESETS[0].svgImage);
  const [selectedHint, setSelectedHint] = useState('tomato_early_blight');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be under 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result);
        setSelectedHint(file.name);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPreset = (preset) => {
    setSelectedImage(preset.svgImage);
    setSelectedHint(preset.id);
    setResult(null);
    setError('');
  };

  const handleClear = () => {
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

    try {
      const response = await detectDisease(selectedHint);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Diagnostic inference failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl min-h-[160px] flex flex-col justify-center">
        <img
          src="/assets/images/crop-fields.jpg"
          alt="Visual Plant Leaf Diagnostic Scanner"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/85 to-forest-950/40 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/30 text-rose-300 text-xs font-bold mb-2 border border-rose-500/40 backdrop-blur-md">
              <Bug className="w-4 h-4" />
              <span>Computer Vision Diagnostic Lab</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {t('disease_det_title')}
            </h1>
            <p className="text-xs sm:text-sm text-cream-100/90 mt-1 max-w-2xl font-medium">
              {t('disease_det_subtitle')}
            </p>
          </div>

          {/* Sample Preset Leaf Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-earth-600 dark:text-darkbg-muted mr-1">
              Sample Leaves:
            </span>
            {SAMPLE_LEAF_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => selectPreset(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  selectedHint === preset.id
                    ? 'bg-forest-600 text-white border-forest-600 shadow-sm'
                    : 'bg-cream-100 dark:bg-darkbg-surface hover:bg-forest-100 text-earth-900 dark:text-cream-100 border-cream-300 dark:border-darkbg-border'
                }`}
              >
                {isTamil ? preset.label_ta : preset.label_en}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Upload & Preview (Left 5 Cols) vs Diagnostics (Right 7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upload & Visualizer Box (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-cream-200 dark:border-darkbg-border">
              <h2 className="text-sm font-bold uppercase tracking-wider text-earth-800 dark:text-cream-100">
                Leaf Photo Specimen
              </h2>
              {selectedImage && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('disease_btn_remove')}</span>
                </button>
              )}
            </div>

            {/* Drag & Drop Upload Zone */}
            <label className="relative border-2 border-dashed border-forest-400/80 dark:border-forest-600/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-forest-50/50 dark:hover:bg-darkbg-surface transition-colors group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <UploadCloud className="w-8 h-8 text-forest-600 dark:text-leaf-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-forest-950 dark:text-cream-50">
                {t('disease_dropzone')}
              </span>
              <span className="text-[11px] text-earth-600 dark:text-darkbg-muted mt-1">
                {t('disease_supported_formats')}
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
              className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-forest-700 hover:bg-forest-800 shadow-soft transition-all text-sm flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Scanning Plant Foliage...</span>
                </span>
              ) : (
                <>
                  <Bug className="w-4 h-4" />
                  <span>{t('disease_btn_analyze')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* Pathology Diagnostics & Treatment Plan (Right 7 Cols) - Dual Output */}
        <div className="lg:col-span-7 space-y-6">
          
          {result ? (
            <div className="space-y-6">
              
              {/* Primary Pathology Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cream-200 dark:border-darkbg-border">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-earth-600 dark:text-darkbg-muted">
                        {t('disease_result_crop')}: <span className="text-forest-700 dark:text-leaf-300">{isTamil ? result.crop_ta : result.crop_en}</span>
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-cream-50 mt-1">
                      {isTamil ? result.condition_ta : result.condition_en}
                    </h2>

                    {/* Severity Badge */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs font-semibold text-earth-700 dark:text-darkbg-muted">
                        {t('disease_result_severity')}:
                      </span>
                      <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        result.severity_level === 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        result.severity_level === 1 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300' :
                        result.severity_level === 2 ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300' :
                        'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        ● {result.severity}
                      </span>
                    </div>
                  </div>

                  {/* Confidence Gauge */}
                  <ConfidenceGauge
                    value={result.confidence}
                    size={130}
                    label="AI Certainty"
                  />
                </div>

                {/* Description & Cause */}
                <div className="my-5 space-y-3">
                  <div className="p-4 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-earth-800 dark:text-cream-100 mb-1">
                      Symptom Pathology
                    </h4>
                    <p className="text-xs sm:text-sm text-earth-700 dark:text-cream-200/90 leading-relaxed font-medium">
                      {isTamil ? result.description_ta : result.description_en}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-earth-800 dark:text-cream-100 mb-1">
                      {t('disease_result_cause')}
                    </h4>
                    <p className="text-xs sm:text-sm text-earth-700 dark:text-cream-200/90 leading-relaxed">
                      {isTamil ? result.cause_ta : result.cause_en}
                    </p>
                  </div>
                </div>

                {/* Actionable Remedies (Organic & Chemical) */}
                <div className="space-y-3 pt-2">
                  {/* Organic Remedy */}
                  <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                      <Sprout className="w-4 h-4 text-emerald-600" />
                      <span>{t('disease_result_organic')}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 leading-relaxed font-medium">
                      {isTamil ? result.organic_treatment_ta : result.organic_treatment_en}
                    </p>
                  </div>

                  {/* Chemical Remedy */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                      <FlaskConical className="w-4 h-4 text-amber-600" />
                      <span>{t('disease_result_chemical')}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-100 leading-relaxed font-medium">
                      {isTamil ? result.chemical_treatment_ta : result.chemical_treatment_en}
                    </p>
                  </div>

                  {/* Preventive Cultivation Steps */}
                  <div className="p-4 rounded-2xl bg-forest-50/80 dark:bg-darkbg-surface border border-forest-200/80 dark:border-darkbg-border">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-forest-900 dark:text-leaf-300 mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-forest-600" />
                      <span>{t('disease_result_prevention')}</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-earth-800 dark:text-cream-200 leading-relaxed">
                      {isTamil ? result.prevention_ta : result.prevention_en}
                    </p>
                  </div>
                </div>

                {/* Mandatory Disclaimer */}
                <div className="mt-5 p-3.5 rounded-xl bg-amber-50 dark:bg-darkbg-surface border border-amber-300/80 dark:border-darkbg-border flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <p className="leading-relaxed">
                    {isTamil ? result.disclaimer_ta : result.disclaimer_en}
                  </p>
                </div>

              </div>

            </div>
          ) : (
            <div className="h-full min-h-[420px] rounded-3xl bg-white/60 dark:bg-darkbg-card/60 border border-dashed border-cream-300 dark:border-darkbg-border flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-cream-100 dark:bg-darkbg-surface flex items-center justify-center text-earth-500 dark:text-darkbg-muted mb-4">
                <Bug className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-forest-950 dark:text-cream-50 mb-1">
                {isTamil ? 'இலை ஸ்கேன் அறிக்கை இங்கே தோன்றும்' : 'Diagnostic Report Area'}
              </h3>
              <p className="text-xs sm:text-sm text-earth-600 dark:text-darkbg-muted max-w-sm">
                {isTamil
                  ? 'மேலே உள்ள மாதிரி இலைகளை தேர்வு செய்து "நோயை கண்டறியவும்" பொத்தானை அழுத்தவும்.'
                  : 'Select a sample leaf preset on the top right or upload a leaf photo to diagnose plant pathogens and receive treatment protocols.'}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default DiseaseDetection;
