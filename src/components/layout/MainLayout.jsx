import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-slate-800 flex flex-col">
      <Navbar />
      {/* pt-24 accounts for the floating navbar (h-16) + mt-3 + extra gap */}
      <main className="pt-24 pb-16 flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
