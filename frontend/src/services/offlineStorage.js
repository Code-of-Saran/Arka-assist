/**
 * LocalStorage utilities for saving farmer activities and recommendation history
 */

const STORAGE_KEYS = {
  PREDICTIONS: 'arka_assist_crop_history',
  DISEASES: 'arka_assist_disease_history',
  ACTIVITIES: 'arka_assist_recent_activities'
};

const LEGACY_KEYS = {
  PREDICTIONS: 'agrivision_crop_history',
  DISEASES: 'agrivision_disease_history',
  ACTIVITIES: 'agrivision_recent_activities'
};

const getMigratedItem = (key, legacyKey) => {
  try {
    const current = localStorage.getItem(key);
    if (current) return current;
    const legacy = localStorage.getItem(legacyKey);
    if (legacy) {
      localStorage.setItem(key, legacy);
      localStorage.removeItem(legacyKey);
      return legacy;
    }
  } catch (e) {
    // Ignore storage errors
  }
  return null;
};

export const saveCropPredictionHistory = (prediction) => {
  try {
    const existing = JSON.parse(getMigratedItem(STORAGE_KEYS.PREDICTIONS, LEGACY_KEYS.PREDICTIONS) || '[]');
    const record = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      crop_key: prediction.crop_key,
      crop_name_en: prediction.crop_name_en,
      crop_name_ta: prediction.crop_name_ta,
      confidence: prediction.confidence,
      category: prediction.category
    };
    const updated = [record, ...existing].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify(updated));
    localStorage.removeItem(LEGACY_KEYS.PREDICTIONS);
    
    // Also append to recent activities
    addRecentActivity({
      type: 'crop_recommendation',
      title_en: `Recommended ${prediction.crop_name_en}`,
      title_ta: `${prediction.crop_name_ta} பரிந்துரைக்கப்பட்டது`,
      subtitle: `${prediction.confidence}% confidence`,
      time: 'Just now'
    });
  } catch (e) {
    console.error('Failed to save crop prediction history', e);
  }
};

export const getCropPredictionHistory = () => {
  try {
    return JSON.parse(getMigratedItem(STORAGE_KEYS.PREDICTIONS, LEGACY_KEYS.PREDICTIONS) || '[]');
  } catch (e) {
    return [];
  }
};

export const addRecentActivity = (activity) => {
  try {
    const existing = JSON.parse(getMigratedItem(STORAGE_KEYS.ACTIVITIES, LEGACY_KEYS.ACTIVITIES) || '[]');
    const record = {
      id: Date.now(),
      ...activity,
      timestamp: new Date().toISOString()
    };
    const updated = [record, ...existing].slice(0, 8);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updated));
    localStorage.removeItem(LEGACY_KEYS.ACTIVITIES);
  } catch (e) {
    console.error('Failed to add recent activity', e);
  }
};

export const getRecentActivities = () => {
  try {
    const existing = JSON.parse(getMigratedItem(STORAGE_KEYS.ACTIVITIES, LEGACY_KEYS.ACTIVITIES) || '[]');
    if (existing.length === 0) {
      return [
        {
          id: 1,
          type: 'weather',
          title_en: 'Weather check: Coimbatore',
          title_ta: 'வானிலை சரிபார்ப்பு: கோயம்புத்தூர்',
          subtitle: 'Partly Cloudy, 28.5°C',
          time: '2 hours ago'
        },
        {
          id: 2,
          type: 'crop_recommendation',
          title_en: 'Soil NPK analysis performed',
          title_ta: 'மண் NPK பரிசோதனை செய்யப்பட்டது',
          subtitle: 'Rice (Paddy) Recommended (98.3%)',
          time: '5 hours ago'
        },
        {
          id: 3,
          type: 'disease',
          title_en: 'Tomato foliage scanned',
          title_ta: 'தக்காளி இலை ஸ்கேன் செய்யப்பட்டது',
          subtitle: 'Early Blight Detected (Mild)',
          time: '1 day ago'
        }
      ];
    }
    return existing;
  } catch (e) {
    return [];
  }
};
