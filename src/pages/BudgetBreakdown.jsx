import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign, TrendingUp, TrendingDown, AlertTriangle,
  Plus, ArrowLeft, Wallet, CreditCard, PieChart as PieChartIcon,
  Calendar, X,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { budgetService, tripService } from '../services/api';

const CATEGORY_COLORS = {
  accommodation: '#6366f1',
  transportation: '#14b8a6',
  food: '#f59e0b',
  activities: '#ef4444',
  shopping: '#8b5cf6',
  insurance: '#06b6d4',
  visa: '#ec4899',
  miscellaneous: '#64748b',
};

const CATEGORY_ICONS = {
  accommodation: '🏨',
  transportation: '✈️',
  food: '🍽️',
  activities: '🎯',
  shopping: '🛍️',
  insurance: '🛡️',
  visa: '📄',
  miscellaneous: '📦',
};

export default function BudgetBreakdown() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: '', title: '', amount: '', date: '', notes: '',
  });

  // Fetch trips list
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

  // Fetch budget summary when trip changes
  useEffect(() => {
    if (!selectedTrip) return;
    budgetService.summary(selectedTrip.id)
      .then(setSummary)
      .catch(console.error);
  }, [selectedTrip]);

  const handleAddExpense = async () => {
    if (!newExpense.category || !newExpense.title || !newExpense.amount) return;
    try {
      await budgetService.addItem({
        category: parseInt(newExpense.category),
        title: newExpense.title,
        amount: parseFloat(newExpense.amount),
        date: newExpense.date || new Date().toISOString().split('T')[0],
        notes: newExpense.notes,
      });
      // Refresh summary
      const updated = await budgetService.summary(selectedTrip.id);
      setSummary(updated);
      setShowAddModal(false);
      setNewExpense({ category: '', title: '', amount: '', date: '', notes: '' });
    } catch (err) {
      console.error(err);
    }
  };

  // Prepare chart data
  const pieData = summary?.breakdown?.map((cat) => ({
    name: cat.label,
    value: cat.spent,
    color: CATEGORY_COLORS[cat.category] || '#64748b',
  })) || [];

  const barData = summary?.daily_spending?.map((d) => ({
    date: d.date,
    amount: parseFloat(d.total),
  })) || [];

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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Budget Breakdown</h1>
          <p className="text-slate-500 mt-1 text-sm">Track spending, stay on budget, travel smarter.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Trip selector */}
          <select
            value={selectedTrip?.id || ''}
            onChange={(e) => {
              const t = trips.find((t) => t.id === parseInt(e.target.value));
              setSelectedTrip(t);
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium
              text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400
              transition-all"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
          <Button variant="brand" size="md" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" /> Add Expense
          </Button>
        </div>
      </div>

      {/* ── Over-budget Alert ────────────────────────────────────── */}
      {summary?.is_over_budget && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200
          animate-[fadeUp_0.4s_ease-out_forwards]">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-800">Over Budget!</p>
            <p className="text-xs text-red-600 mt-0.5">
              You've exceeded your budget by <span className="font-bold">${summary.over_amount.toLocaleString()}</span>.
              Consider reviewing your spending.
            </p>
          </div>
        </div>
      )}

      {/* ── Summary Cards ────────────────────────────────────────── */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Budget',
              value: `$${summary.total_planned.toLocaleString()}`,
              icon: Wallet,
              color: 'text-primary-600 bg-primary-50',
              sub: `${summary.trip_days} days`,
            },
            {
              label: 'Total Spent',
              value: `$${summary.total_spent.toLocaleString()}`,
              icon: CreditCard,
              color: 'text-indigo-600 bg-indigo-50',
              sub: `${Math.round(summary.total_spent / summary.total_planned * 100)}% used`,
            },
            {
              label: 'Remaining',
              value: `$${Math.max(0, summary.remaining).toLocaleString()}`,
              icon: summary.remaining >= 0 ? TrendingUp : TrendingDown,
              color: summary.remaining >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50',
              sub: summary.remaining >= 0 ? 'On track' : 'Over budget',
            },
            {
              label: 'Daily Average',
              value: `$${summary.daily_average.toLocaleString()}`,
              icon: Calendar,
              color: 'text-amber-600 bg-amber-50',
              sub: 'Per day',
            },
          ].map(({ label, value, icon: Icon, color, sub }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-card p-5
              transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-slate-400">{sub}</span>
              </div>
              <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Charts Row ───────────────────────────────────────────── */}
      {summary && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card hover={false} className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <PieChartIcon className="w-5 h-5 text-primary-500" />
              <h3 className="text-base font-semibold text-slate-800">Spending Distribution</h3>
            </div>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px', border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontSize: '13px',
                    }}
                    formatter={(val) => [`$${val.toLocaleString()}`, '']}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                No spending data yet
              </div>
            )}
          </Card>

          {/* Bar Chart — Daily Spending */}
          <Card hover={false} className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <DollarSign className="w-5 h-5 text-indigo-500" />
              <h3 className="text-base font-semibold text-slate-800">Daily Spending</h3>
            </div>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                    tickFormatter={(d) => {
                      const dt = new Date(d);
                      return `${dt.getMonth() + 1}/${dt.getDate()}`;
                    }}
                  />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px', border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontSize: '13px',
                    }}
                    formatter={(val) => [`$${val.toLocaleString()}`, 'Spent']}
                  />
                  <Bar dataKey="amount" fill="url(#barGrad)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                No daily spending data
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── Category Breakdown Cards ─────────────────────────────── */}
      {summary?.breakdown && (
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Category Breakdown</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.breakdown.map((cat) => {
              const pct = cat.planned > 0 ? Math.min(100, Math.round(cat.spent / cat.planned * 100)) : 0;
              const isOver = cat.spent > cat.planned;
              return (
                <div
                  key={cat.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-card p-5
                    transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{CATEGORY_ICONS[cat.category] || '📦'}</span>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{cat.label}</p>
                        <p className="text-xs text-slate-400">Planned: ${cat.planned.toLocaleString()}</p>
                      </div>
                    </div>
                    <Badge variant={isOver ? 'red' : 'green'}>
                      {isOver ? 'Over' : `${pct}%`}
                    </Badge>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        backgroundColor: isOver ? '#ef4444' : (CATEGORY_COLORS[cat.category] || '#14b8a6'),
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Spent: <span className="font-semibold text-slate-700">${cat.spent.toLocaleString()}</span></span>
                    <span className={isOver ? 'text-red-500 font-semibold' : ''}>
                      {isOver ? `-$${Math.abs(cat.remaining).toLocaleString()}` : `$${cat.remaining.toLocaleString()} left`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Add Expense Modal ────────────────────────────────────── */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Expense" size="md">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40
                text-sm text-slate-800"
            >
              <option value="">Select category</option>
              {summary?.breakdown?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Title</label>
            <input
              type="text"
              value={newExpense.title}
              onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
              placeholder="e.g. Restaurant dinner"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40
                text-sm text-slate-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Amount ($)</label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50
                  focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40
                  text-sm text-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Date</label>
              <input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50
                  focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40
                  text-sm text-slate-800"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" size="md" className="flex-1" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="brand" size="md" className="flex-1"
              onClick={handleAddExpense}
              disabled={!newExpense.category || !newExpense.title || !newExpense.amount}
            >
              <Plus className="w-4 h-4" /> Add Expense
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
