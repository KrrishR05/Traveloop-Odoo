import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, DollarSign, Plus, Filter, X, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import SearchBar from '../components/ui/SearchBar';
import { activities, activityCategories } from '../data/activities';

const priceRanges = [
  { id: 'all',   label: 'Any Price'  },
  { id: 'Free',  label: 'Free'       },
  { id: '$',     label: 'Budget ($)' },
  { id: '$$',    label: 'Mid ($$)'   },
  { id: '$$$',   label: 'Premium ($$$)' },
];

const ratingFilters = [
  { id: 'all',  label: 'All Ratings' },
  { id: '4.5',  label: '4.5+ ⭐'     },
  { id: '4.0',  label: '4.0+ ⭐'     },
];

const categoryVariant = (cat) => {
  const m = { sightseeing: 'indigo', food: 'sand', adventure: 'pink',
              culture: 'teal', nature: 'green', transport: 'slate', accommodation: 'slate' };
  return m[cat] ?? 'slate';
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} className={`w-3.5 h-3.5 ${n <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
          viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span className="text-xs text-slate-500 ml-1">{rating}</span>
    </div>
  );
}

export default function ActivitySearch() {
  const navigate = useNavigate();
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState('all');
  const [price,    setPrice]    = useState('all');
  const [rating,   setRating]   = useState('all');
  const [added,    setAdded]    = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      const q    = query.toLowerCase();
      const matchQ  = !q || a.name.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.tags.some(t=>t.toLowerCase().includes(q));
      const matchC  = category === 'all' || a.category === category;
      const matchP  = price    === 'all' || a.priceRange === price;
      const matchR  = rating   === 'all' || a.rating >= parseFloat(rating);
      return matchQ && matchC && matchP && matchR;
    });
  }, [query, category, price, rating]);

  const toggleAdd = (id) =>
    setAdded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const clearFilters = () => { setQuery(''); setCategory('all'); setPrice('all'); setRating('all'); };
  const activeFilterCount = [category !== 'all', price !== 'all', rating !== 'all'].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page header */}
      <div className="mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-3 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Find Activities</h1>
        <p className="text-slate-500 text-sm mt-1">Discover experiences to add to your itinerary</p>
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-3 mb-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery('')}
          placeholder="Search activities, cities, or tags…"
          size="md"
          id="activity-search"
          className="flex-1"
        />
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-medium
            transition-all duration-200 flex-shrink-0
            ${showFilters || activeFilterCount > 0
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
            }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 mb-6 space-y-5
          animate-[fadeUp_0.25s_ease-out_forwards]">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Filters</h3>
            <button onClick={clearFilters} className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> Clear all
            </button>
          </div>

          {/* Category chips */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {activityCategories.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setCategory(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                    ${category === id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 text-slate-600 hover:border-primary-300'
                    }`}
                >
                  <span>{icon}</span> {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Price range */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Price Range</p>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setPrice(id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                      ${price === id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 text-slate-600 hover:border-primary-300'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="text-xs font-medium text-slate-500 mb-2">Minimum Rating</p>
              <div className="flex flex-wrap gap-2">
                {ratingFilters.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setRating(id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                      ${rating === id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 text-slate-600 hover:border-primary-300'
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-800">{filtered.length}</span> activities found
          {added.size > 0 && (
            <span className="ml-2 text-primary-600 font-medium">· {added.size} added to trip</span>
          )}
        </p>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline font-medium flex items-center gap-1">
            <X className="w-3.5 h-3.5" /> Clear filters
          </button>
        )}
      </div>

      {/* Activity grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium text-slate-600 mb-1">No activities match your search</p>
          <p className="text-sm">Try adjusting your filters or search term</p>
          <button onClick={clearFilters} className="mt-4 text-primary-600 text-sm font-medium hover:underline">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((act) => {
            const isAdded = added.has(act.id);
            return (
              <div
                key={act.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden
                  transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1.5 hover:border-primary-100 group"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={act.image}
                    alt={act.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 overlay-bottom opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Price badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full
                      text-xs font-semibold text-slate-700 shadow-sm">
                      {act.price === 'Free' ? '🆓 Free' : act.price}
                    </span>
                  </div>

                  {/* Category */}
                  <div className="absolute top-3 right-3">
                    <Badge variant={categoryVariant(act.category)}>{act.category}</Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 text-sm mb-1 leading-snug group-hover:text-primary-700 transition-colors">
                    {act.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-2">
                    <span>📍</span> {act.city}
                  </p>

                  <StarRating rating={act.rating} />
                  <p className="text-xs text-slate-400 mt-0.5">{act.reviews.toLocaleString()} reviews</p>

                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    {act.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {act.duration}
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {act.tags.slice(0, 2).map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs">{t}</span>
                    ))}
                  </div>

                  {/* Add button */}
                  <button
                    onClick={() => toggleAdd(act.id)}
                    className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold
                      transition-all duration-200
                      ${isAdded
                        ? 'bg-primary-500 text-white shadow-brand'
                        : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200'
                      }`}
                  >
                    {isAdded ? (
                      <><span>✓</span> Added to Trip</>
                    ) : (
                      <><Plus className="w-3.5 h-3.5" /> Add to Trip</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky bottom bar when activities added */}
      {added.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40
          flex items-center gap-4 px-6 py-3.5 rounded-2xl shadow-card-lg
          bg-slate-900 text-white text-sm font-medium
          animate-[fadeUp_0.25s_ease-out_forwards]">
          <span>{added.size} {added.size === 1 ? 'activity' : 'activities'} selected</span>
          <Button variant="brand" size="sm" onClick={() => navigate('/trips/1/itinerary')}>
            Add to Itinerary →
          </Button>
        </div>
      )}
    </div>
  );
}
