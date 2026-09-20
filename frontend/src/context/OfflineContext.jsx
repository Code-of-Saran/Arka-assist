import React, { createContext, useContext, useState, useEffect } from 'react';

const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isBackendReachable, setIsBackendReachable] = useState(true);
  const [forcedOffline, setForcedOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial backend ping
    const checkBackend = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const res = await fetch('/api/health', { signal: controller.signal });
        clearTimeout(timeoutId);
        setIsBackendReachable(res.ok);
      } catch (err) {
        setIsBackendReachable(false);
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const isEffectivelyOffline = forcedOffline || !isOnline || !isBackendReachable;

  const toggleForcedOffline = () => {
    setForcedOffline(prev => !prev);
  };

  return (
    <OfflineContext.Provider value={{
      isOnline,
      isBackendReachable,
      isOffline: isEffectivelyOffline,
      forcedOffline,
      toggleForcedOffline
    }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
