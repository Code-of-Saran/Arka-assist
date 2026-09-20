import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getDailyAnalysis } from '../services/api';
import {
  Calendar,
  Activity,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  Sparkles,
  Droplets,
  CloudSun,
  Thermometer,
  Layers,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const DailyAnalysisPage = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const [selectedCrop, setSelectedCrop] = useState('Rice (Paddy)');
  const [selectedParcel, setSelectedParcel] = useState('Field 1');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalysis = async (crop = selectedCrop, parcel = selectedParcel) => {
    setLoading(true);
    try {
      const data = await getDailyAnalysis(crop, parcel);
      setAnalysis(data);
    } catch (err) {
      console.error('Error fetching daily analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [selectedCrop, selectedParcel]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl min-h-[180px] flex flex-col justify-center">
        <img
          src="/assets/images/crop-fields.jpg"
          alt="Daily Farm Intelligence"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/85 to-forest-950/40 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-500/30 text-leaf-300 text-xs font-bold mb-2 border border-leaf-500/40 backdrop-blur-md">
              <Clock className="w-3.5 h-3.5" />
              <span>{isTamil ? '24 மணி நேர சுழற்சி பகுப்பாய்வு' : '24-Hour Crop Surveillance'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
              {t('daily_analysis_title')}
            </h1>
            <p className="text-xs sm:text-sm text-cream-100/90 mt-1 max-w-2xl leading-relaxed font-medium">
              {t('daily_analysis_subtitle')}
            </p>
          </div>

        {/* Parcel Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedParcel}
            onChange={(e) => {
              setSelectedParcel(e.target.value);
              if (e.target.value === 'Field 1') setSelectedCrop('Rice (Paddy)');
              if (e.target.value === 'Field 2') setSelectedCrop('Cotton');
              if (e.target.value === 'Field 3') setSelectedCrop('Banana');
              if (e.target.value === 'Field 4') setSelectedCrop('Tomato');
            }}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-white dark:bg-darkbg-card text-forest-950 dark:text-cream-50 border border-cream-300 dark:border-darkbg-border shadow-sm cursor-pointer"
          >
            <option value="Field 1">North Parcel (Field 1 - Rice)</option>
            <option value="Field 2">East Parcel (Field 2 - Cotton)</option>
            <option value="Field 3">South Parcel (Field 3 - Banana)</option>
            <option value="Field 4">West Parcel (Field 4 - Tomato)</option>
          </select>
        </div>
      </div>
    </div>

      {analysis && (
        <>
          {/* Yesterday vs Today Progression Comparison Banner */}
          <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-darkbg-border mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-forest-950 dark:text-cream-50 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-leaf-500" />
                <span>{isTamil ? 'நேற்று → இன்று ஒப்பீடு' : 'Yesterday → Today Shift Analysis'}</span>
              </h2>
              <span className="text-xs font-bold text-leaf-600 dark:text-leaf-400">Field 1 (Paddy)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Overall Health Shift */}
              <div className="p-4 rounded-2xl bg-cream-50/80 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-earth-600 dark:text-darkbg-muted uppercase">Health Index</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-earth-500 line-through">78%</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">82%</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              {/* Stress Level Shift */}
              <div className="p-4 rounded-2xl bg-cream-50/80 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-earth-600 dark:text-darkbg-muted uppercase">Crop Stress</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-amber-700 line-through">Medium</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">Low</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
              </div>

              {/* Water Requirement */}
              <div className="p-4 rounded-2xl bg-cream-50/80 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-earth-600 dark:text-darkbg-muted uppercase">Soil Moisture</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-earth-500 line-through">42%</span>
                    <span className="text-xl font-black text-sky-600 dark:text-sky-400 font-mono">48%</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              {/* Canopy Temp Delta */}
              <div className="p-4 rounded-2xl bg-cream-50/80 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-earth-600 dark:text-darkbg-muted uppercase">Canopy Temp ΔT</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-rose-500 line-through">+3.2°C</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">+1.4°C</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
              </div>

            </div>
          </div>

          {/* Status Matrix Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            
            {/* Overall Score */}
            <div className="p-4 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between card-hover-lift">
              <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted">Overall Health</span>
              <div className="text-2xl font-black text-forest-700 dark:text-leaf-400 font-mono my-1">
                {analysis.today_crop_status?.overall_crop_health}/100
              </div>
              <span className="text-[11px] font-semibold text-emerald-600">Optimal Canopy</span>
            </div>

            {/* Health */}
            <div className="p-4 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between card-hover-lift">
              <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted">{t('daily_status_health')}</span>
              <div className="text-lg font-black text-forest-950 dark:text-cream-50 my-1">
                {isTamil ? analysis.today_crop_status?.health_ta : analysis.today_crop_status?.health}
              </div>
              <span className="text-[11px] text-earth-500 dark:text-darkbg-muted">Normal Growth</span>
            </div>

            {/* Stress */}
            <div className="p-4 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between card-hover-lift">
              <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted">{t('daily_status_stress')}</span>
              <div className="text-lg font-black text-forest-950 dark:text-cream-50 my-1">
                {isTamil ? analysis.today_crop_status?.stress_ta : analysis.today_crop_status?.stress}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">Low Burden</span>
            </div>

            {/* Temperature Stress */}
            <div className="p-4 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between card-hover-lift">
              <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted">Thermal Stress</span>
              <div className="text-lg font-black text-amber-600 dark:text-amber-400 my-1">
                {isTamil ? analysis.today_crop_status?.temperature_stress_ta : analysis.today_crop_status?.temperature_stress}
              </div>
              <span className="text-[11px] text-earth-500 dark:text-darkbg-muted">Zone B Hotspot</span>
            </div>

            {/* Water Risk */}
            <div className="p-4 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between card-hover-lift">
              <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted">{t('daily_status_water_risk')}</span>
              <div className="text-lg font-black text-forest-950 dark:text-cream-50 my-1">
                {isTamil ? analysis.today_crop_status?.water_risk_ta : analysis.today_crop_status?.water_risk}
              </div>
              <span className="text-[11px] text-sky-600 font-semibold">Adequate Drip</span>
            </div>

            {/* Weather Risk */}
            <div className="p-4 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between card-hover-lift">
              <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted">{t('daily_status_weather_risk')}</span>
              <div className="text-lg font-black text-amber-600 dark:text-amber-400 my-1">
                {isTamil ? analysis.today_crop_status?.weather_risk_ta : analysis.today_crop_status?.weather_risk}
              </div>
              <span className="text-[11px] text-earth-500 dark:text-darkbg-muted">Humidity 68%</span>
            </div>

          </div>

          {/* Action Tasks & Historical Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Numbered Recommended Action Tasks */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-darkbg-border">
                <h3 className="text-sm font-bold uppercase tracking-wider text-forest-950 dark:text-cream-50 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
                  <span>{t('daily_actions_title')}</span>
                </h3>
                <span className="text-xs text-earth-500 dark:text-darkbg-muted font-mono">4 Scheduled Items</span>
              </div>

              <div className="space-y-3">
                {analysis.today_recommended_actions?.map((item) => (
                  <div
                    key={item.step}
                    className="p-4 rounded-2xl bg-cream-50/70 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border flex items-start gap-3.5"
                  >
                    <span className="w-7 h-7 rounded-xl bg-forest-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      {item.step}
                    </span>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.priority === 'High'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : item.priority === 'Medium'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-leaf-100 text-leaf-800 dark:bg-leaf-950/60 dark:text-leaf-300'
                        }`}>
                          {item.priority} Priority
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-earth-900 dark:text-cream-100 leading-relaxed pt-1">
                        {isTamil ? item.action_ta : item.action_en}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historical Temporal Trend Chart */}
            <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-darkbg-border mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-forest-950 dark:text-cream-50 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
                    <span>7-Day Crop Vitality Progression</span>
                  </h3>
                  <span className="text-xs font-mono font-bold text-forest-700 dark:text-leaf-400">Score Range: 0-100</span>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analysis.historical_trend}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="overall_health"
                        stroke="#2E7D44"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#2E7D44' }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="pt-3 border-t border-cream-200 dark:border-darkbg-border text-xs text-earth-600 dark:text-darkbg-muted flex items-center justify-between">
                <span>Snapshot date: {analysis.date}</span>
                <span className="font-semibold text-forest-700 dark:text-leaf-400">{selectedParcel} ({selectedCrop})</span>
              </div>
            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default DailyAnalysisPage;

