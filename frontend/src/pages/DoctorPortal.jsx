import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Stethoscope, 
  Users, 
  FileText, 
  Calendar, 
  Plus, 
  CheckCircle, 
  Clock, 
  Pill, 
  Search, 
  Activity,
  Trash2
} from 'lucide-react';
import api from '../services/api';
import ReportModal from '../components/ReportModal';

const DoctorPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedReport, setSelectedReport] = useState(null);
  const [showAddPrescriptionModal, setShowAddPrescriptionModal] = useState(false);

  // New Prescription Form
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', timing: '', duration: '' },
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, rRes, pRes, bRes] = await Promise.all([
        api.get('/auth/users/?role=patient'),
        api.get('/reports/'),
        api.get('/doctors/prescriptions/'),
        api.get('/bookings/'),
      ]);
      setPatients(uRes.data);
      setReports(rRes.data);
      setPrescriptions(pRes.data);
      setBookings(bRes.data);
    } catch (err) {
      console.error('Failed to load doctor portal data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'doctor') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user]);

  const handleAddMedicineRow = () => {
    setMedicines([...medicines, { name: '', dosage: '', timing: '', duration: '' }]);
  };

  const handleRemoveMedicineRow = (index) => {
    setMedicines(medicines.filter((_, idx) => idx !== index));
  };

  const handleMedicineChange = (index, field, val) => {
    const updated = [...medicines];
    updated[index][field] = val;
    setMedicines(updated);
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    if (!selectedPatientId || !diagnosis) {
      alert('Please select patient and enter clinical diagnosis.');
      return;
    }

    try {
      await api.post('/doctors/prescriptions/', {
        patient: Number(selectedPatientId),
        diagnosis,
        medicines: medicines.filter((m) => m.name.trim() !== ''),
        notes,
        follow_up_date: followUpDate || null,
      });
      setShowAddPrescriptionModal(false);
      setDiagnosis('');
      setNotes('');
      setMedicines([{ name: '', dosage: '', timing: '', duration: '' }]);
      fetchData();
      alert('Prescription created successfully!');
    } catch (err) {
      console.error('Prescription create failed', err);
      alert('Failed to save prescription.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-teal-800/40">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-md">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Consultant Doctor & Pathologist Portal
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Dr. {user?.first_name} {user?.last_name || 'Mukherjee'} (MD)
            </h1>
            <p className="text-xs text-slate-300">
              ACCUSURE DIAGNOSTICS • Jamshedpur Clinical Diagnostics Division
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddPrescriptionModal(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Write Clinical Prescription</span>
        </button>
      </div>

      {/* Grid: Patients & Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Registry */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Authorized Patients ({patients.length})</h3>
            <span className="text-xs text-slate-400">Jamshedpur Center</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {patients.map((p) => (
              <div key={p.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <strong className="text-slate-900 block text-sm">{p.first_name ? `${p.first_name} ${p.last_name}` : p.username}</strong>
                  <div className="text-slate-500 mt-0.5">
                    Phone: {p.phone_number || 'N/A'} • {p.gender || 'Patient'}
                  </div>
                  <div className="text-[11px] text-slate-400">{p.address}</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedPatientId(p.id);
                    setShowAddPrescriptionModal(true);
                  }}
                  className="px-2.5 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold rounded-lg text-xs"
                >
                  Prescribe
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Diagnostic Reports To Review */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Verified Lab Reports ({reports.length})</h3>
            <span className="text-xs text-slate-400">Quality Assured</span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {reports.map((r) => (
              <div key={r.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-sky-700 text-[11px]">{r.report_id}</span>
                  <strong className="text-slate-900 block mt-0.5">{r.patient_name || r.patient_username}</strong>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{r.overall_summary}</p>
                </div>
                <button
                  onClick={() => setSelectedReport(r)}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs transition"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Issued Prescriptions History */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Consultations & Prescriptions Issued</h3>
        {prescriptions.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No prescriptions recorded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescriptions.map((pr) => (
              <div key={pr.id} className="p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-start border-b pb-2">
                  <div>
                    <strong className="text-slate-900 text-sm block">{pr.patient_name || 'Patient'}</strong>
                    <span className="text-slate-400 text-[11px]">Issued on {new Date(pr.created_at).toLocaleDateString()}</span>
                  </div>
                  {pr.follow_up_date && (
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      Follow-up: {pr.follow_up_date}
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Diagnosis: </span>
                  <span className="text-slate-600">{pr.diagnosis}</span>
                </div>
                {Array.isArray(pr.medicines) && pr.medicines.length > 0 && (
                  <div className="text-[11px] text-slate-500">
                    <strong>Medications: </strong>
                    {pr.medicines.map((m) => `${m.name} (${m.dosage})`).join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Prescription Modal */}
      {showAddPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-200 my-8">
            <h3 className="font-bold text-slate-900 text-base mb-3">Create Clinical Prescription</h3>
            <form onSubmit={handleSavePrescription} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Patient</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.first_name ? `${p.first_name} ${p.last_name}` : p.username} ({p.phone_number || 'No phone'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Clinical Diagnosis & Findings</label>
                <textarea
                  rows="2"
                  required
                  placeholder="e.g. Mild iron deficiency anemia with microcytic red cells."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden"
                ></textarea>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold">Prescribed Medicines</label>
                  <button
                    type="button"
                    onClick={handleAddMedicineRow}
                    className="text-teal-700 font-bold hover:underline"
                  >
                    + Add Medicine
                  </button>
                </div>
                <div className="space-y-2">
                  {medicines.map((m, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-1.5 items-center">
                      <input
                        type="text"
                        placeholder="Drug / Medicine"
                        value={m.name}
                        onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                        className="col-span-4 px-2 py-1 border rounded text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Dosage (e.g. 500mg)"
                        value={m.dosage}
                        onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                        className="col-span-3 px-2 py-1 border rounded text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Timing (e.g. 1-0-1 after food)"
                        value={m.timing}
                        onChange={(e) => handleMedicineChange(idx, 'timing', e.target.value)}
                        className="col-span-3 px-2 py-1 border rounded text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Days"
                        value={m.duration}
                        onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                        className="col-span-1 px-1 py-1 border rounded text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicineRow(idx)}
                        className="col-span-1 text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Follow-up Date (Optional)</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Diet / Lifestyle Advice</label>
                  <input
                    type="text"
                    placeholder="e.g. Drink 3L water, low sodium diet"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddPrescriptionModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-xs"
                >
                  Save & Issue Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lab Report Modal */}
      {selectedReport && (
        <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
};

export default DoctorPortal;

