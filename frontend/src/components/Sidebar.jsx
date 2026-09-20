import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  LayoutDashboard,
  Sprout,
  Bug,
  CloudSun,
  BookOpenCheck,
  Bot,
  GitFork,
  User,
  ShieldCheck,
  Flame,
  Layers,
  Activity,
  Store,
  Box,
  Scale,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const sections = [
    {
      title: isTamil ? 'திட்டமிடல் & முகப்பு' : 'Plan & Intelligence',
      items: [
        { to: '/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
        { to: '/crop-recommendation', label: t('nav_crop_rec'), icon: Sprout },
        { to: '/schemes', label: t('nav_schemes'), icon: BookOpenCheck },
      ]
    },
    {
      title: isTamil ? 'கண்காணிப்பு & ஆய்வு' : 'Monitor & Analyze',
      items: [
        { to: '/farm-3d', label: t('nav_farm_3d'), icon: Box },
        { to: '/thermal', label: t('nav_thermal'), icon: Flame },
        { to: '/multimodal', label: t('nav_multimodal'), icon: Layers },
        { to: '/daily-analysis', label: t('nav_daily_analysis'), icon: Activity },
        { to: '/disease-detection', label: t('nav_disease_det'), icon: Bug },
        { to: '/weather', label: t('nav_weather'), icon: CloudSun },
      ]
    },
    {
      title: isTamil ? 'முடிவெடுத்தல் & விற்பனை' : 'Decide & Market',
      items: [
        { to: '/sell-decision', label: t('nav_sell_wait'), icon: Scale },
        { to: '/market', label: t('nav_market'), icon: Store },
        { to: '/marketplace', label: t('nav_marketplace'), icon: Store },
        { to: '/buyer-matching', label: t('nav_buyer_matching'), icon: Sparkles },
        { to: '/assistant', label: t('nav_assistant'), icon: Bot },
      ]
    },
    {
      title: isTamil ? 'கணக்கு' : 'System & Profile',
      items: [
        { to: '/workflow', label: t('nav_workflow'), icon: GitFork },
        { to: '/profile', label: t('nav_profile'), icon: User },
      ]
    }
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col bg-white/80 dark:bg-darkbg-card/80 border-r border-cream-300 dark:border-darkbg-border p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        {sections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-earth-500 dark:text-darkbg-muted">
              {sec.title}
            </div>

            {sec.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-forest-700 text-white shadow-sm font-bold'
                        : 'text-earth-800 dark:text-cream-200 hover:bg-forest-50 dark:hover:bg-darkbg-surface hover:text-forest-800 dark:hover:text-leaf-300'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Offline Assurance Badge Card */}
      <div className="mt-4 p-3 rounded-xl bg-forest-50/80 dark:bg-darkbg-surface border border-forest-200/80 dark:border-darkbg-border text-xs">
        <div className="flex items-center gap-1.5 text-forest-800 dark:text-leaf-300 font-bold mb-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-leaf-600 dark:text-leaf-400" />
          <span>Arka-assist Offline Engine</span>
        </div>
        <p className="text-[10px] text-earth-700 dark:text-darkbg-muted leading-relaxed">
          Local models & knowledge base bundled for zero-connectivity farming.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
