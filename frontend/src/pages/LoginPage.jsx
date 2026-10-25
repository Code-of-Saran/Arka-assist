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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in-up relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#0B6623]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-[#4F8F5B]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Main Glass Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-glass backdrop-blur-2xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#0B6623]/30 border border-[#0B6623]/40 flex items-center justify-center mx-auto mb-4 text-[#4F8F5B] shadow-glass">
              <Sprout className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t('login_title')}
            </h1>
            <p className="text-xs sm:text-sm text-[#F1E8DF] mt-1.5">
              {t('login_subtitle')}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 p-3 rounded-2xl bg-[#C46F52]/25 border border-[#C46F52]/40 text-white text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#C46F52]" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-[#F1E8DF] uppercase tracking-wider mb-1.5">
                {t('login_username')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4F8F5B]">
                  <User className="w-4 h-4 text-[#4F8F5B]" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. farmer"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#4F8F5B] transition-all font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#F1E8DF] uppercase tracking-wider mb-1.5">
                {t('login_password')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4F8F5B]">
                  <Lock className="w-4 h-4 text-[#4F8F5B]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-2xl text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#4F8F5B] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#D8C7AE] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-2xl font-bold text-white btn-glass-primary shadow-glass transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
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
              <div className="w-full border-t border-white/15"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#765341] px-2 text-[#D8C7AE] font-bold">
                Or One-Click Demo
              </span>
            </div>
          </div>

          {/* Instant Demo Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl font-bold text-white btn-glass-secondary shadow-xs transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#B8A77A]" />
            <span>{t('login_demo_btn')}</span>
          </button>

          {/* Credentials Hint */}
          <div className="mt-5 text-center text-xs text-[#D8C7AE] bg-white/5 p-2.5 rounded-2xl border border-white/10">
            {t('login_credentials_hint')}
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;

