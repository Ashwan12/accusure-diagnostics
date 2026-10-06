import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  Activity, 
  Home, 
  Calendar, 
  FileText, 
  User, 
  LogOut, 
  ShieldCheck, 
  Stethoscope, 
  LayoutDashboard,
  Clock
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin' || user.role === 'staff') return '/admin';
    if (user.role === 'doctor') return '/doctor';
    return '/dashboard';
  };

  const getDashboardLabel = () => {
    if (!user) return 'Portal Login';
    if (user.role === 'admin') return 'Admin Dashboard';
    if (user.role === 'staff') return 'Staff Console';
    if (user.role === 'doctor') return 'Doctor Portal';
    return 'Patient Dashboard';
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Tests & Packages', path: '/tests' },
    { label: 'Home Collection', path: '/home-collection' },
    { label: 'About Us', path: '/#about' },
    { label: 'Contact', path: '/#contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top emergency / contact strip */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Free Home Sample Collection in Jamshedpur
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Mon - Sun: 06:30 AM - 09:00 PM
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a 
              href="tel:7205573352" 
              className="flex items-center gap-1 text-cyan-300 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="font-semibold">7205573352</span>
            </a>
            <a 
              href="https://wa.me/917205573352?text=Hello%20Accusure%20Diagnostics,%20I%20want%20to%20book%20a%20test" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-none group-hover:text-sky-600 transition-colors">
                ACCUSURE <span className="text-sky-600">DIAGNOSTICS</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 tracking-wide mt-0.5">
                Smart Healthcare & Diagnostic Center
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-sky-600 bg-sky-50 font-semibold'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/home-collection"
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors border border-sky-200"
            >
              Book Home Collection
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition shadow-xs"
                >
                  <LayoutDashboard className="w-4 h-4 text-sky-400" />
                  <span>{getDashboardLabel()}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-sm shadow-sky-600/30 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <Link
                to={getDashboardPath()}
                className="p-2 text-sky-600 bg-sky-50 rounded-lg"
                title="Dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in duration-200">
          <div className="flex flex-col gap-1 pb-4 border-b border-slate-100">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(item.path)
                    ? 'text-sky-600 bg-sky-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/home-collection"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 text-sm font-semibold text-white bg-sky-600 rounded-lg shadow-sm"
            >
              Request Free Home Sample Collection
            </Link>

            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg"
                >
                  {getDashboardLabel()} ({user.username})
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-center py-2 px-4 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-4 text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 px-4 text-sm font-semibold text-white bg-slate-900 rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

