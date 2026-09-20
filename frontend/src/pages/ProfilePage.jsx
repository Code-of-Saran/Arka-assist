import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  User,
  MapPin,
  Globe,
  Sprout,
  Maximize2,
  Layers,
  Droplets,
  Save,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  RotateCcw
} from 'lucide-react';

const SOIL_TYPES = [
  'Clay Loam',
  'Deep Black Soil (Regur)',
  'Red Sandy Loam',
  'Alluvial Soil',
  'Coastal Sandy',
  'Laterite Soil'
];

const CROPS_LIST = [
  'Rice (Paddy)',
  'Cotton',
  'Maize (Corn)',
  'Banana',
  'Mango',
  'Sugarcane',
  'Chickpea',
  'Blackgram',
  'Watermelon',
  'Coconut'
];

const IRRIGATION_TYPES = [
  'Drip & Micro-Irrigation',
  'Borewell & Canal Sprinklers',
  'Traditional Flood Basin',
  'Rainfed Farming'
];

const ProfilePage = () => {
  const { t, language } = useLanguage();
  const { user, updateProfile, resetProfile } = useAuth();
  const isTamil = language === 'ta';

  const [formData, setFormData] = useState({
    name: user?.name || 'VSBCETC [CSE PROJECT]',
    location: user?.location || 'Coimbatore, Tamil Nadu',
    farm_size: user?.farm_size || '4.5 Acres',
    soil_type: user?.soil_type || 'Clay Loam',
    primary_crop: user?.primary_crop || 'Rice (Paddy)',
    irrigation: user?.irrigation || 'Drip & Micro-Irrigation'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || 'VSBCETC [CSE PROJECT]',
        location: user.location || 'Coimbatore, Tamil Nadu',
        farm_size: user.farm_size || '4.5 Acres',
        soil_type: user.soil_type || 'Clay Loam',
        primary_crop: user.primary_crop || 'Rice (Paddy)',
        irrigation: user.irrigation || 'Drip & Micro-Irrigation'
      });
    }
  }, [user]);

  const [savedAlert, setSavedAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3500);
  };

  const handleReset = () => {
    const defaulted = resetProfile();
    setFormData({
      name: defaulted.name,
      location: defaulted.location,
      farm_size: defaulted.farm_size,
      soil_type: defaulted.soil_type,
      primary_crop: defaulted.primary_crop,
      irrigation: defaulted.irrigation || 'Drip & Micro-Irrigation'
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft">
        <div className="flex items-center gap-2 text-xs font-bold text-forest-700 dark:text-leaf-400 uppercase tracking-wider mb-1">
          <User className="w-4 h-4" />
          <span>Farmer Profile & Specifications</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-cream-50 tracking-tight">
          {t('profile_title')}
        </h1>
        <p className="text-xs sm:text-sm text-earth-700 dark:text-cream-200/80 mt-1">
          {t('profile_subtitle')}
        </p>
      </div>

      {/* Save Success Alert */}
      {savedAlert && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm flex items-center gap-3 shadow-soft animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">{t('profile_saved_alert')}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Farmer Name */}
          <div>
            <label className="block text-xs font-bold text-earth-800 dark:text-cream-100 uppercase tracking-wider mb-2">
              {t('profile_name')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-earth-500 dark:text-darkbg-muted absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-earth-900 dark:text-cream-50 font-medium focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-earth-800 dark:text-cream-100 uppercase tracking-wider mb-2">
              {t('profile_location')}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-earth-500 dark:text-darkbg-muted absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-earth-900 dark:text-cream-50 font-medium focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>

          {/* Farm Size */}
          <div>
            <label className="block text-xs font-bold text-earth-800 dark:text-cream-100 uppercase tracking-wider mb-2">
              {t('profile_farm_size')}
            </label>
            <div className="relative">
              <Maximize2 className="w-4 h-4 text-earth-500 dark:text-darkbg-muted absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.farm_size}
                onChange={(e) => setFormData({ ...formData, farm_size: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-earth-900 dark:text-cream-50 font-medium focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>

          {/* Dominant Soil Type */}
          <div>
            <label className="block text-xs font-bold text-earth-800 dark:text-cream-100 uppercase tracking-wider mb-2">
              {t('profile_soil_type')}
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 text-earth-500 dark:text-darkbg-muted absolute left-3.5 top-3.5" />
              <select
                value={formData.soil_type}
                onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-earth-900 dark:text-cream-50 font-medium focus:outline-none focus:ring-2 focus:ring-forest-500 cursor-pointer"
              >
                {SOIL_TYPES.map((soil) => (
                  <option key={soil} value={soil}>{soil}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary Crop */}
          <div>
            <label className="block text-xs font-bold text-earth-800 dark:text-cream-100 uppercase tracking-wider mb-2">
              {t('profile_primary_crop')}
            </label>
            <div className="relative">
              <Sprout className="w-4 h-4 text-earth-500 dark:text-darkbg-muted absolute left-3.5 top-3.5" />
              <select
                value={formData.primary_crop}
                onChange={(e) => setFormData({ ...formData, primary_crop: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-earth-900 dark:text-cream-50 font-medium focus:outline-none focus:ring-2 focus:ring-forest-500 cursor-pointer"
              >
                {CROPS_LIST.map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Irrigation Method */}
          <div>
            <label className="block text-xs font-bold text-earth-800 dark:text-cream-100 uppercase tracking-wider mb-2">
              {t('profile_irrigation')}
            </label>
            <div className="relative">
              <Droplets className="w-4 h-4 text-earth-500 dark:text-darkbg-muted absolute left-3.5 top-3.5" />
              <select
                value={formData.irrigation}
                onChange={(e) => setFormData({ ...formData, irrigation: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-earth-900 dark:text-cream-50 font-medium focus:outline-none focus:ring-2 focus:ring-forest-500 cursor-pointer"
              >
                {IRRIGATION_TYPES.map((irr) => (
                  <option key={irr} value={irr}>{irr}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Actions CTA */}
        <div className="pt-4 border-t border-cream-200 dark:border-darkbg-border flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl font-semibold text-earth-700 dark:text-cream-200 bg-cream-200/80 dark:bg-darkbg-surface hover:bg-cream-300 dark:hover:bg-darkbg-border border border-cream-300 dark:border-darkbg-border transition-all text-xs flex items-center gap-1.5"
            title="Reset to default details (VSBCETC [CSE PROJECT])"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-bold text-white bg-forest-700 hover:bg-forest-800 shadow-soft transition-all text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{t('profile_save_btn')}</span>
          </button>
        </div>

      </form>

    </div>
  );
};

export default ProfilePage;

