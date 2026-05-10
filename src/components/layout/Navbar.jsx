import { Link } from 'react-router-dom';
import { UserCircle, Map } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-lg border-b border-white/40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Map className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              Traveloop
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full font-medium transition-all duration-200 shadow-md hover:shadow-lg">
              Sign Up
            </Link>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <UserCircle className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
