import React from 'react';

const ConfidenceGauge = ({ value = 0, size = 160, strokeWidth = 12, label = "Confidence", showPercent = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  // Determine color and glow based on score in original agriculture system
  let strokeColor = '#2E7D44'; // Primary Light Green
  let strokeGlow = 'drop-shadow(0 0 8px rgba(46, 125, 68, 0.5))';
  let badgeClass = 'bg-forest-500/15 text-forest-800 dark:text-leaf-300 border-forest-500/30';
  let badgeText = 'Good Confidence';

  if (normalizedValue < 60) {
    strokeColor = '#EA580C'; // Action Orange
    strokeGlow = 'drop-shadow(0 0 8px rgba(234, 88, 12, 0.5))';
    badgeClass = 'bg-sell-DEFAULT/15 text-sell-DEFAULT border-sell-DEFAULT/30';
    badgeText = 'Moderate Match';
  } else if (normalizedValue >= 85) {
    strokeColor = '#5BA33C'; // Leaf Green
    strokeGlow = 'drop-shadow(0 0 10px rgba(91, 163, 60, 0.6))';
    badgeClass = 'bg-leaf-500/15 text-leaf-700 dark:text-leaf-300 border-leaf-500/30';
    badgeText = 'Optimal Match';
  }

  return (
    <div className="flex flex-col items-center justify-center p-5 rounded-3xl glass-card border border-earth-200/80 dark:border-darkbg-border bg-white/60 dark:bg-darkbg-card/60 shadow-glass backdrop-blur-xl">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(223, 211, 188, 0.35)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active progress arc with luminous glow */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{ filter: strokeGlow }}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Central percentage text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black tracking-tight text-[#271D15] dark:text-[#F0F7F2]">
            {normalizedValue}%
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-forest-600 dark:text-leaf-400 mt-0.5">
            {label}
          </span>
        </div>
      </div>

      <div className={`mt-3 px-3.5 py-1 rounded-full text-xs font-semibold border ${badgeClass} shadow-sm backdrop-blur-md`}>
        {badgeText}
      </div>
    </div>
  );
};

export default ConfidenceGauge;
