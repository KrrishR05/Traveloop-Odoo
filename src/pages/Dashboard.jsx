import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, ArrowRight, Star, MapPin, Calendar, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { destinations, previousTrips } from '../data/destinations';

const stats = [
  { label: 'Destinations',   value: '190+', icon: MapPin      },
  { label: 'Happy Travelers', value: '50K+', icon: Star        },
  { label: 'Trips Planned',  value: '120K+', icon: Calendar    },
  { label: 'Trending Now',   value: '24',    icon: TrendingUp  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = destinations.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.country.toLowerCase().includes(search.toLowerCase())
  );

  const categoryVariant = (tag) => {
    const map = { Beach: 'teal', Mountains: 'indigo', City: 'slate', Culture: 'sand',
                  Nature: 'green', Adventure: 'pink', Romantic: 'pink', Luxury: 'sand',
                  History: 'indigo', Scenic: 'teal', Food: 'sand' };
    return map[tag] ?? 'slate';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-8">

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative w-full h-[480px] md:h-[540px] rounded-4xl overflow-hidden shadow-card-lg">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1400&h=600"
          alt="Travel banner — winding road through mountains"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/30 to-transparent" />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
              bg-white/20 text-white backdrop-blur-sm border border-white/30 mb-4">
              ✦ Your journey starts here
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-lg">
              Explore the World,<br />
              <span className="text-primary-300">Your Way</span>
            </h1>
            <p className="text-white/80 text-lg max-w-xl mb-8 drop-shadow">
              Discover new destinations, build rich day-by-day itineraries,
              and create memories that last a lifetime.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="brand"
                size="lg"
                onClick={() => navigate('/trips/create')}
                className="shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Plan a New Trip
              </Button>
              <Link
                to="/cities/search"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold
                  text-white bg-white/15 hover:bg-white/25 backdrop-blur-sm
                  border border-white/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                Browse Destinations
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-white
              border border-slate-100 shadow-card text-center"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center
              bg-primary-50 text-primary-600">
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-slate-800 tracking-tight">{value}</span>
            <span className="text-xs text-slate-500 font-medium">{label}</span>
          </div>
        ))}
      </section>

      {/* ── Search + CTA bar ────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row gap-3 items-center
        bg-white border border-slate-100 shadow-card p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations, countries…"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50
              focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400
              transition-all duration-200 text-slate-800 placeholder:text-slate-400 text-sm"
          />
        </div>
        <Button variant="brand" size="md" onClick={() => navigate('/trips/create')}>
          <Plus className="w-4 h-4" />
          New Trip
        </Button>
      </section>

      {/* ── Recommended Destinations ────────────────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Recommended Destinations</h2>
            <p className="text-slate-500 text-sm mt-1">Trending places travelers love right now</p>
          </div>
          <Link
            to="/cities/search"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium
              text-primary-600 hover:text-primary-700 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {(search ? filtered : destinations.slice(0, 8)).map((dest, i) => (
            <Card
              key={dest.id}
              className="p-0 overflow-hidden group cursor-pointer"
              style={{ animationDelay: `${i * 80}ms` }}
              onClick={() => navigate('/cities/search')}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 overlay-bottom opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Rating pill */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1
                  bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-700
                  shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {dest.rating}
                </div>

                {/* Best time pill */}
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100
                  transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full
                    text-xs font-medium text-slate-700">
                    Best: {dest.bestTime}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 text-sm mb-1 group-hover:text-primary-600 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-400 mb-3">{dest.reviews.toLocaleString()} reviews</p>
                <div className="flex flex-wrap gap-1.5">
                  {dest.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant={categoryVariant(tag)}>{tag}</Badge>
                  ))}
                  <span className="text-xs text-slate-400 self-center">{dest.avgBudget}</span>
                </div>
              </div>
            </Card>
          ))}
          {search && filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400">
              No destinations match "{search}"
            </div>
          )}
        </div>
      </section>

      {/* ── Previous Trips ──────────────────────────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Your Trips</h2>
            <p className="text-slate-500 text-sm mt-1">Revisit, view, or continue planning</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/trips/create')}>
            <Plus className="w-4 h-4" />
            Add Trip
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {previousTrips.map((trip) => (
            <Card key={trip.id} className="p-0 overflow-hidden group cursor-pointer">
              <div className="relative h-44 overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 overlay-bottom" />
                <div className="absolute top-3 right-3">
                  <Badge variant={trip.status === 'upcoming' ? 'green' : 'slate'}>
                    {trip.status === 'upcoming' ? '✦ Upcoming' : '✓ Completed'}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-4">
                  <p className="text-white font-semibold text-sm drop-shadow">{trip.name}</p>
                  <p className="text-white/70 text-xs">{trip.date} · {trip.duration}</p>
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{trip.budget}</span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/trips/1/view`)}
                >
                  View Itinerary
                </Button>
              </div>
            </Card>
          ))}

          {/* Add new trip CTA card */}
          <button
            onClick={() => navigate('/trips/create')}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl
              border-2 border-dashed border-slate-200 p-8 text-slate-400
              hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50
              transition-all duration-300 min-h-[200px] cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center
              bg-slate-100 group-hover:bg-primary-100 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">Plan a new trip</span>
          </button>
        </div>
      </section>
    </div>
  );
}
