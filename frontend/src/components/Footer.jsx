import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Shield, Award } from 'lucide-react';

const Footer = () => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <footer className="w-full glass-dark border-t border-white/10 mt-auto py-6 text-xs text-white/70">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#0B6623] text-white flex items-center justify-center shadow-sm">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-black text-white tracking-tight font-mono">
              ARKA<span className="text-[#5BA33C] font-black">—ASSIST</span>
            </span>
            <span className="text-white/40">—</span>
            <span className="text-[#D8C7AE] text-[11px]">{isTamil ? 'பல்நோக்கு AI விவசாய வழிகாட்டுதல் தளம்' : 'Autonomous Multimodal Farm Decision Support System'}</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span className="flex items-center gap-1.5 text-[#5BA33C]">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-white/90 font-medium">100% Offline-First Architecture</span>
            </span>
            <span className="flex items-center gap-1.5 text-[#D8C7AE]">
              <Award className="w-3.5 h-3.5 text-[#B8A77A]" />
              <span className="text-white/90 font-medium">Agronomic Decision Support</span>
            </span>
          </div>

          <div className="text-center md:text-right text-white/50 text-[11px]">
            <span>© 2026 Arka-assist. {isTamil ? 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' : 'All rights reserved.'}</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
