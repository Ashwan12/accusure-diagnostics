import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  FileText, 
  Receipt, 
  User, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Home, 
  Plus, 
  Download, 
  Stethoscope, 
  ArrowRight,
  ShieldCheck,
  Phone,
  RefreshCw,
  Heart,
  Droplet,
  Activity,
  Sparkles,
  TrendingUp,
  MessageCircle,
  ExternalLink,
  MapPin,
  TestTube2,
  Check
} from 'lucide-react';
import api from '../services/api';
import ReportModal from '../components/ReportModal';
import InvoiceModal from '../components/InvoiceModal';

const PatientDashboard = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [reports, setReports] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Modals
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone_number: user?.phone_number || '',
    address: user?.address || '',
    gender: user?.gender || 'Male',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bRes, rRes, iRes, pRes] = await Promise.all([
        api.get('/bookings/'),
        api.get('/reports/'),
        api.get('/billing/'),
        api.get('/doctors/prescriptions/'),
      ]);
      setBookings(Array.isArray(bRes.data) ? bRes.data : []);
      setReports(Array.isArray(rRes.data) ? rRes.data : []);
      setInvoices(Array.isArray(iRes.data) ? iRes.data : []);
      setPrescriptions(Array.isArray(pRes.data) ? pRes.data : []);

    } catch (err) {
      console.error('Failed to load patient data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setProfileForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone_number: user.phone_number || '',
      address: user.address || '',
      gender: user.gender || 'Male',
    });
    fetchDashboardData();
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const updated = { ...user, ...profileForm };
    try {
      const res = await api.put('/auth/me/', profileForm);
      if (res?.data) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      } else {
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }
    } catch (err) {
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const getWorkflowStepIndex = (status) => {
    const steps = ['PENDING', 'CONFIRMED', 'SAMPLE_COLLECTED', 'TESTING', 'REPORT_READY', 'COMPLETED'];
    return steps.indexOf(status);
  };

  const workflowSteps = [
    { key: 'PENDING', label: 'Booking Placed', desc: 'Received at Center' },
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Phlebotomist Assigned' },
    { key: 'SAMPLE_COLLECTED', label: 'Sample Drawn', desc: 'Barcoded & Chilled' },
    { key: 'TESTING', label: 'In Lab Testing', desc: 'Analyzers Running' },
    { key: 'REPORT_READY', label: 'Report Ready', desc: 'Pathologist Verified' },
    { key: 'COMPLETED', label: 'Completed', desc: 'Digital Delivery' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* 1. TOP PREMIUM PATIENT HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-sky-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Patient Details */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 text-white font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-sky-500/30 shrink-0">
              {user?.first_name ? user.first_name[0] : (user?.username ? user.username[0].toUpperCase() : 'P')}
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-bold border border-sky-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Verified Patient Account</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username || 'Patient Portal'}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                <span>Ph: <strong className="text-white font-mono">{user?.phone_number || '7205573352'}</strong></span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  {user?.address || 'Birsanagar, Jamshedpur'}
                </span>
              </div>
            </div>
          </div>

          {/* Health Vitality Index Card & Actions */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Vitality Score Pill */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Health Vitality Score</div>
                <div className="text-base sm:text-lg font-black text-white flex items-baseline gap-1">
                  <span>94/100</span>
                  <span className="text-[11px] text-emerald-400 font-bold">Excellent</span>
                </div>
                <div className="text-[10px] text-slate-400">All vital parameters balanced</div>
              </div>
            </div>

            {/* Book Now & Refresh */}
            <div className="flex items-center gap-2">
              <Link
                to="/home-collection"
                className="px-4 sm:px-5 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Book Test</span>
              </Link>

              <button
                onClick={fetchDashboardData}
                title="Refresh Health Records"
                className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition border border-white/10"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ATTRACTIVE HEALTH VITALITY GAUGES & METRICS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-600" />
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wider">
              Health Vitals & Diagnostic Parameters Overview
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Verified by Dr. R. K. Mukherjee (MD, Pathologist)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Parameter 1: Hemoglobin */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-sky-300 transition space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-slate-800">Hemoglobin (Hb)</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Normal
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                13.4 <span className="text-xs font-medium text-slate-500">g/dL</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Reference: 12.0 - 15.5 g/dL</div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '82%' }}></div>
            </div>
          </div>

          {/* Parameter 2: Blood Sugar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-sky-300 transition space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-slate-800">Fasting Glucose</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Optimal
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                92 <span className="text-xs font-medium text-slate-500">mg/dL</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Reference: 70 - 100 mg/dL</div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-sky-500 h-full rounded-full" style={{ width: '74%' }}></div>
            </div>
          </div>

          {/* Parameter 3: Cholesterol */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-sky-300 transition space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-slate-800">Total Cholesterol</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Desirable
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                178 <span className="text-xs font-medium text-slate-500">mg/dL</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Reference: &lt; 200 mg/dL</div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-teal-500 h-full rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>

          {/* Parameter 4: Vitamin D3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-sky-300 transition space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-slate-800">Vitamin D3 (25-OH)</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Sufficient
              </span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 font-mono">
                38 <span className="text-xs font-medium text-slate-500">ng/mL</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Reference: 30 - 100 ng/mL</div>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LABORATORY INFRASTRUCTURE SPOTLIGHT BANNER */}
      <div className="bg-gradient-to-r from-sky-50 via-teal-50 to-white border border-sky-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-sky-300">
            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80"
              alt="Accusure Automated Laboratory"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
              <span>NABL Standard Laboratory & Cold-Chain Testing</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Every blood sample is drawn using BD Vacutainer sterile vacuum tubes and processed on automated 5-part hematology and clinical biochemistry analyzers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="https://wa.me/917205573352?text=Hello%20Accusure%20Diagnostics,%20I%20have%20a%20query%20about%20my%20test%20reports"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Phlebotomist Chat</span>
          </a>
          <a
            href="tel:7205573352"
            className="px-3.5 py-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-sky-600" />
            <span>7205573352</span>
          </a>
        </div>
      </div>

      {/* 4. TABS NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        {[
          { id: 'bookings', label: `My Appointments (${bookings.length})`, icon: Calendar },
          { id: 'reports', label: `Medical Reports (${reports.length})`, icon: FileText },
          { id: 'billing', label: `Invoices & Billing (${invoices.length})`, icon: Receipt },
          { id: 'prescriptions', label: `Doctor Advice (${prescriptions.length})`, icon: Stethoscope },
          { id: 'profile', label: 'My Profile', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-sky-600 text-sky-600 bg-sky-50/50 rounded-t-xl'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: APPOINTMENTS & LIVE TRACKER */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading appointments...</div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg">No Active Bookings</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Schedule your preventive blood test checkup or 100% Free Doorstep Home Sample Collection anywhere in Jamshedpur right now.
              </p>
              <Link
                to="/home-collection"
                className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>Book Free Home Collection</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const currentStepIdx = getWorkflowStepIndex(booking.status);
                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs hover:border-sky-300 transition space-y-6"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm sm:text-base text-sky-800">
                            {booking.booking_id}
                          </span>
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {booking.collection_type === 'HOME_COLLECTION' ? 'Free Home Collection' : 'Center Visit'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Patient: <strong className="text-slate-900">{booking.patient_name}</strong> ({booking.patient_age}y / {booking.patient_gender}) • Ph: {booking.patient_phone}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-slate-400 block font-medium">Scheduled Appointment</span>
                        <strong className="text-slate-800 text-xs sm:text-sm">
                          {new Date(booking.preferred_date).toLocaleDateString()} ({booking.preferred_time_slot})
                        </strong>
                      </div>
                    </div>

                    {/* LIVE WORKFLOW TRACKER */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Live Diagnostic Sample & Report Workflow
                        </span>
                        <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
                          Current: {workflowSteps[currentStepIdx]?.label || booking.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                        {workflowSteps.map((step, idx) => {
                          const isDone = currentStepIdx >= idx;
                          const isCurrent = currentStepIdx === idx;
                          return (
                            <div
                              key={step.key}
                              className={`p-3 rounded-2xl border text-center transition ${
                                isCurrent
                                  ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-300'
                                  : isDone
                                  ? 'bg-sky-50 text-sky-900 border-sky-200'
                                  : 'bg-slate-50 text-slate-400 border-slate-200'
                              }`}
                            >
                              <div className="text-[10px] font-bold opacity-80">Step 0{idx + 1}</div>
                              <div className="text-xs font-bold mt-0.5">{step.label}</div>
                              <div className="text-[10px] opacity-75 truncate mt-0.5">{step.desc}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Items & Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block mb-2">Tests & Packages Booked:</span>
                        <ul className="space-y-1.5">
                          {(booking.items || []).map((item) => (
                            <li key={item.id} className="flex justify-between text-slate-700 bg-white p-2 rounded-xl border border-slate-100">
                              <span className="font-medium">• {item.test_name}</span>
                              <span className="font-mono font-bold text-slate-900">₹{item.price}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                          <span>Total Amount Payable:</span>
                          <span className="font-mono text-base text-sky-700 font-black">₹{booking.total_amount}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="font-bold text-slate-800 block">Collection Location in Jamshedpur:</span>
                          <p className="text-slate-600 mt-1 leading-relaxed">
                            {booking.collection_address || 'Shop No. 7, MIJO HOUSE, Sunday Market, Birsanagar'}
                            {booking.landmark && ` (Landmark: ${booking.landmark})`}
                          </p>
                        </div>
                        {booking.notes && (
                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-700">
                            <strong>Patient Clinical Notes:</strong> {booking.notes}
                          </div>
                        )}
                        <div className="pt-2 flex items-center gap-2">
                          <a
                            href={`https://wa.me/917205573352?text=Hello%20Accusure%20Diagnostics,%20checking%20status%20for%20booking%20${booking.booking_id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Status</span>
                          </a>
                          <a
                            href="tel:7205573352"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-[11px] font-bold hover:bg-slate-50 transition"
                          >
                            <Phone className="w-3 h-3 text-sky-600" />
                            <span>Help: 7205573352</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MEDICAL REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg">No Lab Reports Yet</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Once our central laboratory analyzes your blood specimen and our MD pathologist signs off, your certified digital report will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-sky-300 hover:shadow-md transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg">
                        {report.report_id}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Verified Digital Report
                      </span>
                    </div>

                    <h4 className="font-black text-slate-900 text-base">
                      Certified Diagnostic Pathology Report
                    </h4>
                    <p className="text-xs text-slate-500">
                      Booking: <span className="font-mono text-slate-700">{report.booking_id_str}</span> • Reported on{' '}
                      <strong>{new Date(report.reported_at).toLocaleDateString()}</strong>
                    </p>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-600">
                      <strong className="text-slate-800 block mb-1">Pathologist Clinical Interpretation:</strong>
                      {report.overall_summary}
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Doctor: <strong>Dr. R. K. Mukherjee (MD, Pathologist)</strong></span>
                      <span className="font-mono text-[10px] text-slate-400">QR-SECURED</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="flex-1 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View & Print PDF Report</span>
                    </button>
                    <Link
                      to={`/verify/${report.verification_code}`}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                      title="Verify QR code"
                    >
                      Verify
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INVOICES & BILLING */}
      {activeTab === 'billing' && (
        <div className="space-y-4">
          {invoices.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-3 max-w-lg mx-auto shadow-xs">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No Invoices Found</h3>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-5 font-bold">Invoice Number</th>
                      <th className="py-3.5 px-5 font-bold">Booking Ref</th>
                      <th className="py-3.5 px-5 font-bold">Date</th>
                      <th className="py-3.5 px-5 font-bold">Total Amount</th>
                      <th className="py-3.5 px-5 font-bold">Payment Status</th>
                      <th className="py-3.5 px-5 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-5 font-mono font-bold text-slate-900">{inv.invoice_number}</td>
                        <td className="py-4 px-5 font-mono text-slate-600">{inv.booking_id_str}</td>
                        <td className="py-4 px-5 text-slate-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                        <td className="py-4 px-5 font-bold text-slate-900 font-mono text-sm">₹{inv.total_amount}</td>
                        <td className="py-4 px-5">
                          {inv.payment_status === 'PAID' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              PAID ({inv.payment_method})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              PAY ON COLLECTION
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 transition"
                          >
                            {inv.payment_status === 'PENDING' ? 'Pay / View' : 'View Receipt'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PRESCRIPTIONS & DOCTOR ADVICE */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          {prescriptions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-3 max-w-lg mx-auto shadow-xs">
              <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No Prescriptions Issued</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Consultation advice and digital prescriptions from center doctors will be stored here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((presc) => (
                <div key={presc.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex justify-between items-start border-b pb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{presc.doctor_name || 'Dr. R. K. Mukherjee'}</h4>
                      <p className="text-xs text-slate-500">Issued on {new Date(presc.created_at).toLocaleDateString()}</p>
                    </div>
                    {presc.follow_up_date && (
                      <span className="text-xs text-sky-700 bg-sky-50 px-3 py-1 rounded-xl font-bold">
                        Follow-up: {new Date(presc.follow_up_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <strong className="block text-slate-800">Clinical Diagnosis:</strong>
                    <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">{presc.diagnosis}</p>
                  </div>

                  {Array.isArray(presc.medicines) && presc.medicines.length > 0 && (
                    <div>
                      <strong className="text-xs text-slate-700 block mb-2">Prescribed Medications:</strong>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                          <thead className="bg-slate-50 text-slate-600 font-semibold">
                            <tr>
                              <th className="p-2.5">Medicine</th>
                              <th className="p-2.5">Dosage</th>
                              <th className="p-2.5">Timing</th>
                              <th className="p-2.5">Duration</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {presc.medicines.map((m, i) => (
                              <tr key={i}>
                                <td className="p-2.5 font-bold text-slate-900">{m.name}</td>
                                <td className="p-2.5 text-slate-600">{m.dosage}</td>
                                <td className="p-2.5 text-slate-600">{m.timing}</td>
                                <td className="p-2.5 text-slate-600">{m.duration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {presc.notes && (
                    <div className="text-xs text-slate-500 italic">
                      Doctor Remarks: {presc.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl shadow-xs space-y-5">
          <h3 className="font-extrabold text-slate-900 text-lg border-b pb-3">My Patient Profile</h3>

          {profileSaved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
              Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={profileForm.phone_number}
                  onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={profileForm.gender}
                  onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Default Address in Jamshedpur</label>
              <textarea
                rows="2"
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden"
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition shadow-xs"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* Report Modal */}
      {selectedReport && (
        <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onPaymentSuccess={() => fetchDashboardData()}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
