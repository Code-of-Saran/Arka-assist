import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  User,
  MapPin,
  Sprout,
  Maximize2,
  Layers,
  Droplets,
  Save,
  CheckCircle2,
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Header */}
      <div className="glass-light p-6 rounded-3xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B6623] uppercase tracking-wider mb-1">
            <User className="w-4 h-4 text-[#0B6623]" />
            <span>Farmer Profile & Specifications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#17351F] tracking-tight">
            {t('profile_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#4A3A30] mt-1 font-medium">
            {t('profile_subtitle')}
          </p>
        </div>
      </div>

      {/* Save Success Alert */}
      {savedAlert && (
        <div className="p-4 rounded-2xl bg-[#0B6623]/15 border border-[#0B6623]/35 text-[#0B6623] text-xs sm:text-sm flex items-center gap-3 shadow-glass animate-fade-in backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-[#0B6623] shrink-0" />
          <span className="font-bold text-[#0B6623]">{t('profile_saved_alert')}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="glass-light p-6 sm:p-8 rounded-3xl space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Farmer Name */}
          <div>
            <label className="block text-xs font-bold text-[#17351F] uppercase tracking-wider mb-2">
              {t('profile_name')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#0B6623] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm glass-input-light text-[#17351F] font-bold focus:outline-none focus:border-[#0B6623] transition-all"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-[#17351F] uppercase tracking-wider mb-2">
              {t('profile_location')}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#0B6623] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm glass-input-light text-[#17351F] font-bold focus:outline-none focus:border-[#0B6623] transition-all"
              />
            </div>
          </div>

          {/* Farm Size */}
          <div>
            <label className="block text-xs font-bold text-[#17351F] uppercase tracking-wider mb-2">
              {t('profile_farm_size')}
            </label>
            <div className="relative">
              <Maximize2 className="w-4 h-4 text-[#0B6623] absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={formData.farm_size}
                onChange={(e) => setFormData({ ...formData, farm_size: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm glass-input-light text-[#17351F] font-bold focus:outline-none focus:border-[#0B6623] transition-all"
              />
            </div>
          </div>

          {/* Dominant Soil Type */}
          <div>
            <label className="block text-xs font-bold text-[#17351F] uppercase tracking-wider mb-2">
              {t('profile_soil_type')}
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 text-[#0B6623] absolute left-3.5 top-3.5" />
              <select
                value={formData.soil_type}
                onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm glass-input-light text-[#17351F] font-bold focus:outline-none focus:border-[#0B6623] cursor-pointer outline-none"
              >
                {SOIL_TYPES.map((soil) => (
                  <option key={soil} value={soil} className="bg-[#765341] text-white">{soil}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary Crop */}
          <div>
            <label className="block text-xs font-bold text-[#17351F] uppercase tracking-wider mb-2">
              {t('profile_primary_crop')}
            </label>
            <div className="relative">
              <Sprout className="w-4 h-4 text-[#0B6623] absolute left-3.5 top-3.5" />
              <select
                value={formData.primary_crop}
                onChange={(e) => setFormData({ ...formData, primary_crop: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm glass-input-light text-[#17351F] font-bold focus:outline-none focus:border-[#0B6623] cursor-pointer outline-none"
              >
                {CROPS_LIST.map((crop) => (
                  <option key={crop} value={crop} className="bg-[#765341] text-white">{crop}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Irrigation Method */}
          <div>
            <label className="block text-xs font-bold text-[#17351F] uppercase tracking-wider mb-2">
              {t('profile_irrigation')}
            </label>
            <div className="relative">
              <Droplets className="w-4 h-4 text-[#0B6623] absolute left-3.5 top-3.5" />
              <select
                value={formData.irrigation}
                onChange={(e) => setFormData({ ...formData, irrigation: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm glass-input-light text-[#17351F] font-bold focus:outline-none focus:border-[#0B6623] cursor-pointer outline-none"
              >
                {IRRIGATION_TYPES.map((irr) => (
                  <option key={irr} value={irr} className="bg-[#765341] text-white">{irr}</option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Actions CTA */}
        <div className="pt-4 border-t border-[#765341]/15 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-2xl font-bold btn-glass-secondary text-[#5F5148] hover:text-[#17351F] transition-all text-xs flex items-center gap-1.5 cursor-pointer"
            title="Reset to default details (VSBCETC [CSE PROJECT])"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#0B6623]" />
            <span>Reset to Default</span>
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl font-bold text-white btn-glass-primary shadow-glass transition-all text-sm flex items-center gap-2 cursor-pointer"
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

