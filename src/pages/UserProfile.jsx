import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Users, Star, Edit3, Check, X,
  Camera, Mail, Phone, Globe, Award, ChevronRight,
  Settings, LogOut, Heart, Bookmark, Share2,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { currentUser, myTrips } from '../data/community';

const statColors = ['text-primary-600 bg-primary-50', 'text-indigo-600 bg-indigo-50', 'text-pink-600 bg-pink-50', 'text-amber-600 bg-amber-50'];

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ ...currentUser });
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ ...currentUser });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('trips');

  const handleSave = () => {
    setUser({ ...editData });
    setEditModalOpen(false);
  };

  const handleCancel = () => {
    setEditData({ ...user });
    setEditModalOpen(false);
  };

  const statItems = [
    { label: 'Trips',      value: user.stats.trips,      icon: MapPin   },
    { label: 'Countries',  value: user.stats.countries,  icon: Globe    },
    { label: 'Followers',  value: `${(user.stats.followers/1000).toFixed(1)}k`, icon: Users },
    { label: 'Following',  value: user.stats.following,  icon: Heart    },
  ];

  const tabs = [
    { id: 'trips',   label: 'My Trips',   count: myTrips.length },
    { id: 'badges',  label: 'Badges',     count: user.badges.length },
    { id: 'prefs',   label: 'Preferences' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

      {/* ── Cover + Avatar ───────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden shadow-card-lg mb-6">
        {/* Cover photo */}
        <div className="h-52 md:h-64 relative">
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        </div>

        {/* Profile info bar */}
        <div className="bg-white px-6 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 relative z-10">

            {/* Avatar */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-2xl border-4 border-white shadow-card-lg object-cover bg-primary-100"
              />
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center
                text-white shadow-sm hover:bg-primary-700 transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:mb-1">
              <Button variant="secondary" size="sm" onClick={() => {}}>
                <Share2 className="w-4 h-4" /> Share
              </Button>
              <Button variant="brand" size="sm" onClick={() => setEditModalOpen(true)}>
                <Edit3 className="w-4 h-4" /> Edit Profile
              </Button>
            </div>
          </div>

          {/* Name & Bio */}
          <div className="mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{user.name}</h1>
              <span className="text-sm text-slate-400 font-medium">{user.handle}</span>
            </div>
            <p className="text-sm text-slate-600 mt-1.5 max-w-lg leading-relaxed">{user.bio}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary-400" />{user.location}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary-400" />Joined {user.joinedDate}</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary-400" />{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Strip ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statItems.map(({ label, value, icon: Icon }, i) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 text-center group hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${statColors[i]}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-800 tracking-tight">{value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-card' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {tab.label}
            {tab.count && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
                ${activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-slate-200 text-slate-500'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ─────────────────────────────────────────── */}

      {/* My Trips */}
      {activeTab === 'trips' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myTrips.map((trip) => (
            <Card key={trip.id} className="p-0 overflow-hidden group cursor-pointer" onClick={() => navigate(`/trips/${trip.id}/view`)}>
              <div className="relative h-40 overflow-hidden">
                <img src={trip.image} alt={trip.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                <div className="absolute top-3 right-3">
                  <Badge variant={trip.status === 'upcoming' ? 'green' : trip.status === 'ongoing' ? 'indigo' : 'slate'}>
                    {trip.status === 'upcoming' ? '✦ Upcoming' : trip.status === 'ongoing' ? '● Ongoing' : '✓ Done'}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-4">
                  <p className="text-white font-semibold text-sm">{trip.name}</p>
                  <p className="text-white/70 text-xs">{trip.date}</p>
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="text-sm font-medium text-slate-700">{trip.budget} · {trip.duration}</div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-400 transition-colors" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Badges */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user.badges.map(badge => (
            <div key={badge.id} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100
              shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-indigo-50 flex items-center justify-center
                text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                {badge.icon}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{badge.label}</p>
                <p className="text-sm text-slate-500 mt-0.5">{badge.desc}</p>
              </div>
              <Award className="w-4 h-4 text-amber-400 ml-auto flex-shrink-0" />
            </div>
          ))}
          {/* Locked badges */}
          {['Night Owl Traveler', 'Solo Explorer', 'Budget Master'].map(b => (
            <div key={b} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-dashed border-slate-200 opacity-60">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">🔒</div>
              <div>
                <p className="font-semibold text-slate-500">{b}</p>
                <p className="text-xs text-slate-400 mt-0.5">Keep traveling to unlock</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preferences */}
      {activeTab === 'prefs' && (
        <div className="space-y-4">
          {[
            { label: 'Travel Style',        value: user.preferences.travelStyle,        icon: '🌍' },
            { label: 'Favorite Continent',  value: user.preferences.favoriteContinent,  icon: '🗺️' },
            { label: 'Typical Budget',      value: user.preferences.typicalBudget,      icon: '💰' },
            { label: 'Languages',           value: user.preferences.languages.join(', '), icon: '🗣️' },
          ].map(pref => (
            <div key={pref.label} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-card">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{pref.icon}</span>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{pref.label}</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{pref.value}</p>
                </div>
              </div>
              <button className="p-2 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Danger zone */}
          <div className="pt-4 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 text-sm text-slate-500 px-4 py-2.5 rounded-xl
              border border-slate-200 hover:bg-slate-50 transition-all">
              <Settings className="w-4 h-4" /> Account Settings
            </button>
            <button className="flex items-center gap-2 text-sm text-red-500 px-4 py-2.5 rounded-xl
              border border-red-100 hover:bg-red-50 transition-all">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* ── Edit Profile Modal ───────────────────────────────────── */}
      <Modal isOpen={editModalOpen} onClose={handleCancel} title="Edit Profile" size="md">
        <div className="space-y-4">
          {[
            { field: 'name',     label: 'Full Name',  type: 'text' },
            { field: 'email',    label: 'Email',      type: 'email' },
            { field: 'location', label: 'Location',   type: 'text' },
          ].map(({ field, label, type }) => (
            <div key={field} className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">{label}</label>
              <input
                type={type}
                value={editData[field]}
                onChange={e => setEditData(prev => ({ ...prev, [field]: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                  focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400
                  transition-all text-slate-800 text-sm"
              />
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Bio</label>
            <textarea
              rows={3}
              value={editData.bio}
              onChange={e => setEditData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400
                transition-all text-slate-800 text-sm resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              <X className="w-4 h-4" /> Cancel
            </Button>
            <Button variant="brand" size="sm" onClick={handleSave}>
              <Check className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
