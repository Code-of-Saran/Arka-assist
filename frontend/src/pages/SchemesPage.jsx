import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getSchemes } from '../services/api';
import {
  BookOpenCheck,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award,
  FileText,
  Users,
  IndianRupee,
  Sparkles,
  Filter
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
    <div className="space-y-8">
      
      {/* Header & Search */}
      <div className="p-6 rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-forest-700 dark:text-leaf-400 uppercase tracking-wider mb-1">
              <BookOpenCheck className="w-4 h-4" />
              <span>National & State Welfare Schemes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-forest-950 dark:text-cream-50 tracking-tight">
              {t('schemes_title')}
            </h1>
            <p className="text-xs sm:text-sm text-earth-700 dark:text-cream-200/80 mt-1 max-w-xl">
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
                className="w-full pl-10 pr-24 py-3 rounded-2xl text-xs sm:text-sm bg-cream-50 dark:bg-darkbg-surface border border-cream-300 dark:border-darkbg-border text-earth-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-forest-500 font-medium"
              />
              <Search className="w-4 h-4 text-earth-500 dark:text-darkbg-muted absolute left-3.5 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-forest-700 hover:bg-forest-800 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-cream-200 dark:border-darkbg-border">
          <div className="flex items-center gap-1.5 text-xs font-bold text-earth-600 dark:text-darkbg-muted mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategory === cat
                  ? 'bg-forest-700 text-white border-forest-700 shadow-sm'
                  : 'bg-cream-100 dark:bg-darkbg-surface text-earth-800 dark:text-cream-200 border-cream-300 dark:border-darkbg-border hover:bg-forest-50'
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
                className="rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border shadow-soft overflow-hidden transition-all duration-200"
              >
                {/* Scheme Header Summary */}
                <div
                  onClick={() => toggleExpand(scheme.id)}
                  className="p-6 cursor-pointer hover:bg-cream-50/50 dark:hover:bg-darkbg-surface/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-forest-100 dark:bg-forest-950/60 text-forest-800 dark:text-leaf-300 border border-forest-200 dark:border-forest-800">
                        {isTamil ? (scheme.category_ta || scheme.category) : scheme.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cream-200 dark:bg-darkbg-surface text-earth-700 dark:text-cream-200 border border-cream-300 dark:border-darkbg-border">
                        {isTamil ? (scheme.level_ta || scheme.level) : scheme.level}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-forest-950 dark:text-cream-50">
                      {isTamil ? scheme.name_ta : scheme.name_en}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs font-bold text-forest-700 dark:text-leaf-400">
                      {isExpanded ? 'Hide Details' : 'View Details'}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-cream-200 dark:bg-darkbg-surface flex items-center justify-center text-forest-800 dark:text-cream-100">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-cream-200 dark:border-darkbg-border space-y-4 bg-cream-50/40 dark:bg-darkbg-surface/30">
                    
                    {/* Benefits Box */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-leaf-300 mb-1.5 flex items-center gap-1.5">
                        <IndianRupee className="w-4 h-4 text-emerald-600" />
                        <span>{t('schemes_benefits')}</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-earth-800 dark:text-cream-200/90 leading-relaxed font-medium">
                        {isTamil ? scheme.benefits_ta : scheme.benefits_en}
                      </p>
                    </div>

                    {/* Eligibility & Documents Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Eligibility */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-leaf-300 mb-1.5 flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-forest-600" />
                          <span>{t('schemes_eligibility')}</span>
                        </h4>
                        <p className="text-xs text-earth-700 dark:text-cream-200 leading-relaxed">
                          {isTamil ? scheme.eligibility_ta : scheme.eligibility_en}
                        </p>
                      </div>

                      {/* Documents */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 dark:text-leaf-300 mb-1.5 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-amber-600" />
                          <span>{t('schemes_documents')}</span>
                        </h4>
                        <p className="text-xs text-earth-700 dark:text-cream-200 leading-relaxed">
                          {isTamil ? scheme.documents_ta : scheme.documents_en}
                        </p>
                      </div>
                    </div>

                    {/* Official Link Button */}
                    <div className="flex justify-end pt-2">
                      <a
                        href={scheme.official_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-forest-700 hover:bg-forest-800 shadow-soft transition-all"
                      >
                        <span>{t('schemes_apply_btn')}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-darkbg-card border border-cream-300 dark:border-darkbg-border">
            <BookOpenCheck className="w-10 h-10 text-earth-400 dark:text-darkbg-muted mx-auto mb-3" />
            <h3 className="text-base font-bold text-forest-950 dark:text-cream-50">
              No matching schemes found
            </h3>
            <p className="text-xs text-earth-600 dark:text-darkbg-muted mt-1">
              Try searching with another keyword or reset the category filter.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default SchemesPage;
