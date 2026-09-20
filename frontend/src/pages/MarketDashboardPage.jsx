import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getMarketPrices } from '../services/api';
import {
  TrendingUp,
  TrendingDown,
  Store,
  ArrowUpRight,
  ShieldCheck,
  Scale,
  PackageCheck,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  Info
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

  const activeCommodity = marketData?.commodities?.find((c) => c.crop_id === selectedCrop) || marketData?.commodities?.[0];

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl min-h-[180px] flex flex-col justify-center">
        <img
          src="/assets/images/market-produce.jpg"
          alt="Agricultural Market Bazaar Produce"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/85 to-forest-950/40 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 backdrop-blur-md">
                <Store className="w-3.5 h-3.5" />
                <span>Agmarknet Wholesale Mandi Index</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase">
                Demo Data
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
              {t('market_title')}
            </h1>
            <p className="text-xs sm:text-sm text-cream-100/90 mt-1 max-w-2xl leading-relaxed font-medium">
              {t('market_subtitle')}
            </p>
          </div>

          <Link
            to="/sell-decision"
            className="btn-agro-sell self-start sm:self-center flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold shadow-md cursor-pointer hover:scale-105 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isTamil ? 'AI விற்பனை ஆலோசனை' : 'AI Sell/Wait Advisor'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Commodity Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {marketData?.commodities?.map((item) => (
          <button
            key={item.crop_id}
            onClick={() => setSelectedCrop(item.crop_id)}
            type="button"
            className={`p-4 rounded-3xl border text-left transition-all flex flex-col justify-between cursor-pointer card-hover-lift ${
              selectedCrop === item.crop_id
                ? 'bg-forest-50 dark:bg-forest-950/60 border-forest-600 dark:border-leaf-500 shadow-md'
                : 'bg-white dark:bg-darkbg-card border-cream-300 dark:border-darkbg-border hover:border-forest-400'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest-950 dark:text-cream-50">
                  {isTamil ? item.name_ta : item.name_en}
                </span>
                <span className={`text-[10px] font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                  item.price_change_dir === 'up' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                }`}>
                  {item.price_change_dir === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {item.price_change_7d_pct > 0 ? `+${item.price_change_7d_pct}%` : `${item.price_change_7d_pct}%`}
                </span>
              </div>
              <div className="text-xl font-black text-forest-950 dark:text-cream-50 font-mono mt-1">
                ₹{item.current_price}
              </div>
              <span className="text-[10px] text-earth-500 dark:text-darkbg-muted">per quintal</span>
            </div>

            <div className="mt-3 pt-2 border-t border-cream-200 dark:border-darkbg-border text-[10px] text-earth-600 dark:text-darkbg-muted truncate font-medium">
              📍 {item.mandi}
            </div>
          </button>
        ))}
      </div>

      {/* Active Crop Detailed Focus */}
      {activeCommodity && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: 7-Day Trend Chart */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-darkbg-border">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted">
                  {isTamil ? '7 நாள் விலை போக்கு' : '7-Day Price Trajectory'}
                </span>
                <h3 className="text-lg font-black text-forest-950 dark:text-cream-50">
                  {isTamil ? activeCommodity.name_ta : activeCommodity.name_en}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-forest-700 dark:text-leaf-400">
                  Current: ₹{activeCommodity.current_price}/qtl
                </span>
                <div className="text-[11px] text-earth-500 dark:text-darkbg-muted">
                  30-Day Avg: ₹{activeCommodity.historical_avg_30d}
                </div>
              </div>
            </div>

            {/* Area Chart */}
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeCommodity.trend_7d}>
                  <defs>
                    <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E7D44" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2E7D44" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis domain={['dataMin - 100', 'dataMax + 100']} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#2E7D44"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#priceGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 text-xs text-earth-600 dark:text-darkbg-muted flex items-center justify-between border-t border-cream-200 dark:border-darkbg-border">
              <span>Mandi: {activeCommodity.mandi}</span>
              <span className="font-semibold text-forest-700 dark:text-leaf-400">District: {activeCommodity.district}</span>
            </div>
          </div>

          {/* Right Column: Key Mandi Indicators & Quick Decision Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-earth-600 dark:text-darkbg-muted flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
                <span>Mandi Trading Telemetry</span>
              </h3>

              <div className="space-y-3 text-xs">
                
                {/* Benchmark MSP */}
                <div className="p-3.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border flex items-center justify-between">
                  <span className="text-earth-700 dark:text-cream-200">Government MSP Benchmark:</span>
                  <span className="font-bold text-forest-900 dark:text-cream-50 font-mono">
                    {activeCommodity.msp_benchmark ? `₹${activeCommodity.msp_benchmark} / qtl` : 'N/A (Commercial)'}
                  </span>
                </div>

                {/* Daily Arrivals */}
                <div className="p-3.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border flex items-center justify-between">
                  <span className="text-earth-700 dark:text-cream-200">Daily Mandi Arrivals:</span>
                  <span className="font-bold text-forest-900 dark:text-cream-50 font-mono">
                    {activeCommodity.market_arrivals_quintals} Quintals
                  </span>
                </div>

                {/* Demand Status */}
                <div className="p-3.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border flex items-center justify-between">
                  <span className="text-earth-700 dark:text-cream-200">Demand Index:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {isTamil ? activeCommodity.demand_status_ta : activeCommodity.demand_status}
                  </span>
                </div>

                {/* Weekly Holding Cost */}
                <div className="p-3.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border flex items-center justify-between">
                  <span className="text-earth-700 dark:text-cream-200">Storage / Holding Cost:</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400 font-mono">
                    ₹{activeCommodity.holding_cost_per_week} / qtl / week
                  </span>
                </div>

              </div>

              {/* Action Button to Sell/Wait */}
              <Link
                to={`/sell-decision?crop=${activeCommodity.crop_id}`}
                className="btn-agro-market w-full py-3 px-4 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2 shadow-md cursor-pointer block"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{isTamil ? 'விற்பனை முடிவை கணக்கிடுக' : `Run AI Sell/Wait Decision for ${activeCommodity.name_en}`}</span>
              </Link>

              <div className="pt-2 text-[11px] text-earth-500 dark:text-darkbg-muted leading-relaxed flex items-center gap-1.5 font-medium">
                <Info className="w-3.5 h-3.5 text-earth-500 shrink-0" />
                <span>{marketData?.data_source}</span>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default MarketDashboardPage;

