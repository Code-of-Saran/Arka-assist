import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getMarketplaceListings, createMarketplaceListing, sendPurchaseInquiry } from '../services/api';
import {
  Store,
  PlusCircle,
  Search,
  Filter,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  X,
  MessageSquare,
  UserCheck,
  TrendingUp
} from 'lucide-react';

const MarketplacePage = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const isTamil = language === 'ta';

  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [activeListing, setActiveListing] = useState(null);
  const [inquirySuccessMsg, setInquirySuccessMsg] = useState('');

  // New Listing Form State
  const [newCrop, setNewCrop] = useState('Rice (Paddy - Super Ponni)');
  const [newQty, setNewQty] = useState(50);
  const [newPrice, setNewPrice] = useState(2400);
  const [newGrade, setNewGrade] = useState('Grade A+ (Premium)');
  const [newLocation, setNewLocation] = useState(user?.location || 'Coimbatore, Tamil Nadu');
  const [newHarvestDate, setNewHarvestDate] = useState('2026-09-25');
  const [newDescription, setNewDescription] = useState('Clean naturally cultivated crop ready for direct procurement.');

  // Inquiry Form State
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState('');

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await getMarketplaceListings(search, selectedCrop);
      setListings(data.listings || []);
    } catch (err) {
      console.error('Error loading listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [search, selectedCrop]);

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      await createMarketplaceListing({
        farmer_name: user?.name || 'Farmer',
        crop: newCrop,
        quantity_quintals: Number(newQty),
        expected_price_per_quintal: Number(newPrice),
        location: newLocation,
        district: 'Coimbatore',
        quality_grade: newGrade,
        harvest_date: newHarvestDate,
        description: newDescription,
        image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
      });
      setShowAddModal(false);
      fetchListings();
    } catch (err) {
      console.error('Create listing error:', err);
    }
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    if (!activeListing) return;
    try {
      const res = await sendPurchaseInquiry({
        listing_id: activeListing.id,
        buyer_name: buyerName || 'Agro Wholesale Buyer',
        buyer_phone: buyerPhone || '+91 98765 43210',
        offered_price: offerPrice || activeListing.expected_price_per_quintal,
        quantity_needed: activeListing.quantity_quintals,
        message: inquiryMsg || 'Interested in direct procurement of your harvest.'
      });
      setInquirySuccessMsg(res.message);
      setTimeout(() => {
        setShowInquiryModal(false);
        setInquirySuccessMsg('');
        setBuyerName('');
        setBuyerPhone('');
      }, 2000);
    } catch (err) {
      console.error('Send inquiry error:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header Banner - Liquid Glass & Deep Green Overlay */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-glass min-h-[170px] flex flex-col justify-center border border-white/20 glass-panel">
        <img
          src="/assets/images/harvest-mandi.jpg"
          alt="Direct Agricultural Marketplace"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B6623]/92 via-[#0B6623]/80 to-[#765341]/85 z-10 pointer-events-none" />
        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold mb-2 border border-white/25 backdrop-blur-md">
              <Store className="w-3.5 h-3.5 text-white" />
              <span>Direct Agricultural Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {t('marketplace_title')}
            </h1>
            <p className="text-xs sm:text-sm text-[#F1E8DF] mt-1 max-w-2xl leading-relaxed font-medium">
              {t('marketplace_subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/buyer-matching"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold btn-glass-secondary transition-all shadow-glass cursor-pointer backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-[#4F8F5B]" />
              <span>{isTamil ? 'AI வாங்குவோர் பொருத்தம்' : 'AI Buyer Matching'}</span>
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold btn-glass-primary transition-all shadow-glass cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>{t('marketplace_add_btn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-light p-4 rounded-3xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0B6623]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isTamil ? 'விளைபொருள் அல்லது விவசாயி பெயரை தேடுக...' : 'Search listings by crop, farmer, or description...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs glass-input-light text-[#17351F] placeholder-[#5F5148] focus:outline-none focus:border-[#0B6623] font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#0B6623]" />
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl text-xs glass-input-light text-[#17351F] font-bold cursor-pointer outline-none focus:border-[#0B6623]"
          >
            <option value="" className="bg-[#765341] text-white">All Crops</option>
            <option value="rice" className="bg-[#765341] text-white">Rice (Paddy)</option>
            <option value="cotton" className="bg-[#765341] text-white">Cotton</option>
            <option value="banana" className="bg-[#765341] text-white">Banana</option>
            <option value="tomato" className="bg-[#765341] text-white">Tomato</option>
          </select>
        </div>
      </div>

      {/* Listings Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {listings.map((item) => (
          <div
            key={item.id}
            className="glass-light p-5 rounded-3xl flex flex-col justify-between hover:border-[#765341]/40 transition-all duration-300 group hover:shadow-glass"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#0B6623]/15 text-[#0B6623] border border-[#0B6623]/30">
                  {item.quality_grade}
                </span>
                <span className="text-[11px] font-bold text-[#5F5148] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#0B6623]" />
                  <span>Harvest: {item.harvest_date}</span>
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-[#17351F] group-hover:text-[#0B6623] transition-colors">
                  {item.crop}
                </h3>
                <div className="flex items-center justify-between mt-1 text-xs text-[#5F5148] font-bold">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0B6623]" />
                    <span>{item.location}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <UserCheck className="w-3.5 h-3.5 text-[#0B6623]" />
                    <span>{item.farmer_name}</span>
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl glass-card-light flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#5F5148] uppercase tracking-wider block">Price Expectation</span>
                  <span className="text-xl font-black text-[#17351F] font-mono">
                    ₹{item.expected_price_per_quintal}
                  </span>
                  <span className="text-[10px] text-[#5F5148] font-medium"> / qtl</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#5F5148] uppercase tracking-wider block">Volume Available</span>
                  <span className="text-xl font-black text-[#0B6623] font-mono">
                    {item.quantity_quintals}
                  </span>
                  <span className="text-[10px] text-[#5F5148] font-medium"> Quintals</span>
                </div>
              </div>

              <p className="text-xs text-[#4A3A30] leading-relaxed line-clamp-2 font-medium">
                {item.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#765341]/15 flex items-center justify-between gap-2.5">
              <Link
                to={`/buyer-matching?crop=${encodeURIComponent(item.crop)}&price=${item.expected_price_per_quintal}&qty=${item.quantity_quintals}`}
                className="px-3.5 py-2 rounded-xl text-xs font-bold btn-glass-secondary flex items-center gap-1.5 cursor-pointer text-[#17351F]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0B6623]" />
                <span>Matches</span>
              </Link>

              <button
                onClick={() => {
                  setActiveListing(item);
                  setShowInquiryModal(true);
                }}
                type="button"
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-center shadow-glass btn-glass-primary transition-all cursor-pointer text-white"
              >
                {t('marketplace_inquire_btn')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl glass-modal border border-white/20 shadow-2xl bg-[#654536]/95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/15">
              <h3 className="text-base font-black tracking-tight text-white">{t('marketplace_add_btn')}</h3>
              <button onClick={() => setShowAddModal(false)} type="button" className="p-1 rounded-full text-[#D8C7AE] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#F1E8DF]">{t('marketplace_crop')}:</label>
                <input
                  type="text"
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#4F8F5B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#F1E8DF]">{t('marketplace_qty')} (Qtl):</label>
                  <input
                    type="number"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#4F8F5B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#F1E8DF]">{t('marketplace_price')} (₹/Qtl):</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#4F8F5B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#F1E8DF]">Quality Grade:</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#4F8F5B]"
                  >
                    <option value="Grade A+ (Premium)" className="bg-[#654536] text-white">Grade A+ (Premium)</option>
                    <option value="Grade A (Standard)" className="bg-[#654536] text-white">Grade A (Standard)</option>
                    <option value="Grade B (Commercial)" className="bg-[#654536] text-white">Grade B (Commercial)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#F1E8DF]">Expected Harvest Date:</label>
                  <input
                    type="date"
                    value={newHarvestDate}
                    onChange={(e) => setNewHarvestDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#4F8F5B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#F1E8DF]">Farm / Village Location:</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#4F8F5B]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#F1E8DF]">Produce Notes / Description:</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows="3"
                  className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#4F8F5B]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#D8C7AE] hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold btn-glass-primary shadow-glass transition-all"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purchase Inquiry Modal */}
      {showInquiryModal && activeListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl glass-modal border border-white/20 shadow-2xl bg-[#654536]/95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/15">
              <div>
                <h3 className="text-base font-black tracking-tight text-white">Send Direct Inquiry</h3>
                <span className="text-xs text-[#4F8F5B] font-semibold">{activeListing.crop} ({activeListing.quantity_quintals} Qtl)</span>
              </div>
              <button onClick={() => setShowInquiryModal(false)} type="button" className="p-1 rounded-full text-[#D8C7AE] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySuccessMsg ? (
              <div className="p-8 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#0B6623]/30 text-[#4F8F5B] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">{inquirySuccessMsg}</h4>
                <p className="text-xs text-[#D8C7AE]">Farmer notified via direct SMS dispatch simulation.</p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="p-6 space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-[#F1E8DF]">Buyer / Company Name:</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Kongu Agro Millers Pvt Ltd"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#4F8F5B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#F1E8DF]">Contact Phone Number:</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#4F8F5B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#F1E8DF]">Offered Price (₹/Quintal):</label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    placeholder={`Expected: ₹${activeListing.expected_price_per_quintal}`}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#4F8F5B]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#F1E8DF]">Message / Terms:</label>
                  <textarea
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    rows="2"
                    placeholder="Ready for pickup upon quality inspection..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-[#4F8F5B]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#D8C7AE] hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold btn-glass-primary shadow-glass transition-all"
                  >
                    Send Purchase Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default MarketplacePage;

