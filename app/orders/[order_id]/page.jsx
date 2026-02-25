"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  MapPin,
  CreditCard,
  ShieldCheck,
  Clock,
  Printer,
  Package,
  Star,
  Phone,
  Mail,
  FileText
} from "lucide-react";
import Footer from "../../../components/Footer";
import axios from "axios";

export default function OrderDetailPage() {
  const { order_id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login?redirect=/orders/" + order_id);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [order_id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-zinc-100 border-t-[#A68042] rounded-full animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">Loading Order Details</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center max-w-sm">
          <Package className="mx-auto text-zinc-100 w-24 h-24 mb-6" strokeWidth={0.5} />
          <h2 className="text-2xl font-heading uppercase tracking-widest text-zinc-900 mb-4">Order Not Found</h2>
          <p className="text-zinc-400 italic mb-8">This order does not exist or has been removed.</p>
          <Link href="/orders" className="inline-block bg-zinc-900 text-white px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-[#A68042] transition-all">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.created_at);
  const itemsTotal = order.items?.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0) || 0;
  const grandTotal = parseFloat(order.total_amount) || itemsTotal;

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'paid' || s === 'delivered') return 'bg-green-100 text-green-800 border-green-200';
    if (s === 'placed') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (s === 'cancelled' || s === 'failed') return 'bg-red-100 text-red-800 border-red-200';
    if (s === 'processing' || s === 'pending') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-zinc-100 text-zinc-800 border-zinc-200';
  };

  return (
    <main className="bg-zinc-50 min-h-screen">
      {/* ===== SCREEN VIEW ===== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 no-print">
        {/* Back & Actions */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/orders" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors group">
            <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
            <span className="text-xs uppercase tracking-widest font-semibold">Back to Orders</span>
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white border border-zinc-200 hover:border-zinc-400 px-5 py-2.5 text-xs uppercase tracking-widest font-bold text-zinc-800 transition-all rounded-md shadow-sm"
          >
            <Printer size={14} />
            Print Invoice
          </button>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-100 overflow-hidden">
          {/* Header */}
          <div className="bg-zinc-900 text-white px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-wide">HRIDIKA JEWELS</h1>
                <p className="text-zinc-400 text-xs mt-1">Tax Invoice</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">Order #{order.id}</p>
                <p className="text-zinc-400 text-xs mt-1">{orderDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          {/* Status Bar */}
          <div className="px-8 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-4 bg-zinc-50/50">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Status:</span>
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Payment:</span>
              <span className="text-xs font-bold text-zinc-800 uppercase">{order.payment_method}</span>
            </div>
          </div>

          {/* Customer & Shipping */}
          <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-zinc-100">
            <div>
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-3 flex items-center gap-2">
                <Package size={14} className="text-[#A68042]" />
                Bill To
              </h3>
              <p className="font-bold text-zinc-900 text-sm">{order.customer_name || "Customer"}</p>
              {order.customer_email && <p className="text-zinc-500 text-xs mt-1 flex items-center gap-1.5"><Mail size={12} />{order.customer_email}</p>}
              {order.customer_phone && <p className="text-zinc-500 text-xs mt-1 flex items-center gap-1.5"><Phone size={12} />{order.customer_phone}</p>}
            </div>
            <div>
              <h3 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-3 flex items-center gap-2">
                <MapPin size={14} className="text-[#A68042]" />
                Ship To
              </h3>
              <p className="text-zinc-700 text-sm leading-relaxed">{order.address}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="px-8 py-6">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-4">Order Items</h3>

            {/* Table Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 pb-3 border-b-2 border-zinc-200 text-[10px] uppercase tracking-widest font-bold text-zinc-400">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Item</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Unit Price</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            {/* Items */}
            <div className="divide-y divide-zinc-100">
              {order.items?.map((item, idx) => {
                const unitPrice = parseFloat(item.price);
                const lineTotal = unitPrice * item.quantity;
                return (
                  <div key={idx} className="grid grid-cols-12 gap-4 py-4 items-center">
                    <div className="col-span-1 text-xs text-zinc-400 font-semibold">{idx + 1}</div>
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="w-12 h-12 bg-zinc-50 relative overflow-hidden rounded flex-shrink-0">
                        <Image
                          src={(() => {
                            const fallback = "https://placehold.co/100x100/f8f8f8/666?text=Item";
                            try {
                              if (!item.images) return fallback;
                              const parsed = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
                              if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
                              if (typeof parsed === 'string' && parsed.trim()) return parsed;
                              return fallback;
                            } catch { return typeof item.images === 'string' && item.images.startsWith('http') ? item.images : fallback; }
                          })()}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-zinc-900">{item.name}</p>
                      </div>
                    </div>
                    <div className="col-span-2 text-center text-sm text-zinc-700">{item.quantity}</div>
                    <div className="col-span-2 text-right text-sm text-zinc-700">₹{unitPrice.toLocaleString("en-IN")}</div>
                    <div className="col-span-2 text-right text-sm font-bold text-zinc-900">₹{lineTotal.toLocaleString("en-IN")}</div>
                  </div>
                );
              }) || <p className="text-zinc-400 italic py-4">No items available.</p>}
            </div>
          </div>

          {/* Totals */}
          <div className="px-8 py-6 bg-zinc-50 border-t border-zinc-200">
            <div className="max-w-xs ml-auto space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="text-zinc-800 font-medium">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Tax (Inclusive)</span>
                <span className="text-zinc-500 font-medium">Included</span>
              </div>
              <div className="border-t-2 border-zinc-300 pt-3 flex justify-between">
                <span className="text-base font-bold text-zinc-900 uppercase tracking-wide">Grand Total</span>
                <span className="text-xl font-bold text-zinc-900">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {order.razorpay_payment_id && (
            <div className="px-8 py-4 border-t border-zinc-100 bg-white">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <CreditCard size={14} className="text-[#A68042]" />
                <span className="font-semibold">Transaction ID:</span>
                <span className="font-mono text-zinc-700">{order.razorpay_payment_id}</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-8 py-6 border-t border-zinc-100 bg-zinc-50/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#A68042]" /> Insured Delivery</span>
                <span className="flex items-center gap-1.5"><Star size={14} className="text-[#A68042]" /> Hallmarked & Certified</span>
              </div>
              <p className="italic">Thank you for shopping with Hridika Jewels</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PRINT VIEW ===== */}
      <div className="print-only-invoice">
        {/* Print Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-black mb-1">HRIDIKA JEWELS</h1>
            <p className="text-[10px] text-zinc-600 font-semibold uppercase tracking-widest">Tax Invoice / Bill of Supply</p>
          </div>
          <div className="text-right text-[11px]">
            <p><span className="text-zinc-400 font-semibold">Invoice No:</span> <span className="font-bold text-black">HRD/{orderDate.getFullYear()}/{order.id}</span></p>
            <p><span className="text-zinc-400 font-semibold">Date:</span> <span className="font-bold text-black">{orderDate.toLocaleDateString("en-IN", { day: '2-digit', month: 'long', year: 'numeric' })}</span></p>
            <p><span className="text-zinc-400 font-semibold">Status:</span> <span className="font-bold text-green-700 uppercase">{order.status}</span></p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-0 border border-black mb-6 text-[11px]">
          <div className="p-4 border-r border-black bg-zinc-50">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">From</h3>
            <p className="font-black text-xs text-black">HRIDIKA JEWELS PVT LTD</p>
            <p>402, Signature Plaza, Diamond Market</p>
            <p>Surat, Gujarat - 395006</p>
            <p className="mt-1 font-bold">GSTIN: 24AAACH1234F1Z5</p>
          </div>
          <div className="p-4">
            <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">Bill To / Ship To</h3>
            <p className="font-black text-xs text-black uppercase">{order.customer_name || "Customer"}</p>
            <p className="leading-relaxed">{order.address}</p>
            {order.customer_phone && <p className="mt-1">Ph: {order.customer_phone}</p>}
            {order.customer_email && <p>Email: {order.customer_email}</p>}
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse border border-black mb-6 text-[11px]">
          <thead>
            <tr className="bg-black text-white">
              <th className="py-2 px-3 text-left w-10 border border-black">#</th>
              <th className="py-2 px-3 text-left border border-black">Description</th>
              <th className="py-2 px-3 text-center w-20 border border-black">HSN</th>
              <th className="py-2 px-3 text-center w-16 border border-black">Qty</th>
              <th className="py-2 px-3 text-right w-28 border border-black">Rate (₹)</th>
              <th className="py-2 px-3 text-right w-28 border border-black">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, idx) => {
              const unitPrice = parseFloat(item.price);
              const lineTotal = unitPrice * item.quantity;
              return (
                <tr key={idx} className="border border-black">
                  <td className="py-2 px-3 text-center border border-black font-bold text-zinc-400">{idx + 1}</td>
                  <td className="py-2 px-3 border border-black">
                    <p className="font-bold uppercase text-black">{item.name}</p>
                    <p className="text-[9px] text-zinc-500 italic">Hallmarked & Certified</p>
                  </td>
                  <td className="py-2 px-3 text-center border border-black font-bold">7113</td>
                  <td className="py-2 px-3 text-center border border-black font-bold">{item.quantity}</td>
                  <td className="py-2 px-3 text-right border border-black">{unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td className="py-2 px-3 text-right border border-black font-bold">{lineTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-zinc-50 border-t-2 border-black">
              <td colSpan={4} className="py-2 px-3 text-right text-[9px] uppercase tracking-widest text-zinc-400 font-bold border border-black">Subtotal</td>
              <td colSpan={2} className="py-2 px-3 text-right font-black text-sm border border-black">₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr className="bg-zinc-50">
              <td colSpan={4} className="py-2 px-3 text-right text-[9px] uppercase tracking-widest text-zinc-400 font-bold border border-black">Shipping</td>
              <td colSpan={2} className="py-2 px-3 text-right font-bold border border-black">FREE</td>
            </tr>
            <tr className="bg-zinc-100 border-t-2 border-black">
              <td colSpan={4} className="py-3 px-3 text-right text-xs uppercase tracking-widest font-black border border-black">Grand Total</td>
              <td colSpan={2} className="py-3 px-3 text-right font-black text-lg border border-black">₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>

        {/* Tax Note & Payment */}
        <div className="flex justify-between items-start mb-8 text-[10px]">
          <div className="w-1/2 p-3 border border-zinc-300 bg-zinc-50">
            <h4 className="font-black uppercase mb-2 text-black text-[9px] tracking-widest">Tax Note</h4>
            <p className="text-zinc-600 leading-relaxed">GST @ 3% (CGST 1.5% + SGST 1.5%) is inclusive in the above prices as per GST Rules 2017 for Jewelry (HSN 7113).</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-[9px]">Payment Method</p>
            <p className="font-black uppercase text-black text-sm">{order.payment_method}</p>
            {order.razorpay_payment_id && (
              <p className="text-zinc-500 text-[9px]">Txn: {order.razorpay_payment_id}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-black pt-4 flex justify-between items-end">
          <div className="text-[9px] text-zinc-500 space-y-1 max-w-sm">
            <h5 className="font-black uppercase text-black text-[9px] tracking-widest mb-2">Terms & Conditions</h5>
            <p>1. Goods once sold are subject to return policy.</p>
            <p>2. All jewelry is hallmarked and certified.</p>
            <p>3. Disputes subject to Surat, Gujarat jurisdiction.</p>
            <p>4. This is a computer-generated invoice.</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-zinc-400 mb-8">Authorized Signatory</p>
            <p className="text-xs font-black uppercase tracking-widest text-black">Hridika Jewels Pvt Ltd</p>
          </div>
        </div>
      </div>

      <div className="no-print">
        <Footer />
      </div>

      <style jsx global>{`
        .print-only-invoice {
          display: none;
        }

        @media print {
          .no-print, nav, footer, button {
            display: none !important;
          }
          body, html, main {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-only-invoice {
            display: block !important;
            padding: 30px 40px !important;
          }
          .print-only-invoice * {
            visibility: visible !important;
          }
          table { display: table !important; width: 100% !important; border-collapse: collapse !important; }
          thead { display: table-header-group !important; background: black !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; color: white !important; }
          tbody { display: table-row-group !important; }
          tfoot { display: table-footer-group !important; }
          tr { display: table-row !important; }
          th, td { display: table-cell !important; }
          .flex { display: flex !important; }
          .grid { display: grid !important; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .justify-between { justify-content: space-between !important; }
          .items-start { align-items: flex-start !important; }
          .items-end { align-items: flex-end !important; }
          .text-right { text-align: right !important; }
          .w-1\\/2 { width: 50% !important; }
          .bg-zinc-50 { background-color: #f9fafb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-zinc-100 { background-color: #f4f4f5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .bg-black { background-color: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>
    </main>
  );
}
