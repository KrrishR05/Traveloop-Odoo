import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-slate-800">
      <Navbar />
      {/* pt-24 accounts for the floating navbar (h-16) + mt-3 + extra gap */}
      <main className="pt-24 pb-16 min-h-screen flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
