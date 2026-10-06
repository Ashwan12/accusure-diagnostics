import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, CalendarPlus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MobileQuickBar = () => {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin' || user.role === 'staff') return '/admin';
    if (user.role === 'doctor') return '/doctor';
    return '/dashboard';
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-lg flex items-center justify-around gap-1 text-[11px] font-medium text-slate-600">
      {/* Call */}
      <a
        href="tel:7205573352"
        className="flex flex-col items-center justify-center p-1.5 text-slate-700 hover:text-sky-600 transition"
      >
        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mb-1">
          <Phone className="w-4 h-4" />
        </div>
        <span>Call</span>
      </a>

      {/* WhatsApp */}
      <a
        href="https://wa.me/917205573352?text=Hello%20Accusure%20Diagnostics,%20I%20want%20to%20book%20a%20blood%20test"
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center justify-center p-1.5 text-emerald-700 transition"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
          <MessageCircle className="w-4 h-4" />
        </div>
        <span>WhatsApp</span>
      </a>

      {/* Book Home Collection */}
      <Link
        to="/home-collection"
        className="flex flex-col items-center justify-center p-1.5 text-sky-700 transition"
      >
        <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center mb-1 shadow-sm shadow-sky-600/30">
          <CalendarPlus className="w-4 h-4" />
        </div>
        <span className="font-semibold text-sky-700">Book Test</span>
      </Link>

      {/* Dashboard or Login */}
      <Link
        to={getDashboardPath()}
        className="flex flex-col items-center justify-center p-1.5 text-slate-700 hover:text-sky-600 transition"
      >
        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center mb-1">
          <LayoutDashboard className="w-4 h-4" />
        </div>
        <span>{user ? 'Portal' : 'Login'}</span>
      </Link>
    </div>
  );
};

export default MobileQuickBar;

