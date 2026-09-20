import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getDigitalTwinFarm } from '../services/api';
import {
  Box,
  Layers,
  Thermometer,
  Droplets,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Eye,
  RotateCw,
  Compass,
  Sparkles
} from 'lucide-react';

const Farm3DPage = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const [farmData, setFarmData] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState('field-1');
  const [viewAngle, setViewAngle] = useState('isometric'); // 'isometric' | 'top'
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

  const parcels = farmData?.parcels || [];
  const selectedParcel = parcels.find((p) => p.id === selectedFieldId) || parcels[0];

  // 3D Canvas rendering engine (Isometric perspective with dynamic lighting & crop foliage)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || parcels.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Center coordinates
    const centerX = width / 2;
    const centerY = height / 2 - 10;

    // Isometric projection helpers
    const tileW = 140;
    const tileH = 70;
    const tileDepth = 25;

    // 4 Field grid positions: (row, col)
    const fieldPositions = {
      'field-1': { r: 0, c: 0 }, // North
      'field-2': { r: 0, c: 1 }, // East
      'field-3': { r: 1, c: 0 }, // South
      'field-4': { r: 1, c: 1 }  // West
    };

    // Draw Ground baseplate shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 110, 240, 110, 0, 0, Math.PI * 2);
    ctx.fill();

    // Irrigation canal dividers
    const drawCanal = () => {
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      // Main central axis
      ctx.moveTo(centerX - 170, centerY + 20);
      ctx.lineTo(centerX + 170, centerY + 20);
      ctx.stroke();
    };

    // Draw parcels
    parcels.forEach((p) => {
      const pos = fieldPositions[p.id];
      if (!pos) return;

      const isSelected = p.id === selectedFieldId;

      // Isometric position calculation
      const isoX = centerX + (pos.c - pos.r) * (tileW * 0.72);
      const isoY = centerY + (pos.c + pos.r) * (tileH * 0.75) - 30;

      // Elevation lift on selection
      const lift = isSelected ? 16 : 0;
      const yElevated = isoY - lift;

      // Parcel base colors
      let topColor = '#10B981'; // Green
      let leftColor = '#059669';
      let rightColor = '#047857';

      if (p.status_state === 'warning') {
        topColor = '#F59E0B'; // Amber
        leftColor = '#D97706';
        rightColor = '#B45309';
      } else if (p.status_state === 'critical') {
        topColor = '#EF4444'; // Red
        leftColor = '#DC2626';
        rightColor = '#B91C1C';
      }

      if (isSelected) {
        // Highlight stroke
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
      }

      // 1. Top Diamond Face
      ctx.fillStyle = topColor;
      ctx.beginPath();
      ctx.moveTo(isoX, yElevated - tileH / 2);
      ctx.lineTo(isoX + tileW / 2, yElevated);
      ctx.lineTo(isoX, yElevated + tileH / 2);
      ctx.lineTo(isoX - tileW / 2, yElevated);
      ctx.closePath();
      ctx.fill();
      if (isSelected) ctx.stroke();

      // 2. Left 3D Extrusion
      ctx.fillStyle = leftColor;
      ctx.beginPath();
      ctx.moveTo(isoX - tileW / 2, yElevated);
      ctx.lineTo(isoX, yElevated + tileH / 2);
      ctx.lineTo(isoX, yElevated + tileH / 2 + tileDepth);
      ctx.lineTo(isoX - tileW / 2, yElevated + tileDepth);
      ctx.closePath();
      ctx.fill();

      // 3. Right 3D Extrusion
      ctx.fillStyle = rightColor;
      ctx.beginPath();
      ctx.moveTo(isoX, yElevated + tileH / 2);
      ctx.lineTo(isoX + tileW / 2, yElevated);
      ctx.lineTo(isoX + tileW / 2, yElevated + tileDepth);
      ctx.lineTo(isoX, yElevated + tileH / 2 + tileDepth);
      ctx.closePath();
      ctx.fill();

      // 4. Crop Row Furrows (Texturing)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      for (let f = -2; f <= 2; f++) {
        ctx.beginPath();
        ctx.moveTo(isoX - 25 + f * 10, yElevated - 8 + f * 5);
        ctx.lineTo(isoX + 25 + f * 10, yElevated + 12 + f * 5);
        ctx.stroke();
      }

      // 5. Crop Emoji Symbol & Label
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.crop_icon, isoX, yElevated - 4);

      // 6. Parcel Name Banner
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`${p.name.split(' ')[0]} ${p.name.split(' ')[1]}`, isoX, yElevated + 16);

      // 7. Status Pill
      if (isSelected) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.beginPath();
        ctx.roundRect(isoX - 35, yElevated - 36, 70, 18, 9);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(`${p.health_score}% Vitality`, isoX, yElevated - 27);
      }
    });

    drawCanal();

  }, [parcels, selectedFieldId, viewAngle]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl min-h-[160px] flex flex-col justify-center">
        <img
          src="/assets/images/crop-fields.jpg"
          alt="3D Interactive Digital Twin Farm Canvas"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/85 to-forest-950/40 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-500/30 text-leaf-300 text-xs font-bold mb-2 border border-leaf-500/40 backdrop-blur-md">
              <Box className="w-3.5 h-3.5" />
              <span>Interactive Farm Digital Twin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
              {t('farm_3d_title')}
            </h1>
            <p className="text-xs sm:text-sm text-cream-100/90 mt-1 max-w-2xl leading-relaxed font-medium">
              {t('farm_3d_subtitle')}
            </p>
          </div>

        <div className="flex items-center gap-2">
          <Link
            to="/thermal"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-stone-950 shadow-md transition-all"
          >
            <Flame className="w-4 h-4" />
            <span>{isTamil ? 'வெப்ப படம் பார்க்க' : 'Scan Thermal Canopy'}</span>
          </Link>
        </div>
      </div>
    </div>

      {/* Main 3D Model & Parcel Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 3D Canvas Canvas Renderer */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-cream-200 dark:border-darkbg-border">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted">
                {isTamil ? '3D மாதிரி பார்வை' : '3D Spatial Perspective'}
              </span>
              <h3 className="text-base font-bold text-forest-950 dark:text-cream-50">
                {farmData?.farm_metadata?.farm_name || 'Arka-assist Smart Farm (4.5 Acres)'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-earth-500 dark:text-darkbg-muted">
                Coimbatore, TN
              </span>
            </div>
          </div>

          {/* Interactive Canvas */}
          <div className="relative my-4 flex items-center justify-center bg-cream-50/70 dark:bg-darkbg-surface rounded-2xl border border-cream-200 dark:border-darkbg-border overflow-hidden">
            <canvas
              ref={canvasRef}
              width={560}
              height={380}
              className="w-full max-w-[560px] h-auto cursor-pointer"
              onClick={(e) => {
                // Toggle through fields on click
                const ids = ['field-1', 'field-2', 'field-3', 'field-4'];
                const nextIdx = (ids.indexOf(selectedFieldId) + 1) % ids.length;
                setSelectedFieldId(ids[nextIdx]);
              }}
            />

            {/* Click instruction overlay */}
            <div className="absolute bottom-3 left-4 text-[10px] font-medium text-earth-600 dark:text-darkbg-muted bg-white/80 dark:bg-darkbg-card/80 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-cream-200 dark:border-darkbg-border">
              💡 {isTamil ? 'பார்வையை மாற்ற ஏதேனும் நிலத்தை கிளிக் செய்க' : 'Click field parcel in 3D scene to inspect telemetry'}
            </div>
          </div>

          {/* Parcel Switcher Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            {parcels.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedFieldId(p.id)}
                type="button"
                className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                  selectedFieldId === p.id
                    ? 'bg-forest-600 text-white border-forest-600 shadow-sm'
                    : 'bg-cream-100 dark:bg-darkbg-surface text-forest-950 dark:text-cream-50 border-cream-300 dark:border-darkbg-border hover:border-forest-400'
                }`}
              >
                <span>{p.crop_icon}</span>
                <span className="truncate">{p.name.split(' ')[0]} {p.name.split(' ')[1]}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Right Column: Active Parcel Telemetry & Recommendations */}
        {selectedParcel && (
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-5">
              
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted">
                    {t('farm_3d_field_status')}
                  </span>
                  <h3 className="text-xl font-black text-forest-950 dark:text-cream-50 mt-0.5 flex items-center gap-2">
                    <span>{selectedParcel.crop_icon}</span>
                    <span>{isTamil ? selectedParcel.name_ta : selectedParcel.name}</span>
                  </h3>
                  <span className="text-xs text-forest-700 dark:text-leaf-400 font-medium">
                    Crop: <strong>{isTamil ? selectedParcel.crop_ta : selectedParcel.crop}</strong> ({selectedParcel.area})
                  </span>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedParcel.status_state === 'healthy'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    {selectedParcel.status_badge}
                  </span>
                  <div className="text-xl font-black font-mono mt-1 text-forest-950 dark:text-cream-50">
                    {selectedParcel.health_score}/100
                  </div>
                </div>
              </div>

              {/* Telemetry Sensor Dashboard */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                
                {/* Temperature */}
                <div className="p-3 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border space-y-1">
                  <span className="text-earth-500 dark:text-darkbg-muted flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                    <span>Canopy Temp</span>
                  </span>
                  <div className="text-lg font-black text-forest-950 dark:text-cream-50 font-mono">
                    {selectedParcel.telemetry?.temperature_celsius}°C
                  </div>
                  <span className="text-[10px] text-earth-500">
                    {selectedParcel.telemetry?.stress_level}
                  </span>
                </div>

                {/* Soil Moisture */}
                <div className="p-3 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border space-y-1">
                  <span className="text-earth-500 dark:text-darkbg-muted flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                    <span>Soil Moisture</span>
                  </span>
                  <div className="text-lg font-black text-forest-950 dark:text-cream-50 font-mono">
                    {selectedParcel.telemetry?.moisture_pct}%
                  </div>
                  <span className="text-[10px] text-blue-600 font-medium">Volumetric Sensor</span>
                </div>

              </div>

              {/* Agronomic Growth Context */}
              <div className="space-y-2 text-xs pt-2 border-t border-cream-200 dark:border-darkbg-border">
                <div className="flex justify-between">
                  <span className="text-earth-600 dark:text-darkbg-muted">Growth Phenology:</span>
                  <span className="font-bold text-forest-950 dark:text-cream-50">{selectedParcel.growth_stage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-600 dark:text-darkbg-muted">Days After Sowing:</span>
                  <span className="font-bold font-mono text-forest-950 dark:text-cream-50">{selectedParcel.days_after_sowing} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-earth-600 dark:text-darkbg-muted">Nutrient Nitrogen Status:</span>
                  <span className="font-bold text-forest-950 dark:text-cream-50">{selectedParcel.telemetry?.nitrogen_status}</span>
                </div>
              </div>

              {/* Action Plan */}
              <div className="p-4 rounded-xl bg-forest-50 dark:bg-forest-950/40 border border-forest-200 dark:border-forest-800 text-xs space-y-1">
                <span className="font-bold text-forest-900 dark:text-leaf-300 uppercase text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
                  <span>Parcel Action Plan</span>
                </span>
                <p className="text-earth-800 dark:text-cream-100 leading-relaxed font-medium">
                  {selectedParcel.recommended_action}
                </p>
              </div>

              {/* Navigation Jump */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/thermal"
                  className="py-2 px-3 rounded-xl bg-orange-100 text-orange-950 dark:bg-orange-950/40 dark:text-orange-200 text-xs font-bold text-center hover:bg-orange-200 transition-colors block"
                >
                  Thermal Diagnostics
                </Link>
                <Link
                  to="/multimodal"
                  className="py-2 px-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold text-center transition-colors block"
                >
                  Multimodal Scan
                </Link>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default Farm3DPage;
