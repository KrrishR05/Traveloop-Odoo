import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, FileText, DollarSign, Image, ArrowRight, ArrowLeft, CheckCircle2,
} from 'lucide-react';
import Button from '../components/ui/Button';

const DESTINATIONS_QUICK = [
  'Bali, Indonesia', 'Paris, France', 'Tokyo, Japan', 'Santorini, Greece',
  'New York, USA', 'Swiss Alps', 'Maldives', 'Kyoto, Japan',
];

const TRIP_TYPES = [
  { id: 'adventure',  label: 'Adventure',  emoji: '🧗' },
  { id: 'relaxation', label: 'Relaxation', emoji: '🌴' },
  { id: 'cultural',   label: 'Cultural',   emoji: '🏛️' },
  { id: 'romantic',   label: 'Romantic',   emoji: '💑' },
  { id: 'family',     label: 'Family',     emoji: '👨‍👩‍👧' },
  { id: 'business',   label: 'Business',   emoji: '💼' },
];

export default function CreateTrip() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title:       '',
    destination: '',
    startDate:   '',
    endDate:     '',
    description: '',
    tripType:    '',
    budget:      '',
    coverImage:  '',
  });

  const update = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const tripDays = (() => {
    if (!form.startDate || !form.endDate) return 0;
    const diff = (new Date(form.endDate) - new Date(form.startDate)) / 86_400_000;
    return diff > 0 ? diff + 1 : 0;
  })();

  const isStep1Valid = form.title && form.destination && form.startDate && form.endDate;

  const handleCreate = () => {
    // In a real app, persist trip data; here we navigate with a static id
    navigate('/trips/1/itinerary', { state: { trip: form, days: tripDays } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      {/* ── Page header ────────────────────────────────────────── */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700
            transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Plan a New Trip</h1>
        <p className="text-slate-500 text-sm mt-1">Fill in the details to start building your itinerary</p>
      </div>

      {/* ── Step indicator ─────────────────────────────────────── */}
      <div className="flex items-center gap-0 mb-10">
        {[1, 2].map((s, i) => (
          <div key={s} className="flex items-center">
            <button
              onClick={() => s < step && setStep(s)}
              className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold
                transition-all duration-200
                ${step >= s
                  ? 'text-white shadow-brand'
                  : 'bg-slate-100 text-slate-400'}`}
              style={step >= s
                ? { backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)' }
                : {}}
            >
              {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
            </button>
            <span className={`hidden sm:block ml-2 text-sm font-medium mr-6 ${step >= s ? 'text-slate-800' : 'text-slate-400'}`}>
              {s === 1 ? 'Trip Details' : 'Preferences'}
            </span>
            {i < 1 && <div className={`h-px flex-1 mx-2 ${step > s ? 'bg-primary-400' : 'bg-slate-200'} sm:w-8 w-4`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">

        {/* ── Form ─────────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-5">
          {step === 1 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 space-y-5">
              <h2 className="text-lg font-semibold text-slate-800">Trip Details</h2>

              {/* Title */}
              <Field label="Trip Title" icon={<FileText className="w-4 h-4 text-slate-400" />}>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g. Bali Honeymoon 2025"
                  className="input-modern pl-11"
                />
              </Field>

              {/* Destination */}
              <Field label="Primary Destination" icon={<MapPin className="w-4 h-4 text-slate-400" />}>
                <input
                  type="text"
                  value={form.destination}
                  onChange={(e) => update('destination', e.target.value)}
                  placeholder="Where are you headed?"
                  className="input-modern pl-11"
                  list="dest-suggestions"
                />
                <datalist id="dest-suggestions">
                  {DESTINATIONS_QUICK.map((d) => <option key={d} value={d} />)}
                </datalist>
              </Field>

              {/* Quick pick chips */}
              <div className="flex flex-wrap gap-2">
                {DESTINATIONS_QUICK.slice(0, 5).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => update('destination', d)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                      ${form.destination === d
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'
                      }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Start Date" icon={<Calendar className="w-4 h-4 text-slate-400" />}>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => update('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-modern pl-11"
                  />
                </Field>
                <Field label="End Date" icon={<Calendar className="w-4 h-4 text-slate-400" />}>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => update('endDate', e.target.value)}
                    min={form.startDate || new Date().toISOString().split('T')[0]}
                    className="input-modern pl-11"
                  />
                </Field>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Tell us about your trip — what's the vibe, who's going, any must-sees?"
                  rows={3}
                  maxLength={300}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50
                    focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400
                    transition-all text-sm text-slate-800 placeholder:text-slate-400 resize-none"
                />
                <p className="text-right text-xs text-slate-400">{form.description.length}/300</p>
              </div>

              <Button
                variant="brand"
                size="lg"
                className="w-full"
                disabled={!isStep1Valid}
                onClick={() => setStep(2)}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 space-y-5">
              <h2 className="text-lg font-semibold text-slate-800">Preferences</h2>

              {/* Trip type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Trip Type</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {TRIP_TYPES.map(({ id, label, emoji }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => update('tripType', id)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-sm
                        transition-all duration-200
                        ${form.tripType === id
                          ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-glow'
                          : 'border-slate-200 text-slate-600 hover:border-primary-300'
                        }`}
                    >
                      <span className="text-xl">{emoji}</span>
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <Field label="Estimated Budget (USD)" icon={<DollarSign className="w-4 h-4 text-slate-400" />}>
                <input
                  type="number"
                  value={form.budget}
                  onChange={(e) => update('budget', e.target.value)}
                  placeholder="e.g. 2500"
                  className="input-modern pl-11"
                />
              </Field>

              {/* Cover image */}
              <Field label="Cover Image URL (optional)" icon={<Image className="w-4 h-4 text-slate-400" />}>
                <input
                  type="url"
                  value={form.coverImage}
                  onChange={(e) => update('coverImage', e.target.value)}
                  placeholder="https://images.unsplash.com/…"
                  className="input-modern pl-11"
                />
              </Field>

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" size="md" className="flex-1" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button variant="brand" size="md" className="flex-1" onClick={handleCreate}>
                  Build Itinerary <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Live Preview Card ─────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="sticky top-28">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Preview</p>
            <div className="rounded-2xl border border-slate-100 shadow-card overflow-hidden">
              {/* Cover */}
              <div className="relative h-36 bg-gradient-to-br from-primary-600 to-indigo-600">
                {form.coverImage && (
                  <img
                    src={form.coverImage}
                    alt="Cover"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                {!form.coverImage && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <p className="font-semibold text-sm drop-shadow">
                    {form.title || 'Your Trip Title'}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-3 bg-white">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  <span>{form.destination || 'Destination'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  <span>
                    {form.startDate && form.endDate
                      ? `${new Date(form.startDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })} – ${new Date(form.endDate).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`
                      : 'Select dates'}
                  </span>
                </div>
                {tripDays > 0 && (
                  <div className="px-3 py-1.5 bg-primary-50 rounded-lg text-xs font-medium text-primary-700 inline-block">
                    {tripDays} {tripDays === 1 ? 'day' : 'days'}
                  </div>
                )}
                {form.budget && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <DollarSign className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span>Budget: ${parseInt(form.budget).toLocaleString()}</span>
                  </div>
                )}
                {form.description && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{form.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Small reusable field wrapper for icon inputs */
function Field({ label, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          {icon}
        </div>
        {children}
      </div>
    </div>
  );
}
