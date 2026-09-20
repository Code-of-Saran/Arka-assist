import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Heart, Shield, Award } from 'lucide-react';

const Footer = () => {
  const { language } = useLanguage();
  const isTamil = language === 'ta';

  return (
    <footer className="w-full bg-cream-100 dark:bg-darkbg-base border-t border-cream-300 dark:border-darkbg-border mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-earth-600 dark:text-darkbg-muted">
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-forest-600 flex items-center justify-center text-white">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-forest-900 dark:text-cream-100">
              ARKA-ASSIST
            </span>
            <span>—</span>
            <span>{isTamil ? 'பல்நோக்கு AI விவசாய வழிகாட்டுதல் தளம்' : 'A Multimodal AI-Based Farm Intelligence and Decision Support System'}</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-forest-600 dark:text-leaf-400" />
              <span>100% Offline-First Architecture</span>
            </span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Agronomic Decision Support</span>
            </span>
          </div>

          <div className="text-center md:text-right">
            <span>© 2026 Arka-assist. {isTamil ? 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.' : 'A Multimodal AI-Based Farm Intelligence and Decision Support System.'}</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
