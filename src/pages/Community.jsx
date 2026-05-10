import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart, MessageCircle, Bookmark, Share2, Search,
  TrendingUp, Users, Compass, Star, MapPin, Calendar,
  Filter, MoreHorizontal, ArrowRight,
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { communityPosts, sharedItineraries } from '../data/community';

const FEED_TABS = [
  { id: 'explore',      label: '✦ Explore'     },
  { id: 'trending',    label: '🔥 Trending'    },
  { id: 'following',   label: 'Following'      },
  { id: 'itineraries', label: '🗺️ Itineraries'  },
];

const tagVariant = (tag) => {
  const m = { Beach:'teal', Mountains:'indigo', Nature:'green', Culture:'teal', Romantic:'pink', Adventure:'pink', Scenic:'teal', Food:'sand', History:'indigo' };
  return m[tag] ?? 'slate';
};

function PostCard({ post, onLike, onSave }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden hover:shadow-card-lg transition-all duration-300 group">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full bg-primary-100 border-2 border-white shadow-sm object-cover" />
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-none">{post.author.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{post.author.handle} · {post.timeAgo}</p>
          </div>
        </div>
        <button className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="relative overflow-hidden mx-5 rounded-2xl h-60">
        <img src={post.image} alt={post.destination} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
            <MapPin className="w-3 h-3 text-primary-600" />
            <span className="text-xs font-semibold text-slate-700">{post.destination}</span>
          </div>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          {[...Array(post.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
        </div>
      </div>

      <div className="px-5 py-3">
        <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">{post.caption}</p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {post.tags.map(tag => <span key={tag} className="text-xs text-primary-600 font-medium">#{tag}</span>)}
        </div>
      </div>

      <div className="flex items-center justify-between px-5 pb-4 pt-1 border-t border-slate-50">
        <div className="flex items-center gap-1">
          <button onClick={() => onLike(post.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${post.isLiked ? 'text-red-500 bg-red-50' : 'text-slate-500 hover:text-red-400 hover:bg-red-50'}`}>
            <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-500' : ''}`} />{post.likes}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200">
            <MessageCircle className="w-4 h-4" />{post.comments}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onSave(post.id)} className={`p-2 rounded-xl text-sm transition-all duration-200 ${post.isSaved ? 'text-primary-600 bg-primary-50' : 'text-slate-400 hover:text-primary-500 hover:bg-primary-50'}`}>
            <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-primary-500' : ''}`} />
          </button>
          <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ItineraryCard({ plan, onNavigate }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onClick={onNavigate}>
      <div className="relative h-44 overflow-hidden">
        <img src={plan.image} alt={plan.destination} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="font-bold text-white text-sm leading-tight">{plan.title}</h3>
          <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{plan.destination}</p>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold text-slate-700">{plan.rating}</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <img src={plan.author.avatar} alt={plan.author.name} className="w-6 h-6 rounded-full bg-primary-100 object-cover" />
          <span className="text-xs text-slate-500">{plan.author.name}</span>
        </div>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">{plan.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {plan.tags.map(t => <Badge key={t} variant={tagVariant(t)}>{t}</Badge>)}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{plan.days}d</span>
            <span className="flex items-center gap-1"><Bookmark className="w-3 h-3" />{plan.saves}</span>
          </div>
          <span className="font-semibold text-primary-600">{plan.budget}</span>
        </div>
      </div>
    </div>
  );
}

export default function Community() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('explore');
  const [posts, setPosts] = useState(communityPosts);
  const [search, setSearch] = useState('');

  const handleLike = (id) => setPosts(prev => prev.map(p => p.id === id ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p));
  const handleSave = (id) => setPosts(prev => prev.map(p => p.id === id ? { ...p, isSaved: !p.isSaved } : p));

  const displayedPosts = search
    ? posts.filter(p => p.destination.toLowerCase().includes(search.toLowerCase()) || p.author.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    : posts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary-600 mb-1">Travelers Community</p>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Community</h1>
          <p className="text-slate-500 mt-1 text-sm">Stories, discoveries, and public itineraries from fellow travelers.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search destinations, travelers, tags…"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-card focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all text-slate-800 placeholder:text-slate-400 text-sm" />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-card text-sm font-medium text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-all">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {FEED_TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? 'text-white shadow-brand' : 'text-slate-600 bg-white border border-slate-200 hover:border-primary-200 hover:text-primary-600'}`}
            style={activeTab === tab.id ? { backgroundImage: 'linear-gradient(135deg, #0d9488 0%, #4f46e5 100%)' } : {}}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab !== 'itineraries' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPosts.length > 0 ? displayedPosts.map(post => (
            <PostCard key={post.id} post={post} onLike={handleLike} onSave={handleSave} />
          )) : (
            <div className="col-span-full py-20 text-center text-slate-400">
              <p className="text-lg font-medium">No posts found for "{search}"</p>
              <p className="text-sm mt-1">Try a different destination or traveler name.</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Public Itineraries</h2>
              <p className="text-sm text-slate-500 mt-0.5">Community-shared trip plans, ready to use as inspiration</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate('/shared-itineraries')}>
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sharedItineraries.map(plan => (
              <ItineraryCard key={plan.id} plan={plan} onNavigate={() => navigate(`/shared/${plan.id}`)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
