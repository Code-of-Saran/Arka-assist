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
  Activity,
  MapPin,
  RefreshCw,
  LineChart
} from 'lucide-react';

const Dashboard = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { isOffline, toggleOffline } = useOffline();
  const isTamil = language === 'ta';

  const [weather, setWeather] = useState(null);
  const [farmHealth, setFarmHealth] = useState(null);
  const [dailyAnalysis, setDailyAnalysis] = useState(null);
  const [marketSummary, setMarketSummary] = useState(null);
  const [sellDecision, setSellDecision] = useState(null);
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
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const commandModules = [
    {
      title: isTamil ? 'பயிர் பரிந்துரை' : 'AI Crop Planning',
      desc: isTamil ? 'மண் NPK & வானிலை அடிப்படையிலான தேர்வு' : 'NPK soil chemistry & precipitation model',
      icon: Sprout,
      to: '/crop-recommendation',
    },
    {
      title: isTamil ? 'இலை நோய் ஸ்கேனர்' : 'Leaf Disease Scanner',
      desc: isTamil ? 'பார்வை AI இலை நோய் கண்டறிதல் & மருந்து' : 'PyTorch foliar pathology diagnosis',
      icon: Bug,
      to: '/disease-detection',
    },
    {
      title: isTamil ? 'கனோபி வெப்ப ஆய்வு' : 'Thermal Crop Imaging',
      desc: isTamil ? '8×8 அகச்சிவப்பு வெப்ப அழுத்தம் கண்டறிதல்' : '8×8 spatial infrared thermography',
      icon: Flame,
      to: '/thermal',
    },
    {
      title: isTamil ? '3D டிஜிட்டல் பண்ணை' : '3D Farm Digital Twin',
      desc: isTamil ? '4 நிலப்பகுதிகளின் நேரடி 3D மாதிரி' : 'Live telemetry & spatial parcel view',
      icon: Box,
      to: '/farm-3d',
    },
    {
      title: isTamil ? 'விவசாய வானிலை' : 'Agro-Meteorology',
      desc: isTamil ? 'நிகழ்நேர வானிலை & தெளிப்பு வழிகாட்டல்' : 'Foliar spray windows & alerts',
      icon: CloudSun,
      to: '/weather',
    },
    {
      title: isTamil ? 'வேளாண் சந்தை & முடிவு' : 'Market & Sell Decision',
      desc: isTamil ? 'மண்டி விலை போக்கு & நேரடி வர்த்தகம்' : 'Wholesale mandi trends & holding gains',
      icon: Scale,
      to: '/sell-decision',
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* ========================================================
          1. HERO FARM VISUAL (SCREENSHOT 3 EXACT STRUCTURE)
          ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl border border-white/18 p-6 sm:p-8 min-h-[260px] flex flex-col justify-between shadow-2xl">
        {/* High-Res Farm Landscape Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/drone-canopy.jpg"
            alt="Arka-assist Farm Landscape"
            className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.15] scale-105"
          />
          {/* Deep Green Liquid Glass Layered Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D25]/95 via-[#0B6623]/80 to-[#0F3D25]/65 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25 z-10 pointer-events-none" />
        </div>

        {/* Content Layer */}
        <div className="relative z-20 space-y-6">
          
          {/* Top Pill Indicators */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/14 text-white text-xs font-bold border border-white/22 backdrop-blur-md shadow-xs">
              <Sprout className="w-3.5 h-3.5 text-[#5BA33C]" />
              <span>ARKA-ASSIST FARM INTELLIGENCE</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B6623]/60 text-white text-xs font-semibold border border-[#5BA33C]/40 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#5BA33C] animate-pulse" />
              <span>{isOffline ? 'Offline Mode' : 'Online Mode'}</span>
            </div>

            <button
              onClick={toggleOffline}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/18 text-white/90 text-xs font-semibold border border-white/20 backdrop-blur-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-[#D8C7AE]" />
              <span>Test Offline</span>
            </button>
          </div>

          {/* Middle Row: Title & Action CTAs + Health Badge */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl text-white">
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md leading-tight">
                {isTamil ? 'மீண்டும் வருக,' : 'Welcome back,'}
                <br />
                <span className="text-white font-black">
                  {user?.name || 'VSBCETC [CSE PROJECT]!'}
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-medium">
                {isTamil
                  ? 'ஆர்கா-அசிஸ்ட் — பல்நோக்கு AI அடிப்படையிலான பண்ணை நுண்ணறிவு மற்றும் முடிவு ஆதரவு அமைப்பு'
                  : 'Arka-assist — A Multimodal AI-Based Farm Intelligence and Decision Support System'}
              </p>

              <div className="flex items-center gap-2 pt-1 text-xs text-[#D8C7AE] font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#C46F52]" />
                <span>Coimbatore, Tamil Nadu • 4.5 Acres (Clay Loam) • 4 Active Parcels</span>
              </div>
            </div>

            {/* CTAs & Vitality Index */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              
              {/* Analyze My Farm Button */}
              <Link
                to="/multimodal"
                className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs bg-[#0B6623] hover:bg-[#0d7529] text-white border border-white/25 shadow-glass transition-all hover:scale-105 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                  <Sprout className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-left">
                  <span className="block text-[9px] uppercase tracking-wider text-[#D8C7AE]">Instant AI Scan</span>
                  <span className="block text-xs font-black">{isTamil ? 'பண்ணை ஆய்வு' : 'Analyze My Farm'}</span>
                </div>
              </Link>

              {/* Speak to Arka-assist Voice Button */}
              <button
                onClick={() => setVoiceModalOpen(true)}
                type="button"
                className="flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs bg-white/12 hover:bg-white/20 text-white border border-white/20 shadow-glass backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-[#5BA33C]/30 flex items-center justify-center">
                  <Mic className="w-3.5 h-3.5 text-[#5BA33C]" />
                </div>
                <div className="text-left">
                  <span className="block text-[9px] uppercase tracking-wider text-[#D8C7AE]">Voice Companion</span>
                  <span className="block text-xs font-black">{isTamil ? 'குரல் பேசுங்கள்' : 'Speak to Arka-assist'}</span>
                </div>
              </button>

              {/* Overall Farm Health Score Pill */}
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#082314]/80 border border-white/20 backdrop-blur-md shadow-glass">
                <div className="text-center">
                  <div className="text-2xl font-black font-mono text-white leading-none">
                    {farmHealth?.overall_health_score || 83}
                  </div>
                  <div className="text-[10px] text-[#D8C7AE] font-mono font-bold mt-0.5">/ 100</div>
                </div>
                <div className="border-l border-white/18 pl-3 text-left">
                  <span className="block text-[9px] uppercase tracking-wider text-[#D8C7AE] font-bold">OVERALL FARM HEALTH</span>
                  <span className="inline-flex items-center gap-1 text-xs font-black text-[#5BA33C]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Healthy Farm</span>
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          2. TODAY'S PERSONALIZED ACTION PLAN (SCREENSHOT 3)
          ======================================================== */}
      <div className="glass-dark p-6 rounded-3xl space-y-4 border border-white/14">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0B6623]/30 text-[#5BA33C] flex items-center justify-center border border-[#5BA33C]/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                {isTamil ? 'இன்றைய தனிப்பயனாக்கப்பட்ட செயல் திட்டம்' : "Today's Personalized Action Plan"}
              </h2>
              <p className="text-xs text-[#D8C7AE]">
                {isTamil ? 'உங்கள் மண் மற்றும் பயிர் நிலைக்கு ஏற்ப AI உருவாக்கிய சரிபார்ப்பு பட்டியல்' : 'AI-generated daily checklist tailored for your soil & crop condition'}
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/8 text-[#D8C7AE] border border-white/16">
            <Sparkles className="w-3 h-3 text-[#5BA33C]" />
            <span>AI Priority Matrix</span>
          </span>
        </div>

        {/* 3 Prioritized Glass Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          
          {/* Card 1: HIGH PRIORITY */}
          <div className="glass-primary p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-[#C46F52]/60 transition-all group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-white">
                  HIGH PRIORITY
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C46F52]/30 text-[#F1E8DF] border border-[#C46F52]/50">
                  Critical Mitigation
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium leading-relaxed">
                Field 2: Irrigate canopy zone - thermal readings show 34.1°C moisture stress.
              </p>
            </div>

            <Link
              to="/thermal"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#5BA33C] group-hover:translate-x-0.5 transition-transform"
            >
              <span>Review & Action</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: MEDIUM PRIORITY */}
          <div className="glass-primary p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-[#B8A77A]/60 transition-all group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-white">
                  MEDIUM PRIORITY
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B8A77A]/25 text-[#F1E8DF] border border-[#B8A77A]/40">
                  Nutrient / Soil
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium leading-relaxed">
                Field 4: Inspect soil moisture before activating the evening drip cycle.
              </p>
            </div>

            <Link
              to="/daily-analysis"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#5BA33C] group-hover:translate-x-0.5 transition-transform"
            >
              <span>Review & Action</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: LOW PRIORITY */}
          <div className="glass-primary p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-[#5BA33C]/60 transition-all group">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-white">
                  LOW PRIORITY
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5BA33C]/25 text-[#F1E8DF] border border-[#5BA33C]/40">
                  Market Opportunity
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium leading-relaxed">
                Market: Rice prices trending +6.1% this week. Maintain current storage (WAIT).
              </p>
            </div>

            <Link
              to="/sell-decision"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#5BA33C] group-hover:translate-x-0.5 transition-transform"
            >
              <span>Review & Action</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* ========================================================
          3. ROW OF 4 COMPACT INTELLIGENCE CARDS (SCREENSHOT 3)
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: CURRENT AGRO-CLIMATE */}
        <Link
          to="/weather"
          className="glass-dark p-5 rounded-3xl border border-white/14 hover:border-[#5BA33C]/50 transition-all flex flex-col justify-between space-y-3 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-white/80 font-bold uppercase tracking-wider text-[10px]">
              <CloudSun className="w-3.5 h-3.5 text-[#5BA33C]" />
              <span>CURRENT AGRO-CLIMATE</span>
            </div>
            <span className="text-[#D8C7AE] font-mono text-[11px] font-bold">Coimbatore</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-3xl font-black font-mono text-white">
              {weather?.temp || 28.5}°C
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-400/15 flex items-center justify-center text-amber-300">
              <Sun className="w-6 h-6" />
            </div>
          </div>

          <div className="pt-2 border-t border-white/12 text-[11px] text-[#5BA33C] font-semibold flex items-center gap-1">
            <span>● Optimal Foliar Spray Window Open</span>
          </div>
        </Link>

        {/* Card 2: THERMAL SCAN */}
        <Link
          to="/thermal"
          className="glass-dark p-5 rounded-3xl border border-white/14 hover:border-[#C46F52]/50 transition-all flex flex-col justify-between space-y-3 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-white/80 font-bold uppercase tracking-wider text-[10px]">
              <Flame className="w-3.5 h-3.5 text-[#C46F52]" />
              <span>THERMAL SCAN</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5BA33C]/20 text-[#5BA33C] border border-[#5BA33C]/40">
              Low Stress
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-3xl font-black font-mono text-white">
              34.1°C
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#C46F52]/15 flex items-center justify-center text-[#C46F52]">
              <Flame className="w-6 h-6" />
            </div>
          </div>

          <div className="pt-2 border-t border-white/12 text-[11px] text-[#D8C7AE] font-medium">
            Field 2 (Cotton) ΔT: -1.8°C
          </div>
        </Link>

        {/* Card 3: MARKET PRICE */}
        <Link
          to="/market"
          className="glass-dark p-5 rounded-3xl border border-white/14 hover:border-[#5BA33C]/50 transition-all flex flex-col justify-between space-y-3 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-white/80 font-bold uppercase tracking-wider text-[10px]">
              <Store className="w-3.5 h-3.5 text-[#B8A77A]" />
              <span>MARKET PRICE</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5BA33C]/20 text-[#5BA33C] border border-[#5BA33C]/40">
              +6.1% ↑
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-3xl font-black font-mono text-white">
              ₹2,350
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#5BA33C]/15 flex items-center justify-center text-[#5BA33C]">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="pt-2 border-t border-white/12 text-[11px] text-[#D8C7AE] font-medium">
            Rice (Paddy) / Quintal
          </div>
        </Link>

        {/* Card 4: SELL / WAIT */}
        <Link
          to="/sell-decision"
          className="glass-dark p-5 rounded-3xl border border-white/14 hover:border-[#5BA33C]/50 transition-all flex flex-col justify-between space-y-3 group cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-white/80 font-bold uppercase tracking-wider text-[10px]">
              <Scale className="w-3.5 h-3.5 text-[#8A9660]" />
              <span>SELL / WAIT</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-[#D8C7AE] border border-white/16 font-mono">
              74% AI Conf.
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-3xl font-black tracking-tight text-[#5BA33C] font-mono">
              WAIT
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#0B6623]/25 flex items-center justify-center text-[#5BA33C]">
              <Scale className="w-6 h-6" />
            </div>
          </div>

          <div className="pt-2 border-t border-white/12 text-[11px] text-[#D8C7AE] font-medium">
            Hold 7–10 Days For Peak
          </div>
        </Link>

      </div>

      {/* ========================================================
          4. OPERATIONAL DECISION MODULES (PRESERVED)
          ======================================================== */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
              {isTamil ? 'முக்கிய விவசாய செயல்பாட்டு தொகுப்புகள்' : 'Operational Decision Suites'}
            </h2>
            <p className="text-xs text-[#D8C7AE]">Integrated Multimodal Agriculture AI Pipeline</p>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-bold text-[#D8C7AE] font-mono tracking-wider">
            PLAN → GROW → MONITOR → ANALYZE → DECIDE → SELL
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {commandModules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <Link
                key={idx}
                to={mod.to}
                className="glass-dark p-5 rounded-3xl border border-white/12 hover:border-[#0B6623] transition-all duration-300 hover:shadow-glass hover:-translate-y-0.5 group flex items-start gap-4 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#0B6623]/25 text-[#5BA33C] border border-[#5BA33C]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-[#5BA33C] transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-[#D8C7AE] leading-relaxed font-medium">
                    {mod.desc}
                  </p>
                </div>
              </Link>
            );
          })}
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
