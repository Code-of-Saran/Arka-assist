import React from 'react';
import { useOffline } from '../context/OfflineContext';
import { useLanguage } from '../context/LanguageContext';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

const OfflineBadge = ({ showToggle = false, className = '' }) => {
  const { isOffline, forcedOffline, toggleForcedOffline } = useOffline();
  const { t } = useLanguage();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border ${
          isOffline
            ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60 shadow-sm'
            : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60'
        }`}
        title={isOffline ? t('status_offline') : t('status_online')}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isOffline ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isOffline ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
          />
        </span>
        {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
        <span>{isOffline ? t('status_offline') : t('status_online')}</span>
      </div>

      {showToggle && (
        <button
          onClick={toggleForcedOffline}
          type="button"
          className="text-xs px-2 py-1 rounded bg-cream-200 dark:bg-darkbg-surface hover:bg-cream-300 dark:hover:bg-darkbg-border text-earth-700 dark:text-earth-300 transition-colors flex items-center gap-1 border border-cream-300 dark:border-darkbg-border"
          title="Toggle Simulated Offline Mode for Testing"
        >
          <RefreshCw className="w-3 h-3" />
          <span>{forcedOffline ? 'Resume Live' : 'Test Offline'}</span>
        </button>
      )}
    </div>
  );
};

export default OfflineBadge;
