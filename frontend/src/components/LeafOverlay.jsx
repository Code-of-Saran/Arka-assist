import React, { useState } from 'react';
import { ShieldAlert, Crosshair, ZoomIn } from 'lucide-react';

const LeafOverlay = ({ imageUrl, boundingBoxes = [], severity = "Moderate", cropName = "Leaf" }) => {
  const [activeBox, setActiveBox] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  // Severity indicator color
  const getSeverityBadge = () => {
    switch (severity.toLowerCase()) {
      case 'healthy':
        return {
          bg: 'bg-emerald-500/20 border-emerald-500 text-emerald-400',
          boxBorder: 'border-emerald-400',
          boxBg: 'bg-emerald-500/15',
          label: 'Healthy Foliage',
          color: '#10B981'
        };
      case 'mild':
        return {
          bg: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
          boxBorder: 'border-yellow-400',
          boxBg: 'bg-yellow-500/20',
          label: 'Mild Infection',
          color: '#EAB308'
        };
      case 'severe':
        return {
          bg: 'bg-rose-500/20 border-rose-500 text-rose-400',
          boxBorder: 'border-rose-400',
          boxBg: 'bg-rose-500/25',
          label: 'Severe Infection',
          color: '#F43F5E'
        };
      default:
        return {
          bg: 'bg-orange-500/20 border-orange-500 text-orange-400',
          boxBorder: 'border-orange-400',
          boxBg: 'bg-orange-500/20',
          label: 'Moderate Infection',
          color: '#F97316'
        };
    }
  };

  const badge = getSeverityBadge();

  return (
    <div className="flex flex-col bg-darkbg-base rounded-2xl overflow-hidden border border-darkbg-border shadow-soft-lg">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-darkbg-card border-b border-darkbg-border text-xs text-darkbg-muted">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-leaf-400" />
          <span className="font-semibold text-cream-100 uppercase tracking-wider">
            CV Visual Diagnostic Overlay
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
              showHeatmap
                ? 'bg-forest-800 text-leaf-300 border-forest-600'
                : 'bg-darkbg-surface text-darkbg-muted border-darkbg-border'
            }`}
          >
            {showHeatmap ? 'Annotations: ON' : 'Annotations: OFF'}
          </button>
        </div>
      </div>

      {/* Image with SVG Annotation Overlay Container */}
      <div className="relative w-full aspect-square max-h-[380px] bg-black/40 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Leaf diagnostic analysis"
            className="w-full h-full object-cover select-none"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-darkbg-muted p-6">
            <ShieldAlert className="w-12 h-12 text-forest-500 mb-2" />
            <p className="text-sm font-medium">No Image Uploaded</p>
          </div>
        )}

        {/* Dynamic Bounding Box Overlay */}
        {showHeatmap && imageUrl && boundingBoxes.map((box, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setActiveBox(idx)}
            onMouseLeave={() => setActiveBox(null)}
            className={`absolute border-2 rounded-lg cursor-pointer transition-all duration-300 ${badge.boxBorder} ${badge.boxBg} ${
              activeBox === idx ? 'scale-[1.02] ring-4 ring-offset-2 ring-white/30 z-20 shadow-glow-leaf' : 'z-10'
            }`}
            style={{
              left: `${box.x}%`,
              top: `${box.y}%`,
              width: `${box.width}%`,
              height: `${box.height}%`,
            }}
          >
            {/* Box Header Label Tag */}
            <div className="absolute -top-7 left-0 px-2 py-0.5 bg-black/85 text-white font-mono text-[10px] rounded backdrop-blur-sm border border-white/20 whitespace-nowrap flex items-center gap-1 shadow">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.color }} />
              <span>{box.label || `Lesion Region ${idx + 1}`}</span>
              <span className="text-leaf-300 font-bold">({Math.round((box.confidence || 0.92) * 100)}%)</span>
            </div>

            {/* Corner Target Marks */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white"></div>
          </div>
        ))}

        {/* Severity Badge Overlay in bottom corner */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${badge.bg}`}>
            ● {badge.label}
          </span>
        </div>
      </div>

      {/* Caption & Instructions */}
      <div className="px-4 py-2.5 bg-darkbg-card/90 text-xs text-darkbg-muted flex items-center justify-between border-t border-darkbg-border">
        <span>Hover box to inspect pathology coordinates</span>
        <span className="font-mono text-[11px] text-cream-200">
          Target: {cropName} ({boundingBoxes.length} Focus Points)
        </span>
      </div>
    </div>
  );
};

export default LeafOverlay;
