import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Plus, 
  Trash2, 
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const HomeCollectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [availableTests, setAvailableTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  // Selected tests in the cart
  const [selectedTests, setSelectedTests] = useState([]);

  // Form fields
  const [collectionType, setCollectionType] = useState('HOME_COLLECTION');
  const [patientName, setPatientName] = useState(user?.first_name ? `${user.first_name} ${user.last_name}` : '');
  const [patientPhone, setPatientPhone] = useState(user?.phone_number || '');
  const [patientAge, setPatientAge] = useState('32');
  const [patientGender, setPatientGender] = useState(user?.gender || 'Male');
  const [collectionAddress, setCollectionAddress] = useState(user?.address || '');
  const [landmark, setLandmark] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('07:00 AM - 08:30 AM');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await api.get('/tests/');
        setAvailableTests(res.data);

        // Check if navigated with prefilled test from homepage or tests page
        if (location.state?.prefilledTest) {
          setSelectedTests([location.state.prefilledTest]);
        } else if (location.state?.prefilled) {
          const pre = location.state.prefilled;
          setPatientName(pre.name || '');
          setPatientPhone(pre.phone || '');
          setCollectionAddress(pre.address || '');
          if (pre.preferredDate) setPreferredDate(pre.preferredDate);
          if (pre.selectedTestId) {
            const found = res.data.find((t) => t.id === Number(pre.selectedTestId));
            if (found) setSelectedTests([found]);
          }
        } else if (res.data.length > 0) {
          // Default select the popular CBC test
          const cbc = res.data.find((t) => t.code === 'ACC-CBC') || res.data[0];
          setSelectedTests([cbc]);
        }
      } catch (err) {
        console.error('Failed to fetch tests', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [location.state]);

  const handleAddTest = (testId) => {
    const test = availableTests.find((t) => t.id === Number(testId));
    if (test && !selectedTests.some((t) => t.id === test.id)) {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handleRemoveTest = (id) => {
    setSelectedTests(selectedTests.filter((t) => t.id !== id));
  };

  const totalAmount = selectedTests.reduce((sum, t) => sum + Number(t.final_price), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedTests.length === 0) {
      alert('Please select at least one diagnostic test.');
      return;
    }

    if (!patientName || !patientPhone) {
      alert('Please provide patient name and contact phone number.');
      return;
    }

    if (collectionType === 'HOME_COLLECTION' && !collectionAddress) {
      alert('Please provide your home collection address in Jamshedpur.');
      return;
    }

    setSubmitting(true);
    try {
      // If user not logged in, we check if an account exists or prompt login
      if (!user) {
        // Automatically save form state to sessionStorage so user can login/register and return seamlessly
        sessionStorage.setItem('pending_booking', JSON.stringify({
          patient_name: patientName,
          patient_phone: patientPhone,
          patient_age: Number(patientAge),
          patient_gender: patientGender,
          collection_type: collectionType,
          collection_address: collectionAddress,
          landmark,
          preferred_date: preferredDate,
          preferred_time_slot: preferredTimeSlot,
          notes,
          test_ids: selectedTests.map((t) => t.id),
        }));
        alert('Please login or register quickly to securely link your diagnostic booking and reports.');
        navigate('/login?redirect=booking');
        return;
      }

      const payload = {
        patient_name: patientName,
        patient_phone: patientPhone,
        patient_age: Number(patientAge),
        patient_gender: patientGender,
        collection_type: collectionType,
        collection_address: collectionType === 'HOME_COLLECTION' ? collectionAddress : 'ACCUSURE Center Visit: Shop No. 7, MIJO HOUSE, Sunday Market, Birsanagar, Jamshedpur',
        landmark,
        preferred_date: preferredDate,
        preferred_time_slot: preferredTimeSlot,
        notes,
        test_ids: selectedTests.map((t) => t.id),
      };

      const res = await api.post('/bookings/', payload);
      setBookingConfirmed(res.data);
    } catch (err) {
      console.error('Booking failed', err);
      alert(err.response?.data?.error || 'Booking could not be created. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (bookingConfirmed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Booking Confirmed!</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Thank You, {bookingConfirmed.patient_name}
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your booking ID is <strong className="font-mono text-sky-700">{bookingConfirmed.booking_id}</strong>.
            Our team will dispatch a phlebotomist to your doorstep on{' '}
            <strong>{new Date(bookingConfirmed.preferred_date).toLocaleDateString()}</strong> during{' '}
            <strong>{bookingConfirmed.preferred_time_slot}</strong>.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left text-xs space-y-3 max-w-md mx-auto">
          <div className="flex justify-between">
            <span className="text-slate-500">Booking Reference:</span>
            <span className="font-bold font-mono text-slate-900">{bookingConfirmed.booking_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Collection Type:</span>
            <span className="font-bold text-emerald-700">
              {bookingConfirmed.collection_type === 'HOME_COLLECTION' ? 'Free Home Collection' : 'Center Visit'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Payable:</span>
            <span className="font-bold text-slate-900 text-sm">₹{bookingConfirmed.total_amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Status:</span>
            <span className="px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 text-[11px]">
              {bookingConfirmed.status}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Track in Patient Dashboard
          </Link>
          <a
            href="tel:7205573352"
            className="px-6 py-3 bg-white border border-slate-300 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
          >
            Helpline: 7205573352
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-800 to-teal-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACCUSURE DIAGNOSTICS DOORSTEP SERVICE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Schedule Free Home Sample Collection
          </h1>
          <p className="text-xs sm:text-sm text-slate-200">
            Enjoy certified diagnostic blood tests from the comfort of your home in Jamshedpur. Zero collection fees, calibrated vacuum tubes, and digital verified reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Collection Mode */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                1. Select Collection Method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCollectionType('HOME_COLLECTION')}
                  className={`p-4 rounded-xl border-2 text-left transition flex items-start gap-3 ${
                    collectionType === 'HOME_COLLECTION'
                      ? 'border-sky-600 bg-sky-50/60 text-slate-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Home className={`w-5 h-5 mt-0.5 shrink-0 ${collectionType === 'HOME_COLLECTION' ? 'text-sky-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-bold text-sm">Free Home Collection</div>
                    <div className="text-xs text-emerald-700 font-semibold mt-0.5">₹0 Collection Fee in Jamshedpur</div>
                    <div className="text-[11px] text-slate-500 mt-1">Phlebotomist visits your doorstep</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCollectionType('CENTER_VISIT')}
                  className={`p-4 rounded-xl border-2 text-left transition flex items-start gap-3 ${
                    collectionType === 'CENTER_VISIT'
                      ? 'border-sky-600 bg-sky-50/60 text-slate-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Building2 className={`w-5 h-5 mt-0.5 shrink-0 ${collectionType === 'CENTER_VISIT' ? 'text-sky-600' : 'text-slate-400'}`} />
                  <div>
                    <div className="font-bold text-sm">Diagnostic Center Visit</div>
                    <div className="text-xs text-slate-700 font-medium mt-0.5">Sunday Market, Birsanagar</div>
                    <div className="text-[11px] text-slate-500 mt-1">Open 06:30 AM - 09:00 PM</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Schedule Date & Slot */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                2. Preferred Date & Time Slot
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Select Date</label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Time Slot (Morning Fasting Preferred)</label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-500 focus:outline-hidden"
                  >
                    <option value="06:30 AM - 07:30 AM">06:30 AM - 07:30 AM (Early Morning Fasting)</option>
                    <option value="07:30 AM - 08:30 AM">07:30 AM - 08:30 AM</option>
                    <option value="08:30 AM - 09:30 AM">08:30 AM - 09:30 AM</option>
                    <option value="09:30 AM - 11:00 AM">09:30 AM - 11:00 AM</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM (Evening Slot)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Patient Details */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                3. Patient & Contact Information
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Phone Number (For Updates)</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="115"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1">Gender</label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-500 focus:outline-hidden"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Address Details (if Home Collection) */}
            {collectionType === 'HOME_COLLECTION' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  4. Home Address in Jamshedpur
                </label>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Full Street Address / House No.</label>
                    <textarea
                      rows="2"
                      required
                      placeholder="e.g. Flat 302, Green Valley Apartments, Birsanagar Zone 4, Jamshedpur"
                      value={collectionAddress}
                      onChange={(e) => setCollectionAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-500 focus:outline-hidden"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Landmark (Helps Phlebotomist Reach Fast)</label>
                    <input
                      type="text"
                      placeholder="e.g. Near Sunday Market / Beside SBI ATM"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 5. Additional Clinical Notes */}
            <div>
              <label className="block text-xs text-slate-500 mb-1">Special Clinical Instructions / Doctor Prescriptions (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Patient is diabetic; needs fasting draw; please bring senior citizen gentle butterfly needle"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-500 focus:outline-hidden"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Confirming Booking...' : `Confirm Booking & Schedule Phlebotomist (₹${totalAmount})`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Panel: Selected Tests & Order Summary: 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Selected Checkups ({selectedTests.length})</h3>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Free Home Collection
              </span>
            </div>

            {/* Test Selector Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Add Another Test to Booking:</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddTest(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-sky-500 focus:outline-hidden bg-slate-50"
              >
                <option value="">-- Choose from 15+ Tests --</option>
                {availableTests.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} (₹{t.final_price})</option>
                ))}
              </select>
            </div>

            {/* List of items */}
            {selectedTests.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">No tests selected yet. Please add a test above.</p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {selectedTests.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <strong className="text-slate-800 block">{t.name}</strong>
                      <span className="text-[11px] text-slate-500">{t.sample_type} • {t.turnaround_hours}h report</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono">₹{t.final_price}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTest(t.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bill Summary */}
            <div className="border-t border-slate-200 pt-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({selectedTests.length} tests):</span>
                <span className="font-mono text-slate-800">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Doorstep Collection Charges:</span>
                <span>FREE (₹0.00)</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-200 pt-3">
                <span>Total Amount:</span>
                <span className="font-mono text-sky-700">₹{totalAmount}</span>
              </div>
            </div>

            <div className="bg-sky-50 rounded-xl p-3.5 text-[11px] text-sky-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                ACCUSURE DIAGNOSTICS GUARANTEE
              </div>
              <p className="text-slate-600">
                You can pay via Cash or UPI at the time of sample collection. No advance payment required!
              </p>
            </div>
          </div>

          {/* Center Contact Helpline */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 text-xs space-y-3">
            <h4 className="font-bold text-white text-sm">Need Help Booking?</h4>
            <p className="text-slate-400">Our customer support coordinator in Jamshedpur will assist you immediately.</p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="tel:7205573352"
                className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-center font-bold transition flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>7205573352</span>
              </a>
              <a
                href="https://wa.me/917205573352?text=Hello%20Accusure%20Diagnostics,%20please%20help%20me%20book%20a%20test"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center font-bold transition"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCollectionPage;

