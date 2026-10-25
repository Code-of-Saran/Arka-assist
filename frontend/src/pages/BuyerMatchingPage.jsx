import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { matchBuyers } from '../services/api';
import {
  Sparkles,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Clock,
  Award
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

  const buyersList = matchingData?.matched_buyers || matchingData?.best_buyer_matches || [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header Banner - Liquid Glass & Deep Green Overlay */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-glass min-h-[160px] flex flex-col justify-center border border-white/20 glass-panel">
        <img
          src="/assets/images/harvest-mandi.jpg"
          alt="Transparent Procurement Matching Engine"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B6623]/92 via-[#0B6623]/80 to-[#765341]/85 z-10 pointer-events-none" />
        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-2 border border-white/25 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#4F8F5B]" />
              <span>Transparent Procurement Matching Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t('buyer_match_title')}
            </h1>
            <p className="text-xs sm:text-sm text-[#F1E8DF] mt-1 max-w-2xl leading-relaxed font-medium">
              {t('buyer_match_subtitle')}
            </p>
          </div>

          <button
            onClick={handleMatch}
            type="button"
            className="self-start sm:self-center flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold btn-glass-secondary text-white shadow-glass transition-all cursor-pointer backdrop-blur-md"
          >
            <RefreshCw className={`w-4 h-4 text-white ${loading ? 'animate-spin' : ''}`} />
            <span>{isTamil ? 'மீண்டும் பொருத்துக' : 'Re-calculate Matches'}</span>
          </button>
        </div>
      </div>

      {/* Matching Parameters Selector */}
      <div className="glass-light p-6 rounded-3xl space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[#17351F] flex items-center justify-between border-b border-[#765341]/15 pb-2">
          <span>Farmer Offer Criteria for Buyer Matching</span>
          <span className="font-mono text-[11px] text-[#0B6623] font-bold">Scoring Weight: 100 Pts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#17351F]">Crop Offered:</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl glass-input-light text-[#17351F] font-bold outline-none focus:border-[#0B6623]"
            >
              <option value="Rice (Paddy)" className="bg-[#765341] text-white">Rice (Paddy)</option>
              <option value="Cotton" className="bg-[#765341] text-white">Cotton</option>
              <option value="Banana" className="bg-[#765341] text-white">Banana</option>
              <option value="Tomato" className="bg-[#765341] text-white">Tomato</option>
              <option value="Maize" className="bg-[#765341] text-white">Maize</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#17351F]">Lot Quantity (Quintals):</label>
            <input
              type="number"
              min="5"
              max="2000"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-2xl glass-input-light text-[#17351F] font-bold font-mono outline-none focus:border-[#0B6623]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#17351F]">Expected Price (₹/Qtl):</label>
            <input
              type="number"
              step="50"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-2xl glass-input-light text-[#17351F] font-bold font-mono outline-none focus:border-[#0B6623]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#17351F]">Farmer District:</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl glass-input-light text-[#17351F] font-bold outline-none focus:border-[#0B6623]"
            >
              <option value="Coimbatore" className="bg-[#765341] text-white">Coimbatore</option>
              <option value="Erode" className="bg-[#765341] text-white">Erode</option>
              <option value="Tiruppur" className="bg-[#765341] text-white">Tiruppur</option>
              <option value="Salem" className="bg-[#765341] text-white">Salem</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#17351F]">Quality Grade:</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl glass-input-light text-[#17351F] font-bold outline-none focus:border-[#0B6623]"
            >
              <option value="Grade A+" className="bg-[#765341] text-white">Grade A+ (Premium)</option>
              <option value="Grade A" className="bg-[#765341] text-white">Grade A (Standard)</option>
              <option value="Grade B" className="bg-[#765341] text-white">Grade B (Commercial)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matched Buyers Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs px-2">
          <span className="font-bold uppercase tracking-wider text-white">
            Verified Direct Buyers ({buyersList.length} Ranked Matches)
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-[#B8D8BD]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B8D8BD]" />
            <span>Multi-Factor Compatibility Algorithm</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {buyersList.map((buyer, idx) => {
            const isContacted = contactSuccessId === (buyer.buyer_id || idx);

            return (
              <div
                key={buyer.buyer_id || idx}
                className="glass-light p-5 rounded-3xl flex flex-col justify-between hover:border-[#765341]/40 transition-all duration-300 relative group hover:shadow-glass"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0B6623]/15 text-[#0B6623] border border-[#0B6623]/30 flex items-center gap-1">
                      <Award className="w-3 h-3 text-[#0B6623]" />
                      <span>{buyer.verification_status || 'Verified Direct Buyer'}</span>
                    </span>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-[#5F5148]">Score:</span>
                      <span className="text-base font-black font-mono text-[#0B6623]">
                        {buyer.match_score}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[#17351F] group-hover:text-[#0B6623] transition-colors">
                      {buyer.buyer_name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-[#5F5148] mt-1 font-bold">
                      <span>{buyer.business_type}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#0B6623]" />
                        <span>{buyer.location || buyer.district}</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl glass-card-light grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#5F5148] block font-bold">Offered Purchase Price</span>
                      <span className="text-base font-black text-[#17351F] font-mono">
                        ₹{buyer.offered_price_per_quintal}
                      </span>
                      <span className="text-[10px] text-[#5F5148] font-medium"> / qtl</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#5F5148] block font-bold">Distance</span>
                      <span className="text-base font-black text-[#0B6623] font-mono">
                        {buyer.distance_km} km
                      </span>
                      <span className="text-[10px] text-[#5F5148] block font-medium">From your farm</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[#5F5148] font-medium">
                      <span className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#0B6623]" />
                        <span>Logistics:</span>
                      </span>
                      <span className="font-bold text-[#17351F]">{buyer.transport_logistics}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#5F5148] font-medium">
                      <span className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#0B6623]" />
                        <span>Payment Terms:</span>
                      </span>
                      <span className="font-bold text-[#0B6623]">{buyer.payment_terms}</span>
                    </div>
                  </div>

                  {buyer.reasons_for_match && (
                    <div className="pt-2 border-t border-[#765341]/15 text-[11px] text-[#4A3A30] space-y-1 font-medium">
                      {buyer.reasons_for_match.map((r, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#0B6623] shrink-0" />
                          <span className="truncate">{r}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-3 border-t border-[#765341]/15">
                  {isContacted ? (
                    <div className="w-full py-2.5 rounded-xl bg-[#0B6623]/15 border border-[#0B6623]/35 text-[#0B6623] text-xs font-bold text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('buyer_contacted_btn')}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setContactSuccessId(buyer.buyer_id || idx)}
                      type="button"
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-center btn-glass-primary text-white shadow-glass transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{t('buyer_match_contact_btn')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default BuyerMatchingPage;

