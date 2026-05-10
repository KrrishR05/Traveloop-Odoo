import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, Globe, Calendar, DollarSign, TrendingUp, Activity,
  MapPin, ArrowLeft, Compass, Star, Briefcase,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line,
} from 'recharts';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { tripService } from '../services/api';

const TRIP_TYPE_COLORS = {
  adventure: '#ef4444',
  relaxation: '#14b8a6',
  cultural: '#6366f1',
  romantic: '#ec4899',
  family: '#f59e0b',
  business: '#64748b',
};

const TRIP_TYPE_ICONS = {
  adventure: '🧗',
  relaxation: '🌴',
  cultural: '🏛️',
  romantic: '💑',
  family: '👨‍👩‍👧',
  business: '💼',
};

const CHART_TOOLTIP_STYLE = {
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  fontSize: '13px',
};

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      tripService.analytics(),
      tripService.list(),
    ])
      .then(([analyticsData, tripsData]) => {
        setAnalytics(analyticsData);
        setTrips(tripsData.results || tripsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Prepare chart data
  const typeData = analytics?.by_type?.map((t) => ({
    name: t.trip_type.charAt(0).toUpperCase() + t.trip_type.slice(1),
    value: t.count,
    budget: parseFloat(t.total),
    color: TRIP_TYPE_COLORS[t.trip_type] || '#64748b',
  })) || [];

  const destData = analytics?.by_destination?.map((d) => ({
    name: d.destination.split(',')[0],
    budget: parseFloat(d.total),
    trips: d.count,
  })) || [];

  const monthlyData = analytics?.monthly?.map((m) => ({
    month: m.month,
    budget: parseFloat(m.total),
    trips: m.count,
  })) || [];

  // Budget vs planned from trips
  const budgetComparison = trips.slice(0, 6).map((t) => ({
    name: t.title.split(' ').slice(0, 2).join(' '),
    budget: parseFloat(t.budget),
    destination: t.destination,
  }));

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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">Your travel patterns, visualized.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="teal">Live Data</Badge>
          <Badge variant="indigo">Django API</Badge>
        </div>
      </div>

      {/* ── KPI Cards ────────────────────────────────────────────── */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Trips',
              value: analytics.total_trips,
              icon: Compass,
              color: 'text-primary-600 bg-primary-50',
              sub: `${analytics.completed_trips} completed`,
              change: `${analytics.upcoming_trips} upcoming`,
            },
            {
              label: 'Total Budget',
              value: `$${analytics.total_budget.toLocaleString()}`,
              icon: DollarSign,
              color: 'text-indigo-600 bg-indigo-50',
              sub: `Avg: $${analytics.avg_budget.toLocaleString()}`,
              change: 'Per trip',
            },
            {
              label: 'Days Traveled',
              value: analytics.total_days,
              icon: Calendar,
              color: 'text-amber-600 bg-amber-50',
              sub: `${Math.round(analytics.total_days / Math.max(analytics.total_trips, 1))} avg/trip`,
              change: 'Days average',
            },
            {
              label: 'Destinations',
              value: analytics.by_destination?.length || 0,
              icon: MapPin,
              color: 'text-emerald-600 bg-emerald-50',
              sub: 'Unique places',
              change: 'Explored',
            },
          ].map(({ label, value, icon: Icon, color, sub, change }) => (
            <div
              key={label}
              className="bg-white rounded-2xl border border-slate-100 shadow-card p-5
                transition-all duration-300 hover:shadow-card-lg hover:-translate-y-1.5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-slate-400">{change}</span>
              </div>
              <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
              <p className="text-xs text-primary-500 font-medium mt-1">{sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Charts Row 1 ─────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Spending Trend */}
        <Card hover={false} className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            <h3 className="text-base font-semibold text-slate-800">Spending Trend</h3>
          </div>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(v) => [`$${v.toLocaleString()}`, '']} />
                <Area type="monotone" dataKey="budget" stroke="#14b8a6" strokeWidth={2.5} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No monthly data</div>
          )}
        </Card>

        {/* Trip Type Distribution */}
        <Card hover={false} className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-semibold text-slate-800">Trip Type Distribution</h3>
          </div>
          {typeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {typeData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(val, name) => [val, name]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', color: '#64748b' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No type data</div>
          )}
        </Card>
      </div>

      {/* ── Charts Row 2 ─────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Destinations */}
        <Card hover={false} className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-semibold text-slate-800">Top Destinations by Budget</h3>
          </div>
          {destData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={destData} layout="vertical" barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                  width={90}
                />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} formatter={(v) => [`$${v.toLocaleString()}`, 'Budget']} />
                <Bar dataKey="budget" fill="url(#destGrad)" radius={[0, 6, 6, 0]} />
                <defs>
                  <linearGradient id="destGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No destination data</div>
          )}
        </Card>

        {/* Budget per Trip */}
        <Card hover={false} className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <Briefcase className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-semibold text-slate-800">Budget Allocation by Trip</h3>
          </div>
          {budgetComparison.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={budgetComparison} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={(v) => [`$${v.toLocaleString()}`, 'Budget']}
                  labelFormatter={(label) => {
                    const trip = budgetComparison.find((t) => t.name === label);
                    return trip ? `${label} (${trip.destination})` : label;
                  }}
                />
                <Bar dataKey="budget" radius={[6, 6, 0, 0]}>
                  {budgetComparison.map((_, i) => (
                    <Cell
                      key={i}
                      fill={Object.values(TRIP_TYPE_COLORS)[i % Object.values(TRIP_TYPE_COLORS).length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No trip data</div>
          )}
        </Card>
      </div>

      {/* ── Trip Overview Table ───────────────────────────────────── */}
      <Card hover={false} className="overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">All Trips Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trip</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Destination</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Budget</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Days</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trips.map((trip) => (
                <tr
                  key={trip.id}
                  className="hover:bg-primary-50/30 transition-colors cursor-pointer"
                  onClick={() => navigate(`/trips/${trip.id}/view`)}
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{trip.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-primary-400" />
                      {trip.destination}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">
                      {TRIP_TYPE_ICONS[trip.trip_type] || '✈️'} {trip.trip_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-800">
                    ${parseFloat(trip.budget).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    {trip.duration_days}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={trip.status === 'completed' ? 'slate' : trip.status === 'upcoming' ? 'green' : 'indigo'}>
                      {trip.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
