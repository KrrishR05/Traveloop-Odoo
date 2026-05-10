import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, BookOpen, Star, Calendar, MapPin, Tag,
  Search, Trash2, Edit3, ChevronRight, X, Check,
  Cloud, Sun, CloudRain, Smile, Meh, Zap, Heart,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { journalEntries, myTrips } from '../data/community';

const MOODS = ['😊', '🤩', '😄', '😋', '😌', '😢', '😴', '🤔'];

const moodLabels = {
  '😊': 'Happy', '🤩': 'Amazed', '😄': 'Excited',
  '😋': 'Satisfied', '😌': 'Peaceful', '😢': 'Melancholy',
  '😴': 'Tired', '🤔': 'Thoughtful',
};

const tripColors = {
  1: 'from-violet-500 to-purple-600',
  2: 'from-red-500 to-rose-600',
  3: 'from-teal-500 to-emerald-600',
  4: 'from-indigo-500 to-blue-600',
};

function EntryCard({ entry, onDelete, onEdit, onStar }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300 group">
      {/* Trip header */}
      <div className={`bg-gradient-to-r ${tripColors[entry.tripId] ?? 'from-primary-500 to-indigo-500'} px-5 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-white/80" />
          <span className="text-xs font-semibold text-white/90">{entry.tripName}</span>
        </div>
        <button
          onClick={() => onStar(entry.id)}
          className={`text-white/80 hover:text-white transition-colors ${entry.isStarred ? 'text-yellow-300' : ''}`}
        >
          <Star className={`w-4 h-4 ${entry.isStarred ? 'fill-yellow-300 text-yellow-300' : ''}`} />
        </button>
      </div>

      <div className="p-5">
        {/* Date + mood */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{entry.mood}</span>
            <div>
              <p className="text-xs text-slate-400 font-medium">{moodLabels[entry.mood] ?? 'Feeling'}</p>
              <p className="text-xs text-slate-400">{entry.date}</p>
            </div>
          </div>
          {entry.weather && (
            <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
              <Sun className="w-3 h-3 text-amber-400" />{entry.weather}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-primary-700 transition-colors leading-tight">
          {entry.title}
        </h3>

        {/* Content preview */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">{entry.content}</p>

        {/* Image strip */}
        {entry.images?.length > 0 && (
          <div className="flex gap-2 mb-4">
            {entry.images.map((img, i) => (
              <img key={i} src={img} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {entry.tags.map(tag => (
            <Badge key={tag} variant="teal">{tag}</Badge>
          ))}
        </div>

        {/* Highlight */}
        {entry.highlight && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl mb-4 border border-amber-100">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-800 font-medium">{entry.highlight}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(entry)}>
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Button>
          <button
            onClick={() => onDelete(entry.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TripJournal() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState(journalEntries);
  const [search, setSearch] = useState('');
  const [filterTrip, setFilterTrip] = useState('all');
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);

  const [draft, setDraft] = useState({
    tripId: myTrips[0]?.id ?? 1,
    mood: '😊',
    title: '',
    content: '',
    highlight: '',
    tags: '',
    weather: '',
  });

  const filtered = entries.filter(e => {
    const matchTrip = filterTrip === 'all' || String(e.tripId) === String(filterTrip);
    const matchSearch = !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.content.toLowerCase().includes(search.toLowerCase()) ||
      e.tripName.toLowerCase().includes(search.toLowerCase());
    return matchTrip && matchSearch;
  });

  const handleStar = (id) => setEntries(prev => prev.map(e => e.id === id ? { ...e, isStarred: !e.isStarred } : e));
  const handleDelete = (id) => setEntries(prev => prev.filter(e => e.id !== id));

  const handleEdit = (entry) => {
    setEditEntry(entry);
    setDraft({
      tripId: entry.tripId,
      mood: entry.mood,
      title: entry.title,
      content: entry.content,
      highlight: entry.highlight ?? '',
      tags: entry.tags.join(', '),
      weather: entry.weather ?? '',
    });
    setNewModalOpen(true);
  };

  const handleSave = () => {
    const tagArr = draft.tags.split(',').map(t => t.trim()).filter(Boolean);
    const tripName = myTrips.find(t => t.id === Number(draft.tripId))?.name ?? 'My Trip';
    if (editEntry) {
      setEntries(prev => prev.map(e => e.id === editEntry.id ? {
        ...e, ...draft, tripId: Number(draft.tripId), tripName, tags: tagArr,
      } : e));
    } else {
      const newEntry = {
        id: Date.now(), ...draft, tripId: Number(draft.tripId), tripName, tags: tagArr,
        date: new Date().toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }),
        images: [], isStarred: false,
      };
      setEntries(prev => [newEntry, ...prev]);
    }
    setNewModalOpen(false);
    setEditEntry(null);
    setDraft({ tripId: myTrips[0]?.id ?? 1, mood: '😊', title: '', content: '', highlight: '', tags: '', weather: '' });
  };

  const starredCount = entries.filter(e => e.isStarred).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary-600 mb-1">Your Story</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Trip Journal</h1>
          <p className="text-slate-500 mt-1 text-sm">Capture memories, feelings, and highlights from every journey.</p>
        </div>
        <Button variant="brand" size="md" onClick={() => { setEditEntry(null); setNewModalOpen(true); }}>
          <Plus className="w-4 h-4" /> New Entry
        </Button>
      </div>

      {/* ── Stats ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Journal Entries', value: entries.length, icon: BookOpen, color: 'text-primary-600 bg-primary-50' },
          { label: 'Trips Logged',    value: [...new Set(entries.map(e=>e.tripId))].length, icon: MapPin, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Starred Moments', value: starredCount, icon: Star, color: 'text-amber-600 bg-amber-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800 tracking-tight leading-none">{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Search + Filter ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search entries, trips, moments…"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-card focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all text-slate-800 placeholder:text-slate-400 text-sm" />
        </div>
        <select
          value={filterTrip}
          onChange={e => setFilterTrip(e.target.value)}
          className="px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-card text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
        >
          <option value="all">All Trips</option>
          {myTrips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </div>

      {/* ── Entries Grid ────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(entry => (
            <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} onEdit={handleEdit} onStar={handleStar} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-primary-400" />
          </div>
          <p className="font-semibold text-slate-700">No journal entries yet</p>
          <p className="text-sm text-slate-400 mt-1">Start capturing your travel memories</p>
          <Button variant="brand" size="sm" className="mt-4" onClick={() => setNewModalOpen(true)}>
            <Plus className="w-4 h-4" /> Write First Entry
          </Button>
        </div>
      )}

      {/* ── New / Edit Modal ─────────────────────────────────────── */}
      <Modal isOpen={newModalOpen} onClose={() => { setNewModalOpen(false); setEditEntry(null); }}
        title={editEntry ? 'Edit Journal Entry' : 'New Journal Entry'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Trip</label>
              <select value={draft.tripId} onChange={e => setDraft(p => ({ ...p, tripId: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all text-slate-800 text-sm">
                {myTrips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Weather</label>
              <input type="text" value={draft.weather} onChange={e => setDraft(p => ({ ...p, weather: e.target.value }))} placeholder="Sunny, 22°C"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all text-slate-800 text-sm" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Mood</label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m => (
                <button key={m} onClick={() => setDraft(p => ({ ...p, mood: m }))}
                  className={`text-2xl p-2 rounded-xl transition-all ${draft.mood === m ? 'bg-primary-100 ring-2 ring-primary-400 scale-110' : 'hover:bg-slate-100'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Title</label>
            <input type="text" value={draft.title} onChange={e => setDraft(p => ({ ...p, title: e.target.value }))} placeholder="What was the highlight of today?"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all text-slate-800 text-sm" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Journal Entry</label>
            <textarea rows={4} value={draft.content} onChange={e => setDraft(p => ({ ...p, content: e.target.value }))} placeholder="Write about your experience today…"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all text-slate-800 text-sm resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">⭐ Highlight moment</label>
              <input type="text" value={draft.highlight} onChange={e => setDraft(p => ({ ...p, highlight: e.target.value }))} placeholder="Best moment of the day"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all text-slate-800 text-sm" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Tags (comma-separated)</label>
              <input type="text" value={draft.tags} onChange={e => setDraft(p => ({ ...p, tags: e.target.value }))} placeholder="Paris, Louvre, Art"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all text-slate-800 text-sm" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={() => { setNewModalOpen(false); setEditEntry(null); }}>
              <X className="w-4 h-4" /> Cancel
            </Button>
            <Button variant="brand" size="sm" onClick={handleSave} disabled={!draft.title.trim()}>
              <Check className="w-4 h-4" /> {editEntry ? 'Update Entry' : 'Save Entry'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
