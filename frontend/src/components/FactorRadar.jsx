import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const FactorRadar = ({ factors = {} }) => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  const factorList = Object.entries(factors).map(([key, data]) => ({
    key,
    label: isTamil ? (data.label_ta || data.label) : data.label,
    userValue: data.user_value,
    idealValue: data.ideal_value,
    score: data.score || 80,
  }));

  const getScoreColor = (score) => {
    if (score >= 85) return 'bg-emerald-500 text-emerald-700 dark:text-emerald-300';
    if (score >= 65) return 'bg-leaf-500 text-leaf-700 dark:text-leaf-300';
    return 'bg-amber-500 text-amber-700 dark:text-amber-300';
  };

  return (
    <div className="bg-white/80 dark:bg-darkbg-card/80 rounded-2xl p-5 border border-cream-300/80 dark:border-darkbg-border shadow-soft">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-cream-200 dark:border-darkbg-border">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-earth-800 dark:text-cream-100">
            {isTamil ? 'மண் மற்றும் தட்பவெப்ப சத்துக்களின் பொருத்தம்' : 'Agronomic Factor Matching Matrix'}
          </h4>
          <p className="text-xs text-earth-600 dark:text-darkbg-muted mt-0.5">
            {isTamil ? 'உள்ளீடு vs பயிருக்கு தேவையான உகந்த அளவு' : 'Actual Input vs Optimal Requirement'}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-forest-700 dark:text-leaf-300 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-forest-500"></span>
            {isTamil ? 'பொருத்தம் %' : 'Match %'}
          </span>
        </div>
      </div>

      <div className="space-y-3.5">
        {factorList.map((item) => (
          <div key={item.key} className="group">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-earth-900 dark:text-cream-50">
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-earth-600 dark:text-darkbg-muted font-mono text-[11px]">
                  {item.userValue} (Ideal: {item.idealValue})
                </span>
                <span className="font-bold text-forest-700 dark:text-leaf-300 w-9 text-right font-mono">
                  {item.score}%
                </span>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-2.5 bg-cream-200 dark:bg-darkbg-surface rounded-full overflow-hidden p-0.5 border border-cream-300/60 dark:border-darkbg-border/60">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  item.score >= 80 ? 'bg-gradient-to-r from-forest-600 to-leaf-500' :
                  item.score >= 60 ? 'bg-gradient-to-r from-leaf-600 to-amber-500' :
                  'bg-gradient-to-r from-amber-600 to-amber-400'
                }`}
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FactorRadar;
