import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import OfflineBadge from './OfflineBadge';
import VoiceAssistantModal from './VoiceAssistantModal';
import {
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  Sprout,
  LayoutDashboard,
  Bug,
  CloudSun,
  BookOpenCheck,
  Bot,
  GitFork,
  User,
  LogOut,
  LogIn,
  Mic,
  Flame,
  Layers,
  Activity,
  Store,
  Box,
  Scale
} from 'lucide-react';

const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { path: '/dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { path: '/crop-recommendation', label: t('nav_crop_rec'), icon: Sprout },
    { path: '/disease-detection', label: t('nav_disease_det'), icon: Bug },
    { path: '/thermal', label: t('nav_thermal'), icon: Flame },
    { path: '/multimodal', label: t('nav_multimodal'), icon: Layers },
    { path: '/daily-analysis', label: t('nav_daily_analysis'), icon: Activity },
    { path: '/farm-3d', label: t('nav_farm_3d'), icon: Box },
    { path: '/weather', label: t('nav_weather'), icon: CloudSun },
    { path: '/market', label: t('nav_market'), icon: Store },
    { path: '/sell-decision', label: t('nav_sell_wait'), icon: Scale },
    { path: '/marketplace', label: t('nav_marketplace'), icon: Store },
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
      <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand */}
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-600 to-leaf-500 flex items-center justify-center shadow-glow-green group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-forest-900 dark:text-cream-100 flex items-center gap-0.5">
                  ARKA<span className="text-leaf-500 font-extrabold">-ASSIST</span>
                </span>
                <span className="block text-[10px] font-semibold text-earth-600 dark:text-leaf-400 -mt-1 tracking-wider uppercase">
                  {language === 'ta' ? 'பல்நோக்கு AI விவசாயம்' : 'Multimodal Farm Intelligence'}
                </span>
              </div>
            </Link>

            {/* Desktop Right Controls (Voice, Language, Dark Mode, Offline Badge, Profile) */}
            <div className="hidden md:flex items-center gap-2.5">
              
              {/* Voice Command Assistant Button */}
              <button
                onClick={() => setVoiceModalOpen(true)}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-forest-100 dark:bg-darkbg-surface hover:bg-forest-600 hover:text-white dark:hover:bg-forest-600 text-forest-800 dark:text-leaf-300 border border-forest-300 dark:border-darkbg-border transition-all shadow-sm"
                title="Voice Assistant (Mic)"
              >
                <Mic className="w-3.5 h-3.5 text-forest-600 dark:text-leaf-400" />
                <span>Voice</span>
              </button>

              <OfflineBadge showToggle={true} />

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-cream-200/80 dark:bg-darkbg-surface hover:bg-cream-300 dark:hover:bg-darkbg-border text-earth-800 dark:text-cream-100 border border-cream-300 dark:border-darkbg-border transition-all"
                title="Toggle English / தமிழ்"
              >
                <Globe className="w-3.5 h-3.5 text-forest-600 dark:text-leaf-400" />
                <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
              </button>

              {/* Dark / Light Mode Toggle */}
              <button
                onClick={toggleTheme}
                type="button"
                className="p-2 rounded-full bg-cream-200/80 dark:bg-darkbg-surface hover:bg-cream-300 dark:hover:bg-darkbg-border text-earth-800 dark:text-cream-100 border border-cream-300 dark:border-darkbg-border transition-all"
                title={isDark ? t('theme_light') : t('theme_dark')}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-forest-700" />}
              </button>

              {/* User Profile / Auth State */}
              {isAuthenticated ? (
                <div className="flex items-center gap-2 pl-2 border-l border-cream-300 dark:border-darkbg-border">
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isActive('/profile')
                        ? 'bg-forest-600 text-white border-forest-600'
                        : 'bg-white dark:bg-darkbg-surface text-earth-800 dark:text-cream-100 border-cream-300 dark:border-darkbg-border hover:border-forest-500'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[130px]">{user?.name || 'Farmer'}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    type="button"
                    className="p-1.5 rounded-full text-earth-600 dark:text-darkbg-muted hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title={t('nav_logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-forest-600 hover:bg-forest-700 text-white shadow-soft transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t('nav_login')}</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setVoiceModalOpen(true)}
                type="button"
                className="p-2 rounded-lg bg-forest-100 dark:bg-darkbg-surface text-forest-800 dark:text-leaf-300"
                title="Voice Assistant"
              >
                <Mic className="w-4 h-4" />
              </button>
              <OfflineBadge showToggle={false} />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
                className="p-2 rounded-lg bg-cream-200 dark:bg-darkbg-surface text-earth-800 dark:text-cream-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-card border-b border-cream-300 dark:border-darkbg-border px-4 pt-2 pb-6 space-y-3 max-h-[85vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-b border-cream-200 dark:border-darkbg-border">
              <button
                onClick={toggleLanguage}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-cream-200 dark:bg-darkbg-surface text-earth-800 dark:text-cream-100"
              >
                <Globe className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
                <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
              </button>
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-cream-200 dark:bg-darkbg-surface text-earth-800 dark:text-cream-100"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-forest-700" />}
                <span>{isDark ? t('theme_light') : t('theme_dark')}</span>
              </button>
            </div>

            <div className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isActive(item.path)
                        ? 'bg-forest-600 text-white font-semibold'
                        : 'text-earth-800 dark:text-cream-100 hover:bg-cream-200 dark:hover:bg-darkbg-surface'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {isAuthenticated ? (
                <div className="pt-2 border-t border-cream-200 dark:border-darkbg-border space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-earth-800 dark:text-cream-100 hover:bg-cream-200 dark:hover:bg-darkbg-surface"
                  >
                    <User className="w-4 h-4" />
                    <span>{t('nav_profile')} ({user?.name})</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('nav_logout')}</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-forest-600 text-white"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('nav_login')}</span>
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
