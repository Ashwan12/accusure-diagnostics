import React, { useState } from 'react';
import { X, Printer, CheckCircle2, Clock, CreditCard, Receipt, Building2 } from 'lucide-react';
import api from '../services/api';

const InvoiceModal = ({ invoice, onClose, onPaymentSuccess }) => {
  if (!invoice) return null;

  const [paying, setPaying] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('UPI');

  const handlePrint = () => {
    window.print();
  };

  const handlePayNow = async () => {
    setPaying(true);
    try {
      const res = await api.post(`/billing/${invoice.id}/mark_paid/`, {
        payment_method: selectedMethod,
        transaction_id: `UPI-ACC-${Date.now().toString().slice(-6)}`,
      });
      if (onPaymentSuccess) {
        onPaymentSuccess(res.data);
      }
      onClose();
    } catch (err) {
      console.error('Payment failed', err);
      alert('Payment recording failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        {/* Action Header */}
        <div className="no-print bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-sky-400" />
            <span className="font-semibold text-sm">Diagnostic Invoice: {invoice.invoice_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable View */}
        <div className="p-6 sm:p-8 text-slate-800 printable-area text-xs sm:text-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">ACCUSURE DIAGNOSTICS</h2>
              <p className="text-xs text-sky-700 font-semibold">Diagnostic & Healthcare Services</p>
              <p className="text-xs text-slate-500 mt-1">Shop No. 7, MIJO HOUSE, Sunday Market, Birsanagar, Jamshedpur</p>
              <p className="text-xs text-slate-500">Contact: 7205573352 | GSTIN: 20AABCA9123K1ZT</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">TAX INVOICE</span>
              <strong className="text-base font-mono text-slate-900">{invoice.invoice_number}</strong>
              <div className="text-xs text-slate-500 mt-1">
                Date: {new Date(invoice.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Billed To</span>
              <strong className="text-sm text-slate-900 block mt-0.5">{invoice.patient_name || invoice.patient_username}</strong>
              <div className="text-slate-600 mt-0.5">Booking Ref: {invoice.booking_id_str}</div>
            </div>
            <div className="sm:text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Payment Status</span>
              {invoice.payment_status === 'PAID' ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  PAID ({invoice.payment_method})
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mt-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  PAYMENT PENDING
                </div>
              )}
            </div>
          </div>

          {/* Test Items Table */}
          <div className="my-5">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-y border-slate-200">
                  <th className="py-2.5 px-3">Diagnostic Investigation</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Rate</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(invoice.booking_items || []).map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{item.name}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600">1</td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-mono">₹{item.price}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Breakdown */}
          <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-mono text-slate-800">₹{invoice.subtotal}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Home Sample Collection:</span>
              <span>FREE (₹0.00)</span>
            </div>
            {Number(invoice.discount) > 0 && (
              <div className="flex justify-between text-rose-600">
                <span>Discount Applied:</span>
                <span className="font-mono">- ₹{invoice.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2">
              <span>Total Payable:</span>
              <span className="font-mono text-sky-700">₹{invoice.total_amount}</span>
            </div>
          </div>

          {/* Payment actions (Hidden in print) */}
          {invoice.payment_status === 'PENDING' && (
            <div className="no-print mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="font-bold text-slate-800 text-xs mb-2">Simulate / Complete Payment:</h4>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
                >
                  <option value="UPI">UPI / Google Pay / PhonePe</option>
                  <option value="CASH">Cash on Sample Collection</option>
                  <option value="CARD">Debit / Credit Card</option>
                </select>
                <button
                  onClick={handlePayNow}
                  disabled={paying}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-xs disabled:opacity-50"
                >
                  {paying ? 'Processing...' : `Mark as Paid (₹${invoice.total_amount})`}
                </button>
              </div>
            </div>
          )}

          {/* Footer remarks */}
          <div className="border-t border-slate-200 pt-6 mt-8 text-center text-[11px] text-slate-500">
            <p className="font-medium text-slate-700">Thank you for choosing ACCUSURE DIAGNOSTICS!</p>
            <p>For report queries or home sample collection support, call 7205573352.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;

