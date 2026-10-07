import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Search, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Home, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Star, 
  MapPin, 
  Sparkles, 
  Award, 
  HeartHandshake, 
  ChevronRight,
  TestTube2,
  Syringe,
  FileCheck,
  ChevronDown,
  Check,
  Zap,
  Heart,
  Droplet,
  HelpCircle,
  BadgeCheck,
  Sparkle
} from 'lucide-react';
import api from '../services/api';
import { LAB_GALLERY_IMAGES } from '../services/dataFallback';

const HomePage = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loadingTests, setLoadingTests] = useState(true);
  const [openFaq, setOpenFaq] = useState(0); // First FAQ opened by default

  // Quick home collection form states
  const [quickForm, setQuickForm] = useState({
    name: '',
    phone: '',
    address: '',
    preferredDate: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    })(),
    selectedTestId: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, catRes] = await Promise.all([
          api.get('/tests/'),
          api.get('/tests/categories/'),
        ]);
        setTests(testsRes.data);
        setCategories(catRes.data);
      } catch (err) {
        console.error('Error fetching tests:', err);
      } finally {
        setLoadingTests(false);
      }
    };
    fetchData();
  }, []);

  const safeTests = Array.isArray(tests) ? tests : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  const filteredTests = safeTests.filter((test) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = (test.name && test.name.toLowerCase().includes(q)) ||
                          (test.description && test.description.toLowerCase().includes(q)) ||
                          (test.parameters_included && test.parameters_included.toLowerCase().includes(q));
    const matchesCat = selectedCategory === 'all' || test.category_slug === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (!quickForm.name.trim() || !quickForm.phone.trim() || !quickForm.address.trim()) {
      alert('Please fill out your name, mobile number, and doorstep address.');
      return;
    }
    navigate('/home-collection', { state: { prefilled: quickForm } });
  };

  const faqs = [
    {
      q: 'How does 100% Free Doorstep Home Collection work in Jamshedpur?',
      a: 'Simply select your required tests and preferred date & time slot. Our trained phlebotomist visits your home anywhere in Jamshedpur equipped with BD Vacutainer sterile vacuum tubes and a cold-chain box. Zero extra collection fees are charged!'
    },
    {
      q: 'Do I need to be in fasting before giving blood sample?',
      a: 'Tests like Lipid Profile, Fasting Blood Sugar (FBS), and Comprehensive Master Packages require 8 to 10 hours of overnight fasting (water is allowed). Routine tests like CBC, Dengue, Urine, and HbA1c do not require fasting.'
    },
    {
      q: 'When and how will I receive my diagnostic test report?',
      a: 'Routine blood tests (CBC, Sugar, Dengue) are ready within 4 to 6 hours. Profiles (Thyroid, Lipid, LFT, KFT) are delivered within 12 hours. Your verified PDF report is sent via WhatsApp, email, and available on our secure online patient portal with a QR verification code.'
    },
    {
      q: 'Can I pay via Cash or UPI at the time of sample collection?',
      a: 'Yes! No advance payment is required. You can pay conveniently using Google Pay, PhonePe, Paytm, QR code, or Cash directly to the phlebotomist after your sample is drawn safely.'
    },
    {
      q: 'Where is ACCUSURE DIAGNOSTICS center located in Jamshedpur?',
      a: 'Our central walk-in diagnostic laboratory is located at Shop No. 7, MIJO HOUSE, Sunday Market, Birsanagar, Jamshedpur, Jharkhand 831019. We are open 7 days a week from 06:30 AM to 09:00 PM.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 overflow-hidden">
      {/* 1. HERO SECTION WITH GLOWING EFFECTS */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-slate-50 pt-8 sm:pt-14 pb-16 sm:pb-24 border-b border-slate-200">
        {/* Animated Radial Background Orbs */}
        <div className="absolute top-12 left-10 w-96 h-96 bg-sky-300/25 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-300/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & Search */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Glowing Announcement Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-sky-100 to-teal-50 border border-sky-300/60 text-sky-900 text-xs font-bold uppercase tracking-wider shadow-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>NABL Standards • 100% Free Doorstep Collection in Jamshedpur</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Accurate Diagnostic Reports At{' '}
                <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-sky-700 bg-clip-text text-transparent">
                  Affordable Rates
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Trust <strong>ACCUSURE DIAGNOSTICS</strong> for high-precision blood tests, routine checkups, and specialized organ panels. Enjoy certified pathology with <strong>₹0 Home Collection Charges</strong> anywhere in Jamshedpur.
              </p>

              {/* Quick Interactive Search Bar */}
              <div className="max-w-xl mx-auto lg:mx-0 relative">
                <div className="flex items-center bg-white rounded-2xl border-2 border-sky-300 shadow-md focus-within:border-sky-600 focus-within:ring-4 focus-within:ring-sky-100 transition-all p-1.5">
                  <Search className="w-5 h-5 text-sky-500 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search CBC, Blood Sugar, Thyroid, Lipid, LFT..."
                    className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
                  />
                  <Link
                    to="/tests"
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shrink-0 transition shadow-xs"
                  >
                    Find Tests
                  </Link>
                </div>

                {/* Popular Search Tags */}
                <div className="flex flex-wrap gap-2 mt-2.5 text-xs text-slate-500 justify-center lg:justify-start">
                  <span className="font-semibold text-slate-700">Trending:</span>
                  {['CBC (₹299)', 'Lipid Profile', 'Thyroid (T3/T4/TSH)', 'HbA1c', 'Master Health (₹1999)'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term.split(' ')[0])}
                      className="text-sky-600 hover:underline hover:text-sky-800 font-medium transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  to="/home-collection"
                  className="px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-sky-600/30 flex items-center gap-2 transition hover:-translate-y-0.5"
                >
                  <Home className="w-4 h-4" />
                  <span>Book Free Home Collection</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <a
                  href="tel:7205573352"
                  className="px-5 py-3.5 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 rounded-xl font-bold text-sm shadow-xs flex items-center gap-2 transition"
                >
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>7205573352</span>
                </a>

                <a
                  href="https://wa.me/917205573352?text=Hello%20Accusure%20Diagnostics,%20I%20want%20to%20book%20a%20blood%20test"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-xs flex items-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80 text-left">
                <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="text-xl font-black text-emerald-600">FREE</div>
                  <div className="text-[11px] text-slate-500 font-medium">₹0 Doorstep Collection</div>
                </div>
                <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="text-xl font-black text-sky-600">6 - 12h</div>
                  <div className="text-[11px] text-slate-500 font-medium">Fast Verified Reports</div>
                </div>
                <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="text-xl font-black text-slate-900">100%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Painless Vacuum Tubes</div>
                </div>
                <div className="p-3 bg-white/80 backdrop-blur-xs rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="text-xl font-black text-amber-500">4.9 ★</div>
                  <div className="text-[11px] text-slate-500 font-medium">1,200+ Happy Patients</div>
                </div>
              </div>
            </div>

            {/* Right Column: Express Booking Box with Glow */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-sky-200/80 relative hover:border-sky-400 transition-all duration-300">
                <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-black uppercase px-4 py-1 rounded-full shadow-md">
                  Zero Travel • 100% Free Doorstep Visit
                </div>

                <div className="space-y-1 mb-5">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>Schedule Sample Collection</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </h3>
                  <p className="text-xs text-slate-500">
                    Phlebotomist arrives with sterile vacuum tubes at your preferred time.
                  </p>
                </div>

                <form onSubmit={handleQuickSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Patient Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={quickForm.name}
                      onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-hidden text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={quickForm.phone}
                      onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-hidden text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Home Address in Jamshedpur</label>
                    <textarea
                      rows="2"
                      required
                      placeholder="House / Flat No., Colony, Landmark (e.g. Birsanagar, Telco, Sakchi)"
                      value={quickForm.address}
                      onChange={(e) => setQuickForm({ ...quickForm, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-hidden text-sm"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Preferred Date</label>
                      <input
                        type="date"
                        value={quickForm.preferredDate}
                        onChange={(e) => setQuickForm({ ...quickForm, preferredDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-hidden text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Diagnostic Test</label>
                      <select
                        value={quickForm.selectedTestId}
                        onChange={(e) => setQuickForm({ ...quickForm, selectedTestId: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-hidden text-xs"
                      >
                        <option value="">Choose Test / Package</option>
                        {tests.slice(0, 10).map((t) => (
                          <option key={t.id} value={t.id}>{t.name} (₹{t.final_price})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-xl shadow-md shadow-sky-600/30 transition flex items-center justify-center gap-2 mt-4 text-xs sm:text-sm"
                  >
                    <span>Proceed To Confirm Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Painless & Safe Sampling
                  </span>
                  <span>Instant Call: <strong>7205573352</strong></span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LIVE STATISTICS & CREDIBILITY STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-12 relative z-20">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1 border-r border-slate-800/80 last:border-none">
            <div className="text-2xl sm:text-4xl font-black text-sky-400 font-mono">15+</div>
            <div className="text-xs font-semibold text-slate-300">Certified Test Panels</div>
            <div className="text-[11px] text-slate-500">CBC, Lipid, LFT, KFT, Vitamins</div>
          </div>

          <div className="space-y-1 border-r border-slate-800/80 last:border-none">
            <div className="text-2xl sm:text-4xl font-black text-emerald-400 font-mono">10,000+</div>
            <div className="text-xs font-semibold text-slate-300">Samples Processed</div>
            <div className="text-[11px] text-slate-500">Across Jamshedpur Families</div>
          </div>

          <div className="space-y-1 border-r border-slate-800/80 last:border-none">
            <div className="text-2xl sm:text-4xl font-black text-amber-400 font-mono">₹0.00</div>
            <div className="text-xs font-semibold text-slate-300">Doorstep Collection Fee</div>
            <div className="text-[11px] text-slate-500">100% Free Doorstep Phlebotomy</div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-4xl font-black text-teal-300 font-mono">4 - 12h</div>
            <div className="text-xs font-semibold text-slate-300">Turnaround Time</div>
            <div className="text-[11px] text-slate-500">WhatsApp & Portal Reports</div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR DIAGNOSTIC TESTS & PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparent & Affordable Healthcare</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Diagnostic Tests & Health Packages
            </h2>
          </div>
          <Link
            to="/tests"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800 transition"
          >
            <span>View All Tests & Profiles</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Diagnostic Tests
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setSelectedCategory(c.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === c.slug
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Test Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.slice(0, 6).map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-sky-300 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Test Photo Visual Header */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={test.image || 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80'}
                    alt={test.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-600 text-white backdrop-blur-xs shadow-xs">
                      {test.category_name}
                    </span>
                    {test.is_popular && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                    <span className="font-mono bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded text-[10px]">
                      {test.code}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-300 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded text-[10px]">
                      <Clock className="w-3 h-3" />
                      {test.turnaround_hours}h Report
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-base leading-snug mb-1 group-hover:text-sky-600 transition-colors">
                    {test.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {test.description || 'Standard diagnostic test performed using automated chemiluminescence analyzers.'}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-sky-600" />
                      <span>Report Time: <strong>{test.turnaround_hours} Hours</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TestTube2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sample Type: <strong>{test.sample_type}</strong></span>
                    </div>
                    {test.fasting_required ? (
                      <div className="text-amber-700 font-medium text-[11px]">
                        ⚠️ {test.fasting_hours ? `${test.fasting_hours} Hours Fasting Required` : 'Fasting Required'}
                      </div>
                    ) : (
                      <div className="text-emerald-700 font-medium text-[11px]">
                        ✓ No Fasting Required
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Price & Booking CTA */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-slate-900 font-mono">₹{test.final_price}</span>
                      {test.discount_price && (
                        <span className="text-xs line-through text-slate-400 font-mono">₹{test.price}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold block">Free Home Collection</span>
                  </div>

                  <Link
                    to="/home-collection"
                    state={{ prefilledTest: test }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    Book Test
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/tests"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
          >
            <span>Explore All 15+ Diagnostic Tests & Full Body Packages</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. DEDICATED LABORATORY & INFRASTRUCTURE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Advanced Clinical Quality</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Inside ACCUSURE DIAGNOSTICS Laboratory
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Take a look at our certified diagnostic facilities in Jamshedpur. Fully automated analyzers, sterile vacuum sampling, cold-chain transport, and precision MD pathologist verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LAB_GALLERY_IMAGES.map((labItem) => (
            <div
              key={labItem.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={labItem.image}
                    alt={labItem.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-sky-600 text-white backdrop-blur-xs shadow-xs">
                    {labItem.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-sky-600 transition-colors">
                    {labItem.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {labItem.description}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Calibrated Daily
                  </span>
                  <Link
                    to="/home-collection"
                    className="font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                  >
                    <span>Book Test</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY JAMSHEDPUR CHOOSES ACCUSURE (KEY ADVANTAGES) */}
      <section className="bg-gradient-to-b from-sky-50/50 to-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sky-600 text-xs font-bold uppercase tracking-wider">Patient-First Healthcare</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Why Patients & Doctors Trust ACCUSURE
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Combining world-class pathology accuracy with compassionate doorstep service in Jamshedpur.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">100% Free Doorstep Collection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero travel required. Our phlebotomist visits your doorstep in Birsanagar, Telco, Sakchi, Bistupur, or Baridih with zero collection charge.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Automated 5-Part Analyzers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Equipped with laser-based cell counters and chemiluminescence analyzers calibrated daily for hospital-grade precision.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Same-Day 6h Report Delivery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive certified PDF reports directly on WhatsApp and email, with instant QR code authenticity verification.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">MD Pathologist Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every abnormal parameter and full body screening is personally reviewed and signed off by senior consultant pathologists.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <Syringe className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Painless Butterfly Draw</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We use sterile single-use butterfly needles and pre-barcoded BD Vacutainer vacuum tubes ensuring minimal discomfort for seniors and children.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-300 transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Save 30% - 50% On Checkups</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct diagnostic pricing with zero corporate markup. Full-body Master checkups starting at just ₹1,999 covering 70+ parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (4 STEPS) */}
      <section id="how-it-works" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-sky-400 text-xs font-bold uppercase tracking-wider">Hassle-Free Process</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">How ACCUSURE Diagnostics Works</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              From online booking to verified digital reports in 4 simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                01
              </div>
              <h3 className="font-bold text-base text-white mb-2">Book Test Online or Call</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select your required blood test or package online, or simply dial <strong>7205573352</strong>. Choose Free Home Collection or Center Visit.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                02
              </div>
              <h3 className="font-bold text-base text-white mb-2">Free Doorstep Collection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trained phlebotomist arrives at your home with sterilized vacuum tubes. 100% painless sampling using single-use needles.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                03
              </div>
              <h3 className="font-bold text-base text-white mb-2">Automated Lab Testing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Samples are barcoded and analyzed on automated diagnostic analyzers calibrated against NABL quality standards.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                04
              </div>
              <h3 className="font-bold text-base text-white mb-2">Verified Digital Report</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pathologist verifies your test results. Receive report on WhatsApp, email, and portal with QR verification code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need to know about doorstep collection, fasting, and reports.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 hover:text-sky-600 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180 text-sky-600' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. PATIENT TESTIMONIALS & REVIEWS */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-sky-600 text-xs font-bold uppercase tracking-wider">Real Patient Experiences</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">What Jamshedpur Patients Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 hover:shadow-md transition">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "The free home sample collection is a blessing for elderly parents. Rahul the phlebotomist was on time at Birsanagar, very polite and painless sample draw."
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 text-xs block">Suresh Mandal</strong>
                  <span className="text-[11px] text-slate-400">Birsanagar, Jamshedpur</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Verified</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 hover:shadow-md transition">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Got my Master Health Package done for just ₹1,999. Other labs in town charge more than ₹3,500 for the same 70 tests. Received verified PDF report in the evening."
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 text-xs block">Anjali Sen</strong>
                  <span className="text-[11px] text-slate-400">Telco Colony, Jamshedpur</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Verified</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 hover:shadow-md transition">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Very fast CBC and sugar report turnaround within 4 hours. Downloaded report with QR code directly from patient portal. Highly recommend Accusure Diagnostics!"
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 text-xs block">Vikramaditya Roy</strong>
                  <span className="text-[11px] text-slate-400">Baridih, Jamshedpur</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CONTACT & CENTER LOCATION */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Jamshedpur Laboratory</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Visit ACCUSURE DIAGNOSTICS Or Schedule Free Home Collection
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Have questions regarding fasting requirements, health packages, or same-day report delivery? Our team is available 7 days a week.
              </p>

              <div className="space-y-2.5 text-xs text-slate-200 pt-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Shop No. 7, MIJO HOUSE, Sunday Market, Birsanagar, Jamshedpur, Jharkhand 831019</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Direct Helpline: <strong>7205573352</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>WhatsApp Phlebotomist: <strong>7205573352</strong></span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/15 p-6 rounded-2xl space-y-3.5 text-xs">
              <h3 className="font-bold text-base text-white">Direct Quick Connect</h3>
              <p className="text-slate-300">Choose your preferred channel to reach out immediately:</p>
              
              <div className="space-y-2.5">
                <a
                  href="tel:7205573352"
                  className="w-full py-3.5 px-4 rounded-xl bg-white text-slate-900 font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition shadow-sm text-xs sm:text-sm"
                >
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>Call 7205573352 Directly</span>
                </a>

                <a
                  href="https://wa.me/917205573352?text=Hello%20Accusure%20Diagnostics,%20I%20want%20to%20inquire%20about%20blood%20tests"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-sm text-xs sm:text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <Link
                  to="/home-collection"
                  className="w-full py-3.5 px-4 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-sky-500 transition shadow-sm text-xs sm:text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Free Doorstep Collection</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
