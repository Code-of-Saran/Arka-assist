import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  Bug,
  Flame,
  Layers,
  CalendarCheck,
  Store,
  Scale,
  CloudSun,
  BookOpenCheck,
  Bot,
  Mic,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Compass,
  ChevronRight,
  ShieldCheck,
  Box
} from 'lucide-react';

const LandingPage = () => {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const isTamil = language === 'ta';

  const lifecycleStages = [
    { num: '01', step: 'PLAN', title: isTamil ? 'மண் & பயிர் திட்டம்' : 'Soil & Crop Matcher', desc: isTamil ? 'N-P-K & மழைப்பொழிவு ஆய்வு' : 'N-P-K & rainfall suitability', icon: Sprout },
    { num: '02', step: 'GROW', title: isTamil ? 'வானிலை & ஊட்டச்சத்து' : 'Agro-Meteorology', desc: isTamil ? 'தெளிப்பு நேரம் & ஈரப்பதம்' : 'Spray timing & moisture alerts', icon: CloudSun },
    { num: '03', step: 'MONITOR', title: isTamil ? 'இலை நோய் ஸ்கேனர்' : 'Foliar Vision AI', desc: isTamil ? 'AI இலை நோய் கண்டறிதல்' : 'MobileNetV3 leaf pathology', icon: Bug },
    { num: '04', step: 'ANALYZE', title: isTamil ? 'அகச்சிவப்பு வெப்பம்' : 'Canopy Thermography', desc: isTamil ? 'வேர் நீர் பற்றாக்குறை' : 'Root water stress heatmap', icon: Flame },
    { num: '05', step: 'DECIDE', title: isTamil ? '24h பண்ணை வழிகாட்டி' : '24h Action Command', desc: isTamil ? 'P1, P2, P3 முன்னுரிமைகள்' : 'P1, P2, P3 priority daily actions', icon: CalendarCheck },
    { num: '06', step: 'SELL', title: isTamil ? 'மண்டி விற்பனை முடிவு' : 'Market Sell / Wait', desc: isTamil ? 'அதிக லாப விற்பனை நேரம்' : 'Explainable holding profit engine', icon: Scale }
  ];

  const features = [
    {
      id: 'crop',
      tag: 'EDGE AI AGRONOMY',
      title: isTamil ? 'துல்லியமான பயிர் பொருத்தம் & மண் பகுப்பாய்வு' : 'Precision Crop Recommendation Engine',
      desc: isTamil
        ? 'மண்ணின் தழைச்சத்து (N), மணிச்சத்து (P), சாம்பல்சத்து (K), pH மற்றும் வானிலை காரணிகளை பகுப்பாய்வு செய்து அதிக மகசூல் தரும் பயிரை பரிந்துரைக்கும்.'
        : 'RandomForest ML model analyzing 7 vital agro-climatic parameters. Calibrated specifically for Tamil Nadu agro-ecological zones with explainable factor confidence scores.',
      highlights: [
        isTamil ? 'தமிழ்நாடு வேளாண் மண்டல அளவீடுகள்' : 'Multi-parameter soil nutrient matching',
        isTamil ? 'மண் ஊட்டச்சத்து சமநிலை வழிகாட்டல்' : 'Detailed soil nutrient deficiency matrix',
        isTamil ? '100% ஆஃப்லைன் கணக்கீட்டு திறன்' : '100% offline edge inference capability'
      ],
      link: '/crop-recommendation',
      linkText: isTamil ? 'பயிர் பரிந்துரை தொடங்க' : 'Run Crop Planning Engine',
      image: '/assets/images/soil-sprout.jpg',
      reverse: false
    },
    {
      id: 'disease',
      tag: 'COMPUTER VISION AI',
      title: isTamil ? 'இலை நோய் கண்டறிதல் & உயிரியல் சிகிச்சை' : 'Foliar Pathology & Organic Remedy AI',
      desc: isTamil
        ? 'பயிர் இலைகளின் புகைப்படத்தை ஆய்வு செய்து நோய் அறிகுறிகள், பூச்சி தாக்குதல்கள் மற்றும் ஊட்டச்சத்து குறைபாடுகளை நொடிகளில் கண்டறியும்.'
        : 'Instant multi-class crop disease classification using neural computer vision. Provides organic biological preparations and ICAR-verified chemical dosage timings.',
      highlights: [
        isTamil ? 'PyTorch பார்வை மாதிரி பகுப்பாய்வு' : 'PyTorch MobileNetV3 visual classification',
        isTamil ? 'இயற்கை மூலிகை மற்றும் உயிரியல் மருந்துகள்' : 'Biological Panchagavya / Neem formulations',
        isTamil ? 'தெளிவான சிகிச்சை கால அட்டவணை' : 'Actionable spray timing & weather validation'
      ],
      link: '/disease-detection',
      linkText: isTamil ? 'இலை ஸ்கேன் செய்க' : 'Launch Leaf Diagnostic Tool',
      image: '/assets/images/leaf-close-up.jpg',
      reverse: true
    },
    {
      id: 'thermal',
      tag: 'MULTIMODAL THERMOGRAPHY',
      title: isTamil ? 'அகச்சிவப்பு வெப்ப பட பயிர் அழுத்தம்' : 'Thermal Infrared Canopy Diagnostics',
      desc: isTamil
        ? 'பயிர் இலைகளின் வெப்பநிலையை அகச்சிவப்பு வரைபடம் மூலம் ஆய்வு செய்து, வேர் பகுதி நீர் பற்றாக்குறை மற்றும் வாடல் நோயை முன்கூட்டியே எச்சரிக்கும்.'
        : 'Non-invasive spatial thermography mapping canopy temperature anomalies. Detects early stomatal closure, transpiration failure, and root-zone water deficit.',
      highlights: [
        isTamil ? '8×8 நிலப்பரப்பு வெப்ப வரைபடம்' : 'Interactive 8×8 false-color spatial colormap',
        isTamil ? 'கனோபி வெப்பநிலை வேறுபாடு (ΔT)' : 'Canopy-to-air differential (ΔT) tracking',
        isTamil ? 'வாடல் நோய் முன்கூட்டியே அறிதல்' : 'Vascular wilt and salinity stress detection'
      ],
      link: '/thermal',
      linkText: isTamil ? 'வெப்ப பகுப்பாய்வு செய்க' : 'Inspect Canopy Thermography',
      image: '/assets/images/crop-fields.jpg',
      reverse: false
    },
    {
      id: 'farm-3d',
      tag: 'SPATIAL DIGITAL TWIN',
      title: isTamil ? '3D டிஜிட்டல் இரட்டை பண்ணை மாதிரி' : '3D Farm Digital Twin Model',
      desc: isTamil
        ? 'உங்கள் 4.5 ஏக்கர் பண்ணை நிலப்பகுதிகளின் நேரடி 3D மாதிரி. கனோபி வெப்பநிலை மற்றும் ஈரப்பத வரைபடங்களுடன் நிகழ்நேரத்தில் இணைக்கப்பட்டுள்ளது.'
        : 'Spatial isometric digital twin visualizing parcel vitality, canopy thermal hotspots, and soil moisture sensors with immediate field action plans.',
      highlights: [
        isTamil ? '4 நிலப்பகுதிகள் நேரடி பார்வை' : '4-parcel interactive isometric perspective',
        isTamil ? 'கனோபி வெப்பநிலை மற்றும் மண் ஈரப்பதம்' : 'Canopy thermal & root-zone volumetric telemetry',
        isTamil ? 'நிலப்பகுதி வாரியான உடனடி செயல் திட்டம்' : 'Parcel-specific agronomic irrigation schedules'
      ],
      link: '/farm-3d',
      linkText: isTamil ? '3D மாதிரி பார்க்க' : 'Open 3D Farm Digital Twin',
      image: '/assets/images/drone-canopy.jpg',
      reverse: true
    },
    {
      id: 'market',
      tag: 'ECONOMETRIC ENGINE',
      title: isTamil ? 'மண்டி விலை போக்கு & விற்பனை/காத்திருப்பு வழிகாட்டி' : 'Mandi Market & Explainable Sell/Wait Advisor',
      desc: isTamil
        ? 'உண்மையான மண்டி விலைகள் மற்றும் 7 நாள் விலை வேகத்தை ஆய்வு செய்து, விளைபொருளை உடனே விற்க வேண்டுமா அல்லது காத்திருக்க வேண்டுமா என வழிகாட்டும்.'
        : 'Economic decision matrix evaluating real mandi price momentum against storage holding costs and spoilage risks to calculate optimal harvest timing.',
      highlights: [
        isTamil ? 'அரசு Agmarknet மண்டி விலை குறியீடு' : 'Agmarknet wholesale mandi price indices',
        isTamil ? 'காத்திருப்பு பலன் vs சேமிப்பு செலவு' : 'Net holding gain vs. weekly storage cost',
        isTamil ? 'நேரடி கொள்முதல் வாங்குவோர் இணைப்பு' : 'Direct compatibility scoring with wholesale buyers'
      ],
      link: '/sell-decision',
      linkText: isTamil ? 'விற்பனை முடிவை கணக்கிடுக' : 'Calculate Sell vs. Wait Timing',
      image: '/assets/images/harvest-mandi.jpg',
      reverse: false
    }
  ];

  return (
    <div className="flex flex-col min-h-screen text-white selection:bg-[#0B6623] selection:text-white">
      
      {/* ========================================================
          1. HERO SECTION (SCREENSHOT 4 EXACT STRUCTURE)
          ======================================================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-20">
        
        {/* Full-width Background Image with Layered Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/hero-aerial-farm.jpg"
            alt="Indian Farmland at Sunrise"
            className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.45] contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D25]/95 via-[#0B6623]/75 to-[#0F3D25]/60 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a11] via-transparent to-black/35 z-10 pointer-events-none" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6 animate-fade-in-up">
              
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/12 border border-white/22 text-white text-xs font-bold shadow-glass backdrop-blur-md">
                <Sprout className="w-4 h-4 text-[#5BA33C]" />
                <span className="tracking-wide">Next-Gen Agricultural Intelligence Platform</span>
              </div>

              {/* Main Heading & Subtitle */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] drop-shadow-md font-mono">
                  ARKA—ASSIST
                </h1>
                <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#5BA33C] tracking-tight">
                  Your Intelligent Farming Companion
                </p>
                <p className="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed font-medium pt-1">
                  Plan, monitor, analyze and make smarter farming decisions with AI.
                </p>
              </div>

              {/* Feature Chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 text-xs font-semibold text-white">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/18">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5BA33C]" />
                  <span>English & Tamil Dual UI</span>
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/18">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5BA33C]" />
                  <span>100% Offline Capable</span>
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/18">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5BA33C]" />
                  <span>Multimodal RGB + Thermal AI</span>
                </span>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl font-bold text-white btn-glass-primary shadow-glass transition-all text-sm group cursor-pointer"
                >
                  <Sprout className="w-4 h-4 text-white" />
                  <span>Analyze My Farm</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/assistant"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-white bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/35 backdrop-blur-md transition-all text-sm cursor-pointer shadow-glass"
                >
                  <Bot className="w-4 h-4 text-amber-300" />
                  <span>Talk to Arka-assist</span>
                </Link>
              </div>

            </div>

            {/* Right Side: Floating Glass Telemetry Card (SCREENSHOT 4) */}
            <div className="lg:col-span-5 relative pt-4 lg:pt-0">
              <div className="glass-dark p-6 rounded-3xl border border-white/18 shadow-2xl backdrop-blur-2xl space-y-4">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/12">
                  <span className="text-xs font-mono font-black text-[#5BA33C] tracking-wider">
                    FARM_TELEMETRY.AI
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0B6623]/40 text-[#5BA33C] border border-[#5BA33C]/40">
                    LIVE FARM MONITOR
                  </span>
                </div>

                {/* Section 1: OVERALL FARM HEALTH */}
                <div className="flex items-center justify-between py-1">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8C7AE] block">
                      OVERALL FARM HEALTH
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
                        82 / 100
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#0B6623]/40 text-[#5BA33C] border border-[#5BA33C]/40 flex items-center gap-1">
                        <span>Healthy</span>
                        <span>🌱</span>
                      </span>
                    </div>
                  </div>

                  <div className="w-14 h-14 rounded-full border-4 border-[#5BA33C]/30 border-t-[#5BA33C] flex items-center justify-center font-black text-sm text-[#5BA33C] font-mono bg-black/30">
                    82%
                  </div>
                </div>

                {/* Section 2: RECOMMENDED CROP */}
                <div className="p-3.5 rounded-2xl bg-white/6 border border-white/12 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B6623] flex items-center justify-center text-white shrink-0 shadow-glass">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#D8C7AE] block tracking-wider">
                        RECOMMENDED CROP
                      </span>
                      <span className="text-sm font-black text-white block">
                        Rice (Paddy) / நெல்
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#5BA33C] font-mono block">
                      98.3%
                    </span>
                    <span className="text-[9px] text-[#D8C7AE] uppercase tracking-wider block">
                      Confidence
                    </span>
                  </div>
                </div>

                {/* Section 3: Two Mini Telemetry Boxes Side-by-Side */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* Box 1: Agro-Weather */}
                  <div className="p-3 rounded-2xl bg-white/6 border border-white/12 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                      <CloudSun className="w-3.5 h-3.5" />
                      <span>Agro-Weather</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      28.5°C | Optimal
                    </div>
                    <span className="text-[10px] text-[#5BA33C] font-medium block">
                      ■ Spray Window Open
                    </span>
                  </div>

                  {/* Box 2: Pathology AI */}
                  <div className="p-3 rounded-2xl bg-white/6 border border-white/12 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#C46F52] font-bold text-[11px]">
                      <Bug className="w-3.5 h-3.5" />
                      <span>Pathology AI</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      Leaf Scanner
                    </div>
                    <span className="text-[10px] text-amber-300 font-medium block">
                      ■ 0-Risk Early Catch
                    </span>
                  </div>
                </div>

                {/* Section 4: Zero-Latency Offline Mode Footer */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-white/90 font-medium text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5BA33C]" />
                    <span>Zero-Latency Offline Mode</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#5BA33C] tracking-wider">
                    100% READY
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          2. LIFECYCLE STAGES
          ======================================================== */}
      <section className="py-16 glass-dark border-y border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#D8C7AE] text-xs font-black uppercase tracking-widest border border-white/16">
              Complete Farm Lifecycle
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              ONE PLATFORM. EVERY FARM DECISION.
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              {isTamil
                ? 'பயிர் திட்டமிடல் முதல் அறுவடை விற்பனை வரை அனைத்து நிலைகளிலும் விவசாயிகளுக்கு உதவும் முழுமையான தொழில்நுட்ப தொகுப்பு.'
                : 'Arka-assist empowers farmers across all six stages of production with explainable, physics-grounded agricultural intelligence.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
            {lifecycleStages.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={idx}
                  className="glass-primary p-4 rounded-3xl flex flex-col justify-between hover:border-[#5BA33C] transition-all duration-300 hover:shadow-glass hover:-translate-y-1 group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black font-mono text-[#5BA33C]">
                        {st.num}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider uppercase bg-[#0B6623]/25 text-[#5BA33C] border border-[#5BA33C]/30">
                        {st.step}
                      </span>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-[#0B6623]/30 border border-[#5BA33C]/30 flex items-center justify-center text-[#5BA33C] group-hover:bg-[#0B6623] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>

                    <h3 className="text-sm font-black text-white">
                      {st.title}
                    </h3>
                    <p className="text-[11px] text-[#D8C7AE] leading-relaxed font-medium">
                      {st.desc}
                    </p>
                  </div>

                  <div className="pt-2 mt-2 border-t border-white/10 text-[10px] font-bold text-[#D8C7AE] flex items-center gap-1">
                    <span>Phase {idx + 1}</span>
                    <ChevronRight className="w-3 h-3 text-[#5BA33C]" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================
          3. FEATURE SHOWCASE
          ======================================================== */}
      <section className="py-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D8C7AE]">
            Deep-Tech Agronomic Modules
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {isTamil ? 'முக்கிய விவசாய நுண்ணறிவு கருவிகள்' : 'Precision Decision Modules'}
          </h2>
        </div>

        {features.map((feat) => (
          <div
            key={feat.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center ${
              feat.reverse ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Image Frame Column */}
            <div className={`lg:col-span-6 ${feat.reverse ? 'lg:order-2' : 'lg:order-1'}`}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/18 aspect-[16/10] group">
                <img
                  src={feat.image}
                  alt={feat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a11]/95 via-transparent to-black/25 pointer-events-none" />
                
                <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-2xl glass-dark border border-white/18 backdrop-blur-md flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Sparkles className="w-3.5 h-3.5 text-[#5BA33C]" />
                    <span>{feat.tag}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#D8C7AE]">Active Module</span>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className={`lg:col-span-6 space-y-4 ${feat.reverse ? 'lg:order-1' : 'lg:order-2'}`}>
              <div className="space-y-1.5">
                <span className="text-xs font-mono font-bold text-[#5BA33C] uppercase tracking-wider">
                  {feat.tag}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#D8C7AE] leading-relaxed font-medium">
                  {feat.desc}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-2 pt-1">
                {feat.highlights.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2 text-xs font-semibold text-white">
                    <div className="w-4 h-4 rounded-full bg-[#0B6623] text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  to={feat.link}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-white btn-glass-primary shadow-glass transition-all text-xs cursor-pointer group"
                >
                  <span>{feat.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        ))}

      </section>

      {/* ========================================================
          4. CALL TO ACTION PANORAMIC BANNER
          ======================================================== */}
      <section className="py-16 relative overflow-hidden glass-dark text-white border-t border-white/16">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#D8C7AE] text-xs font-bold shadow-glass backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#5BA33C]" />
            <span>Ready for Smarter Harvest Decisions?</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white max-w-2xl mx-auto leading-tight">
            {isTamil ? 'உங்கள் விவசாயத்தை AI தொழில்நுட்பத்துடன் இணைக்கவும்' : 'Transform Your Agricultural Decisions with AI'}
          </h2>

          <p className="text-xs sm:text-sm text-[#D8C7AE] max-w-xl mx-auto leading-relaxed font-medium">
            {isTamil
              ? 'பயிர் பரிந்துரை, இலை ஸ்கேனர், மண்டி விலைகள் மற்றும் அரசு நலத்திட்டங்களை உடனே இலவசமாக பயன்படுத்த தொடங்குங்கள்.'
              : 'Access instant crop recommendation, foliar pathology scanning, mandi trend predictions, and government subsidies with full offline compatibility.'}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold btn-glass-primary shadow-2xl transition-all text-xs cursor-pointer"
            >
              <span>{isTamil ? 'உடனே உள்நுழையவும்' : 'Launch Arka-assist Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/assistant"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-white btn-glass-secondary transition-all text-xs cursor-pointer"
            >
              <Bot className="w-4 h-4 text-[#D8C7AE]" />
              <span>{t('hero_cta_talk') || 'Talk to AI Assistant'}</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
