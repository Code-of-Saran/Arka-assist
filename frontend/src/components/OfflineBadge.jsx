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
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 border ${
          isOffline
            ? 'bg-sell-DEFAULT/15 text-sell-DEFAULT border-sell-DEFAULT/40 shadow-sm'
            : 'bg-leaf-500/15 text-leaf-700 dark:text-leaf-300 border-leaf-500/35 shadow-sm'
        }`}
        title={isOffline ? t('status_offline') : t('status_online')}
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isOffline ? 'bg-sell-DEFAULT' : 'bg-leaf-500'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isOffline ? 'bg-sell-DEFAULT' : 'bg-leaf-500'
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
          className="text-xs px-2.5 py-1 rounded-full bg-white/70 dark:bg-darkbg-card hover:bg-white text-earth-700 dark:text-darkbg-text transition-all flex items-center gap-1.5 border border-earth-200 dark:border-darkbg-border active:scale-95 shadow-xs"
          title="Toggle Simulated Offline Mode for Testing"
        >
          <RefreshCw className="w-3 h-3 text-forest-500 dark:text-leaf-400" />
          <span>{forcedOffline ? 'Resume Live' : 'Test Offline'}</span>
        </button>
      )}
    </div>
  );
};

export default OfflineBadge;
