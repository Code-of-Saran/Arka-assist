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
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  Phone,
  MessageSquare,
  Tag,
  UserCheck
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
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-xl min-h-[180px] flex flex-col justify-center">
        <img
          src="/assets/images/market-produce.jpg"
          alt="Direct Farmer Agricultural Marketplace"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/85 to-forest-950/40 z-10 pointer-events-none" />

        <div className="relative z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf-500/30 text-leaf-300 text-xs font-bold mb-2 border border-leaf-500/40 backdrop-blur-md">
              <Store className="w-3.5 h-3.5" />
              <span>Direct Agricultural Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
              {t('marketplace_title')}
            </h1>
            <p className="text-xs sm:text-sm text-cream-100/90 mt-1 max-w-2xl leading-relaxed font-medium">
              {t('marketplace_subtitle')}
            </p>
          </div>

        <div className="flex items-center gap-3">
          <Link
            to="/buyer-matching"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white dark:bg-darkbg-surface text-forest-950 dark:text-cream-50 hover:bg-cream-100 transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-leaf-600 dark:text-leaf-400" />
            <span>{isTamil ? 'AI வாங்குவோர் பொருத்தம்' : 'AI Buyer Matching'}</span>
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            type="button"
            className="btn-agro-sell flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('marketplace_add_btn')}</span>
          </button>
        </div>
      </div>
    </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-earth-400 dark:text-darkbg-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isTamil ? 'விளைபொருள் அல்லது விவசாயி பெயரை தேடுக...' : 'Search listings by crop, farmer, or description...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border text-forest-950 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-earth-500 dark:text-darkbg-muted" />
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl text-xs bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border text-forest-950 dark:text-cream-50 font-bold cursor-pointer"
          >
            <option value="">All Crops</option>
            <option value="rice">Rice (Paddy)</option>
            <option value="cotton">Cotton</option>
            <option value="banana">Banana</option>
            <option value="tomato">Tomato</option>
          </select>
        </div>
      </div>

      {/* Listings Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {listings.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft flex flex-col justify-between hover:border-forest-500 transition-all card-hover-lift group"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-leaf-100 dark:bg-leaf-950/60 text-leaf-800 dark:text-leaf-300 border border-leaf-300 dark:border-leaf-800">
                  {item.quality_grade}
                </span>
                <span className="text-[11px] font-medium text-earth-500 dark:text-darkbg-muted flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-forest-600" />
                  <span>Harvest: {item.harvest_date}</span>
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-forest-950 dark:text-cream-50 group-hover:text-forest-700 dark:group-hover:text-leaf-400 transition-colors">
                  {item.crop}
                </h3>
                <div className="flex items-center justify-between mt-1 text-xs text-earth-600 dark:text-darkbg-muted font-medium">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-forest-600" />
                    <span>{item.location}</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <UserCheck className="w-3.5 h-3.5 text-leaf-600" />
                    <span>{item.farmer_name}</span>
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-cream-50 dark:bg-darkbg-surface border border-cream-200 dark:border-darkbg-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-earth-500 dark:text-darkbg-muted uppercase block">Price Expectation</span>
                  <span className="text-xl font-black text-forest-950 dark:text-cream-50 font-mono">
                    ₹{item.expected_price_per_quintal}
                  </span>
                  <span className="text-[10px] text-earth-500"> / qtl</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-earth-500 dark:text-darkbg-muted uppercase block">Volume Available</span>
                  <span className="text-xl font-black text-forest-700 dark:text-leaf-400 font-mono">
                    {item.quantity_quintals}
                  </span>
                  <span className="text-[10px] text-earth-500"> Quintals</span>
                </div>
              </div>

              <p className="text-xs text-earth-700 dark:text-cream-200/90 leading-relaxed line-clamp-2 font-medium">
                {item.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-cream-200 dark:border-darkbg-border flex items-center justify-between gap-2.5">
              <Link
                to={`/buyer-matching?crop=${encodeURIComponent(item.crop)}&price=${item.expected_price_per_quintal}&qty=${item.quantity_quintals}`}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cream-100 dark:bg-darkbg-surface hover:bg-forest-100 text-forest-900 dark:text-cream-200 border border-cream-300 dark:border-darkbg-border transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-leaf-600" />
                <span>Matches</span>
              </Link>

              <button
                onClick={() => {
                  setActiveListing(item);
                  setShowInquiryModal(true);
                }}
                type="button"
                className="btn-agro-primary flex-1 py-2 px-3 rounded-xl text-xs font-bold text-center shadow-sm cursor-pointer"
              >
                {t('marketplace_inquire_btn')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 dark:border-darkbg-border bg-forest-900 text-white">
              <h3 className="text-base font-black tracking-tight">{t('marketplace_add_btn')}</h3>
              <button onClick={() => setShowAddModal(false)} type="button" className="p-1 rounded-full hover:bg-forest-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-forest-950 dark:text-cream-50">{t('marketplace_crop')}:</label>
                <input
                  type="text"
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-forest-950 dark:text-cream-50">{t('marketplace_quantity')}:</label>
                  <input
                    type="number"
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border font-mono font-bold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-forest-950 dark:text-cream-50">{t('marketplace_expected_price')}:</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-forest-950 dark:text-cream-50">Quality Grade:</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border font-medium"
                  >
                    <option value="Grade A+ (Premium)">Grade A+ (Export Quality)</option>
                    <option value="Grade A">Grade A (Standard)</option>
                    <option value="Grade B">Grade B (Processing Grade)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-forest-950 dark:text-cream-50">Harvest Date:</label>
                  <input
                    type="date"
                    value={newHarvestDate}
                    onChange={(e) => setNewHarvestDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-forest-950 dark:text-cream-50">Produce Description:</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border font-medium"
                />
              </div>

              <button
                type="submit"
                className="btn-agro-primary w-full py-3 rounded-2xl font-bold shadow-md cursor-pointer"
              >
                Publish Crop Listing
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiryModal && activeListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 dark:border-darkbg-border bg-forest-900 text-white">
              <div>
                <h3 className="text-base font-black tracking-tight">Direct Purchase Inquiry</h3>
                <span className="text-[11px] text-forest-200">{activeListing.crop} ({activeListing.quantity_quintals} qtl)</span>
              </div>
              <button onClick={() => setShowInquiryModal(false)} type="button" className="p-1 rounded-full hover:bg-forest-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySuccessMsg ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <p className="text-sm font-bold text-forest-950 dark:text-cream-50">{inquirySuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="p-6 space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-forest-950 dark:text-cream-50">Your Name / Organization:</label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Kongu Rice Mills or Trade Buyer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-forest-950 dark:text-cream-50">Contact Phone Number:</label>
                  <input
                    type="text"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border font-medium"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-forest-950 dark:text-cream-50">Offered Price (₹ / Quintal):</label>
                  <input
                    type="number"
                    value={offerPrice || activeListing.expected_price_per_quintal}
                    onChange={(e) => setOfferPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-forest-950 dark:text-cream-50">Inquiry Message:</label>
                  <textarea
                    rows={2}
                    value={inquiryMsg}
                    onChange={(e) => setInquiryMsg(e.target.value)}
                    placeholder="Provide pickup preferences, weighment inspection, or terms..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-agro-primary w-full py-3 rounded-2xl font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Transmit Inquiry to Farmer</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default MarketplacePage;

