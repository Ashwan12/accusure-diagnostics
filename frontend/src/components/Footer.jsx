import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  HeartHandshake, 
  MessageCircle,
  Award
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/30">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base tracking-tight">ACCUSURE DIAGNOSTICS</h3>
                <p className="text-[11px] text-sky-400">Healthcare & Diagnostic Management</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leading diagnostic testing facility in Jamshedpur providing automated blood tests, organ profiles, and free doorstep home sample collection with certified accuracy.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/917205573352?text=Hello%20Accusure%20Diagnostics"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 transition text-xs font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Us
              </a>
              <a
                href="tel:7205573352"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950 text-sky-400 border border-sky-800 hover:bg-sky-900 transition text-xs font-medium"
              >
                <Phone className="w-3.5 h-3.5" />
                Call 7205573352
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 border-l-2 border-sky-500 pl-2">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-sky-400 transition">Home</Link></li>
              <li><Link to="/tests" className="hover:text-sky-400 transition">Diagnostic Test Catalog</Link></li>
              <li><Link to="/home-collection" className="hover:text-sky-400 transition">Free Home Sample Collection</Link></li>
              <li><Link to="/login" className="hover:text-sky-400 transition">Patient Portal Login</Link></li>
              <li><Link to="/login" className="hover:text-sky-400 transition">Doctor & Staff Login</Link></li>
              <li><a href="#about" className="hover:text-sky-400 transition">About Our Laboratory</a></li>
              <li><a href="#how-it-works" className="hover:text-sky-400 transition">How It Works</a></li>
            </ul>
          </div>

          {/* Popular Tests */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 border-l-2 border-sky-500 pl-2">Popular Checkups</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/tests" className="hover:text-sky-400 transition">Complete Blood Count (CBC) - ₹299</Link></li>
              <li><Link to="/tests" className="hover:text-sky-400 transition">Lipid Profile (Cholesterol) - ₹599</Link></li>
              <li><Link to="/tests" className="hover:text-sky-400 transition">Thyroid Profile (T3, T4, TSH) - ₹499</Link></li>
              <li><Link to="/tests" className="hover:text-sky-400 transition">Liver Function Test (LFT) - ₹649</Link></li>
              <li><Link to="/tests" className="hover:text-sky-400 transition">Kidney Function Test (KFT) - ₹649</Link></li>
              <li><Link to="/tests" className="hover:text-sky-400 transition">HbA1c Diabetes Screen - ₹450</Link></li>
              <li><Link to="/tests" className="hover:text-sky-400 transition">Master Full Body Package - ₹1,999</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4 border-l-2 border-sky-500 pl-2">Center Location</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Shop No. 7, MIJO HOUSE, Sunday Market, Birsanagar, Jamshedpur, Jharkhand 831019</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>7205573352</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="truncate">ashwanarya20042004@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Mon - Sun: 06:30 AM - 09:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ACCUSURE DIAGNOSTICS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Jamshedpur Diagnostic Healthcare Hub</span>
            <span className="text-emerald-500 font-medium">Free Home Collection Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

