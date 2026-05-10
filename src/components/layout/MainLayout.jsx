import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-slate-800">
      <Navbar />
      <main className="pt-16 pb-12 min-h-screen flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
