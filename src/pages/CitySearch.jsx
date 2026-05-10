import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, ArrowRight, Clock, DollarSign, X } from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { destinations } from '../data/destinations';

const CONTINENTS = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Africa'];

const categoryVariant = (tag) => {
  const map = { Beach: 'teal', Mountains: 'indigo', City: 'slate', Culture: 'sand',
                Nature: 'green', Adventure: 'pink', Romantic: 'pink', Luxury: 'sand',
                History: 'indigo', Scenic: 'teal', Food: 'sand' };
  return map[tag] ?? 'slate';
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map((n) => (
        <svg key={n} className={`w-3 h-3 ${n <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
          viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span className="text-xs text-slate-500 ml-0.5">{rating}</span>
    </div>
  );
}

export default function CitySearch() {
  const navigate = useNavigate();
  const [query,     setQuery]     = useState('');
  const [continent, setContinent] = useState('All');
  const [hovered,   setHovered]   = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const filtered = useMemo(() =>
    destinations.filter((d) => {
      const q = query.toLowerCase();
      const matchQ = !q ||
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q));
      const matchC = continent === 'All' || d.continent === continent;
      return matchQ && matchC;
    }),
    [query, continent]
  );

  const featured = destinations.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-14 relative">

      {/* ── Hero search ──────────────────────────────────────── */}
      <section className="relative rounded-4xl overflow-hidden h-72 md:h-80">
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=1200&h=500"
          alt="World map with landmarks"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/60 via-primary-800/50 to-slate-900/70" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6 px-6 text-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
              Where to next?
            </h1>
            <p className="text-white/70 mt-2 text-sm md:text-base">
              Search destinations from around the world
            </p>
          </div>

          {/* Big search bar */}
          <div className="w-full max-w-xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <MapPin className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cities, countries, or experiences…"
                className="w-full pl-12 pr-12 py-4 rounded-2xl border-0
                  bg-white/95 backdrop-blur-xl text-slate-800 placeholder:text-slate-400
                  focus:outline-none focus:ring-3 focus:ring-white/40 shadow-card-lg text-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured — top picks ─────────────────────────────── */}
      {!query && (
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Featured Destinations</h2>
              <p className="text-slate-500 text-sm mt-1">Editor's picks for unforgettable journeys</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {featured.map((dest, i) => (
              <div
                key={dest.id}
                className="relative h-64 rounded-3xl overflow-hidden group cursor-pointer shadow-card
                  transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1.5"
                onClick={() => setSelectedCity(dest)}
                onMouseEnter={() => setHovered(dest.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 overlay-bottom" />

                {/* Featured label for first */}
                {i === 0 && (
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 bg-amber-400 text-amber-900 rounded-full text-xs font-bold">
                      ✦ Editor's Pick
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="flex items-center gap-1 mb-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-medium text-white/90">{dest.rating}</span>
                    <span className="text-xs text-white/60 ml-1">({dest.reviews.toLocaleString()})</span>
                  </div>
                  <h3 className="font-bold text-lg drop-shadow leading-tight">{dest.name}</h3>
                  <p className="text-white/70 text-xs mt-1">{dest.avgBudget} avg · Best: {dest.bestTime}</p>

                  {/* Hover detail */}
                  <div className={`overflow-hidden transition-all duration-300 ${hovered === dest.id ? 'max-h-20 mt-3 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-white/80 text-xs leading-relaxed line-clamp-2">{dest.description}</p>
                    <div className="flex gap-1.5 mt-2">
                      {dest.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 bg-white/20 rounded-full text-white text-xs">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── All destinations with continent filter ────────────── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {query ? `Results for "${query}"` : 'All Destinations'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {filtered.length} {filtered.length === 1 ? 'destination' : 'destinations'} found
            </p>
          </div>

          {/* Continent tabs */}
          <div className="flex flex-wrap gap-2">
            {CONTINENTS.map((c) => (
              <button
                key={c}
                onClick={() => setContinent(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                  ${continent === c
                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:border-primary-300 bg-white'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">🗺️</p>
            <p className="font-medium text-slate-600 mb-1">No destinations found</p>
            <p className="text-sm mb-4">Try a different search or filter</p>
            <button onClick={() => { setQuery(''); setContinent('All'); }} className="text-primary-600 text-sm font-medium hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((dest) => (
              <div
                key={dest.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden
                  transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1.5 hover:border-primary-100 group cursor-pointer"
                onClick={() => setSelectedCity(dest)}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 overlay-bottom opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Rating */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1
                    bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {dest.rating}
                  </div>

                  {/* Best time on hover */}
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100
                    transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700">
                      Best: {dest.bestTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-primary-700 transition-colors">
                      {dest.name}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-primary-400 transition-colors flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs text-slate-400 mb-2">{dest.reviews.toLocaleString()} reviews</p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {dest.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant={categoryVariant(tag)}>{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-50">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> {dest.avgBudget}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('/trips/create', { state: { prefillDestination: dest.name } }); }}
                      className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
                    >
                      Plan trip →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── City Details Modal ───────────────────────────────── */}
      {selectedCity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div 
            className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-[fadeUp_0.3s_ease-out_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Image */}
            <div className="relative h-48 sm:h-64">
              <img 
                src={selectedCity.image} 
                alt={selectedCity.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <button 
                onClick={() => setSelectedCity(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/40 
                  backdrop-blur-md rounded-full text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary-400">{selectedCity.continent}</span>
                  <span className="w-1 h-1 rounded-full bg-white/50" />
                  <span className="text-xs font-medium text-white/80">{selectedCity.country}</span>
                </div>
                <h2 className="text-3xl font-bold drop-shadow-md">{selectedCity.name}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-semibold text-slate-800">{selectedCity.rating}</span>
                  <span className="text-xs">({selectedCity.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Clock className="w-4 h-4 text-primary-500" />
                  <span className="text-xs">Best time: <strong className="text-slate-800">{selectedCity.bestTime}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs">Avg Budget: <strong className="text-slate-800">{selectedCity.avgBudget}</strong></span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">About</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{selectedCity.description}</p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">Top Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCity.highlights.map(h => (
                    <span key={h} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg border border-primary-100/50">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Button 
                  variant="brand" 
                  size="lg" 
                  className="w-full text-base py-3.5 shadow-brand"
                  onClick={() => navigate('/trips/create', { state: { prefillDestination: selectedCity.name } })}
                >
                  <MapPin className="w-5 h-5 mr-1" />
                  Start the trip from there
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
