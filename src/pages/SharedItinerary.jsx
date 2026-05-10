import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MapPin, Calendar, Clock, DollarSign, ArrowLeft,
  Share2, Bookmark, Star, Users, CheckCircle2,
  ChevronRight, Heart, Copy, Check, Globe,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { sharedItineraries } from '../data/community';

const DEMO_DAYS = [
  {
    id: 1, label: 'Day 1', city: 'Ubud',
    activities: [
      { id: 1,  name: 'Hotel Check-in & Welcome Drink', category: 'accommodation', icon: '🏨', duration: '1 hr',    price: '$120' },
      { id: 2,  name: 'Ubud Sacred Monkey Forest',      category: 'nature',        icon: '🌿', duration: '2-3 hrs', price: '$5'   },
      { id: 3,  name: 'Local Warung Dinner',             category: 'food',          icon: '🍜', duration: '1.5 hrs', price: '$15'  },
    ],
  },
  {
    id: 2, label: 'Day 2', city: 'Ubud / Tegallalang',
    activities: [
      { id: 4,  name: 'Tegallalang Rice Terrace Trek',   category: 'nature',   icon: '🌿', duration: '3 hrs',    price: '$10'  },
      { id: 5,  name: 'Traditional Cooking Class',       category: 'food',     icon: '🍜', duration: '3 hrs',    price: '$45'  },
      { id: 6,  name: 'Sunset at Campuhan Ridge Walk',   category: 'nature',   icon: '🌅', duration: '1.5 hrs',  price: 'Free' },
    ],
  },
  {
    id: 3, label: 'Day 3', city: 'Seminyak / Kuta',
    activities: [
      { id: 7,  name: 'Tanah Lot Temple Visit',          category: 'culture',     icon: '🏛️', duration: '2 hrs',  price: '$8'   },
      { id: 8,  name: 'Seminyak Beach Afternoon',        category: 'sightseeing', icon: '🏖️', duration: '3 hrs',  price: 'Free' },
      { id: 9,  name: 'Rooftop Bar Sunset Drinks',       category: 'food',        icon: '🍹', duration: '2 hrs',  price: '$30'  },
    ],
  },
];

const catVariant = (cat) => {
  const m = { sightseeing:'indigo', food:'sand', adventure:'pink', culture:'teal', nature:'green', transport:'slate', accommodation:'slate' };
  return m[cat] ?? 'slate';
};

export default function SharedItinerary() {
  const navigate = useNavigate();
  const { id } = useParams();

  const plan = sharedItineraries.find(p => p.id === id) ?? sharedItineraries[0];
  const days = DEMO_DAYS;

  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalActivities = days.reduce((s, d) => s + d.activities.length, 0);
  const totalSpend = days.reduce((s, d) =>
    s + d.activities.reduce((ss, a) => {
      const n = parseFloat(String(a.price).replace(/[^0-9.]/g, '') || 0);
      return ss + n;
    }, 0), 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-12">

      {/* ── Back + Actions ───────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLiked(v => !v)}
            className={`p-2.5 rounded-xl transition-all border ${liked ? 'text-red-500 bg-red-50 border-red-100' : 'text-slate-400 bg-white border-slate-200 hover:border-red-200 hover:text-red-400'}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
          </button>
          <button
            onClick={() => setSaved(v => !v)}
            className={`p-2.5 rounded-xl transition-all border ${saved ? 'text-primary-600 bg-primary-50 border-primary-200' : 'text-slate-400 bg-white border-slate-200 hover:border-primary-200 hover:text-primary-500'}`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-primary-500' : ''}`} />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:border-slate-300 hover:text-slate-800 transition-all"
          >
            {copied ? <><Check className="w-4 h-4 text-emerald-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
          </button>
          <Button variant="brand" size="sm">
            <Globe className="w-4 h-4" /> Use This Plan
          </Button>
        </div>
      </div>

      {/* ── Hero Card ───────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden shadow-card-lg h-72 md:h-80">
        <img src={plan.image} alt={plan.destination} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold border border-white/30">
              <Globe className="w-3 h-3" /> Public Itinerary
            </span>
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold border border-white/30">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> {plan.rating}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight drop-shadow-lg">
            {plan.title}
          </h1>
          <p className="text-white/80 mt-2 flex items-center gap-1.5 text-sm">
            <MapPin className="w-3.5 h-3.5" />{plan.destination}
          </p>
        </div>
      </div>

      {/* ── Author + Meta ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-100 shadow-card p-5">
        <div className="flex items-center gap-3">
          <img src={plan.author.avatar} alt={plan.author.name} className="w-12 h-12 rounded-full bg-primary-100 border-2 border-white shadow-sm object-cover" />
          <div>
            <p className="font-semibold text-slate-800">{plan.author.name}</p>
            <p className="text-sm text-slate-400">{plan.author.handle}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary-400" />{plan.days} days</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary-400" />{plan.activities} activities</span>
          <span className="flex items-center gap-1.5"><Bookmark className="w-4 h-4 text-primary-400" />{plan.saves} saves</span>
          <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary-400" />{plan.views.toLocaleString()} views</span>
        </div>
      </div>

      {/* ── Stats Strip ─────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Days',       value: days.length,    icon: Calendar     },
          { label: 'Activities', value: totalActivities, icon: CheckCircle2 },
          { label: 'Est. Spend', value: `$${totalSpend.toFixed(0)}`, icon: DollarSign },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 text-center">
            <Icon className="w-5 h-5 text-primary-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
            <p className="text-xs text-slate-400 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Description ─────────────────────────────────────────── */}
      <div className="p-5 bg-primary-50 border border-primary-100 rounded-2xl">
        <p className="text-sm text-primary-800 leading-relaxed">{plan.description}</p>
      </div>

      {/* ── Tags ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {plan.tags.map(t => (
          <Badge key={t} variant={catVariant(t.toLowerCase())}>{t}</Badge>
        ))}
        <span className="text-sm font-semibold text-primary-600 px-3 py-1 bg-primary-50 rounded-full">{plan.budget}</span>
      </div>

      {/* ── Day-by-Day Timeline ──────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6">Day-by-Day Itinerary</h2>
        <div className="space-y-0">
          {days.map((day, dayIdx) => (
            <div key={day.id} className="relative">
              {dayIdx < days.length - 1 && (
                <div className="absolute left-[1.625rem] top-14 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 to-slate-100 z-0" />
              )}
              <div className="relative z-10 flex gap-5 pb-8">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-brand"
                    style={{ backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)' }}>
                    D{dayIdx + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{day.label}</h3>
                      {day.city && (
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-primary-400" />{day.city}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    {day.activities.map((act, actIdx) => (
                      <div key={act.id} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-200 group">
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                          <span className="text-2xl">{act.icon ?? '📍'}</span>
                          {actIdx < day.activities.length - 1 && <div className="w-px h-4 bg-slate-200" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <p className="font-semibold text-slate-800 text-sm">{act.name}</p>
                            <Badge variant={catVariant(act.category)} className="flex-shrink-0">{act.category}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            {act.duration && (
                              <span className="flex items-center gap-1 text-xs text-slate-400">
                                <Clock className="w-3 h-3" />{act.duration}
                              </span>
                            )}
                            {act.price && (
                              <span className="flex items-center gap-1 text-xs text-slate-400">
                                <DollarSign className="w-3 h-3" />{act.price}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-primary-400 transition-colors flex-shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer CTA ──────────────────────────────────────────── */}
      <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <p className="text-sm text-slate-500">
          ✦ Shared via <span className="font-semibold text-primary-600">Traveloop</span>
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={() => navigate('/community')}>
            More Itineraries
          </Button>
          <Button variant="brand" size="sm">
            <Globe className="w-4 h-4" /> Use This Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
