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
  FileCheck
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

  // Quick home collection form states
  const [quickForm, setQuickForm] = useState({
    name: '',
    phone: '',
    address: '',
    preferredDate: '',
    selectedTestId: '',
  });
  const [formSuccess, setFormSuccess] = useState(false);

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
    if (!quickForm.name || !quickForm.phone || !quickForm.address) {
      alert('Please fill out your name, phone number, and address.');
      return;
    }
    // Navigate to home collection page with prefilled data or submit
    navigate('/home-collection', { state: { prefilled: quickForm } });
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50 pt-10 pb-16 sm:pb-24 border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Premier Diagnostic Laboratory in Jamshedpur</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Accurate Diagnostic Reports At <span className="text-sky-600">Affordable Rates</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Trust ACCUSURE DIAGNOSTICS for high-precision blood tests, routine checkups, and specialized health packages. Enjoy <strong>100% Free Doorstep Home Sample Collection</strong> anywhere in Jamshedpur.
              </p>

              {/* Quick Search Bar */}
              <div className="max-w-xl mx-auto lg:mx-0 relative">
                <div className="flex items-center bg-white rounded-2xl border-2 border-sky-300 shadow-md focus-within:border-sky-600 focus-within:ring-4 focus-within:ring-sky-100 transition-all p-1.5">
                  <Search className="w-5 h-5 text-sky-500 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search CBC, Sugar, Thyroid, Lipid, Liver Test..."
                    className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden"
                  />
                  <Link
                    to="/tests"
                    className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shrink-0 transition"
                  >
                    Find Tests
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2 mt-2.5 text-xs text-slate-500 justify-center lg:justify-start">
                  <span className="font-semibold text-slate-700">Popular:</span>
                  {['CBC', 'Lipid Profile', 'Thyroid T3 T4 TSH', 'HbA1c', 'LFT'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="text-sky-600 hover:underline hover:text-sky-800 font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/home-collection"
                  className="px-6 py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-sm shadow-md shadow-sky-600/30 flex items-center gap-2 transition hover:-translate-y-0.5"
                >
                  <Home className="w-4 h-4" />
                  <span>Book Free Home Collection</span>
                </Link>

                <a
                  href="tel:7205573352"
                  className="px-6 py-3.5 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 rounded-xl font-bold text-sm shadow-xs flex items-center gap-2 transition"
                >
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>Call 7205573352</span>
                </a>

                <a
                  href="https://wa.me/917205573352?text=Hello%20Accusure%20Diagnostics,%20I%20want%20to%20book%20a%20test"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-xs flex items-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>

              {/* Badges / Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80 text-left">
                <div className="p-3 bg-white/70 rounded-xl border border-slate-200/80">
                  <div className="text-xl font-black text-slate-900">FREE</div>
                  <div className="text-[11px] text-slate-500 font-medium">Home Sample Collection</div>
                </div>
                <div className="p-3 bg-white/70 rounded-xl border border-slate-200/80">
                  <div className="text-xl font-black text-sky-600">6 - 12 Hrs</div>
                  <div className="text-[11px] text-slate-500 font-medium">Fast Report Turnaround</div>
                </div>
                <div className="p-3 bg-white/70 rounded-xl border border-slate-200/80">
                  <div className="text-xl font-black text-slate-900">100%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Calibrated Analyzers</div>
                </div>
                <div className="p-3 bg-white/70 rounded-xl border border-slate-200/80">
                  <div className="text-xl font-black text-emerald-600">4.9 ★</div>
                  <div className="text-[11px] text-slate-500 font-medium">Patient Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right Card: Quick Express Booking Box */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-100 relative">
                <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[11px] font-extrabold uppercase px-3.5 py-1 rounded-full shadow-md">
                  Zero Travel • 100% Free Home Visit
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Request Home Sample Collection</h3>
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
                      placeholder="e.g. Ramesh Kumar"
                      value={quickForm.name}
                      onChange={(e) => setQuickForm({ ...quickForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit phone number"
                      value={quickForm.phone}
                      onChange={(e) => setQuickForm({ ...quickForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Home Address in Jamshedpur</label>
                    <textarea
                      rows="2"
                      required
                      placeholder="Street, Colony, House/Flat No., Landmark"
                      value={quickForm.address}
                      onChange={(e) => setQuickForm({ ...quickForm, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 focus:outline-hidden"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Preferred Date</label>
                      <input
                        type="date"
                        value={quickForm.preferredDate}
                        onChange={(e) => setQuickForm({ ...quickForm, preferredDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Diagnostic Test</label>
                      <select
                        value={quickForm.selectedTestId}
                        onChange={(e) => setQuickForm({ ...quickForm, selectedTestId: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-hidden"
                      >
                        <option value="">Select Test / Checkup</option>
                        {tests.slice(0, 8).map((t) => (
                          <option key={t.id} value={t.id}>{t.name} (₹{t.final_price})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-4"
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
                  <span>Instant Call Helpline: <strong>7205573352</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR DIAGNOSTIC TESTS & PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">Transparent & Affordable</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
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
              className="bg-white rounded-2xl border border-slate-200 hover:border-sky-300 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
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
                      <span className="text-xl font-black text-slate-900">₹{test.final_price}</span>
                      {test.discount_price && (
                        <span className="text-xs line-through text-slate-400">₹{test.price}</span>
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

      {/* 3. HOW IT WORKS */}
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
            {/* Step 1 */}
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                01
              </div>
              <h3 className="font-bold text-base text-white mb-2">Book Test Online or Call</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Select your required blood test or package online, or simply dial <strong>7205573352</strong>. Choose Free Home Collection or Center Visit.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                02
              </div>
              <h3 className="font-bold text-base text-white mb-2">Free Doorstep Collection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Trained phlebotomist arrives at your home with sterilized vacuum tubes. 100% painless sampling using single-use needles.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                03
              </div>
              <h3 className="font-bold text-base text-white mb-2">Automated Lab Testing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Samples are barcoded and analyzed on automated diagnostic analyzers calibrated against NABL quality standards.
              </p>
            </div>

            {/* Step 4 */}
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

      {/* 3.5 DEDICATED LABORATORY & INFRASTRUCTURE SHOWCASE */}
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

      {/* 4. ABOUT ACCUSURE DIAGNOSTICS */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-600">About Our Center</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Reliable Healthcare Diagnostics For Jamshedpur Families
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              <strong>ACCUSURE DIAGNOSTICS</strong> was established with a singular mission: to make world-class pathology and health screening affordable and accessible to every citizen. Located at Sunday Market, Birsanagar, Jamshedpur, our center offers full routine and advanced medical diagnostics.
            </p>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Affordable Healthcare:</strong> Every blood test and full-body checkup is priced transparently with no hidden charges.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Specialized Home Collection:</strong> Dedicated phlebotomy team covering all areas of Jamshedpur free of charge.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Qualified Pathologists:</strong> Reports reviewed and signed by experienced consultant pathologists.</span>
              </div>
            </div>
          </div>

          {/* Business Info Card */}
          <div className="bg-sky-50 border border-sky-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="font-bold text-slate-900 text-lg border-b border-sky-200 pb-3">
              ACCUSURE DIAGNOSTICS Center Highlights
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-2xs">
                <span className="text-slate-400 block mb-1">Center Address</span>
                <strong className="text-slate-800 leading-snug">
                  Shop No. 7, MIJO HOUSE, Sunday Market, Birsanagar, Jamshedpur
                </strong>
              </div>

              <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-2xs">
                <span className="text-slate-400 block mb-1">Direct Contact</span>
                <strong className="text-slate-800 text-sm">7205573352</strong>
                <p className="text-slate-500 mt-1">ashwanarya20042004@gmail.com</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-2xs">
                <span className="text-slate-400 block mb-1">Working Timings</span>
                <strong className="text-slate-800">Mon - Sun: 06:30 AM - 09:00 PM</strong>
                <p className="text-emerald-600 font-semibold mt-1">Open 7 Days A Week</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-2xs">
                <span className="text-slate-400 block mb-1">Flagship Feature</span>
                <strong className="text-emerald-700">100% Free Doorstep Collection</strong>
                <p className="text-slate-500 mt-1">Across Jamshedpur</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="tel:7205573352"
                className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-center text-xs transition"
              >
                Call Us Now (7205573352)
              </a>
              <a
                href="https://wa.me/917205573352?text=Hello%20Accusure%20Diagnostics"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-center text-xs transition"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PATIENT TESTIMONIALS */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-sky-600 text-xs font-bold uppercase tracking-wider">Patient Feedback</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">What Jamshedpur Patients Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "The free home sample collection is a blessing for elderly parents. Rahul the phlebotomist was on time at Birsanagar, very polite and painless sample draw."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <strong className="text-slate-900 text-xs block">Suresh Mandal</strong>
                <span className="text-[11px] text-slate-400">Birsanagar, Jamshedpur</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Got my Master Health Package done for just ₹1,999. Other labs in town charge more than ₹3,500 for the same 70 tests. Received verified PDF report in the evening."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <strong className="text-slate-900 text-xs block">Anjali Sen</strong>
                <span className="text-[11px] text-slate-400">Telco Colony, Jamshedpur</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Very fast CBC and sugar report turnaround within 4 hours. Downloaded report with QR code directly from patient portal. Highly recommend Accusure Diagnostics!"
              </p>
              <div className="pt-2 border-t border-slate-100">
                <strong className="text-slate-900 text-xs block">Vikramaditya Roy</strong>
                <span className="text-[11px] text-slate-400">Baridih, Jamshedpur</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT & LOCATION SECTION */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Get In Touch</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Visit ACCUSURE DIAGNOSTICS Or Schedule Free Home Collection
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Have questions regarding fasting requirements, test packages, or same-day report delivery? Our team is available 7 days a week.
              </p>

              <div className="space-y-2.5 text-xs text-slate-200 pt-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Shop No. 7, MIJO HOUSE, Sunday Market, Birsanagar, Jamshedpur</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Contact Phone: <strong>7205573352</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>WhatsApp Support: <strong>7205573352</strong></span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/15 p-6 rounded-2xl space-y-4 text-xs">
              <h3 className="font-bold text-base text-white">Direct Quick Connect</h3>
              <p className="text-slate-300">Choose your preferred channel to reach out immediately:</p>
              
              <div className="space-y-2">
                <a
                  href="tel:7205573352"
                  className="w-full py-3 px-4 rounded-xl bg-white text-slate-900 font-bold flex items-center justify-center gap-2 hover:bg-slate-100 transition"
                >
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>Call 7205573352 Directly</span>
                </a>

                <a
                  href="https://wa.me/917205573352?text=Hello%20Accusure%20Diagnostics,%20I%20want%20to%20inquire%20about%20tests"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <Link
                  to="/home-collection"
                  className="w-full py-3 px-4 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-sky-500 transition"
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

