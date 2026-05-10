import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus, Trash2, ChevronDown, ChevronUp, MapPin, Clock,
  DollarSign, ArrowLeft, Eye, GripVertical, Sparkles,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { suggestedActivitiesForTrip, activityCategories } from '../data/activities';

const ACTIVITY_ICONS = {
  sightseeing:   '🏛️',
  food:          '🍜',
  adventure:     '🧗',
  culture:       '🎭',
  nature:        '🌿',
  transport:     '🚌',
  accommodation: '🏨',
};

const categoryVariant = (cat) => {
  const m = { sightseeing: 'indigo', food: 'sand', adventure: 'pink',
              culture: 'teal', nature: 'green', transport: 'slate', accommodation: 'slate' };
  return m[cat] ?? 'slate';
};

let activityIdCounter = 100;

function makeDay(index, cityName) {
  return { id: Date.now() + index, label: `Day ${index + 1}`, city: cityName, activities: [] };
}

function makeActivity(data = {}) {
  activityIdCounter++;
  return {
    id:       activityIdCounter,
    name:     data.name     ?? '',
    category: data.category ?? 'sightseeing',
    duration: data.duration ?? '',
    price:    data.price    ?? '',
    note:     data.note     ?? '',
    icon:     data.icon     ?? '📍',
  };
}

export default function BuildItinerary() {
  const navigate = useNavigate();
  const location = useLocation();
  const trip  = location.state?.trip  ?? { title: 'My Trip', destination: 'Bali, Indonesia', budget: '2000' };
  const days  = Math.max(location.state?.days ?? 3, 1);

  const [itinerary, setItinerary] = useState(() =>
    Array.from({ length: Math.min(days, 7) }, (_, i) => makeDay(i, trip.destination))
  );
  const [collapsed, setCollapsed] = useState({});
  const [modal, setModal]         = useState({ open: false, dayId: null });
  const [newAct, setNewAct]       = useState(makeActivity());

  /* ── Itinerary mutations ───────────────────────────────────── */
  const addDay = () =>
    setItinerary((prev) => [...prev, makeDay(prev.length, trip.destination)]);

  const removeDay = (dayId) =>
    setItinerary((prev) => prev.filter((d) => d.id !== dayId).map((d, i) => ({ ...d, label: `Day ${i + 1}` })));

  const updateDayCity = (dayId, city) =>
    setItinerary((prev) => prev.map((d) => d.id === dayId ? { ...d, city } : d));

  const openAddActivity = (dayId) => {
    setNewAct(makeActivity());
    setModal({ open: true, dayId });
  };

  const confirmAddActivity = () => {
    if (!newAct.name) return;
    setItinerary((prev) =>
      prev.map((d) =>
        d.id === modal.dayId
          ? { ...d, activities: [...d.activities, { ...newAct }] }
          : d
      )
    );
    setModal({ open: false, dayId: null });
  };

  const addSuggestedActivity = (dayId, suggestion) => {
    setItinerary((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? { ...d, activities: [...d.activities, makeActivity(suggestion)] }
          : d
      )
    );
  };

  const removeActivity = (dayId, actId) =>
    setItinerary((prev) =>
      prev.map((d) =>
        d.id === dayId
          ? { ...d, activities: d.activities.filter((a) => a.id !== actId) }
          : d
      )
    );

  /* ── Budget calculation ────────────────────────────────────── */
  const totalSpend = itinerary.reduce((sum, day) =>
    sum + day.activities.reduce((s, a) => {
      const n = parseFloat(String(a.price).replace(/[^0-9.]/g, '') || 0);
      return s + n;
    }, 0), 0);

  const budget = parseFloat(trip.budget ?? 0);
  const pct    = budget > 0 ? Math.min((totalSpend / budget) * 100, 100) : 0;

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {trip.title || 'Build Itinerary'}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary-500" /> {trip.destination}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={() => navigate('/trips/1/view', { state: { itinerary, trip } })}>
            <Eye className="w-4 h-4" /> Preview
          </Button>
          <Button variant="brand" size="sm" onClick={() => navigate('/trips/1/view', { state: { itinerary, trip } })}>
            View Itinerary <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Days column ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {itinerary.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              collapsed={!!collapsed[day.id]}
              onToggle={() => setCollapsed((c) => ({ ...c, [day.id]: !c[day.id] }))}
              onCityChange={(city) => updateDayCity(day.id, city)}
              onAddActivity={() => openAddActivity(day.id)}
              onAddSuggested={(s) => addSuggestedActivity(day.id, s)}
              onRemoveActivity={(actId) => removeActivity(day.id, actId)}
              onRemoveDay={() => removeDay(day.id)}
              showRemove={itinerary.length > 1}
            />
          ))}

          {/* Add Day */}
          <button
            onClick={addDay}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200
              text-slate-400 hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50
              flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200"
          >
            <Plus className="w-4 h-4" /> Add Another Day
          </button>
        </div>

        {/* ── Sidebar ────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Budget tracker */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary-500" /> Budget Tracker
            </h3>
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-500">Spent</span>
                <span className="font-semibold text-slate-800">${totalSpend.toFixed(0)}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    pct > 90 ? 'bg-red-400' : pct > 70 ? 'bg-amber-400' : 'bg-primary-500'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>$0</span>
                <span>Budget: {budget > 0 ? `$${budget}` : 'Not set'}</span>
              </div>
            </div>
            {budget > 0 && (
              <p className={`text-xs font-medium ${pct > 90 ? 'text-red-500' : 'text-primary-600'}`}>
                {pct > 90
                  ? '⚠️ Over budget!'
                  : `$${(budget - totalSpend).toFixed(0)} remaining`}
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-500" /> Trip Summary
            </h3>
            <div className="space-y-2">
              <Row label="Total days"       value={`${itinerary.length} days`} />
              <Row label="Activities"       value={`${itinerary.reduce((s,d)=>s+d.activities.length,0)} planned`} />
              <Row label="Cities"           value={[...new Set(itinerary.map(d=>d.city))].filter(Boolean).length || '—'} />
              <Row label="Est. spend"       value={`$${totalSpend.toFixed(0)}`} />
            </div>
          </div>

          {/* Suggested activities */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Quick Suggestions
            </h3>
            <p className="text-xs text-slate-400 mb-3">Tap to add to any day</p>
            <div className="space-y-2">
              {suggestedActivitiesForTrip.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    const dayId = itinerary[0]?.id;
                    if (dayId) addSuggestedActivity(dayId, s);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    text-left text-sm border border-slate-100 hover:border-primary-200
                    hover:bg-primary-50 transition-all duration-200 group"
                >
                  <span className="text-base">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 font-medium text-xs truncate">{s.name}</p>
                    <p className="text-slate-400 text-xs">{s.duration} · {s.price}</p>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Activity Modal ─────────────────────────────────── */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, dayId: null })}
        title="Add Activity"
        size="sm"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Activity Name *</label>
            <input
              type="text"
              value={newAct.name}
              onChange={(e) => setNewAct((a) => ({ ...a, name: e.target.value }))}
              placeholder="e.g. Visit Tanah Lot Temple"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400
                text-sm transition-all"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Category</label>
            <div className="grid grid-cols-4 gap-1.5">
              {activityCategories.filter(c=>c.id!=='all').map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setNewAct((a) => ({ ...a, category: c.id, icon: c.icon }))}
                  className={`flex flex-col items-center gap-1 py-2 rounded-xl border text-xs transition-all
                    ${newAct.category === c.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 text-slate-600 hover:border-primary-300'
                    }`}
                >
                  <span>{c.icon}</span>
                  <span className="leading-tight text-center">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Duration</label>
              <input
                type="text"
                value={newAct.duration}
                onChange={(e) => setNewAct((a) => ({ ...a, duration: e.target.value }))}
                placeholder="e.g. 2 hrs"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                  focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Est. Cost</label>
              <input
                type="text"
                value={newAct.price}
                onChange={(e) => setNewAct((a) => ({ ...a, price: e.target.value }))}
                placeholder="e.g. $15"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                  focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Notes (optional)</label>
            <input
              type="text"
              value={newAct.note}
              onChange={(e) => setNewAct((a) => ({ ...a, note: e.target.value }))}
              placeholder="Booking link, timings, tips…"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 text-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setModal({ open: false, dayId: null })}>
              Cancel
            </Button>
            <Button variant="brand" size="md" className="flex-1" onClick={confirmAddActivity} disabled={!newAct.name}>
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────── */

function DayCard({ day, collapsed, onToggle, onCityChange, onAddActivity, onAddSuggested, onRemoveActivity, onRemoveDay, showRemove }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
      {/* Day header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-50">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)' }}>
          {day.label.replace('Day ', '')}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm">{day.label}</p>
          <input
            type="text"
            value={day.city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="City / Location"
            className="text-xs text-slate-400 bg-transparent border-none outline-none w-full
              focus:text-primary-600 transition-colors placeholder:text-slate-300"
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-slate-400">{day.activities.length} activities</span>
          {showRemove && (
            <button
              onClick={onRemoveDay}
              className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all ml-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-all ml-1"
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Activities list */}
      {!collapsed && (
        <div className="p-4 space-y-2.5">
          {day.activities.length === 0 && (
            <p className="text-center text-sm text-slate-300 py-4">No activities yet — add your first one!</p>
          )}
          {day.activities.map((act, idx) => (
            <div
              key={act.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100
                border border-transparent hover:border-slate-200 transition-all duration-200 group"
            >
              <GripVertical className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0 cursor-grab" />
              <span className="text-lg flex-shrink-0 mt-0.5">{act.icon || ACTIVITY_ICONS[act.category] || '📍'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{act.name}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant={categoryVariant(act.category)}>{act.category}</Badge>
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
                {act.note && <p className="text-xs text-slate-400 mt-1 truncate">{act.note}</p>}
              </div>
              <button
                onClick={() => onRemoveActivity(act.id)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50
                  opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Add activity button */}
          <button
            onClick={onAddActivity}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
              border-2 border-dashed border-slate-200 text-sm text-slate-400
              hover:border-primary-300 hover:text-primary-500 hover:bg-primary-50
              transition-all duration-200"
          >
            <Plus className="w-4 h-4" /> Add Activity
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-800">{value}</span>
    </div>
  );
}
