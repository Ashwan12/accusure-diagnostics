import axios from 'axios';
import { FALLBACK_CATEGORIES, FALLBACK_TESTS, FALLBACK_DEMO_USERS } from './dataFallback';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT access token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback provider when backend server is offline or when Vercel rewrites /api to index.html
const getFallbackResponse = (url, method, data) => {
  const cleanUrl = url.replace(API_BASE, '').replace(/^\//, '');

  if (cleanUrl.includes('tests/categories')) {
    return { data: FALLBACK_CATEGORIES, status: 200 };
  }
  if (cleanUrl.includes('tests')) {
    return { data: FALLBACK_TESTS, status: 200 };
  }
  if (cleanUrl.includes('auth/me')) {
    const saved = localStorage.getItem('user');
    return { data: saved ? JSON.parse(saved) : FALLBACK_DEMO_USERS.patient_priya, status: 200 };
  }
  if (cleanUrl.includes('auth/login')) {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const user = FALLBACK_DEMO_USERS[parsed?.username] || {
      id: 99,
      username: parsed?.username || 'user',
      role: parsed?.username?.includes('admin') ? 'admin' : parsed?.username?.includes('doc') ? 'doctor' : 'patient',
      first_name: parsed?.username || 'Demo',
      last_name: 'User'
    };
    return {
      data: {
        access: 'demo-jwt-access-token',
        refresh: 'demo-jwt-refresh-token',
        user
      },
      status: 200
    };
  }
  if (cleanUrl.includes('dashboard/stats')) {
    return {
      data: {
        total_patients: 148,
        total_bookings: 52,
        pending_collections: 3,
        pending_reports: 2,
        completed_bookings: 47,
        total_revenue: 68400,
        pending_revenue: 2998,
        low_stock_items: 2,
        recent_bookings: [
          {
            id: 1,
            booking_id: 'ACC-20261005-A109B2',
            patient_name: 'Priya Sharma',
            phone: '9123456780',
            collection_type: 'HOME_COLLECTION',
            preferred_date: '2026-10-05',
            status: 'COMPLETED',
            total_amount: '1999.00',
            created_at: '05 Oct, 08:30'
          },
          {
            id: 2,
            booking_id: 'ACC-20261006-F81C43',
            patient_name: 'Amit Kumar',
            phone: '9876512340',
            collection_type: 'HOME_COLLECTION',
            preferred_date: '2026-10-06',
            status: 'TESTING',
            total_amount: '898.00',
            created_at: '06 Oct, 09:15'
          }
        ]
      },
      status: 200
    };
  }
  if (cleanUrl.includes('bookings')) {
    const local = localStorage.getItem('mock_bookings');
    const bookings = local ? JSON.parse(local) : [
      {
        id: 1,
        booking_id: 'ACC-20261005-A109B2',
        patient_name: 'Priya Sharma',
        patient_phone: '9123456780',
        patient_age: 28,
        patient_gender: 'Female',
        collection_type: 'HOME_COLLECTION',
        collection_address: 'Flat 302, Green Valley Apartments, Birsanagar, Jamshedpur',
        landmark: 'Near Sunday Market',
        preferred_date: '2026-10-05',
        preferred_time_slot: '07:30 AM - 08:30 AM',
        status: 'COMPLETED',
        total_amount: '1999.00',
        items: [{ id: 1, test_name: 'Accusure Master Full Body Health Package', price: '1999.00' }]
      },
      {
        id: 2,
        booking_id: 'ACC-20261006-F81C43',
        patient_name: 'Amit Kumar',
        patient_phone: '9876512340',
        patient_age: 36,
        patient_gender: 'Male',
        collection_type: 'HOME_COLLECTION',
        collection_address: 'Plot 45, Baridih Road, Jamshedpur',
        landmark: 'Near Tata Steel Gate',
        preferred_date: '2026-10-06',
        preferred_time_slot: '08:00 AM - 09:30 AM',
        status: 'TESTING',
        total_amount: '898.00',
        items: [{ id: 2, test_name: 'Complete Blood Count (CBC)', price: '299.00' }, { id: 3, test_name: 'Lipid Profile', price: '599.00' }]
      }
    ];

    if (method === 'post') {
      const parsed = typeof data === 'string' ? JSON.parse(data) : data;
      const newB = {
        ...parsed,
        id: Date.now(),
        booking_id: `ACC-20261006-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        status: 'CONFIRMED',
        total_amount: '1199.00',
        items: [{ id: 9, test_name: 'Selected Diagnostics', price: '1199.00' }]
      };
      bookings.unshift(newB);
      localStorage.setItem('mock_bookings', JSON.stringify(bookings));
      return { data: newB, status: 201 };
    }

    return { data: bookings, status: 200 };
  }
  if (cleanUrl.includes('reports/verify')) {
    return {
      data: {
        valid: true,
        report_id: 'RPT-202610-8841',
        patient_name: 'Priya Sharma',
        reported_at: new Date().toISOString(),
        doctor_name: 'Dr. R. K. Mukherjee (MD, Pathologist)',
        summary: 'Comprehensive parameters analyzed. All vital indicators within physiological normal limits.',
        center: 'ACCUSURE DIAGNOSTICS, Jamshedpur',
        parameters_data: []
      },
      status: 200
    };
  }
  if (cleanUrl.includes('reports')) {
    return {
      data: [
        {
          id: 1,
          report_id: 'RPT-202610-8841',
          booking_id_str: 'ACC-20261005-A109B2',
          patient_name: 'Priya Sharma',
          doctor_name: 'Dr. R. K. Mukherjee (MD, Pathologist)',
          verification_code: 'ACCUSURE-VER-998822AABB44',
          status: 'PUBLISHED',
          overall_summary: 'Comprehensive parameters are within standard physiological reference ranges. Good metabolic and hematologic balance. Annual routine follow-up recommended.',
          reported_at: '2026-10-05T14:30:00Z',
          parameters_data: [
            {
              section: 'Complete Blood Count (CBC)',
              items: [
                { name: 'Hemoglobin (Hb)', value: '13.4', unit: 'g/dL', normal_range: '12.0 - 15.5', flag: 'NORMAL' },
                { name: 'Total Leukocyte Count (TLC)', value: '7,200', unit: '/cu.mm', normal_range: '4,000 - 10,000', flag: 'NORMAL' },
                { name: 'Platelet Count', value: '245,000', unit: '/cu.mm', normal_range: '150,000 - 450,000', flag: 'NORMAL' },
              ]
            },
            {
              section: 'Lipid Profile',
              items: [
                { name: 'Total Cholesterol', value: '178', unit: 'mg/dL', normal_range: '< 200', flag: 'NORMAL' },
                { name: 'Triglycerides', value: '142', unit: 'mg/dL', normal_range: '< 150', flag: 'NORMAL' },
                { name: 'HDL Cholesterol (Good)', value: '52', unit: 'mg/dL', normal_range: '> 50', flag: 'NORMAL' },
              ]
            }
          ]
        }
      ],
      status: 200
    };
  }
  if (cleanUrl.includes('billing')) {
    return {
      data: [
        {
          id: 1,
          invoice_number: 'INV-202610-8841',
          booking_id_str: 'ACC-20261005-A109B2',
          patient_name: 'Priya Sharma',
          subtotal: '1999.00',
          discount: '0.00',
          home_collection_fee: '0.00',
          total_amount: '1999.00',
          payment_status: 'PAID',
          payment_method: 'UPI',
          created_at: '2026-10-05T10:00:00Z',
          booking_items: [{ name: 'Accusure Master Full Body Health Package', price: '1999.00' }]
        }
      ],
      status: 200
    };
  }
  if (cleanUrl.includes('inventory')) {
    return {
      data: [
        { id: 1, name: 'EDTA Blood Collection Tubes (Purple 2ml)', category: 'TUBES', sku: 'TUB-EDTA-001', quantity: 180, unit: 'Tubes', reorder_level: 50, is_low_stock: false },
        { id: 2, name: 'Serum Separator Gel Tubes (Gold 5ml)', category: 'TUBES', sku: 'TUB-SST-002', quantity: 15, unit: 'Tubes', reorder_level: 30, is_low_stock: true },
        { id: 3, name: 'Sterile 5ml Disposable Syringes (24G)', category: 'SYRINGES', sku: 'SYR-5ML-010', quantity: 250, unit: 'Pieces', reorder_level: 60, is_low_stock: false },
        { id: 4, name: 'Nitrile Examination Gloves Medium', category: 'PPE', sku: 'PPE-GLV-MED', quantity: 8, unit: 'Boxes', reorder_level: 10, is_low_stock: true }
      ],
      status: 200
    };
  }
  if (cleanUrl.includes('prescriptions')) {
    return {
      data: [
        {
          id: 1,
          doctor_name: 'Dr. R. K. Mukherjee (MD, Pathologist)',
          patient_name: 'Priya Sharma',
          diagnosis: 'Routine health screening within normal limits. Mild vitamin D deficiency.',
          medicines: [
            { name: 'Vitamin D3 60,000 IU', dosage: '1 capsule', timing: 'Weekly once after meal', duration: '8 weeks' }
          ],
          notes: 'Repeat test after 2 months. Maintain morning sunlight exposure.',
          created_at: '2026-10-05T15:00:00Z'
        }
      ],
      status: 200
    };
  }

  return { data: [], status: 200 };
};

// Response Interceptor: Catches HTML responses (from Vercel SPA rewrites) or network failures
api.interceptors.response.use(
  (response) => {
    // If Vercel returned HTML index page instead of JSON API response
    if (typeof response.data === 'string' && response.data.trim().startsWith('<!doctype html')) {
      const fallback = getFallbackResponse(response.config.url, response.config.method, response.config.data);
      return fallback;
    }
    return response;
  },
  async (error) => {
    // When API fails because backend is offline on Vercel preview
    if (!error.response || error.response.status === 404 || error.response.status === 500) {
      console.warn('Backend unavailable, providing offline fallback data for:', error.config?.url);
      const fallback = getFallbackResponse(error.config?.url || '', error.config?.method || 'get', error.config?.data);
      return Promise.resolve(fallback);
    }

    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE}/auth/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem('access_token', res.data.access);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
