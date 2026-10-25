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
  CheckCircle2,
  Calendar,
  AlertTriangle,
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
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl min-h-[170px] flex flex-col justify-center border border-white/18">
        <img
          src="/assets/images/hero-aerial-farm.jpg"
          alt="Agro-Meteorological Intel"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D25]/95 via-[#0B6623]/82 to-[#0F3D25]/75 z-10 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-20">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold mb-2 border border-white/25 backdrop-blur-md shadow-xs">
              <CloudSun className="w-3.5 h-3.5 text-[#5BA33C]" />
              <span>Agro-Meteorological Intel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {t('weather_title')}
            </h1>
            <p className="text-xs sm:text-sm text-white/85 mt-1 max-w-xl font-medium">
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
                className="w-full pl-10 pr-24 py-3 rounded-2xl text-xs sm:text-sm bg-black/40 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#5BA33C] font-medium transition-all"
              />
              <Search className="w-4 h-4 text-[#D8C7AE] absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-4 py-1.5 rounded-xl text-xs font-bold btn-glass-primary shadow-glass cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Quick District Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/12 relative z-20">
          <span className="text-xs font-bold text-[#D8C7AE] mr-1">
            Tamil Nadu Districts:
          </span>
          {POPULAR_DISTRICTS.map((dist) => (
            <button
              key={dist}
              type="button"
              onClick={() => fetchCityWeather(dist)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer backdrop-blur-md ${
                activeCity.toLowerCase() === dist.toLowerCase()
                  ? 'bg-[#0B6623] text-white border-[#5BA33C]/60 shadow-glass font-bold'
                  : 'bg-white/8 text-white/85 hover:bg-white/16 border-white/14'
              }`}
            >
              {dist}
            </button>
          ))}
        </div>
      </div>

      {/* Main Weather Content */}
      {weatherData && (
        <div className="space-y-6">
          
          {/* Current Weather Card & Key Agricultural Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Current Conditions Large Banner (7 Cols) */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass-dark text-white border border-white/14 shadow-2xl flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#D8C7AE]">
                      {weatherData.state || 'Tamil Nadu'}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black mt-0.5 text-white">
                      {weatherData.city}
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0B6623]/35 backdrop-blur-md border border-[#5BA33C]/40 text-[#5BA33C]">
                    {weatherData.is_cached_offline ? 'Offline Cached Forecast' : 'Verified Agro Station'}
                  </span>
                </div>

                <div className="flex items-center gap-6 my-6">
                  <span className="text-5xl sm:text-6xl font-black font-mono tracking-tighter text-white">
                    {weatherData.current?.temp}°C
                  </span>
                  <div>
                    <div className="text-lg font-black text-white">
                      {weatherData.current?.condition}
                    </div>
                    <div className="text-xs text-[#D8C7AE]">
                      Feels like {weatherData.current?.feels_like}°C • Wind: {weatherData.current?.wind_speed} km/h
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-telemetry bar inside card */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[#D8C7AE] block text-[10px] uppercase font-bold">Relative Humidity</span>
                  <span className="text-base font-black font-mono text-white">{weatherData.current?.humidity}%</span>
                </div>
                <div>
                  <span className="text-[#D8C7AE] block text-[10px] uppercase font-bold">Atmospheric Pressure</span>
                  <span className="text-base font-black font-mono text-white">{weatherData.current?.pressure} hPa</span>
                </div>
                <div>
                  <span className="text-[#D8C7AE] block text-[10px] uppercase font-bold">Precipitation Prob</span>
                  <span className="text-base font-black font-mono text-[#5BA33C]">{weatherData.current?.rain_probability || 10}%</span>
                </div>
              </div>
            </div>

            {/* Right Agricultural Advisory Card (5 Cols) */}
            <div className="lg:col-span-5 glass-dark p-6 rounded-3xl space-y-4 border border-white/14">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#5BA33C]" />
                  <span>Agronomic Advisory (Next 24h)</span>
                </h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10">
                  <span className="font-bold text-[#5BA33C] block mb-1">💧 Irrigation Advice:</span>
                  <p className="text-white/90 leading-relaxed font-medium">
                    {weatherData.advisory?.irrigation || 'Normal micro-irrigation schedule recommended for standing crops.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10">
                  <span className="font-bold text-[#5BA33C] block mb-1">🌿 Foliar Spray Window:</span>
                  <p className="text-white/90 leading-relaxed font-medium">
                    {weatherData.advisory?.spraying || 'Ideal early morning spray window between 06:30 and 09:30 AM.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/6 border border-white/10">
                  <span className="font-bold text-[#C46F52] block mb-1">🌾 Harvest & Field Protection:</span>
                  <p className="text-white/90 leading-relaxed font-medium">
                    {weatherData.advisory?.harvesting || 'Dry conditions favorable for grain drying and mechanical harvesting.'}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* 5-Day Extended Weather Trajectory */}
          <div className="glass-dark p-6 rounded-3xl space-y-4 border border-white/14">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#5BA33C]" />
                <span>5-Day Agro-Meteorological Outlook</span>
              </h3>
              <span className="text-xs text-[#D8C7AE] font-mono font-bold">Updated Hourly</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {weatherData.forecast?.map((f, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/6 border border-white/10 flex flex-col justify-between text-center space-y-2 hover:border-[#5BA33C]/40 transition-colors"
                >
                  <span className="text-xs font-bold text-white">{f.day}</span>
                  <div className="text-2xl my-1">
                    {f.condition.includes('Rain') ? '🌧️' : f.condition.includes('Cloud') ? '⛅' : '☀️'}
                  </div>
                  <div className="text-sm font-black font-mono text-[#5BA33C]">
                    {f.temp_max}°C / {f.temp_min}°C
                  </div>
                  <span className="text-[10px] text-[#D8C7AE] truncate font-medium">{f.condition}</span>
                  <div className="text-[10px] font-bold text-[#38BDF8] pt-1 border-t border-white/8">
                    Rain: {f.rain_probability || '15%'}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default WeatherPage;
