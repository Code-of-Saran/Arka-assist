import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  User,
  Sliders,
  CheckCircle2,
  Cpu,
  CloudSun,
  Award,
  BarChart3,
  Tractor,
  ArrowDown,
  ShieldCheck,
  GitBranch
} from 'lucide-react';

const PIPELINE_STEPS = [
  {
    id: 1,
    icon: User,
    step: '01',
    title_en: 'Farmer User',
    title_ta: 'விவசாயி / பயனர்',
    subtitle_en: 'Field operator or agronomist accessing portal via mobile or desktop.',
    subtitle_ta: 'மொபைல் அல்லது கணினி மூலம் விவசாயி தளத்தை அணுகுதல்.',
    tech: 'React 18 PWA / Offline Shell',
    details_en: 'Initiates query for crop selection, leaf symptom diagnosis, or weather advisory.',
    details_ta: 'பயிர் தேர்வு, நோய் கண்டறிதல் அல்லது வானிலை ஆலோசனைக்கான கோரிக்கை.'
  },
  {
    id: 2,
    icon: Sliders,
    step: '02',
    title_en: 'Data Input Layer',
    title_ta: 'தரவு உள்ளீட்டு அடுக்கு',
    subtitle_en: 'Captures soil NPK, pH, precipitation, or leaf specimen photo.',
    subtitle_ta: 'மண் சத்துக்கள், pH, மழை அளவு அல்லது இலையின் புகைப்படம் உள்ளீடு.',
    tech: 'Multi-Slider UI / File Drag-and-Drop',
    details_en: 'Structured parameters formatted into standardized agronomic vectors.',
    details_ta: 'சீரான அளவுருக்களாக மாற்றப்படும் விவசாய தரவுகள்.'
  },
  {
    id: 3,
    icon: CheckCircle2,
    step: '03',
    title_en: 'Validation Layer',
    title_ta: 'சரிபார்ப்பு அடுக்கு',
    subtitle_en: 'Boundary filtering, physical metric sanitization, image integrity.',
    subtitle_ta: 'அளவீடுகளின் எல்லைகள் மற்றும் படங்களின் தரம் சரிபார்ப்பு.',
    tech: 'Client & Server Schema Validators',
    details_en: 'Ensures NPK ∈ [0, 200], pH ∈ [3.5, 9.5], and image payload < 10MB.',
    details_ta: 'தவறான அளவீடுகள் தடுக்கப்பட்டு துல்லியமான கணக்கீட்டுக்கு தயாராதல்.'
  },
  {
    id: 4,
    icon: Cpu,
    step: '04',
    title_en: 'AI / ML Processing',
    title_ta: 'AI / ML பகுப்பாய்வு மையம்',
    subtitle_en: 'Random Forest 22-crop inference & computer vision pathology model.',
    subtitle_ta: '22 பயிர் ரேண்டம் பாரஸ்ட் மாதிரி மற்றும் கணினி பார்வை இலை பகுப்பாய்வு.',
    tech: 'Scikit-Learn / Deterministic Centroids',
    details_en: 'Evaluates feature vectors against ICAR agronomic profiles and pathology datasets.',
    details_ta: 'பயிர்களின் வளர்ச்சி தேவைகளுடன் ஒப்பிட்டு சாத்தியக்கூறுகளை கணித்தல்.'
  },
  {
    id: 5,
    icon: CloudSun,
    step: '05',
    title_en: 'Weather & Knowledge Sync',
    title_ta: 'வானிலை & அறிவுத்தள இணைப்பு',
    subtitle_en: 'Live meteorological sync with fallback to bundled local JSON datasets.',
    subtitle_ta: 'நேரலை வானிலை முன்னறிவிப்பு மற்றும் உள்ளூர் அரசு திட்டங்கள் தொகுப்பு.',
    tech: 'Hybrid API / Bundled Agriculture KB',
    details_en: 'Cross-references current precipitation and humidity with foliar spray safety rules.',
    details_ta: 'தற்போதைய ஈரப்பதம் மற்றும் மழை அடிப்படையில் விவசாய எச்சரிக்கைகள் உருவாக்கம்.'
  },
  {
    id: 6,
    icon: Award,
    step: '06',
    title_en: 'Recommendation Engine',
    title_ta: 'பரிந்துரை உருவாக்கம்',
    subtitle_en: 'Synthesizes crop match, biological remedies, and subsidy eligibility.',
    subtitle_ta: 'பயிர் பொருத்தம், இயற்கை கட்டுப்பாட்டு முறைகள் மற்றும் மானிய பரிந்துரை.',
    tech: 'Agronomic Scoring & Remedy Mapper',
    details_en: 'Generates specific fertilizer dosage split schedules and organic pest formulations.',
    details_ta: 'உர மேலாண்மை மற்றும் இயற்கை பூச்சி மருந்து தயாரிப்பு வழிகாட்டல்.'
  },
  {
    id: 7,
    icon: BarChart3,
    step: '07',
    title_en: 'Visual Explanation',
    title_ta: 'இரட்டை விளக்க வெளியீடு (Text + Diagram)',
    subtitle_en: 'Renders SVG confidence gauges, factor radar charts, and leaf bounding overlays.',
    subtitle_ta: 'வரைபட அளவீடுகள், சத்து ஒப்பீடு மற்றும் இலை நோய் அடையாள வட்டங்கள்.',
    tech: 'SVG Radial Gauges / Canvas Heatmaps',
    details_en: 'Transforms numerical probabilities into intuitive visual diagrams for non-technical farmers.',
    details_ta: 'விவசாயிகள் எளிதில் புரிந்து கொள்ளும் வகையில் வரைபடமாக வழங்குதல்.'
  },
  {
    id: 8,
    icon: Tractor,
    step: '08',
    title_en: 'Farmer Field Action',
    title_ta: 'விவசாய கள நடவடிக்கை',
    subtitle_en: 'Targeted irrigation, precise fertilization, and government subsidy adoption.',
    subtitle_ta: 'துல்லிய பாசனம், உரமிடல் மற்றும் அரசு மானிய பலன்களை பெறுதல்.',
    tech: 'Real-World Agronomic Impact',
    details_en: 'Achieves higher crop yield, lower chemical input costs, and zero crop failure.',
    details_ta: 'அதிக மகசூல், குறைந்த செலவு மற்றும் நிலையான விவசாய வளர்ச்சி.'
  }
];

const WorkflowPage = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';
  const [selectedStep, setSelectedStep] = useState(PIPELINE_STEPS[3]); // Default on ML Processing

  return (
    <div className="space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="glass-light p-6 rounded-3xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B6623] uppercase tracking-wider mb-1">
            <GitBranch className="w-4 h-4 text-[#0B6623]" />
            <span>Architectural Blueprint</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#17351F] tracking-tight">
            {t('workflow_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#4A3A30] mt-1 max-w-3xl font-medium">
            {t('workflow_subtitle')}
          </p>
        </div>
      </div>

      {/* Interactive Workflow Diagram & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Visual Pipeline Flow Diagram (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="glass-light p-6 rounded-3xl space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#17351F] pb-2 border-b border-[#765341]/15 flex items-center justify-between">
              <span>End-to-End Decision Pipeline</span>
              <span className="text-xs font-mono text-[#0B6623] font-bold px-2.5 py-0.5 rounded-full bg-[#0B6623]/15 border border-[#0B6623]/30">8 Operational Stages</span>
            </h2>

            <div className="space-y-2.5 pt-2">
              {PIPELINE_STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isSelected = selectedStep.id === step.id;
                return (
                  <div key={step.id}>
                    <div
                      onClick={() => setSelectedStep(step)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'glass-light bg-[#0B6623]/15 text-[#17351F] border-[#0B6623] shadow-glass'
                          : 'glass-card-light text-[#17351F] hover:border-[#765341]/40'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-[#0B6623] text-white shadow-glass'
                              : 'bg-[#0B6623]/10 text-[#0B6623] border border-[#0B6623]/25'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[#0B6623]'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-[#0B6623]">{step.step}</span>
                            <h3 className="text-sm font-black text-[#17351F]">
                              {isTamil ? step.title_ta : step.title_en}
                            </h3>
                          </div>
                          <p className="text-xs text-[#5F5148] mt-0.5 line-clamp-1 font-medium">
                            {isTamil ? step.subtitle_ta : step.subtitle_en}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase ${
                          isSelected
                            ? 'bg-[#0B6623]/20 text-[#0B6623] border border-[#0B6623]/40'
                            : 'bg-white/40 text-[#5F5148] border border-[#765341]/15'
                        }`}
                      >
                        {step.tech.split(' ')[0]}
                      </span>
                    </div>

                    {/* Connecting Visual Arrow */}
                    {idx < PIPELINE_STEPS.length - 1 && (
                      <div className="flex justify-center my-1 text-[#0B6623] opacity-80">
                        <ArrowDown className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step Inspector & Architecture Specifications (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Selected Stage Inspector Card */}
          <div className="glass-light p-6 rounded-3xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#765341]/15">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B6623]">
                Stage Deep-Dive Inspector
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#0B6623]/15 text-[#0B6623] border border-[#0B6623]/30">
                Step {selectedStep.step} / 08
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#17351F]">
                {isTamil ? selectedStep.title_ta : selectedStep.title_en}
              </h3>
              <p className="text-xs text-[#4A3A30] mt-1 leading-relaxed font-medium">
                {isTamil ? selectedStep.subtitle_ta : selectedStep.subtitle_en}
              </p>
            </div>

            {/* Implementation Details */}
            <div className="p-4 rounded-2xl glass-card-light space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B6623]">
                Internal Mechanism & Logic
              </span>
              <p className="text-xs sm:text-sm text-[#17351F] leading-relaxed font-medium">
                {isTamil ? selectedStep.details_ta : selectedStep.details_en}
              </p>
            </div>

            {/* Underlying Technology Stack */}
            <div className="p-4 rounded-2xl glass-card-light space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B6623]">
                Underlying Technology
              </span>
              <div className="text-xs font-mono font-bold text-[#17351F]">
                {selectedStep.tech}
              </div>
            </div>

            {/* Offline-First Guarantee Banner */}
            <div className="p-3.5 rounded-2xl bg-[#0B6623]/15 border border-[#0B6623]/30 flex items-center gap-2.5 text-xs text-[#0B6623] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#0B6623] shrink-0" />
              <span>100% Offline Compatible: Stage functions with zero external network connectivity.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default WorkflowPage;

