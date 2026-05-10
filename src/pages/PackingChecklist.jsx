import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckSquare, Square, Plus, Trash2, ArrowLeft, Package,
  Search, Filter, ChevronDown,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { checklistService, tripService } from '../services/api';

const CATEGORIES = [
  { id: 'all',           label: 'All',           icon: '📋' },
  { id: 'clothing',      label: 'Clothing',      icon: '👕' },
  { id: 'toiletries',    label: 'Toiletries',    icon: '🧴' },
  { id: 'electronics',   label: 'Electronics',   icon: '🔌' },
  { id: 'documents',     label: 'Documents',     icon: '📄' },
  { id: 'essentials',    label: 'Essentials',    icon: '🎒' },
  { id: 'miscellaneous', label: 'Miscellaneous', icon: '📦' },
];

const CATEGORY_VARIANTS = {
  clothing: 'indigo',
  toiletries: 'teal',
  electronics: 'sand',
  documents: 'green',
  essentials: 'red',
  miscellaneous: 'slate',
};

export default function PackingChecklist() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [items, setItems] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '', category: 'essentials' });
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch trips
  useEffect(() => {
    tripService.list()
      .then((data) => {
        const list = data.results || data;
        setTrips(list);
        if (list.length > 0) setSelectedTrip(list[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Fetch checklist items when trip changes
  useEffect(() => {
    if (!selectedTrip) return;
    refreshData();
  }, [selectedTrip]);

  const refreshData = async () => {
    if (!selectedTrip) return;
    try {
      const [itemsData, summary] = await Promise.all([
        checklistService.list(selectedTrip.id),
        checklistService.summary(selectedTrip.id),
      ]);
      setItems(itemsData.results || itemsData);
      setSummaryData(summary);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    try {
      await checklistService.toggle(id);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
    if (!newItem.name.trim()) return;
    try {
      await checklistService.add({
        trip: selectedTrip.id,
        name: newItem.name.trim(),
        category: newItem.category,
        is_packed: false,
        quantity: 1,
      });
      setNewItem({ name: '', category: 'essentials' });
      setShowAddForm(false);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (id) => {
    try {
      await checklistService.remove(id);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter items
  const filtered = items.filter((item) => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const progress = summaryData?.progress || 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-10">

      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <p className="text-sm font-medium text-primary-600 mb-1">Module 4</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Packing Checklist</h1>
          <p className="text-slate-500 mt-1 text-sm">Never forget an essential again.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTrip?.id || ''}
            onChange={(e) => {
              const t = trips.find((t) => t.id === parseInt(e.target.value));
              setSelectedTrip(t);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium
              text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/40
              transition-all"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
          <Button variant="brand" size="md" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>
      </div>

      {/* ── Progress Bar ─────────────────────────────────────────── */}
      <Card hover={false} className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-50">
              <Package className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Packing Progress</p>
              <p className="text-xs text-slate-400">
                {summaryData?.packed || 0} of {summaryData?.total || 0} items packed
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold text-primary-600">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)',
            }}
          />
        </div>

        {/* Category mini-stats */}
        {summaryData?.categories && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
            {Object.entries(summaryData.categories).map(([key, data]) => (
              <div
                key={key}
                className="text-center p-2 rounded-xl bg-slate-50 border border-slate-100"
              >
                <p className="text-lg mb-0.5">{CATEGORIES.find((c) => c.id === key)?.icon || '📦'}</p>
                <p className="text-xs font-medium text-slate-600">{data.packed}/{data.total}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── Add Item Form ────────────────────────────────────────── */}
      {showAddForm && (
        <Card hover={false} className="p-5 animate-[fadeUp_0.3s_ease-out_forwards]">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Add New Item</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Item name (e.g. Sunglasses)"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40
                text-sm text-slate-800 placeholder:text-slate-400"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40
                text-sm text-slate-700"
            >
              {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
            <Button variant="brand" size="md" onClick={handleAdd} disabled={!newItem.name.trim()}>
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
        </Card>
      )}

      {/* ── Search & Category Filter ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white
              focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400
              text-sm text-slate-800 placeholder:text-slate-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium
                transition-all duration-200
                ${activeCategory === cat.id
                  ? 'text-white shadow-brand'
                  : 'text-slate-600 bg-white border border-slate-200 hover:border-primary-300'
                }`}
              style={activeCategory === cat.id ? { backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)' } : {}}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Checklist Items ──────────────────────────────────────── */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-3 text-slate-200" />
            <p className="text-sm font-medium">No items found</p>
            <p className="text-xs mt-1">Add items to your packing list</p>
          </div>
        ) : (
          filtered.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl border transition-all duration-200
                ${item.is_packed
                  ? 'bg-primary-50/50 border-primary-100'
                  : 'bg-white border-slate-100 hover:border-primary-200 hover:shadow-sm'
                }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Toggle */}
              <button
                onClick={() => handleToggle(item.id)}
                className="flex-shrink-0 transition-transform duration-200 hover:scale-110"
              >
                {item.is_packed ? (
                  <CheckSquare className="w-5 h-5 text-primary-500" />
                ) : (
                  <Square className="w-5 h-5 text-slate-300 hover:text-primary-400" />
                )}
              </button>

              {/* Item info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium transition-all duration-200
                  ${item.is_packed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {item.name}
                </p>
                {item.quantity > 1 && (
                  <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                )}
              </div>

              {/* Category badge */}
              <Badge variant={CATEGORY_VARIANTS[item.category] || 'slate'}>
                {item.category_display || item.category}
              </Badge>

              {/* Delete */}
              <button
                onClick={() => handleRemove(item.id)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50
                  transition-all duration-200 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
