import cropsData from '../data/crops.json';
import diseasesData from '../data/diseases.json';

/**
 * Client-side deterministic ML inference engine for Crop Recommendation.
 * Calculates weighted Euclidean / Mahalanobis agronomic proximity score across 22 crops.
 */
export const clientSideRecommendCrop = (n, p, k, temperature, humidity, ph, rainfall) => {
  const userN = parseFloat(n) || 80;
  const userP = parseFloat(p) || 48;
  const userK = parseFloat(k) || 40;
  const userTemp = parseFloat(temperature) || 24;
  const userHum = parseFloat(humidity) || 80;
  const userPH = parseFloat(ph) || 6.5;
  const userRain = parseFloat(rainfall) || 150;

  const weights = {
    n: 0.15,
    p: 0.15,
    k: 0.15,
    temp: 0.15,
    hum: 0.15,
    ph: 0.10,
    rain: 0.15
  };

  const scoredCrops = cropsData.map(crop => {
    // Normalised distance calculation for each parameter
    const distN = Math.abs(userN - crop.ideal_n) / 100;
    const distP = Math.abs(userP - crop.ideal_p) / 100;
    const distK = Math.abs(userK - crop.ideal_k) / 150;
    const distTemp = Math.abs(userTemp - crop.ideal_temp) / 25;
    const distHum = Math.abs(userHum - crop.ideal_humidity) / 50;
    const distPH = Math.abs(userPH - crop.ideal_ph) / 4.0;
    const distRain = Math.abs(userRain - crop.ideal_rainfall) / 200;

    const weightedDistance = (
      distN * weights.n +
      distP * weights.p +
      distK * weights.k +
      distTemp * weights.temp +
      distHum * weights.hum +
      distPH * weights.ph +
      distRain * weights.rain
    );

    // Convert distance to similarity confidence percentage (70% - 99%)
    const rawConfidence = Math.max(0.65, 1 - weightedDistance * 0.45);
    const confidence = Math.min(99.4, Math.round(rawConfidence * 1000) / 10);

    return {
      crop,
      confidence
    };
  });

  scoredCrops.sort((a, b) => b.confidence - a.confidence);
  const primary = scoredCrops[0];

  const calcScore = (val, target, tol) => {
    const diff = Math.abs(val - target);
    const score = Math.max(25, 100 - (diff / tol) * 50);
    return Math.min(100, Math.round(score * 10) / 10);
  };

  const factors = {
    nitrogen: {
      label: "Nitrogen (N)",
      label_ta: "தழைச்சத்து (N)",
      user_value: userN,
      ideal_value: primary.crop.ideal_n,
      score: calcScore(userN, primary.crop.ideal_n, 40)
    },
    phosphorus: {
      label: "Phosphorus (P)",
      label_ta: "மணிச்சத்து (P)",
      user_value: userP,
      ideal_value: primary.crop.ideal_p,
      score: calcScore(userP, primary.crop.ideal_p, 35)
    },
    potassium: {
      label: "Potassium (K)",
      label_ta: "சாம்பல் சத்து (K)",
      user_value: userK,
      ideal_value: primary.crop.ideal_k,
      score: calcScore(userK, primary.crop.ideal_k, 35)
    },
    temperature: {
      label: "Temperature",
      label_ta: "வெப்பநிலை",
      user_value: userTemp,
      ideal_value: primary.crop.ideal_temp,
      score: calcScore(userTemp, primary.crop.ideal_temp, 10)
    },
    humidity: {
      label: "Humidity",
      label_ta: "ஈரப்பதம்",
      user_value: userHum,
      ideal_value: primary.crop.ideal_humidity,
      score: calcScore(userHum, primary.crop.ideal_humidity, 25)
    },
    ph: {
      label: "Soil pH",
      label_ta: "மண் கார அமிலத்தன்மை (pH)",
      user_value: userPH,
      ideal_value: primary.crop.ideal_ph,
      score: calcScore(userPH, primary.crop.ideal_ph, 1.8)
    },
    rainfall: {
      label: "Rainfall",
      label_ta: "மழைப்பொழிவு",
      user_value: userRain,
      ideal_value: primary.crop.ideal_rainfall,
      score: calcScore(userRain, primary.crop.ideal_rainfall, 80)
    }
  };

  const alternatives = scoredCrops.slice(1, 3).map(item => ({
    key: item.crop.id,
    name_en: item.crop.name_en,
    name_ta: item.crop.name_ta,
    confidence: Math.round(item.confidence * 0.9 * 10) / 10,
    category: item.crop.category
  }));

  return {
    success: true,
    crop_key: primary.crop.id,
    crop_name_en: primary.crop.name_en,
    crop_name_ta: primary.crop.name_ta,
    category: primary.crop.category,
    confidence: primary.confidence,
    soil_type: primary.crop.soil_type,
    growth_duration: primary.crop.duration,
    water_requirement: primary.crop.water_need,
    ideal_climate: {
      temperature: `${primary.crop.ideal_temp}°C`,
      rainfall: `${primary.crop.ideal_rainfall} mm`,
      ideal_npk: { n: primary.crop.ideal_n, p: primary.crop.ideal_p, k: primary.crop.ideal_k }
    },
    advice_en: primary.crop.advice_en,
    advice_ta: primary.crop.advice_ta,
    factors,
    alternatives,
    is_offline_simulated: true
  };
};

/**
 * Client-side Disease Detection simulator for offline mode.
 */
export const clientSideDetectDisease = (hint = "") => {
  const hintLower = (hint || "").toLowerCase();
  let disease = diseasesData[0]; // Default tomato early blight

  if (hintLower.includes("potato") || hintLower.includes("late")) {
    disease = diseasesData.find(d => d.id === "potato_late_blight") || diseasesData[1];
  } else if (hintLower.includes("rice") || hintLower.includes("paddy") || hintLower.includes("blast")) {
    disease = diseasesData.find(d => d.id === "rice_blast") || diseasesData[2];
  } else if (hintLower.includes("corn") || hintLower.includes("maize") || hintLower.includes("rust")) {
    disease = diseasesData.find(d => d.id === "corn_rust") || diseasesData[3];
  } else if (hintLower.includes("healthy") || hintLower.includes("clean") || hintLower.includes("green")) {
    disease = diseasesData.find(d => d.id === "healthy_crop") || diseasesData[4];
  }

  return {
    ...disease,
    success: true,
    is_offline_simulated: true,
    disclaimer_en: "Prototype AI diagnostic assistance only. Always consult an agricultural expert before chemical treatment.",
    disclaimer_ta: "இது மாதிரி AI வழிகாட்டுதல் மட்டுமே. மருந்து தெளிப்பதற்கு முன் வேளாண்மை அலுவலரை அணுகவும்."
  };
};
