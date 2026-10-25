import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getDigitalTwinFarm } from '../services/api';
import {
  Box,
  Thermometer,
  Droplets,
  CheckCircle2,
  Flame,
  Activity,
  Layers,
  Sparkles,
  MapPin,
  ArrowRight
} from 'lucide-react';

const Farm3DPage = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const [farmData, setFarmData] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState('field-1');
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchTwin = async () => {
      try {
        const res = await getDigitalTwinFarm();
        setFarmData(res.farm_data);
      } catch (err) {
        console.error('Digital twin fetch error:', err);
      }
    };
    fetchTwin();
  }, []);

  const parcels = farmData?.parcels || [
    {
      id: 'field-1',
      name: 'North Parcel (Field 1)',
      crop: 'Rice (Paddy)',
      crop_icon: '🌾',
      area_acres: 1.8,
      avg_canopy_temp_celsius: 28.2,
      temp_status: 'Low (Healthy)',
      soil_moisture_pct: 72,
      growth_stage: 'Active Tillering',
      days_after_sowing: 42,
      nitrogen_status: 'Adequate (80 mg/kg)',
      health_score: 88,
      action_plan: 'Maintain 3 cm standing water level. Scheduled second split of urea for Day 45.',
      status_state: 'normal'
    },
    {
      id: 'field-2',
      name: 'East Parcel (Field 2)',
      crop: 'Cotton (Bt)',
      crop_icon: '🌱',
      area_acres: 1.2,
      avg_canopy_temp_celsius: 34.1,
      temp_status: 'High Deficit',
      soil_moisture_pct: 42,
      growth_stage: 'Square Formation',
      days_after_sowing: 55,
      nitrogen_status: 'Moderate (65 mg/kg)',
      health_score: 74,
      action_plan: 'Schedule 45-min drip cycle at 18:00 to relieve localized canopy thermal hotspot.',
      status_state: 'warning'
    },
    {
      id: 'field-3',
      name: 'South Parcel (Field 3)',
      crop: 'Maize (Hybrid)',
      crop_icon: '🌽',
      area_acres: 0.9,
      avg_canopy_temp_celsius: 29.5,
      temp_status: 'Optimal',
      soil_moisture_pct: 68,
      growth_stage: 'Tasseling',
      days_after_sowing: 48,
      nitrogen_status: 'Optimal (85 mg/kg)',
      health_score: 91,
      action_plan: 'Canopy vigor is optimal. Prepare micronutrient foliar spray in 3 days.',
      status_state: 'normal'
    },
    {
      id: 'field-4',
      name: 'West Parcel (Field 4)',
      crop: 'Vegetables (Tomato)',
      crop_icon: '🍅',
      area_acres: 0.6,
      avg_canopy_temp_celsius: 30.1,
      temp_status: 'Normal',
      soil_moisture_pct: 58,
      growth_stage: 'Flowering',
      days_after_sowing: 38,
      nitrogen_status: 'High (92 mg/kg)',
      health_score: 85,
      action_plan: 'Inspect root-zone moisture before evening fertigation cycle.',
      status_state: 'normal'
    }
  ];

  const selectedParcel = parcels.find((p) => p.id === selectedFieldId) || parcels[0];

  // 3D Canvas rendering engine (Isometric perspective with vibrant agricultural polygons)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || parcels.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2 - 10;

    const tileW = 150;
    const tileH = 75;
    const tileDepth = 26;

    const fieldPositions = {
      'field-1': { r: 0, c: 0 }, // North
      'field-2': { r: 0, c: 1 }, // East
      'field-3': { r: 1, c: 0 }, // South
      'field-4': { r: 1, c: 1 }  // West
    };

    // Ground shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 115, 250, 110, 0, 0, Math.PI * 2);
    ctx.fill();

    // Irrigation canal dividers
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX - 180, centerY + 22);
    ctx.lineTo(centerX + 180, centerY + 22);
    ctx.stroke();

    parcels.forEach((p) => {
      const pos = fieldPositions[p.id];
      if (!pos) return;

      const isSelected = p.id === selectedFieldId;

      const isoX = centerX + (pos.c - pos.r) * (tileW * 0.72);
      const isoY = centerY + (pos.c + pos.r) * (tileH * 0.75) - 30;

      const lift = isSelected ? 16 : 0;
      const yElevated = isoY - lift;

      let topColor = '#1d7a3e';
      let leftColor = '#115228';
      let rightColor = '#0b381b';

      if (p.id === 'field-2') {
        topColor = '#c46f52';
        leftColor = '#9e5239';
        rightColor = '#733722';
      } else if (p.id === 'field-4') {
        topColor = '#d97706';
        leftColor = '#b45309';
        rightColor = '#78350f';
      } else if (p.id === 'field-3') {
        topColor = '#2e854b';
        leftColor = '#1e5e33';
        rightColor = '#134022';
      }

      // Top Diamond Face
      ctx.fillStyle = topColor;
      ctx.beginPath();
      ctx.moveTo(isoX, yElevated - tileH / 2);
      ctx.lineTo(isoX + tileW / 2, yElevated);
      ctx.lineTo(isoX, yElevated + tileH / 2);
      ctx.lineTo(isoX - tileW / 2, yElevated);
      ctx.closePath();
      ctx.fill();

      if (isSelected) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Left Extrusion
      ctx.fillStyle = leftColor;
      ctx.beginPath();
      ctx.moveTo(isoX - tileW / 2, yElevated);
      ctx.lineTo(isoX, yElevated + tileH / 2);
      ctx.lineTo(isoX, yElevated + tileH / 2 + tileDepth);
      ctx.lineTo(isoX - tileW / 2, yElevated + tileDepth);
      ctx.closePath();
      ctx.fill();

      // Right Extrusion
      ctx.fillStyle = rightColor;
      ctx.beginPath();
      ctx.moveTo(isoX, yElevated + tileH / 2);
      ctx.lineTo(isoX + tileW / 2, yElevated);
      ctx.lineTo(isoX + tileW / 2, yElevated + tileDepth);
      ctx.lineTo(isoX, yElevated + tileH / 2 + tileDepth);
      ctx.closePath();
      ctx.fill();

      // Furrows
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.20)';
      ctx.lineWidth = 1.5;
      for (let f = -2; f <= 2; f++) {
        ctx.beginPath();
        ctx.moveTo(isoX - 25 + f * 10, yElevated - 8 + f * 5);
        ctx.lineTo(isoX + 25 + f * 10, yElevated + 12 + f * 5);
        ctx.stroke();
      }

      // Crop Icon
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.crop_icon || '🌱', isoX, yElevated - 4);

      // Parcel Label
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(p.name.split(' ')[0] + ' ' + p.name.split(' ')[1], isoX, yElevated + 16);

      // Vitality Badge Pill
      if (isSelected) {
        ctx.fillStyle = 'rgba(8, 35, 20, 0.95)';
        ctx.beginPath();
        ctx.roundRect(isoX - 42, yElevated - 38, 84, 20, 10);
        ctx.fill();
        ctx.strokeStyle = '#5BA33C';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(`${p.health_score || 88}% Vitality`, isoX, yElevated - 27);
      }
    });

  }, [parcels, selectedFieldId]);

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* ========================================================
          1. HERO BANNER (SCREENSHOT 2 EXACT STRUCTURE)
          ======================================================== */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl min-h-[170px] flex flex-col justify-center border border-white/18">
        <img
          src="/assets/images/crop-fields.jpg"
          alt="3D Digital Twin Farm Model"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.40] contrast-[1.15] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D25]/95 via-[#0B6623]/85 to-[#0F3D25]/75 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold mb-2 border border-white/25 backdrop-blur-md shadow-xs">
              <Box className="w-3.5 h-3.5 text-[#5BA33C]" />
              <span>Interactive Farm Digital Twin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
              {isTamil ? '3D டிஜிட்டல் இரட்டை பண்ணை மாதிரி' : '3D Digital Twin Farm Model'}
            </h1>
            <p className="text-xs sm:text-sm text-white/85 mt-1 max-w-2xl leading-relaxed font-medium">
              {isTamil
                ? 'நேரடி சென்சார் தரவுகள், கனோபி வெப்பநிலை மற்றும் அழுத்த வரைபடங்களுடன் உங்கள் 4.5 ஏக்கர் பண்ணையின் ஊடாடும் 3D மாதிரி.'
                : 'Interactive 3D representation of your 4.5-acre farm parcels with live telemetry, canopy temperatures, and stress overlays.'}
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/thermal"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold btn-glass-accent shadow-glass transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
            >
              <Flame className="w-4 h-4 text-white" />
              <span>{isTamil ? 'வெப்ப படம் பார்க்க' : 'Scan Thermal Canopy'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. MAIN 3D MODEL & FIELD STATUS GRID (SCREENSHOT 2)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 3D SPATIAL PERSPECTIVE */}
        <div className="lg:col-span-7 glass-dark p-6 rounded-3xl flex flex-col justify-between border border-white/14 space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/12">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D8C7AE] block">
                3D SPATIAL PERSPECTIVE
              </span>
              <h3 className="text-base font-black text-white">
                {farmData?.farm_metadata?.farm_name || 'Arka-assist Demo Smart Farm'}
              </h3>
            </div>

            <span className="text-[11px] font-mono font-bold text-[#5BA33C] px-3 py-1 rounded-full bg-white/8 border border-white/16">
              Coimbatore, TN
            </span>
          </div>

          {/* Interactive 3D Canvas Box */}
          <div className="relative flex items-center justify-center bg-[#07160d] rounded-2xl border border-white/12 overflow-hidden shadow-inner min-h-[340px]">
            <canvas
              ref={canvasRef}
              width={560}
              height={360}
              className="w-full max-w-[560px] h-auto cursor-pointer"
              onClick={() => {
                const ids = ['field-1', 'field-2', 'field-3', 'field-4'];
                const nextIdx = (ids.indexOf(selectedFieldId) + 1) % ids.length;
                setSelectedFieldId(ids[nextIdx]);
              }}
            />

            {/* Click tip banner */}
            <div className="absolute bottom-3 left-4 text-[10px] font-semibold text-white/90 bg-black/60 px-3 py-1 rounded-xl backdrop-blur-md border border-white/16">
              💡 {isTamil ? 'பார்வையை மாற்ற ஏதேனும் நிலத்தை கிளிக் செய்க' : 'Click field parcel in 3D scene to inspect telemetry'}
            </div>
          </div>

          {/* 4 Parcel Navigation Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {parcels.map((p) => {
              const isSelected = selectedFieldId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedFieldId(p.id)}
                  type="button"
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B6623] border-[#5BA33C]/60 text-white shadow-glass'
                      : 'bg-white/6 hover:bg-white/12 text-white/80 border-white/12'
                  }`}
                >
                  <span>{p.crop_icon || '🌱'}</span>
                  <span className="truncate">{p.name.split(' ')[0]} Parcel</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Column: FIELD STATUS */}
        <div className="lg:col-span-5 glass-dark p-6 rounded-3xl flex flex-col justify-between border border-white/14 space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/12">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#D8C7AE] block">
                FIELD STATUS
              </span>
              <h2 className="text-xl font-black text-white flex items-center gap-2 mt-0.5">
                <span>{selectedParcel.crop_icon}</span>
                <span>{selectedParcel.name}</span>
              </h2>
              <span className="text-xs text-[#D8C7AE] font-semibold block mt-0.5">
                Crop: {selectedParcel.crop} ({selectedParcel.area_acres} Acres)
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5BA33C] block">
                Optimal Growth
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-[#5BA33C]">
                {selectedParcel.health_score || 88} / 100
              </span>
            </div>
          </div>

          {/* 2 Mini Telemetry Tiles */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            
            {/* Canopy Temp */}
            <div className="p-3.5 rounded-2xl bg-white/6 border border-white/12">
              <div className="flex items-center gap-1.5 text-[#C46F52] font-semibold mb-1">
                <Flame className="w-4 h-4 text-[#C46F52]" />
                <span className="text-[10px] text-[#D8C7AE] uppercase font-bold">Canopy Temp</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {selectedParcel.avg_canopy_temp_celsius}°C
              </div>
              <span className="text-[10px] text-[#5BA33C] font-semibold mt-0.5 block">
                {selectedParcel.temp_status || 'Low (Healthy)'}
              </span>
            </div>

            {/* Soil Moisture */}
            <div className="p-3.5 rounded-2xl bg-white/6 border border-white/12">
              <div className="flex items-center gap-1.5 text-[#38BDF8] font-semibold mb-1">
                <Droplets className="w-4 h-4 text-[#38BDF8]" />
                <span className="text-[10px] text-[#D8C7AE] uppercase font-bold">Soil Moisture</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                {selectedParcel.soil_moisture_pct}%
              </div>
              <span className="text-[10px] text-[#D8C7AE] font-medium mt-0.5 block">
                Volumetric Sensor
              </span>
            </div>

          </div>

          {/* Detailed Key-Value Telemetry */}
          <div className="space-y-2 py-1 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-white/8">
              <span className="text-[#D8C7AE] font-medium">Growth Phenology:</span>
              <span className="text-white font-bold">{selectedParcel.growth_stage || 'Active Tillering'}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/8">
              <span className="text-[#D8C7AE] font-medium">Days After Sowing:</span>
              <span className="text-white font-bold font-mono">{selectedParcel.days_after_sowing || 42} Days</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-white/8">
              <span className="text-[#D8C7AE] font-medium">Nutrient Nitrogen Status:</span>
              <span className="text-white font-bold">{selectedParcel.nitrogen_status || 'Adequate (80 mg/kg)'}</span>
            </div>
          </div>

          {/* PARCEL ACTION PLAN (Green Glass Box) */}
          <div className="p-4 rounded-2xl glass-green border border-[#5BA33C]/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-[#5BA33C]" />
              <span>PARCEL ACTION PLAN</span>
            </div>
            <p className="text-xs text-white/95 leading-relaxed font-medium">
              {selectedParcel.action_plan || selectedParcel.recommended_action || 'Maintain 3 cm standing water level. Scheduled second split of urea for Day 45.'}
            </p>
          </div>

          {/* Action CTAs at bottom */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Link
              to="/thermal"
              className="py-2.5 px-3 rounded-2xl text-xs font-bold btn-glass-accent shadow-glass text-center transition-all hover:scale-105 cursor-pointer"
            >
              <span>Thermal Diagnostics</span>
            </Link>

            <Link
              to="/multimodal"
              className="py-2.5 px-3 rounded-2xl text-xs font-bold btn-glass-primary shadow-glass text-center transition-all hover:scale-105 cursor-pointer"
            >
              <span>Multimodal Scan</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Farm3DPage;
