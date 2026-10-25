import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getDailyAnalysis } from '../services/api';
import {
  CheckCircle2,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Droplets,
  CloudSun,
  Activity,
  DollarSign
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
    fetchAnalysis(selectedCrop, selectedParcel);
  }, [selectedCrop, selectedParcel]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl min-h-[170px] flex flex-col justify-center border border-white/18">
        <img
          src="/assets/images/drone-canopy.jpg"
          alt="Daily Farm Intelligence"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D25]/95 via-[#0B6623]/85 to-[#0F3D25]/75 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold mb-2 border border-white/25 backdrop-blur-md shadow-xs">
              <Clock className="w-3.5 h-3.5 text-[#5BA33C]" />
              <span>{isTamil ? '24 மணி நேர சுழற்சி பகுப்பாய்வு' : '24-Hour Crop Surveillance'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              {t('daily_analysis_title')}
            </h1>
            <p className="text-xs sm:text-sm text-white/85 mt-1 max-w-2xl leading-relaxed font-medium">
              {t('daily_analysis_subtitle')}
            </p>
          </div>

          {/* Parcel Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedParcel}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedParcel(val);
                if (val === 'Field 1') setSelectedCrop('Rice (Paddy)');
                if (val === 'Field 2') setSelectedCrop('Cotton');
                if (val === 'Field 3') setSelectedCrop('Banana');
                if (val === 'Field 4') setSelectedCrop('Tomato');
              }}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold bg-[#082314]/80 text-white border border-white/25 shadow-glass cursor-pointer outline-none transition-all backdrop-blur-md"
            >
              <option value="Field 1" className="bg-[#0b1a11] text-white">North Parcel (Field 1 - Rice)</option>
              <option value="Field 2" className="bg-[#0b1a11] text-white">East Parcel (Field 2 - Cotton)</option>
              <option value="Field 3" className="bg-[#0b1a11] text-white">South Parcel (Field 3 - Banana)</option>
              <option value="Field 4" className="bg-[#0b1a11] text-white">West Parcel (Field 4 - Tomato)</option>
            </select>
          </div>
        </div>
      </div>

      {analysis && (
        <>
          {/* Status Tag & Location Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 rounded-2xl glass-dark border border-white/12 text-xs">
            <div className="flex items-center gap-2 text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-[#5BA33C]" />
              <span>Intelligence Engine:</span>
              <span className="px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-[#0B6623]/35 text-[#5BA33C] border border-[#5BA33C]/40">
                {analysis.status_type || 'RULE_BASED'}
              </span>
            </div>
            <div className="text-[11px] text-[#D8C7AE] font-medium">
              <span>Location: {analysis.farm_location}</span>
              <span className="mx-2 text-white/30">•</span>
              <span>Crop Stage: {analysis.crop_stage} (Day {analysis.crop_age_days})</span>
            </div>
          </div>

          {/* Status Matrix Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* Overall Score */}
            <div className="p-4 rounded-3xl glass-dark border border-white/12 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8C7AE]">Overall Health</span>
              <div className="text-2xl font-black text-[#5BA33C] font-mono my-1 tracking-tight">
                {analysis.today_crop_status?.overall_crop_health}/100
              </div>
              <span className="text-[10px] font-bold text-[#5BA33C]">Optimal Canopy</span>
            </div>

            {/* Health */}
            <div className="p-4 rounded-3xl glass-dark border border-white/12 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8C7AE]">{t('daily_status_health')}</span>
              <div className="text-base font-black text-white my-1 truncate">
                {isTamil ? analysis.today_crop_status?.health_ta : analysis.today_crop_status?.health}
              </div>
              <span className="text-[10px] text-[#5BA33C] font-bold">Normal Growth</span>
            </div>

            {/* Moisture */}
            <div className="p-4 rounded-3xl glass-dark border border-white/12 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8C7AE]">{t('daily_status_moisture')}</span>
              <div className="text-xl font-black text-white my-1">
                {isTamil ? analysis.today_crop_status?.moisture_ta : analysis.today_crop_status?.moisture}
              </div>
              <span className="text-[10px] text-[#38BDF8] font-bold">48% Root-zone</span>
            </div>

            {/* Stress */}
            <div className="p-4 rounded-3xl glass-dark border border-white/12 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8C7AE]">{t('daily_status_stress')}</span>
              <div className="text-xl font-black text-white my-1">
                {isTamil ? analysis.today_crop_status?.stress_ta : analysis.today_crop_status?.stress}
              </div>
              <span className="text-[10px] text-[#5BA33C] font-bold">ΔT: +1.2°C</span>
            </div>

            {/* Disease Risk */}
            <div className="p-4 rounded-3xl glass-dark border border-white/12 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8C7AE]">{t('daily_status_disease')}</span>
              <div className="text-xl font-black text-white my-1">
                {isTamil ? analysis.today_crop_status?.disease_risk_ta : analysis.today_crop_status?.disease_risk}
              </div>
              <span className="text-[10px] text-[#5BA33C] font-bold">0 Vectors</span>
            </div>

            {/* Spray Window */}
            <div className="p-4 rounded-3xl glass-dark border border-white/12 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8C7AE]">{t('daily_status_spray')}</span>
              <div className="text-sm font-black text-amber-300 my-1">
                {analysis.today_crop_status?.spray_window_hours}
              </div>
              <span className="text-[10px] text-[#5BA33C] font-bold">Suitable</span>
            </div>
          </div>

          {/* Action Plan & Risk Matrix Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Prioritized Checklist (7 Cols) */}
            <div className="lg:col-span-7 glass-dark p-6 rounded-3xl border border-white/14 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5BA33C]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    {t('daily_actions_title')}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#5BA33C] px-2.5 py-0.5 rounded-full bg-white/6 border border-white/12">
                  P1 / P2 / P3 Matrix
                </span>
              </div>

              <div className="space-y-3">
                {analysis.action_plan?.map((act, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/6 border border-white/10 space-y-2 hover:border-[#5BA33C]/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-black uppercase tracking-wider ${
                          act.priority === 'P1'
                            ? 'bg-[#C46F52]/30 text-[#C46F52] border border-[#C46F52]/50'
                            : act.priority === 'P2'
                            ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                            : 'bg-[#5BA33C]/25 text-[#5BA33C] border border-[#5BA33C]/40'
                        }`}>
                          {act.priority}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {isTamil ? act.action_ta : act.action}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#D8C7AE] font-mono">{act.time_window}</span>
                    </div>

                    <p className="text-xs text-white/85 leading-relaxed font-medium">
                      {isTamil ? act.reason_ta : act.reason}
                    </p>

                    <div className="pt-1.5 border-t border-white/8 flex items-center justify-between text-[11px] text-[#D8C7AE]">
                      <span>Impact: <strong className="text-white">{act.impact}</strong></span>
                      <span className="text-[#5BA33C] font-semibold">{act.target_field}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5 Risk Vector Dials (5 Cols) */}
            <div className="lg:col-span-5 glass-dark p-6 rounded-3xl border border-white/14 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#C46F52]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">
                    {t('daily_risks_title')}
                  </h3>
                </div>
                <span className="text-[10px] text-[#D8C7AE] font-mono">5 Threat Dimensions</span>
              </div>

              <div className="space-y-3">
                {analysis.risk_vectors?.map((rk, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/6 border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">
                        {isTamil ? rk.vector_ta : rk.vector}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        rk.severity === 'Low' ? 'bg-[#5BA33C]/25 text-[#5BA33C]' :
                        rk.severity === 'Medium' ? 'bg-amber-500/25 text-amber-300' :
                        'bg-[#C46F52]/25 text-[#C46F52]'
                      }`}>
                        {rk.severity}
                      </span>
                    </div>
                    <p className="text-xs text-[#D8C7AE] leading-relaxed">
                      {isTamil ? rk.explanation_ta : rk.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Multi-Day Vitality Trend Line */}
          <div className="glass-dark p-6 rounded-3xl border border-white/14 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#D8C7AE] block">
                  CROP VITALITY TRAJECTORY
                </span>
                <h3 className="text-base font-black text-white">
                  Temporal Vitality Index (7-Day Evolution)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#5BA33C]">
                Active Tillering Phase
              </span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analysis.trend_history || [
                  { day: 'Day -6', score: 76 },
                  { day: 'Day -5', score: 79 },
                  { day: 'Day -4', score: 81 },
                  { day: 'Day -3', score: 80 },
                  { day: 'Day -2', score: 83 },
                  { day: 'Yesterday', score: 82 },
                  { day: 'Today', score: 83 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#D8C7AE' }} stroke="rgba(255,255,255,0.18)" />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#D8C7AE' }} stroke="rgba(255,255,255,0.18)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(8, 35, 20, 0.95)',
                      borderColor: 'rgba(255,255,255,0.20)',
                      color: '#FFFFFF',
                      borderRadius: '16px',
                      backdropFilter: 'blur(16px)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#5BA33C"
                    strokeWidth={3}
                    dot={{ fill: '#0B6623', stroke: '#5BA33C', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default DailyAnalysisPage;
