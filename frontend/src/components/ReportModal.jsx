import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  QrCode, 
  Activity, 
  FileCheck2 
} from 'lucide-react';

const ReportModal = ({ report, onClose }) => {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const booking = report.booking_details || {};
  const verificationUrl = `${window.location.origin}/verify/${report.verification_code}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        {/* Action bar (hidden when printing) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Diagnostic Lab Report: {report.report_id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Medical Lab Report */}
        <div className="p-6 sm:p-10 bg-white text-slate-900 printable-area">
          {/* Header Letterhead */}
          <div className="border-b-2 border-sky-600 pb-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-md">
                  <Activity className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    ACCUSURE <span className="text-sky-600">DIAGNOSTICS</span>
                  </h1>
                  <p className="text-xs font-semibold text-sky-700 tracking-wide uppercase">
                    Advanced Healthcare & Diagnostic Pathology Laboratory
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Shop No. 7, MIJO HOUSE, Sunday Market, Birsanagar, Jamshedpur | Helpline: 7205573352
                  </p>
                </div>
              </div>

              {/* QR Verification Card */}
              <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-2.5 shrink-0 self-start sm:self-auto">
                <div className="w-14 h-14 bg-white border border-slate-200 rounded-lg p-1 flex items-center justify-center">
                  {/* Generated QR visual */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(verificationUrl)}`}
                    alt="Verify QR"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-[10px] leading-tight text-slate-600">
                  <div className="flex items-center gap-1 font-bold text-emerald-700">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>VERIFIED REPORT</span>
                  </div>
                  <div className="font-mono text-slate-700 mt-0.5 text-[9px]">{report.verification_code?.slice(0, 18)}...</div>
                  <div className="text-slate-400 mt-0.5">Scan to verify online</div>
                </div>
              </div>
            </div>
          </div>

          {/* Patient and Sample Meta Details */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Patient Name:</span>
              <strong className="text-slate-900 font-bold text-sm">{report.patient_name || report.patient_username}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Age / Gender:</span>
              <strong className="text-slate-800">{booking.patient_age || 30} Yrs / {booking.patient_gender || 'Not specified'}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Booking ID:</span>
              <strong className="text-slate-800 font-mono">{report.booking_id_str}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Report ID:</span>
              <strong className="text-sky-700 font-mono">{report.report_id}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Collection Date:</span>
              <strong className="text-slate-800">
                {report.sample_collected_at ? new Date(report.sample_collected_at).toLocaleDateString() : 'Recorded at center'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Reporting Date:</span>
              <strong className="text-slate-800">{new Date(report.reported_at).toLocaleDateString()}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Collection Mode:</span>
              <strong className="text-emerald-700">
                {booking.collection_type === 'HOME_COLLECTION' ? 'Free Home Collection' : 'Center Visit'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Verified By:</span>
              <strong className="text-slate-800">{report.doctor_name}</strong>
            </div>
          </div>

          {/* Clinical Parameters Table */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 border-b pb-1">
              Pathology Investigation Results
            </h3>

            {Array.isArray(report.parameters_data) && report.parameters_data.length > 0 ? (
              <div className="space-y-5">
                {report.parameters_data.map((section, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    {section.section && (
                      <div className="bg-slate-100/80 px-4 py-2 font-bold text-xs text-slate-800 border-b border-slate-200">
                        {section.section}
                      </div>
                    )}
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px]">
                          <th className="py-2 px-3 font-semibold">Test Parameter</th>
                          <th className="py-2 px-3 font-semibold">Observed Value</th>
                          <th className="py-2 px-3 font-semibold">Units</th>
                          <th className="py-2 px-3 font-semibold">Biological Ref Interval</th>
                          <th className="py-2 px-3 font-semibold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(section.items || []).map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3 font-medium text-slate-800">{item.name}</td>
                            <td className="py-2 px-3 font-bold text-slate-900">{item.value}</td>
                            <td className="py-2 px-3 text-slate-500">{item.unit}</td>
                            <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">{item.normal_range}</td>
                            <td className="py-2 px-3 text-right">
                              {item.flag === 'HIGH' ? (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                                  HIGH
                                </span>
                              ) : item.flag === 'LOW' ? (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                                  LOW
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                                  NORMAL
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-lg text-xs text-slate-600 italic">
                Report generated based on standard automated chemistry panel.
              </div>
            )}
          </div>

          {/* Clinical Interpretation / Doctor's Remarks */}
          <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-4 mb-8 text-xs">
            <h4 className="font-bold text-sky-900 mb-1 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
              Pathologist Interpretation & Notes:
            </h4>
            <p className="text-slate-700 leading-relaxed">{report.overall_summary}</p>
          </div>

          {/* Signatures & Footer Notice */}
          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-end gap-6 text-xs text-slate-600">
            <div>
              <p className="font-semibold text-slate-800">ACCUSURE DIAGNOSTICS</p>
              <p className="text-[11px] text-slate-500">Automated High-Throughput Diagnostic Analyzers</p>
              <p className="text-[10px] text-slate-400 mt-1">This report is electronically verified and does not require a physical ink signature.</p>
            </div>
            <div className="text-right">
              <div className="font-serif italic text-base text-slate-800 tracking-wide mb-1 font-semibold">
                R. K. Mukherjee, MD
              </div>
              <p className="font-bold text-slate-900">{report.doctor_name}</p>
              <p className="text-[11px] text-slate-500">Reg. No: JMC-98241 / Consultant Pathologist</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;

