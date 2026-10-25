import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getMarketPrices } from '../services/api';
import {
  TrendingUp,
  TrendingDown,
  Store,
  Scale,
  Sparkles,
  ArrowRight,
  Info,
  MapPin
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const MarketDashboardPage = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const [marketData, setMarketData] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getMarketPrices();
        setMarketData(data);
      } catch (err) {
        console.error('Market prices fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  const defaultCommodities = [
    {
      crop_id: 'rice',
      name_en: 'Rice (Paddy - Common)',
      name_ta: 'நெல் (பொன்னி)',
      current_price: 2350,
      price_change_7d_pct: 6.1,
      price_change_dir: 'up',
      mandi: 'Coimbatore Agricultural R...',
      district: 'Coimbatore',
      msp_benchmark: 2183,
      market_arrivals_quintals: 1420,
      demand_status: 'High Demand',
      demand_status_ta: 'அதிக தேவை',
      holding_cost_per_week: 25,
      historical_avg_30d: 2240,
      trend_7d: [
        { day: 'Day -6', price: 2180 },
        { day: 'Day -5', price: 2210 },
        { day: 'Day -4', price: 2235 },
        { day: 'Day -3', price: 2270 },
        { day: 'Day -2', price: 2300 },
        { day: 'Yesterday', price: 2330 },
        { day: 'Today', price: 2350 }
      ]
    },
    {
      crop_id: 'cotton',
      name_en: 'Cotton (Medium Staple)',
      name_ta: 'பருத்தி',
      current_price: 7120,
      price_change_7d_pct: -1.8,
      price_change_dir: 'down',
      mandi: 'Tirupur Cotton Regulated ...',
      district: 'Tirupur',
      msp_benchmark: 6620,
      market_arrivals_quintals: 850,
      demand_status: 'Moderate Demand',
      demand_status_ta: 'மிதமான தேவை',
      holding_cost_per_week: 45,
      historical_avg_30d: 7250,
      trend_7d: [
        { day: 'Day -6', price: 7300 },
        { day: 'Day -5', price: 7280 },
        { day: 'Day -4', price: 7240 },
        { day: 'Day -3', price: 7200 },
        { day: 'Day -2', price: 7180 },
        { day: 'Yesterday', price: 7150 },
        { day: 'Today', price: 7120 }
      ]
    },
    {
      crop_id: 'banana',
      name_en: 'Banana (Grand Naine / Robusta)',
      name_ta: 'வாழை (நேந்திரன்)',
      current_price: 1850,
      price_change_7d_pct: 8.4,
      price_change_dir: 'up',
      mandi: 'Mettupalayam Fruit Market',
      district: 'Coimbatore',
      msp_benchmark: null,
      market_arrivals_quintals: 2100,
      demand_status: 'Very High Demand',
      demand_status_ta: 'மிக அதிக தேவை',
      holding_cost_per_week: 35,
      historical_avg_30d: 1720,
      trend_7d: [
        { day: 'Day -6', price: 1700 },
        { day: 'Day -5', price: 1730 },
        { day: 'Day -4', price: 1760 },
        { day: 'Day -3', price: 1790 },
        { day: 'Day -2', price: 1810 },
        { day: 'Yesterday', price: 1835 },
        { day: 'Today', price: 1850 }
      ]
    },
    {
      crop_id: 'tomato',
      name_en: 'Tomato (Hybrid Red)',
      name_ta: 'தக்காளி (நாட்டு / ஹைபிரிட்)',
      current_price: 2200,
      price_change_7d_pct: 14.5,
      price_change_dir: 'up',
      mandi: 'Oddanchatram Vegetabl...',
      district: 'Dindigul',
      msp_benchmark: null,
      market_arrivals_quintals: 3200,
      demand_status: 'Surge Demand',
      demand_status_ta: 'திடீர் தேவை உயர்வு',
      holding_cost_per_week: 40,
      historical_avg_30d: 1920,
      trend_7d: [
        { day: 'Day -6', price: 1900 },
        { day: 'Day -5', price: 1950 },
        { day: 'Day -4', price: 2020 },
        { day: 'Day -3', price: 2080 },
        { day: 'Day -2', price: 2130 },
        { day: 'Yesterday', price: 2170 },
        { day: 'Today', price: 2200 }
      ]
    },
    {
      crop_id: 'maize',
      name_en: 'Maize (Hybrid Yellow)',
      name_ta: 'மக்காச்சோளம்',
      current_price: 2140,
      price_change_7d_pct: 2.3,
      price_change_dir: 'up',
      mandi: 'Udumalpet Regulated Mar...',
      district: 'Tiruppur',
      msp_benchmark: 2090,
      market_arrivals_quintals: 1650,
      demand_status: 'Steady Demand',
      demand_status_ta: 'நிலையான தேவை',
      holding_cost_per_week: 20,
      historical_avg_30d: 2100,
      trend_7d: [
        { day: 'Day -6', price: 2090 },
        { day: 'Day -5', price: 2100 },
        { day: 'Day -4', price: 2110 },
        { day: 'Day -3', price: 2125 },
        { day: 'Day -2', price: 2130 },
        { day: 'Yesterday', price: 2135 },
        { day: 'Today', price: 2140 }
      ]
    }
  ];

  const commodities = marketData?.commodities || defaultCommodities;
  const activeCommodity = commodities.find((c) => c.crop_id === selectedCrop) || commodities[0];

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* ========================================================
          1. HERO BANNER (SCREENSHOT 1 EXACT STRUCTURE)
          ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl min-h-[170px] flex flex-col justify-center border border-white/18">
        <img
          src="/assets/images/harvest-mandi.jpg"
          alt="Agmarknet Wholesale Mandi Index"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B6623]/95 via-[#0B6623]/82 to-[#0F3D25]/75 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold border border-white/25 backdrop-blur-md shadow-xs">
                <Store className="w-3.5 h-3.5 text-white" />
                <span>Agmarknet Wholesale Mandi Index</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400/25 text-amber-200 border border-amber-400/40 uppercase">
                DEMO DATA
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              {isTamil ? 'தினசரி சந்தை நுண்ணறிவு & மண்டி விலைகள்' : 'Daily Market Intelligence & Mandi Prices'}
            </h1>
            <p className="text-xs sm:text-sm text-white/85 mt-1 max-w-2xl leading-relaxed font-medium">
              {isTamil
                ? 'மொத்த விற்பனை மண்டி விலைகள், 7 நாள் விலை வேகம், சந்தை வரத்து மற்றும் வெளிப்படையான அக்மார்க்நெட் அளவீடுகள்.'
                : 'Wholesale mandi prices, 7-day price momentum, market arrivals, and transparent Agmarknet benchmarks.'}
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/sell-decision"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold btn-glass-accent shadow-glass transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{isTamil ? 'AI விற்பனை ஆலோசனை' : 'AI Sell/Wait Advisor'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. COMMODITY SELECTOR GRID (5 CARDS - SCREENSHOT 1)
          ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {commodities.map((item) => {
          const isSelected = selectedCrop === item.crop_id;
          const isPositive = item.price_change_dir === 'up' || item.price_change_7d_pct > 0;
          return (
            <button
              key={item.crop_id}
              onClick={() => setSelectedCrop(item.crop_id)}
              type="button"
              className={`p-4 rounded-3xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'glass-dark bg-[#0B6623]/40 border-[#5BA33C]/60 shadow-glass'
                  : 'glass-dark hover:border-white/25'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-bold text-white line-clamp-2 leading-tight">
                    {isTamil ? item.name_ta : item.name_en}
                  </span>
                  <span className={`text-[10px] font-mono font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-full shrink-0 ${
                    isPositive ? 'bg-[#5BA33C]/25 text-[#5BA33C] border border-[#5BA33C]/40' : 'bg-[#C46F52]/25 text-[#C46F52] border border-[#C46F52]/40'
                  }`}>
                    {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    <span>{isPositive ? `+${item.price_change_7d_pct}%` : `${item.price_change_7d_pct}%`}</span>
                  </span>
                </div>

                <div className="text-2xl font-black text-white font-mono mt-2 tracking-tight">
                  ₹{item.current_price}
                </div>
                <span className="text-[10px] text-[#D8C7AE] font-medium block -mt-0.5">
                  per quintal
                </span>
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-[#D8C7AE] truncate font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C46F52] shrink-0" />
                <span className="truncate">{item.mandi}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ========================================================
          3. ACTIVE CROP 7-DAY TRAJECTORY & MANDI TELEMETRY (SCREENSHOT 1)
          ======================================================== */}
      {activeCommodity && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: 7-Day Trend Chart */}
          <div className="lg:col-span-7 glass-dark p-6 rounded-3xl space-y-4 border border-white/14">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/12">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D8C7AE] block">
                  7-DAY PRICE TRAJECTORY
                </span>
                <h3 className="text-lg font-black text-white">
                  {isTamil ? activeCommodity.name_ta : activeCommodity.name_en}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-black text-[#5BA33C] block">
                  Current: ₹{activeCommodity.current_price}/qtl
                </span>
                <div className="text-[11px] text-[#D8C7AE] font-mono">
                  30-Day Avg: ₹{activeCommodity.historical_avg_30d || 2240}
                </div>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeCommodity.trend_7d}>
                  <defs>
                    <linearGradient id="marketPriceTrajectoryGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5BA33C" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#5BA33C" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#D8C7AE' }} stroke="rgba(255,255,255,0.18)" />
                  <YAxis domain={['dataMin - 80', 'dataMax + 80']} tick={{ fontSize: 11, fill: '#D8C7AE' }} stroke="rgba(255,255,255,0.18)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(8, 35, 20, 0.95)',
                      borderColor: 'rgba(255,255,255,0.20)',
                      color: '#FFFFFF',
                      borderRadius: '16px',
                      backdropFilter: 'blur(16px)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#5BA33C"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#marketPriceTrajectoryGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 text-xs text-[#D8C7AE] flex items-center justify-between border-t border-white/10">
              <span>Mandi: <strong className="text-white font-semibold">{activeCommodity.mandi}</strong></span>
              <span>District: <strong className="text-white font-semibold">{activeCommodity.district}</strong></span>
            </div>
          </div>

          {/* Right Column: Mandi Trading Telemetry */}
          <div className="lg:col-span-5 glass-dark p-6 rounded-3xl space-y-4 border border-white/14 flex flex-col justify-between">
            
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-white/12">
                <Scale className="w-4 h-4 text-[#5BA33C]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  MANDI TRADING TELEMETRY
                </h3>
              </div>

              {/* 4 Row Items in Subtle Capsules */}
              <div className="space-y-2.5 text-xs pt-3">
                
                {/* Benchmark MSP */}
                <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-between">
                  <span className="text-[#D8C7AE]">Government MSP Benchmark:</span>
                  <span className="font-bold text-white font-mono">
                    {activeCommodity.msp_benchmark ? `₹${activeCommodity.msp_benchmark} / qtl` : '₹2183 / qtl'}
                  </span>
                </div>

                {/* Daily Arrivals */}
                <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-between">
                  <span className="text-[#D8C7AE]">Daily Mandi Arrivals:</span>
                  <span className="font-bold text-white font-mono">
                    {activeCommodity.market_arrivals_quintals || 1420} Quintals
                  </span>
                </div>

                {/* Demand Index */}
                <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-between">
                  <span className="text-[#D8C7AE]">Demand Index:</span>
                  <span className="font-bold text-[#5BA33C]">
                    {isTamil ? activeCommodity.demand_status_ta : (activeCommodity.demand_status || 'High Demand')}
                  </span>
                </div>

                {/* Weekly Holding Cost */}
                <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10 flex items-center justify-between">
                  <span className="text-[#D8C7AE]">Storage / Holding Cost:</span>
                  <span className="font-bold text-[#C46F52] font-mono">
                    ₹{activeCommodity.holding_cost_per_week || 25} / qtl / week
                  </span>
                </div>

              </div>
            </div>

            {/* Action Button: Run AI Sell/Wait Decision */}
            <div className="pt-2">
              <Link
                to={`/sell-decision?crop=${activeCommodity.crop_id}`}
                className="w-full py-3.5 px-4 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2 shadow-glass btn-glass-accent transition-all cursor-pointer block text-white"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{isTamil ? 'விற்பனை முடிவை கணக்கிடுக' : `Run AI Sell/Wait Decision for ${activeCommodity.name_en}`}</span>
              </Link>

              <div className="pt-2 text-[10.5px] text-[#D8C7AE]/75 leading-relaxed flex items-center gap-1.5 font-medium">
                <Info className="w-3.5 h-3.5 text-[#5BA33C] shrink-0" />
                <span>{marketData?.data_source || 'Agmarknet API Wholesale Commodity Feeds'}</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default MarketDashboardPage;
