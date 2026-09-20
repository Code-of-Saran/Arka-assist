import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { matchBuyers } from '../services/api';
import {
  Sparkles,
  Building2,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Scale,
  RefreshCw
} from 'lucide-react';

const BuyerMatchingPage = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';
  const [searchParams] = useSearchParams();

  const [crop, setCrop] = useState(searchParams.get('crop') || 'Rice (Paddy)');
  const [quantity, setQuantity] = useState(Number(searchParams.get('qty')) || 45);
  const [price, setPrice] = useState(Number(searchParams.get('price')) || 2400);
  const [district, setDistrict] = useState('Coimbatore');
  const [grade, setGrade] = useState('Grade A+');

  const [matchingData, setMatchingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contactSuccessId, setContactSuccessId] = useState(null);

  const handleMatch = async () => {
    setLoading(true);
    try {
      const data = await matchBuyers({
        crop,
        quantity_quintals: quantity,
        expected_price: price,
        district,
        quality_grade: grade
      });
      setMatchingData(data);
    } catch (err) {
      console.error('Matching error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleMatch();
  }, [crop, quantity, price, district, grade]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-forest-900 via-teal-950 to-stone-900 text-white shadow-soft-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-500/20 text-leaf-300 text-xs font-bold mb-2 border border-leaf-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Procurement Matching Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t('buyer_match_title')}
          </h1>
          <p className="text-xs sm:text-sm text-forest-200 mt-1 max-w-2xl leading-relaxed">
            {t('buyer_match_subtitle')}
          </p>
        </div>

        <button
          onClick={handleMatch}
          type="button"
          className="self-start sm:self-center flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-leaf-600 hover:bg-leaf-700 text-white shadow-md transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{isTamil ? 'மீண்டும் பொருத்துக' : 'Re-calculate Matches'}</span>
        </button>
      </div>

      {/* Matching Parameters Selector */}
      <div className="p-6 rounded-2xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-earth-600 dark:text-darkbg-muted flex items-center justify-between">
          <span>Farmer Offer Criteria for Buyer Matching</span>
          <span className="font-mono text-[11px] text-forest-700 dark:text-leaf-400">Scoring Weight: 100 Pts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-forest-950 dark:text-cream-50">Crop Offered:</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border"
            >
              <option value="Rice (Paddy)">Rice (Paddy)</option>
              <option value="Cotton">Cotton</option>
              <option value="Banana">Banana</option>
              <option value="Tomato">Tomato</option>
              <option value="Maize">Maize</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-forest-950 dark:text-cream-50">Volume (Quintals):</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-forest-950 dark:text-cream-50">Expected Price (₹/qtl):</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-forest-950 dark:text-cream-50">District Proximity:</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border"
            >
              <option value="Coimbatore">Coimbatore</option>
              <option value="Tirupur">Tirupur</option>
              <option value="Erode">Erode</option>
              <option value="Namakkal">Namakkal</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-forest-950 dark:text-cream-50">Quality Grade:</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border"
            >
              <option value="Grade A+">Grade A+ (Export)</option>
              <option value="Grade A">Grade A (Standard)</option>
              <option value="Grade B">Grade B (Processing)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ranked Buyer Matches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-forest-950 dark:text-cream-50 tracking-tight flex items-center gap-2">
            <span>{isTamil ? 'சிறந்த வாங்குவோர் பொருத்தங்கள்' : 'Ranked Institutional Buyer Matches'}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-leaf-300 font-bold">
              {matchingData?.best_buyer_matches?.length || 0} Matches
            </span>
          </h2>
          <span className="text-xs text-earth-500 dark:text-darkbg-muted">{matchingData?.scoring_weights}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matchingData?.best_buyer_matches?.map((buyer, idx) => (
            <div
              key={buyer.buyer_id}
              className="p-6 rounded-2xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between hover:border-forest-500 transition-all space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500 dark:text-darkbg-muted">
                      Rank #{idx + 1}
                    </span>
                    <h3 className="text-base font-bold text-forest-950 dark:text-cream-50 mt-0.5">
                      {buyer.name}
                    </h3>
                    <span className="text-xs text-forest-700 dark:text-leaf-400 font-medium">
                      {buyer.company_type}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-2xl font-black text-forest-700 dark:text-leaf-400 font-mono">
                      {buyer.match_percentage}%
                    </span>
                    <span className="block text-[10px] uppercase font-bold text-earth-500">Match Score</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-cream-200 dark:border-darkbg-border text-xs">
                  <div className="flex items-center gap-1.5 text-earth-700 dark:text-cream-200">
                    <MapPin className="w-3.5 h-3.5 text-forest-600 shrink-0" />
                    <span className="truncate">{buyer.location}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-earth-700 dark:text-cream-200">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Max Price: <strong>{buyer.max_offered_price}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5 text-earth-700 dark:text-cream-200">
                    <Truck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{buyer.pickup_available ? 'On-farm pickup available' : 'Mandi gate delivery required'}</span>
                  </div>
                </div>

                {/* Explainability Highlights */}
                <div className="pt-3 border-t border-cream-200 dark:border-darkbg-border space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-earth-500 tracking-wider block">
                    {t('buyer_match_reason')}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {buyer.highlights?.map((hl, hIdx) => (
                      <span
                        key={hIdx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-cream-100 dark:bg-darkbg-surface text-forest-900 dark:text-cream-200 border border-cream-200 dark:border-darkbg-border"
                      >
                        ✓ {hl}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-cream-200 dark:border-darkbg-border">
                {contactSuccessId === buyer.buyer_id ? (
                  <div className="py-2 px-3 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Procurement Notification Dispatched!</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setContactSuccessId(buyer.buyer_id);
                      setTimeout(() => setContactSuccessId(null), 3000);
                    }}
                    type="button"
                    className="w-full py-2 px-3 rounded-xl bg-forest-600 hover:bg-forest-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>{t('buyer_contact_btn')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default BuyerMatchingPage;
