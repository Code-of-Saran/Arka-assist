import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import {
  getWeather,
  getFarmHealthScore,
  getDailyAnalysis,
  getMarketPrices,
  getSellDecision
} from '../services/api';
import { getRecentActivities } from '../services/offlineStorage';
import OfflineBadge from '../components/OfflineBadge';
import VoiceAssistantModal from '../components/VoiceAssistantModal';
import {
  Sprout,
  Bug,
  CloudSun,
  BookOpenCheck,
  Bot,
  ArrowRight,
  TrendingUp,
  Droplets,
  Wind,
  Sun,
  ShieldCheck,
  Clock,
  Sparkles,
  ChevronRight,
  Layers,
  Flame,
  Scale,
  Store,
  Box,
  Mic,
  AlertTriangle,
  CheckCircle2,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { isOffline } = useOffline();
  const isTamil = language === 'ta';

  const [weather, setWeather] = useState(null);
  const [farmHealth, setFarmHealth] = useState(null);
  const [dailyAnalysis, setDailyAnalysis] = useState(null);
  const [marketSummary, setMarketSummary] = useState(null);
  const [sellDecision, setSellDecision] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [wData, hData, dData, mData, sData] = await Promise.all([
          getWeather('Coimbatore'),
          getFarmHealthScore(),
          getDailyAnalysis('Rice (Paddy)', 'Field 1'),
          getMarketPrices(),
          getSellDecision({ crop: 'rice' })
        ]);
        setWeather(wData);
        setFarmHealth(hData);
        setDailyAnalysis(dData);
        setMarketSummary(mData);
        setSellDecision(sData);
      } catch (e) {
        console.error('Dashboard data load error:', e);
      }
      setActivities(getRecentActivities());
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  // Today's Prioritized Action Items
  const dailyActions = [
    {
      priority: 'High',
      tag_en: 'Critical Mitigation',
      tag_ta: 'அவசர பணி',
      title_en: 'Field 2: Irrigate canopy zone - thermal readings show 34.1°C moisture stress.',
      title_ta: 'நிலம் 2-ல் கனோபி நீர்ப்பாசனம் செய்யவும் - 34.1°C வெப்ப அழுத்தம் பதிவாகியுள்ளது.',
      link: '/thermal',
      color: 'border-l-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
    },
    {
      priority: 'Medium',
      tag_en: 'Nutrient / Soil',
      tag_ta: 'மண் ஈரப்பதம்',
      title_en: 'Field 4: Inspect soil moisture before activating the evening drip cycle.',
      title_ta: 'நிலம் 4: மாலை நேர சொட்டு நீர் பாசனத்திற்கு முன் மண் ஈரப்பதத்தை சரிபார்க்கவும்.',
      link: '/daily-analysis',
      color: 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
    },
    {
      priority: 'Low',
      tag_en: 'Market Opportunity',
      tag_ta: 'சந்தை வாய்ப்பு',
      title_en: 'Market: Rice prices trending +6.1% this week. Maintain current storage (WAIT).',
      title_ta: 'சந்தை: நெல் விலை வாரத்திற்கு +6.1% உயர்கிறது. விற்பனையை தள்ளிப்போடவும் (WAIT).',
      link: '/sell-decision',
      color: 'border-l-leaf-500 bg-leaf-50/50 dark:bg-leaf-950/20'
    }
  ];

  // Unified Intelligence Pipeline Modules
  const pipelineModules = [
    {
      stage: 'PLAN',
      title: isTamil ? 'பயிர் பரிந்துரை' : 'Crop Recommendation',
      desc: isTamil ? 'மண் NPK மற்றும் காலநிலை சார்ந்த ML பரிந்துரை' : 'Soil NPK & climate-matched AI crop selection',
      icon: Sprout,
      to: '/crop-recommendation',
      color: 'bg-forest-600 text-white'
    },
    {
      stage: 'GROW',
      title: isTamil ? 'விவசாய வானிலை' : 'Weather Intelligence',
      desc: isTamil ? 'நிகழ்நேர வானிலை & பாசன எச்சரிக்கைகள்' : 'Real-time weather radar & spraying windows',
      icon: CloudSun,
      to: '/weather',
      color: 'bg-amber-600 text-white'
    },
    {
      stage: 'MONITOR',
      title: isTamil ? '3D டிஜிட்டல் பண்ணை' : '3D Farm Digital Twin',
      desc: isTamil ? '4 நிலப்பகுதிகளின் நேரடி 3D மாதிரி & சென்சார்கள்' : 'Interactive 3D representation of 4 farm parcels',
      icon: Box,
      to: '/farm-3d',
      color: 'bg-emerald-600 text-white'
    },
    {
      stage: 'MONITOR',
      title: isTamil ? 'வெப்ப பட ஆய்வு' : 'Thermal Crop Imaging',
      desc: isTamil ? 'கனோபி அகச்சிவப்பு வெப்ப அழுத்தம் கண்டறிதல்' : 'Infrared thermography & transpiration deficit',
      icon: Flame,
      to: '/thermal',
      color: 'bg-orange-600 text-white'
    },
    {
      stage: 'ANALYZE',
      title: isTamil ? 'பல்நோக்கு ஆய்வு' : 'Multimodal Analysis',
      desc: isTamil ? 'RGB + வெப்ப படம் + மண் + வானிலை ஒருங்கிணைப்பு' : 'Fused RGB visuals + thermal IR + soil sensors',
      icon: Layers,
      to: '/multimodal',
      color: 'bg-teal-600 text-white'
    },
    {
      stage: 'ANALYZE',
      title: isTamil ? 'தினசரி பயிர் நலம்' : 'Daily Crop Analysis',
      desc: isTamil ? '24 மணி நேர சுகாதார குறியீடு & கால வரிசை' : 'Daily vitality index & chronological comparison',
      icon: Activity,
      to: '/daily-analysis',
      color: 'bg-blue-600 text-white'
    },
    {
      stage: 'DECIDE',
      title: isTamil ? 'விற்பனை / காத்திருப்பு' : 'AI Sell/Wait Decision',
      desc: isTamil ? 'விலை ஏற்றம் & சேமிப்பு செலவு அடிப்படையிலான முடிவு' : 'Econometric harvest timing with explainability',
      icon: Scale,
      to: '/sell-decision',
      color: 'bg-purple-600 text-white'
    },
    {
      stage: 'SELL',
      title: isTamil ? 'வேளாண் சந்தை' : 'Farm Marketplace',
      desc: isTamil ? 'விளைபொருள் பட்டியல் & வாங்குவோர் தொடர்பு' : 'Direct farmer listings & verified buyer inquiry',
      icon: Store,
      to: '/marketplace',
      color: 'bg-leaf-600 text-white'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* 1. ARKA-ASSIST UNIFIED COMMAND BANNER */}
      <div className="relative overflow-hidden rounded-3xl text-white shadow-xl min-h-[220px] flex flex-col justify-center p-6 sm:p-8">
        {/* Farm Landscape Image */}
        <img
          src="/assets/images/hero-farm-bg.jpg"
          alt="Arka-assist Agricultural Farm"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05] transition-transform duration-700 hover:scale-105"
        />
        {/* Dark Gradient Overlay for optimal readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/92 via-forest-950/80 to-forest-950/40 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-forest-950/40 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-500/25 text-leaf-300 text-xs font-bold border border-leaf-500/40 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ARKA-ASSIST FARM INTELLIGENCE</span>
              </div>
              <OfflineBadge showToggle={true} />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-md">
              {t('dash_welcome')}, {user?.name || 'Farmer'}! 🌾
            </h1>
            <p className="text-xs sm:text-sm text-cream-100/90 leading-relaxed font-medium">
              {isTamil
                ? 'அர்கா-அசிஸ்ட்: பல்நோக்கு AI வழி பண்ணை நுண்ணறிவு மற்றும் முடிவெடுக்கும் தளம்'
                : 'Arka-assist — A Multimodal AI-Based Farm Intelligence and Decision Support System'}
              <span className="block text-[11px] text-leaf-300 mt-1 font-medium">
                📍 {user?.location || 'Coimbatore, Tamil Nadu'} • {user?.farm_size || '4.5 Acres'} (Clay Loam) • 4 Active Parcels
              </span>
            </p>
          </div>

          {/* Quick Actions & Health Gauge */}
          <div className="flex flex-wrap items-center gap-3 z-20 shrink-0">
            <Link
              to="/multimodal"
              className="btn-agro-primary flex items-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-xs group cursor-pointer shadow-lg hover:scale-105 transition-all"
            >
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sprout className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] text-emerald-100 font-semibold leading-none">Instant AI Scan</span>
                <span className="text-xs">{isTamil ? 'எனது பண்ணையை பகுப்பாய்வு செய்க' : 'Analyze My Farm'}</span>
              </div>
            </Link>

            <button
              onClick={() => setVoiceModalOpen(true)}
              type="button"
              className="btn-agro-voice flex items-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-xs group cursor-pointer shadow-lg hover:scale-105 transition-all"
            >
            <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] text-emerald-200 font-semibold leading-none">Voice Companion</span>
              <span className="text-xs">{isTamil ? 'பேசி முடிவெடுங்கள்' : 'Speak to Arka-assist'}</span>
            </div>
          </button>

          {/* Farm Health Gauge Badge */}
          <div className="p-3.5 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/10 backdrop-blur-sm flex items-center gap-3 shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex flex-col items-center justify-center">
              <span className="text-xl font-black font-mono text-emerald-300 leading-none">
                {farmHealth?.overall_health_score || 82}
              </span>
              <span className="text-[9px] font-bold text-emerald-200">/ 100</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-leaf-300 block tracking-wider">Overall Farm Health</span>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-leaf-400" />
                <span>Healthy Farm</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>


      {/* 2. TODAY'S PRIORITIZED ACTION PLAN */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-darkbg-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-forest-100 dark:bg-darkbg-surface text-forest-700 dark:text-leaf-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-forest-950 dark:text-cream-50 tracking-tight">
                {isTamil ? 'இன்றைய முன்னுரிமை விவசாய பணிகள்' : "Today's Personalized Action Plan"}
              </h2>
              <p className="text-[11px] text-earth-600 dark:text-darkbg-muted">AI-generated daily checklist tailored for your soil & crop condition</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-leaf-100 dark:bg-darkbg-surface text-leaf-800 dark:text-leaf-300 border border-leaf-300 dark:border-darkbg-border">
            {isTamil ? 'தானியங்கி AI பகுப்பாய்வு' : 'AI Priority Matrix'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {dailyActions.map((act, idx) => (
            <Link
              key={idx}
              to={act.link}
              className={`p-4 rounded-2xl border border-cream-200 dark:border-darkbg-border border-l-4 ${act.color} flex flex-col justify-between card-hover-lift`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-earth-500 dark:text-darkbg-muted">
                    {act.priority} Priority
                  </span>
                  <span className="text-[10px] font-bold text-forest-700 dark:text-leaf-300 px-2 py-0.5 rounded bg-white/60 dark:bg-black/20">
                    {isTamil ? act.tag_ta : act.tag_en}
                  </span>
                </div>
                <p className="text-xs font-semibold text-forest-950 dark:text-cream-50 leading-relaxed">
                  {isTamil ? act.title_ta : act.title_en}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-cream-200 dark:border-darkbg-border/60 flex items-center justify-between text-[11px] font-bold text-forest-700 dark:text-leaf-400">
                <span>{isTamil ? 'பார்வையிடுக' : 'Review & Action'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. MULTIMODAL TELEMETRY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Weather Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between card-hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted flex items-center gap-1.5">
              <CloudSun className="w-4 h-4 text-sky-500" />
              <span>{t('dash_weather_card')}</span>
            </span>
            <span className="text-xs font-bold text-forest-700 dark:text-leaf-300">Coimbatore</span>
          </div>

          <div className="flex items-center justify-between my-3">
            <div>
              <div className="text-3xl font-black text-forest-950 dark:text-cream-50 font-mono">
                {weather?.temp || 28.5}°C
              </div>
              <div className="text-xs text-earth-700 dark:text-cream-200 font-semibold mt-0.5">
                {isTamil ? weather?.condition_ta || 'பகுதி மேகமூட்டம்' : weather?.condition_en || 'Partly Cloudy'}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center shadow-inner">
              <Sun className="w-6 h-6 text-amber-500" />
            </div>
          </div>

          <Link
            to="/weather"
            className="btn-agro-weather py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between"
          >
            <span>{isTamil ? 'வானிலை பார்க்க' : 'View Weather'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Thermal Stress Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between card-hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Thermal Scan</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              Low Stress
            </span>
          </div>

          <div className="flex items-center justify-between my-3">
            <div>
              <div className="text-3xl font-black text-forest-950 dark:text-cream-50 font-mono">
                34.1°C
              </div>
              <div className="text-xs text-earth-700 dark:text-cream-200 font-medium">
                Field 2 (Cotton) ΔT: +5.6°C
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center shadow-inner">
              <Flame className="w-6 h-6" />
            </div>
          </div>

          <Link
            to="/thermal"
            className="btn-agro-primary py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between"
          >
            <span>{isTamil ? 'வெப்ப ஆய்வு' : 'Analyze Thermal'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Market Price Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between card-hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-amber-500" />
              <span>Market Price</span>
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
              +6.1% ↑
            </span>
          </div>

          <div className="flex items-center justify-between my-3">
            <div>
              <div className="text-3xl font-black text-forest-950 dark:text-cream-50 font-mono">
                ₹2,350
              </div>
              <div className="text-xs text-earth-700 dark:text-cream-200 font-medium">
                Rice (Paddy) / Quintal
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shadow-inner">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <Link
            to="/market"
            className="btn-agro-market py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between"
          >
            <span>{isTamil ? 'சந்தை விவரம்' : 'Market Details'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Sell / Wait Decision Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between card-hover-lift">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-purple-500" />
              <span>Sell / Wait</span>
            </span>
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 font-mono">74% AI Conf.</span>
          </div>

          <div className="flex items-center justify-between my-3">
            <div>
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                WAIT
              </div>
              <div className="text-xs text-earth-700 dark:text-cream-200 font-medium">
                Hold 7-10 Days for Peak
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center shadow-inner">
              <Scale className="w-6 h-6" />
            </div>
          </div>

          <Link
            to="/sell-decision"
            className="btn-agro-sell py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between"
          >
            <span>{isTamil ? 'விற்பனை முடிவு' : 'Check Sell Timing'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* 4. UNIFIED INTELLIGENCE WORKFLOW PIPELINE GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-forest-950 dark:text-cream-50 tracking-tight">
              {isTamil ? 'ஒருங்கிணைந்த பண்ணை முடிவெடுக்கும் கருவிகள்' : 'Unified Decision Intelligence Pipeline'}
            </h2>
            <p className="text-xs text-earth-600 dark:text-darkbg-muted">Select an AI tool to inspect or optimize your farm operation</p>
          </div>
          <span className="hidden sm:inline-block text-xs font-bold text-earth-500 dark:text-darkbg-muted font-mono">
            PLAN → GROW → MONITOR → ANALYZE → DECIDE → SELL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pipelineModules.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.to}
                className="group p-5 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border hover:border-forest-500 dark:hover:border-leaf-500 shadow-soft card-hover-lift flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-2xl ${item.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cream-100 dark:bg-darkbg-surface text-earth-700 dark:text-cream-200 border border-cream-200 dark:border-darkbg-border uppercase">
                      {item.stage}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-forest-950 dark:text-cream-50 group-hover:text-forest-700 dark:group-hover:text-leaf-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-earth-600 dark:text-darkbg-muted leading-relaxed mt-1">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-cream-200 dark:border-darkbg-border flex items-center justify-between text-xs font-bold text-forest-700 dark:text-leaf-400">
                  <span>{isTamil ? 'துவக்குக' : 'Open Module'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 5. RECENT ACTIVITY & SOIL PARAMETERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Activity Feed */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-darkbg-border">
            <h3 className="text-sm font-bold uppercase tracking-wider text-forest-950 dark:text-cream-50 flex items-center gap-2">
              <Clock className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
              <span>{t('dash_recent_activity')}</span>
            </h3>
            <span className="text-xs text-earth-500 font-mono">Live Session</span>
          </div>

          <div className="space-y-2.5">
            {activities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-cream-50/70 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-forest-100 dark:bg-darkbg-card text-forest-700 dark:text-leaf-400 flex items-center justify-center shadow-inner">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-forest-950 dark:text-cream-50">
                      {isTamil ? act.title_ta || act.title_en : act.title_en}
                    </div>
                    <div className="text-[11px] text-earth-600 dark:text-darkbg-muted">
                      {act.subtitle}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-medium text-earth-500">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Soil Telemetry Status */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-darkbg-border mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-forest-950 dark:text-cream-50 flex items-center gap-2">
                <Layers className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
                <span>{t('dash_soil_health')}</span>
              </h3>
              <span className="text-xs font-bold text-emerald-600">Clay Loam (Optimal)</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-earth-700 dark:text-darkbg-muted font-medium">Nitrogen (N)</span>
                  <span className="font-mono font-bold text-forest-800 dark:text-leaf-300">80 mg/kg</span>
                </div>
                <div className="w-full h-2 rounded-full bg-cream-200 dark:bg-darkbg-surface overflow-hidden">
                  <div className="h-full bg-forest-600 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-earth-700 dark:text-darkbg-muted font-medium">Phosphorus (P)</span>
                  <span className="font-mono font-bold text-forest-800 dark:text-leaf-300">48 mg/kg</span>
                </div>
                <div className="w-full h-2 rounded-full bg-cream-200 dark:bg-darkbg-surface overflow-hidden">
                  <div className="h-full bg-leaf-500 rounded-full" style={{ width: '65%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-earth-700 dark:text-darkbg-muted font-medium">Potassium (K)</span>
                  <span className="font-mono font-bold text-forest-800 dark:text-leaf-300">40 mg/kg</span>
                </div>
                <div className="w-full h-2 rounded-full bg-cream-200 dark:bg-darkbg-surface overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '55%' }} />
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/crop-recommendation"
            className="mt-5 btn-agro-primary w-full py-2.5 px-3 rounded-xl text-xs font-bold text-center block"
          >
            {isTamil ? 'புதிய மண் பரிசோதனை செய்ய' : 'Run Full NPK Simulation'}
          </Link>
        </div>

      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />

    </div>
  );
};

export default Dashboard;

