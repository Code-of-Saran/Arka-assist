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
  Sparkles,
  Users
} from 'lucide-react';

const Sidebar = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const sections = [
    {
      title: isTamil ? 'திட்டமிடல் & நுண்ணறிவு' : 'PLAN & INTELLIGENCE',
      items: [
        { to: '/dashboard', label: isTamil ? 'முகப்பு பலகை' : 'Dashboard', icon: LayoutDashboard },
        { to: '/crop-recommendation', label: isTamil ? 'பயிர் பரிந்துரை' : 'Crop Recommendation', icon: Sprout },
        { to: '/schemes', label: isTamil ? 'அரசு திட்டங்கள்' : 'Government Schemes', icon: BookOpenCheck },
      ]
    },
    {
      title: isTamil ? 'கண்காணிப்பு & பகுப்பாய்வு' : 'MONITOR & ANALYZE',
      items: [
        { to: '/farm-3d', label: isTamil ? '3D டிஜிட்டல் பண்ணை' : '3D Digital Farm Model', icon: Box },
        { to: '/thermal', label: isTamil ? 'கனோபி வெப்ப ஆய்வு' : 'Thermal Crop Imaging', icon: Flame },
        { to: '/multimodal', label: isTamil ? 'பல்நோக்கு AI பகுப்பாய்வு' : 'Multimodal Analysis', icon: Layers },
        { to: '/daily-analysis', label: isTamil ? 'தினசரி பயிர் பகுப்பாய்வு' : 'Daily Crop Analysis', icon: Activity },
        { to: '/disease-detection', label: isTamil ? 'இலை நோய் கண்டறிதல்' : 'Disease Detection', icon: Bug },
        { to: '/weather', label: isTamil ? 'வானிலை & வழிகாட்டல்' : 'Weather & Advisory', icon: CloudSun },
      ]
    },
    {
      title: isTamil ? 'முடிவெடுத்தல் & சந்தை' : 'DECIDE & MARKET',
      items: [
        { to: '/sell-decision', label: isTamil ? 'விற்பனை / காத்திருப்பு' : 'Sell / Wait Decision', icon: Scale },
        { to: '/market', label: isTamil ? 'சந்தை நுண்ணறிவு' : 'Market Intelligence', icon: Store },
        { to: '/marketplace', label: isTamil ? 'பண்ணை சந்தை' : 'Farm Marketplace', icon: Store },
        { to: '/buyer-matching', label: isTamil ? 'AI வாங்குவோர் இணைப்பு' : 'AI Buyer Matching', icon: Users },
        { to: '/assistant', label: isTamil ? 'AI உதவியாளர்' : 'AI Assistant', icon: Bot },
      ]
    },
    {
      title: isTamil ? 'அமைப்பு & சுயவிவரம்' : 'SYSTEM & PROFILE',
      items: [
        { to: '/workflow', label: isTamil ? 'கட்டமைப்பு & செயல்முறை' : 'Architecture & Workflow', icon: GitFork },
        { to: '/profile', label: isTamil ? 'விவசாயி சுயவிவரம்' : 'Farmer Profile', icon: User },
      ]
    }
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col glass-dark border-r border-white/12 p-3.5 min-h-[calc(100vh-4.25rem)] select-none">
      <div className="space-y-4 flex-1 overflow-y-auto pr-1">
        {sections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#B8A77A]">
              {sec.title}
            </div>

            {sec.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#0B6623]/45 border border-[#78B482]/40 text-white font-bold shadow-glass'
                        : 'text-white/80 hover:bg-white/10 hover:text-white border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-[#5BA33C]" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* 9. SIDEBAR AGRICULTURE IMAGE CARD */}
      <div className="mt-3 relative overflow-hidden rounded-2xl border border-white/18 shadow-glass group">
        <img
          src="/assets/images/crop-fields.jpg"
          alt="Smart Farming"
          className="w-full h-20 object-cover object-center filter brightness-[0.52] contrast-[1.15] group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#082314]/95 via-[#0B6623]/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
          <div className="text-[11px] font-black tracking-wider uppercase text-white flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5 text-[#5BA33C]" />
            <span>SMART FARMING</span>
          </div>
          <p className="text-[9.5px] text-[#D8C7AE] font-medium leading-tight">
            {isTamil ? 'துல்லிய பண்ணை நுண்ணறிவு.' : 'Better insights. Higher yield.'}
          </p>
        </div>
      </div>

      {/* Offline Assurance Badge */}
      <div className="mt-2.5 p-2.5 rounded-xl bg-white/5 border border-white/12 text-xs backdrop-blur-md">
        <div className="flex items-center gap-1.5 text-white font-bold mb-0.5 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5BA33C]" />
          <span>Arka-assist Offline Engine</span>
        </div>
        <p className="text-[9.5px] text-[#D8C7AE]/80 leading-tight">
          Local models & knowledge base bundled
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
