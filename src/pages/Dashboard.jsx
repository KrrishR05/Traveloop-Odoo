import { Search, Plus } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const recommended = [
    { id: 1, name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=400&h=300' },
    { id: 2, name: 'Swiss Alps', image: 'https://images.unsplash.com/photo-1531366936337-77b128052684?auto=format&fit=crop&q=80&w=400&h=300' },
    { id: 3, name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac542?auto=format&fit=crop&q=80&w=400&h=300' },
  ];

  const previous = [
    { id: 1, name: 'Paris, France', date: 'Oct 2023', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400&h=300' },
    { id: 2, name: 'Tokyo, Japan', date: 'Mar 2023', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400&h=300' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200&h=400" 
          alt="Travel Banner" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-10 text-white w-full">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Explore the World</h1>
            <p className="text-lg md:text-xl max-w-2xl text-white/90 drop-shadow-md">
              Discover new places, create unforgettable memories, and manage all your trips in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-lg">
        <div className="relative w-full md:max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search destinations..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
          />
        </div>
        <Button className="w-full md:w-auto">
          <Plus className="h-5 w-5 mr-2" />
          Plan New Trip
        </Button>
      </div>

      {/* Recommended Destinations */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Recommended Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommended.map((dest) => (
            <Card key={dest.id} className="p-0 overflow-hidden group cursor-pointer hover:-translate-y-2">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-5 bg-white/90 backdrop-blur-sm relative z-10">
                <h3 className="text-xl font-semibold text-slate-800 group-hover:text-primary-600 transition-colors">{dest.name}</h3>
                <p className="text-slate-500 text-sm mt-1">Popular right now</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Previous Trips */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Previous Trips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previous.map((trip) => (
            <Card key={trip.id} className="p-0 overflow-hidden group cursor-pointer">
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={trip.image} 
                  alt={trip.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5 flex justify-between items-center bg-white/90 backdrop-blur-sm relative z-10">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">{trip.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{trip.date}</p>
                </div>
                <Button variant="secondary" className="px-4 py-2 text-sm">View</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
