import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const LoginPage = () => {
  const { t, language } = useLanguage();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('farmer');
  const [password, setPassword] = useState('arka-assist');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const res = login(username, password, false);
      setLoading(false);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error || 'Invalid credentials');
      }
    }, 400);
  };

  const handleDemoLogin = () => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      login('farmer', 'arka-assist', true);
      setLoading(false);
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        
        {/* Main Card */}
        <div className="bg-white/90 dark:bg-darkbg-card/90 rounded-3xl p-6 sm:p-8 border border-cream-300 dark:border-darkbg-border shadow-soft-lg backdrop-blur-md">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-600 to-leaf-500 flex items-center justify-center mx-auto mb-4 shadow-glow-green text-white">
              <Sprout className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-cream-50 tracking-tight">
              {t('login_title')}
            </h1>
            <p className="text-xs sm:text-sm text-earth-700 dark:text-darkbg-muted mt-1.5">
              {t('login_subtitle')}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-earth-800 dark:text-cream-100 uppercase tracking-wider mb-1.5">
                {t('login_username')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-earth-500 dark:text-darkbg-muted">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. farmer"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-earth-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-earth-800 dark:text-cream-100 uppercase tracking-wider mb-1.5">
                {t('login_password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-earth-500 dark:text-darkbg-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-earth-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-forest-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-earth-500 dark:text-darkbg-muted hover:text-earth-800 dark:hover:text-cream-100"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-white bg-forest-700 hover:bg-forest-800 shadow-soft transition-all text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>{t('login_btn')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cream-300 dark:border-darkbg-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-darkbg-card px-2 text-earth-500 dark:text-darkbg-muted font-bold">
                Or One-Click Demo
              </span>
            </div>
          </div>

          {/* Instant Demo Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-forest-900 dark:text-cream-100 bg-leaf-100 dark:bg-darkbg-surface hover:bg-leaf-200 dark:hover:bg-darkbg-border border border-leaf-300 dark:border-forest-700/60 shadow-sm transition-all text-sm flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-forest-600 dark:text-leaf-400" />
            <span>{t('login_demo_btn')}</span>
          </button>

          {/* Credentials Hint */}
          <div className="mt-5 text-center text-xs text-earth-600 dark:text-darkbg-muted bg-cream-100 dark:bg-darkbg-base p-2.5 rounded-xl border border-cream-200 dark:border-darkbg-border">
            {t('login_credentials_hint')}
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
