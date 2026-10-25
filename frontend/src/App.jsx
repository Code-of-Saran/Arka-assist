import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { OfflineProvider, useOffline } from './context/OfflineContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CropRecommendation from './pages/CropRecommendation';
import DiseaseDetection from './pages/DiseaseDetection';
import WeatherPage from './pages/WeatherPage';
import SchemesPage from './pages/SchemesPage';
import ChatbotPage from './pages/ChatbotPage';
import WorkflowPage from './pages/WorkflowPage';
import ProfilePage from './pages/ProfilePage';
import ThermalAnalysisPage from './pages/ThermalAnalysisPage';
import MultimodalPage from './pages/MultimodalPage';
import DailyAnalysisPage from './pages/DailyAnalysisPage';
import MarketDashboardPage from './pages/MarketDashboardPage';
import SellWaitPage from './pages/SellWaitPage';
import MarketplacePage from './pages/MarketplacePage';
import BuyerMatchingPage from './pages/BuyerMatchingPage';
import Farm3DPage from './pages/Farm3DPage';

import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, AlertTriangle } from 'lucide-react';

const OfflineNotificationBanner = () => {
  const { isOffline } = useOffline();
  const { t } = useLanguage();

  if (!isOffline) return null;

  return (
    <div className="bg-gradient-to-r from-sell to-sell-dark text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm border-b border-sell-dark/20 transition-all animate-fade-in z-50">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>{t('offline_banner_text')}</span>
    </div>
  );
};

const pageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.995 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -8, scale: 0.995, transition: { duration: 0.2, ease: 'easeIn' } }
};

const AppLayout = ({ children, isPublic = false }) => {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-white transition-colors duration-300">
      <OfflineNotificationBanner />
      <Navbar />

      {isPublic || isLanding || isLogin ? (
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 w-full"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      ) : (
        <div className="flex-1 w-full flex flex-col lg:flex-row">
          <Sidebar />
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex-1 p-4 sm:p-6 lg:p-7 min-w-0 overflow-y-auto w-full"
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
      )}

      <Footer />
    </div>
  );
};


function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <OfflineProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public Landing & Login */}
                <Route
                  path="/"
                  element={
                    <AppLayout isPublic={true}>
                      <LandingPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <AppLayout isPublic={true}>
                      <LoginPage />
                    </AppLayout>
                  }
                />

                {/* Protected Modules */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crop-recommendation"
                  element={
                    <AppLayout>
                      <CropRecommendation />
                    </AppLayout>
                  }
                />
                <Route
                  path="/disease-detection"
                  element={
                    <AppLayout>
                      <DiseaseDetection />
                    </AppLayout>
                  }
                />
                <Route
                  path="/weather"
                  element={
                    <AppLayout>
                      <WeatherPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/schemes"
                  element={
                    <AppLayout>
                      <SchemesPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/assistant"
                  element={
                    <AppLayout>
                      <ChatbotPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/workflow"
                  element={
                    <AppLayout>
                      <WorkflowPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/farm-3d"
                  element={
                    <AppLayout>
                      <Farm3DPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/thermal"
                  element={
                    <AppLayout>
                      <ThermalAnalysisPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/multimodal"
                  element={
                    <AppLayout>
                      <MultimodalPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/daily-analysis"
                  element={
                    <AppLayout>
                      <DailyAnalysisPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/market"
                  element={
                    <AppLayout>
                      <MarketDashboardPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/sell-decision"
                  element={
                    <AppLayout>
                      <SellWaitPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/marketplace"
                  element={
                    <AppLayout>
                      <MarketplacePage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/buyer-matching"
                  element={
                    <AppLayout>
                      <BuyerMatchingPage />
                    </AppLayout>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ProfilePage />
                      </AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </AuthProvider>
        </OfflineProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
