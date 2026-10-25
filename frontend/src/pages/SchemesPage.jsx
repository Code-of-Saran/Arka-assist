import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getSchemes } from '../services/api';
import {
  BookOpenCheck,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  IndianRupee,
  Filter,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const CATEGORIES = [
  "All",
  "Financial Support",
  "Crop Insurance",
  "Solar & Irrigation",
  "Subsidies & Equipment",
  "Organic Farming"
];

const SchemesPage = () => {
  const { t, language } = useLanguage();
  const isTamil = language === 'ta';

  const [schemes, setSchemes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedScheme, setExpandedScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSchemesList = async (search = '', cat = 'All') => {
    setLoading(true);
    try {
      const data = await getSchemes(search, cat);
      setSchemes(data.schemes || []);
    } catch (e) {
      console.error('Schemes load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemesList(searchQuery, selectedCategory);
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSchemesList(searchQuery, selectedCategory);
  };

  const toggleExpand = (id) => {
    setExpandedScheme(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-white shadow-2xl min-h-[170px] flex flex-col justify-center border border-white/18">
        <img
          src="/assets/images/crop-fields.jpg"
          alt="Government Agricultural Schemes"
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.15] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D25]/95 via-[#0B6623]/82 to-[#0F3D25]/75 z-10 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-20">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold mb-2 border border-white/25 backdrop-blur-md shadow-xs">
              <BookOpenCheck className="w-3.5 h-3.5 text-[#5BA33C]" />
              <span>National & State Welfare Schemes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {t('schemes_title')}
            </h1>
            <p className="text-xs sm:text-sm text-white/85 mt-1 max-w-xl font-medium leading-relaxed">
              {t('schemes_subtitle')}
            </p>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="w-full lg:w-96">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('schemes_search_placeholder')}
                className="w-full pl-10 pr-24 py-3 rounded-2xl text-xs sm:text-sm bg-black/40 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#5BA33C] font-medium transition-all"
              />
              <Search className="w-4 h-4 text-[#D8C7AE] absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-4 py-1.5 rounded-xl text-xs font-bold btn-glass-primary shadow-glass cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-white/12 relative z-20">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#D8C7AE] mr-1">
            <Filter className="w-3.5 h-3.5 text-[#5BA33C]" />
            <span>Category:</span>
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer backdrop-blur-md ${
                selectedCategory === cat
                  ? 'bg-[#0B6623] text-white border-[#5BA33C]/60 shadow-glass'
                  : 'bg-white/8 text-white/85 hover:bg-white/16 border-white/14'
              }`}
            >
              {cat === 'All' ? t('schemes_filter_all') : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes List Cards */}
      <div className="space-y-4">
        {schemes.length > 0 ? (
          schemes.map((scheme) => {
            const isExpanded = expandedScheme === scheme.id;
            return (
              <div
                key={scheme.id}
                className="rounded-3xl glass-dark border border-white/14 overflow-hidden transition-all duration-300 hover:border-[#5BA33C]/40"
              >
                {/* Scheme Header Summary */}
                <div
                  onClick={() => toggleExpand(scheme.id)}
                  className="p-6 cursor-pointer hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0B6623]/35 text-[#5BA33C] border border-[#5BA33C]/40">
                        {scheme.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-[#D8C7AE] border border-white/16">
                        {scheme.target_state}
                      </span>
                    </div>

                    <h2 className="text-lg font-black text-white">
                      {isTamil ? scheme.name_ta : scheme.name_en}
                    </h2>
                    <p className="text-xs text-[#D8C7AE] line-clamp-1 font-medium">
                      {isTamil ? scheme.desc_ta : scheme.desc_en}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-[#D8C7AE] uppercase tracking-wider block">
                        Assistance Value
                      </span>
                      <span className="text-base font-black text-[#5BA33C] font-mono">
                        {scheme.subsidy_amount}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="p-2 rounded-xl bg-white/8 text-[#D8C7AE] hover:text-white transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-white/10 space-y-4 animate-fade-in text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-2xl bg-white/6 border border-white/10 space-y-1">
                        <span className="font-bold text-[#5BA33C] block uppercase text-[10px]">
                          Target Beneficiaries & Eligibility
                        </span>
                        <p className="text-white/90 leading-relaxed font-medium">
                          {isTamil ? scheme.eligibility_ta : scheme.eligibility_en}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white/6 border border-white/10 space-y-1">
                        <span className="font-bold text-[#5BA33C] block uppercase text-[10px]">
                          Required Application Documentation
                        </span>
                        <p className="text-white/90 leading-relaxed font-medium">
                          {isTamil ? scheme.docs_ta : scheme.docs_en}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-[#D8C7AE]">
                        Nodal Ministry: <strong className="text-white">{scheme.nodal_agency}</strong>
                      </span>

                      {scheme.portal_url && (
                        <a
                          href={scheme.portal_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold btn-glass-primary shadow-glass"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 rounded-3xl glass-dark border border-white/14 text-center space-y-2">
            <BookOpenCheck className="w-8 h-8 text-[#5BA33C] mx-auto" />
            <h3 className="text-sm font-bold text-white">No Schemes Found</h3>
            <p className="text-xs text-[#D8C7AE]">Try changing your search query or filter category.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default SchemesPage;
