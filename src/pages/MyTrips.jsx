import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Users, Plus, Star, ArrowRight,
  Clock, CheckCircle2, Zap, Filter, ChevronRight,
  BookOpen, Share2, MoreHorizontal,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { myTrips } from '../data/community';

const STATUS_TABS = [
  { id: 'all',       label: 'All Trips',  count: myTrips.length },
  { id: 'upcoming',  label: 'Upcoming',   count: myTrips.filter(t => t.status === 'upcoming').length },
  { id: 'ongoing',   label: 'Ongoing',    count: myTrips.filter(t => t.status === 'ongoing').length },
  { id: 'completed', label: 'Completed',  count: myTrips.filter(t => t.status === 'completed').length },
];

const statusBadge = (status) => {
  const map = {
    upcoming:  { variant: 'green', label: '✦ Upcoming'  },
    ongoing:   { variant: 'indigo', label: '● Ongoing'   },
    completed: { variant: 'slate', label: '✓ Completed'  },
  };
  return map[status] ?? { variant: 'slate', label: status };
};

export default function MyTrips() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [openMenuId, setOpenMenuId] = useState(null);

  const filtered = activeTab === 'all' ? myTrips : myTrips.filter(t => t.status === activeTab);

  const stats = [
    { label: 'Total Trips',   value: myTrips.length,                                        icon: MapPin,       color: 'text-primary-600 bg-primary-50'   },
    { label: 'Countries',     value: 12,                                                     icon: Zap,          color: 'text-indigo-600 bg-indigo-50'      },
    { label: 'Days Traveled', value: myTrips.filter(t=>t.status==='completed').reduce((s,t)=>s+parseInt(t.duration),0), icon: Calendar, color: 'text-amber-600 bg-amber-50' },
    { label: 'Activities',    value: myTrips.reduce((s,t)=>s+t.activities,0),                icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50'    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-10">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary-600 mb-1">My Journey</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Trips</h1>
          <p className="text-slate-500 mt-1 text-sm">All your adventures, beautifully organized.</p>
        </div>
        <Button variant="brand" size="md" onClick={() => navigate('/trips/create')}>
          <Plus className="w-4 h-4" /> Plan New Trip
        </Button>
      </div>

      {/* ── Stats Strip ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800 tracking-tight leading-none">{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'text-white shadow-brand'
                : 'text-slate-600 bg-white border border-slate-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            style={activeTab === tab.id ? { backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)' } : {}}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
              ${activeTab === tab.id ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {tab.count}
            </span>
          </button>
        ))}
        <button className="ml-auto flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700
          px-3 py-2 rounded-xl hover:bg-slate-100 transition-all">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* ── Trip Cards Grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((trip, i) => {
          const badge = statusBadge(trip.status);
          return (
            <Card
              key={trip.id}
              className="p-0 overflow-hidden group cursor-pointer"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Cover Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/10 to-transparent" />

                {/* Status badge top-left */}
                <div className="absolute top-3 left-3">
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>

                {/* Menu top-right */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === trip.id ? null : trip.id); }}
                    className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full
                      text-slate-600 hover:bg-white transition-all shadow-sm"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {openMenuId === trip.id && (
                    <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-card-lg border border-slate-100
                      py-1.5 z-20 min-w-[150px] animate-[fadeUp_0.2s_ease-out_forwards]">
                      {[
                        { icon: ArrowRight, label: 'View Itinerary' },
                        { icon: Share2, label: 'Share Trip' },
                        { icon: BookOpen, label: 'Add Journal' },
                      ].map(({ icon: Icon, label }) => (
                        <button key={label} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700
                          hover:bg-slate-50 transition-colors">
                          <Icon className="w-4 h-4 text-slate-400" />
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Title & date overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-bold text-white text-base leading-tight drop-shadow">{trip.name}</h3>
                  <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {trip.date}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4">
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary-400" />{trip.duration}</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-primary-400" />{trip.companions + 1} people</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-primary-400" />{trip.activities} activities</span>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {trip.highlights.slice(0, 3).map(h => (
                    <span key={h} className="text-xs bg-primary-50 text-primary-700 px-2.5 py-0.5 rounded-full font-medium">{h}</span>
                  ))}
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700">{trip.budget}</span>
                    {trip.rating && (
                      <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {trip.rating}.0
                      </span>
                    )}
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/trips/${trip.id}/view`)}
                    className="gap-1"
                  >
                    View <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {/* Add Trip CTA */}
        <button
          onClick={() => navigate('/trips/create')}
          className="flex flex-col items-center justify-center gap-3 rounded-2xl
            border-2 border-dashed border-slate-200 p-8 text-slate-400
            hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50
            transition-all duration-300 min-h-[320px] cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center
            bg-slate-100 group-hover:bg-primary-100 transition-colors">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">Plan a new trip</p>
            <p className="text-xs mt-1 text-slate-300">Add your next adventure</p>
          </div>
        </button>
      </div>
    </div>
  );
}
