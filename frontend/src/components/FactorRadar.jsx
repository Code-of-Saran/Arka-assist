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

  return (
    <div className="glass-panel rounded-3xl p-6 border border-earth-200/80 dark:border-darkbg-border shadow-glass">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-earth-200/80 dark:border-darkbg-border">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-forest-800 dark:text-leaf-300">
            {isTamil ? 'மண் மற்றும் தட்பவெப்ப சத்துக்களின் பொருத்தம்' : 'Agronomic Factor Matching Matrix'}
          </h4>
          <p className="text-xs text-earth-600 dark:text-darkbg-muted mt-0.5">
            {isTamil ? 'உள்ளீடு vs பயிருக்கு தேவையான உகந்த அளவு' : 'Actual Input vs Optimal Requirement'}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-forest-600 dark:text-leaf-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-leaf-500 shadow-sm"></span>
            {isTamil ? 'பொருத்தம் %' : 'Match %'}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {factorList.map((item) => (
          <div key={item.key} className="group">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-[#271D15] dark:text-[#F0F7F2]">
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-earth-600 dark:text-darkbg-muted font-mono text-[11px]">
                  {item.userValue} (Ideal: {item.idealValue})
                </span>
                <span className="font-bold text-forest-600 dark:text-leaf-400 w-9 text-right font-mono">
                  {item.score}%
                </span>
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full h-2 bg-earth-200/40 dark:bg-darkbg-card rounded-full overflow-hidden p-0.5 border border-earth-200/60 dark:border-darkbg-border">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${
                  item.score >= 80 ? 'bg-gradient-to-r from-leaf-500 to-leaf-400' :
                  item.score >= 60 ? 'bg-gradient-to-r from-market-DEFAULT to-market-light' :
                  'bg-gradient-to-r from-sell to-sell-light'
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
