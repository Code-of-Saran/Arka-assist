import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  Bug,
  CloudSun,
  BookOpenCheck,
  Bot,
  WifiOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Layers,
  ChevronRight,
  TrendingUp,
  Cpu,
  Globe2
} from 'lucide-react';

const LandingPage = () => {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const isTamil = language === 'ta';

  const capabilities = [
    {
      icon: Sprout,
      title: isTamil ? 'பயிர் பரிந்துரை' : 'Crop Recommendation',
      desc: isTamil ? 'மண் சத்துக்கள் (NPK), காரத்தன்மை மற்றும் வானிலை அளவுகளை ஆய்வு செய்து உகந்த பயிரை பரிந்துரைக்கும்.' : 'Machine-learned agronomic modeling matching soil NPK, pH, and precipitation to highest yield crop.',
      link: '/crop-recommendation',
      tag: 'ML Model'
    },
    {
      icon: Cpu,
      title: isTamil ? 'வெப்ப பட & பல்நோக்கு ஆய்வு' : 'Thermal & Multimodal Vision',
      desc: isTamil ? 'இலை நிறப்படம் மற்றும் அகச்சிவப்பு வெப்பநிலையை ஒருங்கிணைத்து துல்லிய பயிர் அழுத்த கண்டறிதல்.' : 'Fused RGB pathology and thermal infrared thermography for root-zone moisture & transpiration deficit.',
      link: '/multimodal',
      tag: 'Multimodal AI'
    },
    {
      icon: TrendingUp,
      title: isTamil ? 'சந்தை & விற்பனை முடிவு' : 'Market & Sell/Wait Engine',
      desc: isTamil ? 'மண்டி விலைகள், 7 நாள் விலை போக்கு மற்றும் AI விற்பனை / காத்திருப்பு வழிகாட்டுதல்.' : 'Authentic mandi prices, 7-day momentum tracking, and explainable AI Sell vs. Wait harvest guidance.',
      link: '/market',
      tag: 'Econometric AI'
    },
    {
      icon: Layers,
      title: isTamil ? '3D டிஜிட்டல் பண்ணை' : '3D Farm Digital Twin',
      desc: isTamil ? 'உங்கள் நிலப்பகுதிகளின் நேரடி வெப்பநிலை, மண் ஈரப்பதம் மற்றும் பயிர் நிலையை 3D-ல் காட்டும்.' : 'Interactive 3D representation of farm parcels with live canopy temperatures and sensor telemetry.',
      link: '/farm-3d',
      tag: 'Digital Twin'
    },
    {
      icon: CloudSun,
      title: isTamil ? 'விவசாய வானிலை' : 'Agro-Meteorology',
      desc: isTamil ? 'வானிலை முன்னறிவிப்புடன் பாசனம், மருந்து தெளிப்பு மற்றும் மழைக்கான விவசாய எச்சரிக்கைகள்.' : 'Localized weather tracking paired with real-time irrigation advice, spray windows, and flood hazards.',
      link: '/weather',
      tag: 'Advisory'
    },
    {
      icon: Bot,
      title: isTamil ? 'குரல் வழி AI விவசாய உதவியாளர்' : 'AI Voice Farm Assistant',
      desc: isTamil ? 'குரல் மூலம் பேசி பயிர் ஆலோசனை, சந்தை விலை மற்றும் பண்ணை முடிவுகளை உடனே அறியலாம்.' : 'Hands-free conversational speech companion with English & Tamil speech recognition and audio readout.',
      link: '/assistant',
      tag: 'Voice AI'
    }
  ];

  const workflowSteps = [
    { num: '01', title: isTamil ? 'மண் & தட்பவெப்ப உள்ளீடு' : 'Soil & Climate Input', desc: isTamil ? 'நிலத்தின் NPK சத்துக்கள், pH அளவு மற்றும் மழைப்பொழிவு' : 'NPK soil chemistry, pH, moisture & precipitation inputs' },
    { num: '02', title: isTamil ? 'AI மாதிரி பகுப்பாய்வு' : 'AI/ML Processing', desc: isTamil ? 'ரேண்டம் பாரஸ்ட் மற்றும் கணினி பார்வை மாதிரிகள்' : 'Trained Random Forest classifier & visual pathology engines' },
    { num: '03', title: isTamil ? 'இரட்டை அறிக்கை வெளியீடு' : 'Dual Output Matrix', desc: isTamil ? 'விளக்க உரை + வரைபட ஒப்பீட்டு விளக்கங்கள்' : 'Agronomic textual guide + interactive visual diagrammatic charts' },
    { num: '04', title: isTamil ? 'விவசாய நடவடிக்கை' : 'Field Implementation', desc: isTamil ? 'துல்லிய பாசனம், உரம் மற்றும் நோய் மேலாண்மை' : 'Targeted fertigation, timely spray windows, and subsidy adoption' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION WITH FULL-WIDTH AGRICULTURAL BACKGROUND */}
      <section className="relative overflow-hidden min-h-[85vh] lg:min-h-[90vh] flex items-center pt-16 pb-24 lg:pt-20 lg:pb-28">
        
        {/* AGRICULTURAL BACKGROUND IMAGE WITH COVER & SLOW SUBTLE ZOOM */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/assets/images/hero-farm-bg.jpg"
            alt="Arka-assist Smart Agricultural Farm Field"
            className="w-full h-full object-cover object-center transform scale-105 animate-hero-bg-zoom filter brightness-[0.92] contrast-[1.05]"
          />
          {/* Subtle dark earth-tone gradient overlay (35-50%) for guaranteed text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/92 via-forest-950/80 to-forest-950/50 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-forest-950/40 z-10" />
          {/* Subtle warm glow accents */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[300px] bg-amber-500/10 blur-[120px] pointer-events-none z-10" />
          <div className="absolute bottom-10 right-1/4 w-[450px] h-[250px] bg-leaf-500/15 blur-[100px] pointer-events-none z-10" />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6 animate-fade-in-up">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900/80 border border-leaf-500/40 text-leaf-300 text-xs font-bold shadow-lg backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isTamil ? 'அடுத்த தலைமுறை ஸ்மார்ட் விவசாய தளம்' : 'Next-Gen Agricultural Intelligence Platform'}</span>
              </div>

              {/* ARKA-ASSIST Brand Title */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white drop-shadow-md leading-[1.08]">
                  ARKA-ASSIST
                </h1>
                <p className="text-xl sm:text-2xl font-extrabold text-leaf-300 tracking-wide">
                  {t('hero_brand_subtitle')}
                </p>
              </div>

              {/* Tagline / Supporting text */}
              <p className="text-base sm:text-lg text-cream-100/90 max-w-2xl leading-relaxed font-medium drop-shadow">
                {t('hero_brand_tagline')}
              </p>

              {/* Highlights Chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1 text-xs font-bold text-cream-100">
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-leaf-400" />
                  {isTamil ? 'தமிழ் & English' : 'English & Tamil Dual UI'}
                </span>
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-leaf-400" />
                  {isTamil ? '100% ஆஃப்லைன் முறை' : '100% Offline Capable'}
                </span>
                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-leaf-400" />
                  {isTamil ? 'உரை + வரைபட வெளியீடு' : 'Multimodal RGB + Thermal AI'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-forest-600 via-forest-500 to-leaf-600 hover:from-forest-500 hover:to-leaf-500 border border-leaf-400/40 shadow-xl hover:shadow-glow-green transform hover:-translate-y-0.5 transition-all duration-200 text-sm group"
                >
                  <Sprout className="w-5 h-5 text-leaf-200 group-hover:rotate-12 transition-transform" />
                  <span>{t('hero_cta_analyze')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/assistant"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/40 backdrop-blur-md shadow-lg transform hover:-translate-y-0.5 transition-all text-sm group"
                >
                  <Bot className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>{t('hero_cta_talk')}</span>
                </Link>
              </div>

            </div>

            {/* Right Hero Visual Depth Floating Glass Cards */}
            <div className="lg:col-span-5 relative space-y-4">
              
              {/* Main Floating Farm Health & AI Telemetry Card */}
              <div className="hero-glass-card rounded-3xl p-6 shadow-2xl text-white backdrop-blur-xl border border-white/20 relative overflow-hidden group hover:border-leaf-400/50 transition-all">
                {/* Top glow accent */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-leaf-500/20 blur-2xl rounded-full pointer-events-none" />
                
                {/* Header status bar */}
                <div className="flex items-center justify-between pb-4 border-b border-white/15 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-xs font-mono text-leaf-300 font-semibold tracking-wider">FARM_TELEMETRY.AI</span>
                  </div>
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-leaf-500/20 text-leaf-300 border border-leaf-400/30">
                    Live Farm Monitor
                  </span>
                </div>

                {/* Farm Health Gauge Card */}
                <div className="mb-5 p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md flex items-center justify-between">
                  <div>
                    <div className="text-xs text-cream-200/80 font-medium uppercase tracking-wider">Overall Farm Health</div>
                    <div className="text-2xl font-black text-white flex items-center gap-2 mt-0.5">
                      <span>82 / 100</span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 font-semibold">Healthy 🌱</span>
                    </div>
                  </div>
                  {/* Progress Arc / Circle */}
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-500/30 border-t-emerald-400 flex items-center justify-center font-bold text-xs text-emerald-300">
                    82%
                  </div>
                </div>

                {/* Simulated decision widgets */}
                <div className="space-y-3">
                  {/* Top crop recommendation */}
                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-forest-700/80 border border-leaf-500/30 flex items-center justify-center text-leaf-300 text-lg font-bold shadow-inner">
                        🌾
                      </div>
                      <div>
                        <div className="text-[11px] text-cream-200/70 uppercase font-semibold">Recommended Crop</div>
                        <div className="text-sm font-bold text-white">Rice (Paddy) / நெல்</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-leaf-400">98.3%</span>
                      <span className="block text-[9px] text-cream-200/60 font-mono">Confidence</span>
                    </div>
                  </div>

                  {/* Weather & Leaf Scanner Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold mb-1">
                        <CloudSun className="w-3.5 h-3.5" />
                        <span>Agro-Weather</span>
                      </div>
                      <div className="text-xs font-bold text-white">28.5°C | Optimal</div>
                      <div className="text-[10px] text-leaf-300 mt-0.5 font-medium">● Spray Window Open</div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                      <div className="flex items-center gap-1.5 text-xs text-rose-300 font-semibold mb-1">
                        <Bug className="w-3.5 h-3.5" />
                        <span>Pathology AI</span>
                      </div>
                      <div className="text-xs font-bold text-white">Leaf Scanner</div>
                      <div className="text-[10px] text-amber-300 mt-0.5 font-medium">● 0-Risk Early Catch</div>
                    </div>
                  </div>

                  {/* Zero-latency offline pill */}
                  <div className="p-2.5 rounded-xl bg-forest-900/60 border border-leaf-500/30 flex items-center justify-between text-xs text-cream-200">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium">
                      <ShieldCheck className="w-4 h-4 text-leaf-400" />
                      <span>Zero-Latency Offline Mode</span>
                    </span>
                    <span className="font-mono text-leaf-300 font-bold text-[10px]">100% READY</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. KEY CAPABILITIES GRID */}
      <section className="py-16 bg-cream-200/50 dark:bg-darkbg-card/40 border-y border-cream-300/80 dark:border-darkbg-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl font-black text-forest-950 dark:text-cream-50 tracking-tight">
              {isTamil ? 'முக்கிய விவசாய சேவைகள்' : 'Comprehensive Agricultural Decision Suites'}
            </h2>
            <p className="text-sm sm:text-base text-earth-700 dark:text-cream-200/80">
              {isTamil ? 'விவசாயிகளுக்கு தேவையான அனைத்து தொழில்நுட்ப வழிகாட்டல்களும் ஒரே இடத்தில்.' : 'Modular architecture engineered to solve real-world farming challenges with actionable guidance.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.link}
                  className="group relative p-6 rounded-2xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border hover:border-forest-500 dark:hover:border-forest-600 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-forest-50 dark:bg-darkbg-surface text-forest-700 dark:text-leaf-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cream-200 dark:bg-darkbg-surface text-earth-700 dark:text-cream-200 border border-cream-300 dark:border-darkbg-border">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-forest-950 dark:text-cream-50 mb-2 group-hover:text-forest-600 dark:group-hover:text-leaf-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-earth-700 dark:text-darkbg-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-cream-200 dark:border-darkbg-border/60 flex items-center justify-between text-xs font-bold text-forest-700 dark:text-leaf-400">
                    <span>{isTamil ? 'பயன்படுத்துக' : 'Open Tool'}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS / AI PIPELINE */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 dark:text-leaf-400">
              {isTamil ? 'எளிய 4-படி செயல்முறை' : 'Seamless 4-Step Process'}
            </span>
            <h2 className="text-3xl font-black text-forest-950 dark:text-cream-50 tracking-tight">
              {isTamil ? 'அக்ரி விஷன் எவ்வாறு செயல்படுகிறது?' : 'How AgriVision Drives Better Yields'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-white/80 dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col"
              >
                <div className="text-3xl font-black text-forest-600/30 dark:text-leaf-500/30 font-mono mb-2">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-forest-950 dark:text-cream-50 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-earth-700 dark:text-darkbg-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Workflow architecture link CTA */}
          <div className="mt-10 text-center">
            <Link
              to="/workflow"
              className="inline-flex items-center gap-2 text-xs font-bold text-forest-700 dark:text-leaf-400 hover:underline"
            >
              <Cpu className="w-4 h-4" />
              <span>{isTamil ? 'முழுமையான சிஸ்டம் கட்டமைப்பை பார்க்க' : 'View Complete System Architecture & Pipeline'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="py-14 bg-gradient-to-br from-forest-800 to-forest-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            {isTamil ? 'உங்கள் விவசாய முடிவுகளை இன்றே எளிதாக்குங்கள்' : 'Ready to Transform Your Agricultural Decisions?'}
          </h2>
          <p className="text-sm sm:text-base text-forest-200 max-w-xl mx-auto">
            {isTamil ? 'இலவசமாக பதிவு செய்து ஸ்மார்ட் பயிர் வழிகாட்டலை உடனே தொடங்குங்கள்.' : 'Access AI crop recommendation, leaf scanner, and government welfare benefits instantly with full offline support.'}
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-leaf-500 hover:bg-leaf-600 text-forest-950 shadow-soft-lg hover:scale-105 transition-all text-sm"
            >
              <span>{isTamil ? 'உடனே உள்நுழையவும்' : 'Launch AgriVision Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
