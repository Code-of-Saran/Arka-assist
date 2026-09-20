import React from 'react';

const ConfidenceGauge = ({ value = 0, size = 160, strokeWidth = 12, label = "Confidence", showPercent = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  // Determine color based on score
  let colorClass = '#2E7D44'; // Forest Green
  let textClass = 'text-forest-600 dark:text-leaf-400';
  let badgeText = 'High Confidence';

  if (normalizedValue < 60) {
    colorClass = '#D97706'; // Amber
    textClass = 'text-amber-600 dark:text-amber-400';
    badgeText = 'Moderate Match';
  } else if (normalizedValue >= 85) {
    colorClass = '#165B33';
    textClass = 'text-forest-700 dark:text-leaf-300';
    badgeText = 'Optimal Match';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white/60 dark:bg-darkbg-card/70 rounded-2xl border border-cream-300/80 dark:border-darkbg-border shadow-soft">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-cream-300 dark:text-darkbg-surface"
          />
          {/* Active progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Central percentage text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold tracking-tight ${textClass}`}>
            {normalizedValue}%
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-earth-600 dark:text-darkbg-muted mt-0.5">
            {label}
          </span>
        </div>
      </div>

      <div className="mt-3 px-3 py-1 rounded-full text-xs font-medium bg-forest-50 dark:bg-forest-950/60 text-forest-700 dark:text-leaf-300 border border-forest-200 dark:border-forest-800/60">
        {badgeText}
      </div>
    </div>
  );
};

export default ConfidenceGauge;
