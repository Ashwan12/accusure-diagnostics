import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  Users, 
  Calendar, 
  FileText, 
  Receipt, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Send, 
  ShieldCheck, 
  RefreshCw,
  Home
} from 'lucide-react';
import api from '../services/api';
import ReportModal from '../components/ReportModal';
import InvoiceModal from '../components/InvoiceModal';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [tests, setTests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [reports, setReports] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Modals
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Filter states
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('ALL');

  // New Test Modal State
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [newTestForm, setNewTestForm] = useState({
    name: '',
    code: '',
    category: 1,
    price: '',
    discount_price: '',
    sample_type: 'Blood',
    turnaround_hours: 12,
    parameters_included: '',
    description: '',
    fasting_required: false,
    is_popular: false,
  });

  // Report Generator Modal State
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [selectedBookingForReport, setSelectedBookingForReport] = useState(null);
  const [reportSummaryText, setReportSummaryText] = useState('All parameters analyzed using automated calibrated analyzers. Results within normal limits.');
  const [reportParamValues, setReportParamValues] = useState([
    { name: 'Hemoglobin (Hb)', value: '13.5', unit: 'g/dL', normal_range: '12.0 - 16.0', flag: 'NORMAL' },
    { name: 'Total WBC Count', value: '6,800', unit: '/cu.mm', normal_range: '4,000 - 10,000', flag: 'NORMAL' },
    { name: 'Platelet Count', value: '260,000', unit: '/cu.mm', normal_range: '150,000 - 450,000', flag: 'NORMAL' },
    { name: 'Fasting Blood Sugar', value: '94', unit: 'mg/dL', normal_range: '70 - 99', flag: 'NORMAL' },
  ]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, bRes, tRes, invRes, invcRes, rRes, uRes] = await Promise.all([
        api.get('/dashboard/stats/'),
        api.get('/bookings/'),
        api.get('/tests/'),
        api.get('/inventory/'),
        api.get('/billing/'),
        api.get('/reports/'),
        api.get('/auth/users/'),
      ]);
      setStats(statsRes.data);
      setBookings(bRes.data);
      setTests(tRes.data);
      setInventory(invRes.data);
      setInvoices(invcRes.data);
      setReports(rRes.data);
      setStaffUsers(uRes.data.filter((u) => u.role === 'staff' || u.role === 'admin'));
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      navigate('/login');
      return;
    }
    fetchAllData();
  }, [user]);

  // Handle status update of booking
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.post(`/bookings/${bookingId}/update_status/`, { status: newStatus });
      fetchAllData();
    } catch (err) {
      console.error('Status update failed', err);
      alert('Could not update status');
    }
  };

  // Handle assign staff
  const handleAssignStaff = async (bookingId, staffId) => {
    try {
      await api.post(`/bookings/${bookingId}/assign_staff/`, { staff_id: staffId });
      fetchAllData();
    } catch (err) {
      console.error('Assign staff failed', err);
    }
  };

  // Handle Inventory Stock Adjustment
  const handleAdjustStock = async (itemId, delta) => {
    try {
      await api.post(`/inventory/${itemId}/adjust_stock/`, { delta });
      fetchAllData();
    } catch (err) {
      console.error('Stock adjustment failed', err);
    }
  };

  // Handle Add New Test
  const handleCreateTest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tests/', {
        ...newTestForm,
        category: Number(newTestForm.category),
        price: Number(newTestForm.price),
        discount_price: newTestForm.discount_price ? Number(newTestForm.discount_price) : null,
      });
      setShowAddTestModal(false);
      fetchAllData();
    } catch (err) {
      console.error('Failed to add test', err);
      alert('Error creating test. Please check code uniqueness.');
    }
  };

  // Handle Publish Report for Booking
  const handlePublishReport = async (e) => {
    e.preventDefault();
    if (!selectedBookingForReport) return;

    try {
      await api.post('/reports/', {
        booking: selectedBookingForReport.id,
        patient: selectedBookingForReport.patient,
        doctor_name: 'Dr. R. K. Mukherjee (MD, Pathologist)',
        overall_summary: reportSummaryText,
        parameters_data: [
          {
            section: selectedBookingForReport.items?.[0]?.test_name || 'Laboratory Investigation',
            items: reportParamValues,
          },
        ],
        status: 'PUBLISHED',
      });
      setShowGenerateReportModal(false);
      fetchAllData();
      alert('Report published and patient notified successfully!');
    } catch (err) {
      console.error('Report publish failed', err);
      alert('Failed to publish report.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingStatusFilter === 'ALL') return true;
    return b.status === bookingStatusFilter;
  });

  const filteredInventory = inventory.filter((item) => {
    if (inventoryCategoryFilter === 'ALL') return true;
    if (inventoryCategoryFilter === 'LOW') return item.is_low_stock;
    return item.category === inventoryCategoryFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-md shadow-sky-600/30">
            <Activity className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                Accusure Admin Management Center
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300">
                {user?.role.toUpperCase()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Operations & Healthcare Dashboard
            </h1>
            <p className="text-xs text-slate-400">
              Logged in as <strong>{user?.get_full_name || user?.username}</strong> • Shop No. 7, Birsanagar, Jamshedpur
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddTestModal(true)}
            className="px-3.5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Test</span>
          </button>
          <button
            onClick={fetchAllData}
            className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition border border-slate-700"
            title="Refresh database"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        {[
          { id: 'overview', label: 'Analytics & KPIs', icon: TrendingUp },
          { id: 'bookings', label: `Bookings (${bookings.length})`, icon: Calendar },
          { id: 'home_collections', label: `Home Collections (${bookings.filter(b => b.collection_type === 'HOME_COLLECTION').length})`, icon: Home },
          { id: 'tests_catalog', label: `Test Catalog (${tests.length})`, icon: Activity },
          { id: 'reports', label: `Reports (${reports.length})`, icon: FileText },
          { id: 'billing', label: `Invoices (₹${stats?.total_revenue || 0})`, icon: Receipt },
          { id: 'inventory', label: `Inventory Supplies (${inventory.length})`, icon: Package },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold block">Total Registered Patients</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats?.total_patients || 0}</div>
              <div className="text-[11px] text-emerald-600 font-medium">Jamshedpur Center Records</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold block">Total Diagnostic Bookings</span>
              <div className="text-2xl sm:text-3xl font-black text-sky-600">{stats?.total_bookings || 0}</div>
              <div className="text-[11px] text-slate-500 font-medium">{stats?.completed_bookings || 0} Completed Tests</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold block">Pending Home Collections</span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600">{stats?.pending_collections || 0}</div>
              <div className="text-[11px] text-amber-700 font-medium">Doorstep sample pickup queue</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs text-slate-500 font-semibold block">Collected Lab Revenue</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">₹{stats?.total_revenue || 0}</div>
              <div className="text-[11px] text-slate-500 font-medium">Pending: ₹{stats?.pending_revenue || 0}</div>
            </div>
          </div>

          {/* Quick Notice Banner if Low Stock exists */}
          {stats?.low_stock_items > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <span>
                  <strong>Inventory Alert:</strong> {stats.low_stock_items} supply item(s) are below safety reorder threshold!
                </span>
              </div>
              <button
                onClick={() => { setActiveTab('inventory'); setInventoryCategoryFilter('LOW'); }}
                className="px-3 py-1 bg-amber-600 text-white font-bold rounded-lg text-xs hover:bg-amber-700 transition"
              >
                View Low Stock
              </button>
            </div>
          )}

          {/* Recent Bookings Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Recent Patient Bookings</h3>
              <button
                onClick={() => setActiveTab('bookings')}
                className="text-xs font-bold text-sky-600 hover:text-sky-800"
              >
                Manage All Bookings →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Booking ID</th>
                    <th className="py-2.5 px-3">Patient</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(stats?.recent_bookings || []).map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{b.booking_id}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{b.patient_name}</td>
                      <td className="py-3 px-3 text-slate-500">{b.phone}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                          {b.collection_type === 'HOME_COLLECTION' ? 'Home Collection' : 'Center'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{b.preferred_date}</td>
                      <td className="py-3 px-3 font-bold font-mono text-slate-900">₹{b.total_amount}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS MANAGEMENT */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {/* Status Filter Toolbar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {['ALL', 'PENDING', 'CONFIRMED', 'SAMPLE_COLLECTED', 'TESTING', 'REPORT_READY', 'COMPLETED'].map((st) => (
              <button
                key={st}
                onClick={() => setBookingStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  bookingStatusFilter === st
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Bookings List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Booking ID</th>
                    <th className="py-3 px-4 font-semibold">Patient & Phone</th>
                    <th className="py-3 px-4 font-semibold">Type & Address</th>
                    <th className="py-3 px-4 font-semibold">Schedule</th>
                    <th className="py-3 px-4 font-semibold">Amount</th>
                    <th className="py-3 px-4 font-semibold">Status Workflow</th>
                    <th className="py-3 px-4 font-semibold">Assigned Staff</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {b.booking_id}
                        <div className="text-[10px] text-slate-400 font-sans">
                          {b.items?.length || 0} test(s)
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <strong className="text-slate-800 block">{b.patient_name}</strong>
                        <a href={`tel:${b.patient_phone}`} className="text-sky-600 hover:underline">
                          {b.patient_phone}
                        </a>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-semibold text-emerald-700 block">
                          {b.collection_type === 'HOME_COLLECTION' ? 'Free Home Collection' : 'Center Visit'}
                        </span>
                        <span className="text-slate-500 line-clamp-1">{b.collection_address}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="block text-slate-800 font-medium">
                          {new Date(b.preferred_date).toLocaleDateString()}
                        </span>
                        <span className="text-[11px] text-slate-500">{b.preferred_time_slot}</span>
                      </td>

                      <td className="py-3.5 px-4 font-bold font-mono text-slate-900">
                        ₹{b.total_amount}
                      </td>

                      {/* Workflow Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value)}
                          className="px-2 py-1 text-xs rounded-lg border border-slate-300 font-bold bg-slate-50 text-slate-800 focus:outline-hidden"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="SAMPLE_COLLECTED">SAMPLE_COLLECTED</option>
                          <option value="TESTING">TESTING</option>
                          <option value="REPORT_READY">REPORT_READY</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      {/* Assigned Staff */}
                      <td className="py-3.5 px-4">
                        <select
                          value={b.assigned_staff || ''}
                          onChange={(e) => handleAssignStaff(b.id, e.target.value)}
                          className="px-2 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-hidden"
                        >
                          <option value="">Unassigned</option>
                          {staffUsers.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.first_name ? `${s.first_name} (${s.username})` : s.username}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Action to Generate / View Report */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedBookingForReport(b);
                            setShowGenerateReportModal(true);
                          }}
                          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                        >
                          Attach Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HOME COLLECTION DISPATCH BOARD */}
      {activeTab === 'home_collections' && (
        <div className="space-y-4">
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-xs text-sky-900 flex items-center justify-between">
            <div>
              <strong className="block text-sm">Doorstep Phlebotomy Dispatch Board</strong>
              <span>Manage scheduled home sample pickups across Birsanagar, Baridih, Telco, and Jamshedpur zones.</span>
            </div>
            <span className="font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full">
              {bookings.filter(b => b.collection_type === 'HOME_COLLECTION' && b.status !== 'COMPLETED').length} Active Pickups
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings
              .filter((b) => b.collection_type === 'HOME_COLLECTION')
              .map((b) => (
                <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-900">{b.booking_id}</span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{b.patient_name}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {b.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Address: </strong>{b.collection_address}
                        {b.landmark && <span className="block text-slate-400">Landmark: {b.landmark}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.preferred_date} ({b.preferred_time_slot})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <a href={`tel:${b.patient_phone}`} className="font-bold text-slate-800 hover:text-sky-600">
                        {b.patient_phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <a
                      href={`https://wa.me/91${b.patient_phone}?text=Hello%20${encodeURIComponent(b.patient_name)},%20ACCUSURE%20phlebotomist%20is%20on%20the%20way%20for%20your%20sample%20collection.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-1.5 text-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                    >
                      WhatsApp
                    </a>
                    <button
                      onClick={() => handleUpdateBookingStatus(b.id, 'SAMPLE_COLLECTED')}
                      className="flex-1 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition"
                    >
                      Mark Collected
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: TEST CATALOG & PRICING */}
      {activeTab === 'tests_catalog' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-base">Diagnostic Tests & Pricing</h3>
            <button
              onClick={() => setShowAddTestModal(true)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Test</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Test Name</th>
                    <th className="py-3 px-4 font-semibold">Code</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Price (₹)</th>
                    <th className="py-3 px-4 font-semibold">Offer Price (₹)</th>
                    <th className="py-3 px-4 font-semibold">Sample Type</th>
                    <th className="py-3 px-4 font-semibold">Turnaround</th>
                    <th className="py-3 px-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tests.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">{t.name}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{t.code}</td>
                      <td className="py-3 px-4 text-slate-600">{t.category_name}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">₹{t.price}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                        {t.discount_price ? `₹${t.discount_price}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{t.sample_type}</td>
                      <td className="py-3 px-4 text-slate-600">{t.turnaround_hours}h</td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MEDICAL REPORT MANAGEMENT */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Report ID</th>
                    <th className="py-3 px-4 font-semibold">Booking ID</th>
                    <th className="py-3 px-4 font-semibold">Patient</th>
                    <th className="py-3 px-4 font-semibold">Reported At</th>
                    <th className="py-3 px-4 font-semibold">Doctor</th>
                    <th className="py-3 px-4 font-semibold">QR Code ID</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-sky-700">{r.report_id}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{r.booking_id_str}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{r.patient_name || r.patient_username}</td>
                      <td className="py-3 px-4 text-slate-500">{new Date(r.reported_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-slate-700">{r.doctor_name}</td>
                      <td className="py-3 px-4 font-mono text-[10px] text-slate-400">
                        {r.verification_code?.slice(0, 16)}...
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedReport(r)}
                          className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
                        >
                          View / Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: BILLING & REVENUE */}
      {activeTab === 'billing' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Invoice No</th>
                    <th className="py-3 px-4 font-semibold">Patient</th>
                    <th className="py-3 px-4 font-semibold">Booking ID</th>
                    <th className="py-3 px-4 font-semibold">Amount</th>
                    <th className="py-3 px-4 font-semibold">Payment Status</th>
                    <th className="py-3 px-4 font-semibold">Method</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoice_number}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{inv.patient_name || inv.patient_username}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{inv.booking_id_str}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">₹{inv.total_amount}</td>
                      <td className="py-3 px-4">
                        {inv.payment_status === 'PAID' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            PAID
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            PENDING
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{inv.payment_method}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                        >
                          Invoice Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: INVENTORY MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {['ALL', 'LOW', 'TUBES', 'SYRINGES', 'PPE', 'CONTAINERS', 'REAGENTS'].map((c) => (
                <button
                  key={c}
                  onClick={() => setInventoryCategoryFilter(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    inventoryCategoryFilter === c
                      ? 'bg-sky-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Item Name</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">SKU</th>
                    <th className="py-3 px-4 font-semibold">Stock In Hand</th>
                    <th className="py-3 px-4 font-semibold">Reorder Threshold</th>
                    <th className="py-3 px-4 font-semibold">Stock Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Quick Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                      <td className="py-3 px-4 text-slate-600">{item.category}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{item.sku}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{item.reorder_level} {item.unit}</td>
                      <td className="py-3 px-4">
                        {item.is_low_stock ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" />
                            LOW STOCK
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            IN STOCK
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleAdjustStock(item.id, -10)}
                            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-bold"
                            title="Deduct 10"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => handleAdjustStock(item.id, 25)}
                            className="px-2 py-0.5 bg-sky-50 hover:bg-sky-100 rounded text-sky-700 font-bold"
                            title="Add 25"
                          >
                            +25
                          </button>
                          <button
                            onClick={() => handleAdjustStock(item.id, 50)}
                            className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 rounded text-emerald-700 font-bold"
                            title="Add 50"
                          >
                            +50
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW TEST MODAL */}
      {showAddTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-4">Add New Diagnostic Test</h3>
            <form onSubmit={handleCreateTest} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Test Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Serum Ferritin"
                  value={newTestForm.name}
                  onChange={(e) => setNewTestForm({ ...newTestForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Unique Code</label>
                  <input
                    type="text"
                    required
                    placeholder="ACC-FER"
                    value={newTestForm.code}
                    onChange={(e) => setNewTestForm({ ...newTestForm, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={newTestForm.category}
                    onChange={(e) => setNewTestForm({ ...newTestForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
                  >
                    <option value="1">Routine Blood Tests</option>
                    <option value="2">Organ & Profile Panels</option>
                    <option value="3">Diabetes & Sugar</option>
                    <option value="4">Vitamins & Hormones</option>
                    <option value="5">Infection & Fever</option>
                    <option value="6">Full Body Packages</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Regular Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="450"
                    value={newTestForm.price}
                    onChange={(e) => setNewTestForm({ ...newTestForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    placeholder="399"
                    value={newTestForm.discount_price}
                    onChange={(e) => setNewTestForm({ ...newTestForm, discount_price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Sample Type</label>
                  <input
                    type="text"
                    value={newTestForm.sample_type}
                    onChange={(e) => setNewTestForm({ ...newTestForm, sample_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Turnaround (Hours)</label>
                  <input
                    type="number"
                    value={newTestForm.turnaround_hours}
                    onChange={(e) => setNewTestForm({ ...newTestForm, turnaround_hours: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Parameters Included</label>
                <input
                  type="text"
                  placeholder="e.g. Ferritin, Iron Binding"
                  value={newTestForm.parameters_included}
                  onChange={(e) => setNewTestForm({ ...newTestForm, parameters_included: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddTestModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white font-bold rounded-lg"
                >
                  Save Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERATE / PUBLISH REPORT MODAL */}
      {showGenerateReportModal && selectedBookingForReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-2">
              Publish Diagnostic Report: {selectedBookingForReport.booking_id}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Patient: <strong>{selectedBookingForReport.patient_name}</strong> • Phone: {selectedBookingForReport.patient_phone}
            </p>

            <form onSubmit={handlePublishReport} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Consultant Pathologist Interpretation & Clinical Summary</label>
                <textarea
                  rows="3"
                  value={reportSummaryText}
                  onChange={(e) => setReportSummaryText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold mb-2">Parameter Observed Values:</label>
                <div className="space-y-2">
                  {reportParamValues.map((p, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-lg">
                      <span className="col-span-5 font-semibold text-slate-800">{p.name}</span>
                      <input
                        type="text"
                        value={p.value}
                        onChange={(e) => {
                          const updated = [...reportParamValues];
                          updated[idx].value = e.target.value;
                          setReportParamValues(updated);
                        }}
                        className="col-span-3 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                      <span className="col-span-2 text-slate-500 text-[10px]">{p.unit}</span>
                      <select
                        value={p.flag}
                        onChange={(e) => {
                          const updated = [...reportParamValues];
                          updated[idx].flag = e.target.value;
                          setReportParamValues(updated);
                        }}
                        className="col-span-2 px-1 py-1 border rounded text-[10px]"
                      >
                        <option value="NORMAL">Normal</option>
                        <option value="HIGH">High</option>
                        <option value="LOW">Low</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowGenerateReportModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Publish & Verify Report
                </button>
              </div>
            </form>
          </div>
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
          onPaymentSuccess={() => fetchAllData()}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

