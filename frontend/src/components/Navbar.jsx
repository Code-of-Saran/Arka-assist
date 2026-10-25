import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import OfflineBadge from './OfflineBadge';
import VoiceAssistantModal from './VoiceAssistantModal';
import {
  Sprout,
  LayoutDashboard,
  Bug,
  Flame,
  Layers,
  Activity,
  Store,
  Scale,
  CloudSun,
  BookOpenCheck,
  Bot,
  Globe,
  Sun,
  Moon,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
  Mic,
  Users,
  GitFork,
  Box
} from 'lucide-react';

const Navbar = () => {
  const { t, language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { path: '/crop-recommendation', label: t('nav_crop_rec'), icon: Sprout },
    { path: '/farm-3d', label: '3D Farm', icon: Box },
    { path: '/thermal', label: t('nav_thermal'), icon: Flame },
    { path: '/multimodal', label: t('nav_multimodal'), icon: Layers },
    { path: '/daily-analysis', label: t('nav_daily_analysis'), icon: Activity },
    { path: '/disease-detection', label: t('nav_disease_det'), icon: Bug },
    { path: '/weather', label: t('nav_weather'), icon: CloudSun },
    { path: '/sell-decision', label: t('nav_sell_wait'), icon: Scale },
    { path: '/market', label: t('nav_market'), icon: Store },
    { path: '/marketplace', label: t('nav_marketplace'), icon: Store },
    { path: '/buyer-matching', label: 'Buyer Match', icon: Users },
    { path: '/schemes', label: t('nav_schemes'), icon: BookOpenCheck },
    { path: '/assistant', label: t('nav_assistant'), icon: Bot },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand with Green Badge */}
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[#0B6623] border border-white/25 flex items-center justify-center shadow-glass group-hover:scale-105 transition-all text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1 font-mono">
                  ARKA<span className="text-[#5BA33C] font-black">—ASSIST</span>
                </span>
                <span className="block text-[9px] font-bold text-[#D8C7AE] -mt-1 tracking-widest uppercase">
                  {language === 'ta' ? 'பல்நோக்கு AI விவசாயம்' : 'MULTIMODAL FARM INTELLIGENCE'}
                </span>
              </div>
            </Link>

            {/* Desktop Right Controls (Voice, Online/Offline, Tamil, Theme, Profile, Logout) */}
            <div className="hidden md:flex items-center gap-2">
              
              {/* Voice Command Assistant Button */}
              <button
                onClick={() => setVoiceModalOpen(true)}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/18 text-white border border-white/16 transition-all shadow-xs cursor-pointer group"
                title="Voice Assistant (Mic)"
              >
                <Mic className="w-3.5 h-3.5 text-[#5BA33C]" />
                <span>Voice</span>
              </button>

              <OfflineBadge showToggle={true} />

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/18 text-white border border-white/16 transition-all shadow-xs cursor-pointer"
                title="Toggle English / தமிழ்"
              >
                <Globe className="w-3.5 h-3.5 text-[#D8C7AE]" />
                <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
              </button>

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                type="button"
                className="p-2 rounded-full bg-white/10 hover:bg-white/18 text-white border border-white/16 transition-all shadow-xs cursor-pointer"
                title={isDark ? t('theme_light') : t('theme_dark')}
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-[#D8C7AE]" />}
              </button>

              {/* User Profile / Auth State */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2 pl-2 border-l border-white/16">
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isActive('/profile')
                        ? 'bg-[#0B6623]/60 text-white border-[#5BA33C]/50 shadow-glass'
                        : 'bg-white/10 text-white hover:bg-white/18 border-white/16'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-[#5BA33C]" />
                    <span className="truncate max-w-[130px]">{user?.name || 'VSBCETC [CSE PROJ...]'}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    type="button"
                    className="p-1.5 rounded-full text-[#D8C7AE] hover:text-[#C46F52] hover:bg-[#C46F52]/20 transition-colors cursor-pointer"
                    title={t('nav_logout')}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold btn-glass-primary shadow-sm"
                >
                  <LogIn className="w-3.5 h-3.5 text-white" />
                  <span>{t('nav_login')}</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setVoiceModalOpen(true)}
                type="button"
                className="p-2 rounded-full bg-white/10 text-white border border-white/16 cursor-pointer"
              >
                <Mic className="w-4 h-4 text-[#5BA33C]" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-modal border-t border-white/15 px-4 pt-3 pb-6 space-y-2 animate-fade-in max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 pt-1 pb-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                      isActive(link.path)
                        ? 'bg-[#0B6623] text-white shadow-sm'
                        : 'text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-[#5BA33C]" />
                    <span className="truncate">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-white">
              <button
                onClick={toggleLanguage}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15"
              >
                <Globe className="w-3.5 h-3.5 text-[#D8C7AE]" />
                <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
              </button>

              <button
                onClick={toggleTheme}
                type="button"
                className="p-2 rounded-full bg-white/10 border border-white/15 text-white"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
              </button>

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#C46F52]/20 text-[#D8C7AE] border border-[#C46F52]/40"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-1.5 rounded-full bg-[#0B6623] text-white font-bold"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
