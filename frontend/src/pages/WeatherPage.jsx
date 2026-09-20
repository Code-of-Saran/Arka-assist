import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getWeather } from '../services/api';
import {
  CloudSun,
  Search,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Thermometer,
  Sparkles,
  Info
} from 'lucide-react';

const POPULAR_DISTRICTS = ['Coimbatore', 'Thanjavur', 'Madurai', 'Chennai', 'Salem', 'Tiruchirappalli'];

const WeatherPage = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const [cityInput, setCityInput] = useState('');
  const [activeCity, setActiveCity] = useState('Coimbatore');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCityWeather = async (city) => {
    setLoading(true);
    setError('');
    try {
      const data = await getWeather(city);
      setWeatherData(data);
      setActiveCity(city);
    } catch (err) {
      setError('Failed to fetch weather forecast');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCityWeather(activeCity);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      fetchCityWeather(cityInput.trim());
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header & Search */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <CloudSun className="w-4 h-4" />
              <span>Agro-Meteorological Intel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-cream-50 tracking-tight">
              {t('weather_title')}
            </h1>
            <p className="text-xs sm:text-sm text-earth-700 dark:text-cream-200/80 mt-1 max-w-xl">
              {t('weather_subtitle')}
            </p>
          </div>

          {/* City Search Bar */}
          <form onSubmit={handleSearch} className="w-full lg:w-96">
            <div className="relative">
              <input
                type="text"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder={t('weather_search_placeholder')}
                className="w-full pl-10 pr-24 py-3 rounded-2xl text-xs sm:text-sm bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-earth-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
              />
              <Search className="w-4 h-4 text-earth-500 dark:text-darkbg-muted absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Quick District Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-cream-200 dark:border-darkbg-border">
          <span className="text-xs font-bold text-earth-600 dark:text-darkbg-muted mr-1">
            Tamil Nadu Districts:
          </span>
          {POPULAR_DISTRICTS.map((dist) => (
            <button
              key={dist}
              type="button"
              onClick={() => fetchCityWeather(dist)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                activeCity.toLowerCase() === dist.toLowerCase()
                  ? 'bg-forest-700 text-white border-forest-700'
                  : 'bg-cream-100 dark:bg-darkbg-surface text-earth-800 dark:text-cream-200 border-cream-300 dark:border-darkbg-border hover:bg-forest-50'
              }`}
            >
              {dist}
            </button>
          ))}
        </div>
      </div>

      {/* Main Weather Content */}
      {weatherData && (
        <div className="space-y-8">
          
          {/* 1. Hero Current Weather Card & Key Agricultural Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Current Conditions Large Banner (7 Cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 text-white shadow-soft-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-leaf-300">
                      {weatherData.state || 'Tamil Nadu'}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black mt-0.5">
                      {weatherData.city}
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 backdrop-blur-md border border-white/20">
                    {weatherData.is_cached_offline ? 'Offline Cached Forecast' : 'Verified Agro Station'}
                  </span>
                </div>

                <div className="flex items-center gap-6 my-6">
                  <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white">
                    {weatherData.temp}°C
                  </div>
                  <div className="border-l border-white/20 pl-6">
                    <div className="text-lg font-bold text-leaf-300">
                      {isTamil ? (weatherData.condition_ta || 'பகுதி மேகமூட்டம்') : weatherData.condition_en}
                    </div>
                    <div className="text-xs text-forest-200 mt-1">
                      Estimated Soil Moisture: <span className="font-semibold text-white">{weatherData.soil_moisture}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric bar */}
              <div className="grid grid-cols-3 gap-3 pt-5 border-t border-white/15 text-xs text-forest-200">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-[10px] uppercase text-forest-300">{t('weather_humidity')}</div>
                    <div className="font-bold text-white text-sm">{weatherData.humidity}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-[10px] uppercase text-forest-300">{t('weather_rain_prob')}</div>
                    <div className="font-bold text-white text-sm">{weatherData.rain_prob}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-teal-400" />
                  <div>
                    <div className="text-[10px] uppercase text-forest-300">{t('weather_wind')}</div>
                    <div className="font-bold text-white text-sm">{weatherData.wind_speed} km/h</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Agricultural Advisories (5 Cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-earth-800 dark:text-cream-100 mb-4 pb-2 border-b border-cream-200 dark:border-darkbg-border flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>{t('weather_advisories_title')}</span>
                </h3>

                <div className="space-y-3">
                  {weatherData.advisories?.map((adv, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border text-xs ${
                        adv.severity === 'danger'
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                          : adv.severity === 'warning'
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                          : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      }`}
                    >
                      <div className="font-bold text-xs mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{isTamil ? adv.title_ta : adv.title_en}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed opacity-90 font-medium">
                        {isTamil ? adv.desc_ta : adv.desc_en}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-cream-200 dark:border-darkbg-border text-[11px] text-earth-500 dark:text-darkbg-muted flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Advisories automatically updated based on rain and wind thresholds.</span>
              </div>
            </div>

          </div>

          {/* 2. Today's Hourly Forecast Matrix */}
          {weatherData.hourly && (
            <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft">
              <h3 className="text-sm font-bold uppercase tracking-wider text-earth-800 dark:text-cream-100 mb-4 pb-2 border-b border-cream-200 dark:border-darkbg-border">
                {t('weather_hourly')}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {weatherData.hourly.map((hour, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200/80 dark:border-darkbg-border text-center space-y-2"
                  >
                    <div className="text-xs font-mono font-bold text-earth-600 dark:text-darkbg-muted">
                      {hour.time}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-cream-200 dark:bg-darkbg-card flex items-center justify-center mx-auto text-amber-500">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div className="text-lg font-black text-forest-950 dark:text-cream-50 font-mono">
                      {hour.temp}°C
                    </div>
                    <div className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-0.5">
                      <CloudRain className="w-3 h-3" />
                      <span>{hour.rain}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. 5-Day Outlook Cards */}
          {weatherData.forecast && (
            <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft">
              <h3 className="text-sm font-bold uppercase tracking-wider text-earth-800 dark:text-cream-100 mb-4 pb-2 border-b border-cream-200 dark:border-darkbg-border flex items-center gap-2">
                <Calendar className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
                <span>{t('weather_5day')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {weatherData.forecast.map((day, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200/80 dark:border-darkbg-border flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-forest-950 dark:text-cream-50">
                        {isTamil ? day.day_ta : day.day_en}
                      </span>
                      <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 flex items-center gap-0.5 font-bold">
                        <CloudRain className="w-3 h-3" />
                        {day.rain}%
                      </span>
                    </div>

                    <div className="my-3">
                      <div className="text-xs font-semibold text-earth-600 dark:text-darkbg-muted">
                        {day.condition}
                      </div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xl font-black text-forest-950 dark:text-cream-50 font-mono">
                          {day.temp_max}°
                        </span>
                        <span className="text-xs font-mono text-earth-500 dark:text-darkbg-muted">
                          / {day.temp_min}°C
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-1.5 rounded-full bg-cream-200 dark:bg-darkbg-card overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-forest-600 to-amber-500 rounded-full" style={{ width: `${day.rain}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default WeatherPage;
