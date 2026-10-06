import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  Lock, 
  User, 
  ShieldCheck, 
  Stethoscope, 
  Users, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTarget = searchParams.get('redirect');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const loggedUser = await login(username, password);
      redirectAfterAuth(loggedUser);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoUsername, demoPassword) => {
    setLoading(true);
    setError('');
    try {
      const loggedUser = await login(demoUsername, demoPassword);
      redirectAfterAuth(loggedUser);
    } catch (err) {
      console.error('Demo login error:', err);
      setError('Could not log in with demo account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const redirectAfterAuth = (user) => {
    if (redirectTarget === 'booking') {
      navigate('/home-collection');
      return;
    }
    if (user.role === 'admin' || user.role === 'staff') {
      navigate('/admin');
    } else if (user.role === 'doctor') {
      navigate('/doctor');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            ACCUSURE <span className="text-sky-600">DIAGNOSTICS</span>
          </h2>
          <p className="text-xs text-slate-500">Sign in to your diagnostic portal account</p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-sky-500 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : 'Sign In To Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Accounts Selector */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>One-Click Demo Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleDemoLogin('patient_priya', 'patient123')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 text-left transition"
              >
                <div className="font-bold text-slate-900">Patient Portal</div>
                <div className="text-slate-500 text-[10px]">Priya Sharma</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin', 'admin123')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 text-left transition"
              >
                <div className="font-bold text-slate-900">Admin Console</div>
                <div className="text-slate-500 text-[10px]">Ashwani Arya</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('dr_mukherjee', 'doctor123')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 text-left transition"
              >
                <div className="font-bold text-slate-900">Doctor Portal</div>
                <div className="text-slate-500 text-[10px]">Dr. R. K. Mukherjee</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('staff_rahul', 'staff123')}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 text-left transition"
              >
                <div className="font-bold text-slate-900">Staff / Phlebotomy</div>
                <div className="text-slate-500 text-[10px]">Rahul Verma</div>
              </button>
            </div>
          </div>

          {/* Registration link */}
          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-sky-600 hover:text-sky-800">
              Register New Patient Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

