import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, CheckCircle2, Activity, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const VerifyReportPage = () => {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyCode = async () => {
      try {
        const res = await api.get(`/reports/verify/${code}/`);
        setData(res.data);
      } catch (err) {
        console.error('Verification error', err);
        setError('This QR verification code does not match any official report issued by ACCUSURE DIAGNOSTICS.');
      } finally {
        setLoading(false);
      }
    };
    if (code) {
      verifyCode();
    }
  }, [code]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white">
            <Activity className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">ACCUSURE DIAGNOSTICS</h2>
            <p className="text-xs text-sky-700 font-semibold">Official Report Verification Registry</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-500">Verifying security token...</div>
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs space-y-2 text-center">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <strong className="block text-sm">Verification Failed</strong>
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm text-emerald-800">Authentic Diagnostic Report Verified</strong>
                <span>This medical test report is authentic and officially signed by ACCUSURE DIAGNOSTICS.</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Report ID:</span>
                <span className="font-mono font-bold text-slate-900">{data.report_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">{data.patient_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reporting Date:</span>
                <span>{new Date(data.reported_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verifying Pathologist:</span>
                <span className="font-semibold text-slate-800">{data.doctor_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Center:</span>
                <span>{data.center}</span>
              </div>
            </div>

            <div className="bg-sky-50 p-3 rounded-xl border border-sky-100 text-sky-900">
              <strong>Clinical Finding: </strong>
              <span>{data.summary}</span>
            </div>
          </div>
        )}

        <div className="pt-2 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to ACCUSURE Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyReportPage;

