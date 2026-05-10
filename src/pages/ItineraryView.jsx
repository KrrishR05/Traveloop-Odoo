import { useLocation, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Clock, DollarSign, ArrowLeft, Printer, Share2,
  CheckCircle2, ChevronRight,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

/* ── Default demo data shown when navigating directly ─────────── */
const DEMO_TRIP = {
  title: 'Bali Adventure 2025',
  destination: 'Bali, Indonesia',
  startDate: '2025-08-10',
  endDate: '2025-08-14',
  description: 'Five days of temples, rice terraces, and beachside sunsets.',
  budget: '2000',
  tripType: 'adventure',
};

const DEMO_ITINERARY = [
  {
    id: 1, label: 'Day 1', city: 'Ubud',
    activities: [
      { id: 1, name: 'Hotel Check-in & Settle',      category: 'accommodation', icon: '🏨', duration: '1 hr',    price: '$120' },
      { id: 2, name: 'Ubud Sacred Monkey Forest',    category: 'nature',        icon: '🌿', duration: '2-3 hrs', price: '$5'   },
      { id: 3, name: 'Local Warung Dinner',           category: 'food',          icon: '🍜', duration: '1.5 hrs', price: '$15'  },
    ],
  },
  {
    id: 2, label: 'Day 2', city: 'Ubud / Tegallalang',
    activities: [
      { id: 4, name: 'Tegallalang Rice Terrace Trek', category: 'nature',   icon: '🌿', duration: '3 hrs',    price: '$10' },
      { id: 5, name: 'Traditional Cooking Class',     category: 'food',     icon: '🍜', duration: '3 hrs',    price: '$45' },
      { id: 6, name: 'Sunset at Campuhan Ridge',      category: 'nature',   icon: '🌅', duration: '1.5 hrs',  price: 'Free'},
    ],
  },
  {
    id: 3, label: 'Day 3', city: 'Seminyak / Kuta',
    activities: [
      { id: 7, name: 'Tanah Lot Temple Visit',        category: 'culture',      icon: '🏛️', duration: '2 hrs',  price: '$8' },
      { id: 8, name: 'Seminyak Beach Afternoon',      category: 'sightseeing',  icon: '🏖️', duration: '3 hrs',  price: 'Free' },
      { id: 9, name: 'Rooftop Bar Sunset',            category: 'food',         icon: '🍹', duration: '2 hrs',  price: '$30' },
    ],
  },
  {
    id: 4, label: 'Day 4', city: 'Mount Batur',
    activities: [
      { id: 10, name: 'Pre-dawn Volcano Hike',       category: 'adventure',    icon: '🧗', duration: 'Full day', price: '$55' },
      { id: 11, name: 'Traditional Balinese Massage', category: 'culture',     icon: '💆', duration: '1.5 hrs', price: '$20'  },
    ],
  },
  {
    id: 5, label: 'Day 5', city: 'Ngurah Rai Airport',
    activities: [
      { id: 12, name: 'Souvenir Shopping — Sukawati', category: 'culture',   icon: '🛍️', duration: '2 hrs', price: '$30' },
      { id: 13, name: 'Airport Transfer',             category: 'transport', icon: '✈️', duration: '1 hr',  price: '$25' },
    ],
  },
];

const categoryVariant = (cat) => {
  const m = { sightseeing: 'indigo', food: 'sand', adventure: 'pink',
              culture: 'teal', nature: 'green', transport: 'slate', accommodation: 'slate' };
  return m[cat] ?? 'slate';
};

export default function ItineraryView() {
  const navigate = useNavigate();
  const location = useLocation();

  const trip      = location.state?.trip      ?? DEMO_TRIP;
  const itinerary = location.state?.itinerary ?? DEMO_ITINERARY;

  const totalActivities = itinerary.reduce((s, d) => s + d.activities.length, 0);
  const totalSpend      = itinerary.reduce((s, d) =>
    s + d.activities.reduce((ss, a) => {
      const n = parseFloat(String(a.price).replace(/[^0-9.]/g, '') || 0);
      return ss + n;
    }, 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Builder
          </button>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{trip.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="w-4 h-4 text-primary-500" /> {trip.destination}
            </span>
            {trip.startDate && (
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar className="w-4 h-4 text-primary-500" />
                {new Date(trip.startDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                {' – '}
                {new Date(trip.endDate || trip.startDate).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print
          </Button>
          <Button variant="secondary" size="sm">
            <Share2 className="w-4 h-4" /> Share
          </Button>
          <Button variant="brand" size="sm"
            onClick={() => navigate('/trips/1/itinerary', { state: { trip, itinerary } })}>
            Edit
          </Button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Days',        value: itinerary.length,  icon: Calendar   },
          { label: 'Activities',  value: totalActivities,   icon: CheckCircle2 },
          { label: 'Est. Spend',  value: `$${totalSpend.toFixed(0)}`, icon: DollarSign },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 text-center">
            <Icon className="w-5 h-5 text-primary-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
            <p className="text-xs text-slate-400 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Trip description */}
      {trip.description && (
        <div className="mb-8 p-5 bg-primary-50 border border-primary-100 rounded-2xl">
          <p className="text-sm text-primary-800 leading-relaxed">{trip.description}</p>
        </div>
      )}

      {/* ── Timeline ────────────────────────────────────────────── */}
      <div className="space-y-0">
        {itinerary.map((day, dayIdx) => (
          <div key={day.id} className="relative">
            {/* Vertical connector */}
            {dayIdx < itinerary.length - 1 && (
              <div className="absolute left-[1.625rem] top-14 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 to-slate-100 z-0" />
            )}

            <div className="relative z-10 flex gap-5 pb-8">
              {/* Day badge */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div
                  className="w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-brand"
                  style={{ backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)' }}
                >
                  D{dayIdx + 1}
                </div>
              </div>

              {/* Day content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">{day.label}</h2>
                    {day.city && (
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-primary-400" /> {day.city}
                      </p>
                    )}
                  </div>
                </div>

                {/* Activities */}
                <div className="space-y-3">
                  {day.activities.length === 0 ? (
                    <p className="text-sm text-slate-300 italic">No activities planned</p>
                  ) : (
                    day.activities.map((act, actIdx) => (
                      <div
                        key={act.id}
                        className="flex items-start gap-4 p-4 bg-white rounded-2xl
                          border border-slate-100 shadow-card
                          hover:shadow-card-lg hover:-translate-y-0.5 transition-all duration-200 group"
                      >
                        {/* Icon + connector */}
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                          <span className="text-2xl">{act.icon ?? '📍'}</span>
                          {actIdx < day.activities.length - 1 && (
                            <div className="w-px h-4 bg-slate-200" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <p className="font-semibold text-slate-800 text-sm">{act.name}</p>
                            <Badge variant={categoryVariant(act.category)} className="flex-shrink-0">
                              {act.category}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            {act.duration && (
                              <span className="flex items-center gap-1 text-xs text-slate-400">
                                <Clock className="w-3 h-3" /> {act.duration}
                              </span>
                            )}
                            {act.price && (
                              <span className="flex items-center gap-1 text-xs text-slate-400">
                                <DollarSign className="w-3 h-3" /> {act.price}
                              </span>
                            )}
                          </div>
                          {act.note && (
                            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{act.note}</p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-primary-400
                          transition-colors flex-shrink-0 mt-0.5" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <p className="text-sm text-slate-500">
          ✦ Trip planned with <span className="font-semibold text-primary-600">Traveloop</span>
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={() => navigate('/activities/search')}>
            Find More Activities
          </Button>
          <Button variant="brand" size="sm" onClick={() => navigate('/trips/1/itinerary', { state: { trip } })}>
            Edit Itinerary
          </Button>
        </div>
      </div>
    </div>
  );
}
