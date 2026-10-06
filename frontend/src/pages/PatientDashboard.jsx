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
  RefreshCw
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
    fetchDashboardData();
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/me/', profileForm);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      console.error('Profile update failed', err);
      alert('Failed to update profile.');
    }
  };

  const getWorkflowStepIndex = (status) => {
    const steps = ['PENDING', 'CONFIRMED', 'SAMPLE_COLLECTED', 'TESTING', 'REPORT_READY', 'COMPLETED'];
    return steps.indexOf(status);
  };

  const workflowSteps = [
    { key: 'PENDING', label: 'Booking Placed' },
    { key: 'CONFIRMED', label: 'Confirmed' },
    { key: 'SAMPLE_COLLECTED', label: 'Sample Drawn' },
    { key: 'TESTING', label: 'In Lab Testing' },
    { key: 'REPORT_READY', label: 'Report Ready' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white font-black text-xl flex items-center justify-center shadow-md">
            {user?.first_name ? user.first_name[0] : user?.username[0].toUpperCase()}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-sky-600">Patient Health Portal</div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Welcome, {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Ph: {user?.phone_number || '7205573352'} • {user?.address || 'Birsanagar, Jamshedpur'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/home-collection"
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Test</span>
          </Link>
          <button
            onClick={fetchDashboardData}
            className="p-2.5 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition border border-slate-200"
            title="Refresh records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
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
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition ${
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

      {/* TAB 1: BOOKINGS & TRACKING WORKFLOW */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">Loading appointments...</div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No Appointments Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Schedule your blood test checkup or free home collection in Jamshedpur right now.
              </p>
              <Link
                to="/home-collection"
                className="inline-block px-5 py-2.5 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Book Free Home Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const currentStepIdx = getWorkflowStepIndex(booking.status);
                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-900">
                            {booking.booking_id}
                          </span>
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-sky-50 text-sky-700">
                            {booking.collection_type === 'HOME_COLLECTION' ? 'Free Home Collection' : 'Center Visit'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Patient: <strong>{booking.patient_name}</strong> ({booking.patient_age}y / {booking.patient_gender}) • Phone: {booking.patient_phone}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-slate-500 block">Scheduled For</span>
                        <strong className="text-slate-800 text-xs">
                          {new Date(booking.preferred_date).toLocaleDateString()} ({booking.preferred_time_slot})
                        </strong>
                      </div>
                    </div>

                    {/* LIVE WORKFLOW TRACKER */}
                    <div className="py-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Live Diagnostic Workflow Tracker
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                        {workflowSteps.map((step, idx) => {
                          const isDone = currentStepIdx >= idx;
                          const isCurrent = currentStepIdx === idx;
                          return (
                            <div
                              key={step.key}
                              className={`p-2.5 rounded-xl border text-center transition ${
                                isCurrent
                                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                  : isDone
                                  ? 'bg-sky-50 text-sky-800 border-sky-200'
                                  : 'bg-slate-50 text-slate-400 border-slate-200'
                              }`}
                            >
                              <div className="text-[10px] font-bold">Step 0{idx + 1}</div>
                              <div className="text-xs font-semibold mt-0.5 truncate">{step.label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Items & Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">Investigations Booked:</span>
                        <ul className="space-y-1">
                          {(booking.items || []).map((item) => (
                            <li key={item.id} className="flex justify-between text-slate-600">
                              <span>• {item.test_name}</span>
                              <span className="font-mono font-semibold text-slate-900">₹{item.price}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                          <span>Total Amount:</span>
                          <span className="font-mono text-sky-700">₹{booking.total_amount}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <span className="font-bold text-slate-700 block">Collection Details:</span>
                          <p className="text-slate-600 mt-0.5">
                            {booking.collection_address || 'Shop No. 7, Sunday Market, Birsanagar'}
                            {booking.landmark && ` (Landmark: ${booking.landmark})`}
                          </p>
                        </div>
                        {booking.phlebotomist_notes && (
                          <div className="bg-white p-2 rounded-lg border border-slate-200 text-[11px] text-slate-700">
                            <strong>Phlebotomist Note:</strong> {booking.phlebotomist_notes}
                          </div>
                        )}
                        {booking.assigned_staff_name && (
                          <div className="text-[11px] text-slate-500">
                            Assigned Phlebotomist: <strong>{booking.assigned_staff_name}</strong>
                          </div>
                        )}
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
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No Lab Reports Available Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once your blood sample is analyzed and verified by our pathologist, your report will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-sky-300 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-sky-700">
                        {report.report_id}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified Report
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">
                      Diagnostic Laboratory Report
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Booking: <span className="font-mono">{report.booking_id_str}</span> • Reported on{' '}
                      {new Date(report.reported_at).toLocaleDateString()}
                    </p>

                    <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 line-clamp-2">
                      <strong className="text-slate-800">Interpretation: </strong>
                      {report.overall_summary}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View & Download Report</span>
                    </button>
                    <Link
                      to={`/verify/${report.verification_code}`}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                      title="Verify QR"
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
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No Invoices Found</h3>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Invoice No</th>
                      <th className="py-3 px-4 font-semibold">Booking Ref</th>
                      <th className="py-3 px-4 font-semibold">Date</th>
                      <th className="py-3 px-4 font-semibold">Amount</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{inv.invoice_number}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{inv.booking_id_str}</td>
                        <td className="py-3.5 px-4 text-slate-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">₹{inv.total_amount}</td>
                        <td className="py-3.5 px-4">
                          {inv.payment_status === 'PAID' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              PAID ({inv.payment_method})
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              PENDING
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 transition"
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
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">No Prescriptions Issued</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Consultation advice and digital prescriptions from center doctors will be stored here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((presc) => (
                <div key={presc.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex justify-between items-start border-b pb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{presc.doctor_name || 'Dr. R. K. Mukherjee'}</h4>
                      <p className="text-xs text-slate-500">Issued on {new Date(presc.created_at).toLocaleDateString()}</p>
                    </div>
                    {presc.follow_up_date && (
                      <span className="text-xs text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg font-semibold">
                        Follow-up: {new Date(presc.follow_up_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <strong>Clinical Diagnosis:</strong>
                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{presc.diagnosis}</p>
                  </div>

                  {Array.isArray(presc.medicines) && presc.medicines.length > 0 && (
                    <div>
                      <strong className="text-xs text-slate-700 block mb-2">Prescribed Medications:</strong>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                          <thead className="bg-slate-50 text-slate-600">
                            <tr>
                              <th className="p-2">Medicine</th>
                              <th className="p-2">Dosage</th>
                              <th className="p-2">Timing</th>
                              <th className="p-2">Duration</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {presc.medicines.map((m, i) => (
                              <tr key={i}>
                                <td className="p-2 font-semibold text-slate-800">{m.name}</td>
                                <td className="p-2 text-slate-600">{m.dosage}</td>
                                <td className="p-2 text-slate-600">{m.timing}</td>
                                <td className="p-2 text-slate-600">{m.duration}</td>
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
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl shadow-xs space-y-5">
          <h3 className="font-bold text-slate-900 text-base border-b pb-3">My Patient Profile</h3>

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

