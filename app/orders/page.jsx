"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle2,
  Package,
  Truck,
  AlertCircle,
  Star
} from "lucide-react";
import Footer from "../../components/Footer";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/login?redirect=/orders");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => console.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, [router]);

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered') return 'text-green-600 bg-green-50 border-green-100';
    if (s === 'cancelled') return 'text-red-500 bg-red-50 border-red-100';
    if (s === 'processing' || s === 'pending') return 'text-[#A68042] bg-[#A68042]/5 border-[#A68042]/20';
    return 'text-zinc-500 bg-zinc-50 border-zinc-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-zinc-100 border-t-[#A68042] rounded-full animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">Retrieving Your History</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-2 pb-32">
        <div className="max-w-4xl mb-24">
          <Link href="/profile" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/50 hover:backdrop-blur-md px-4 py-2 rounded-full -ml-4 transition-all duration-300 mb-12 group cursor-pointer">
            <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Back to Dashboard</span>
          </Link>
          <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold mb-4 block italic">Acquisition History</span>
          <h1 className="text-5xl md:text-6xl font-heading text-zinc-900 uppercase tracking-widest leading-tight">
            Our Shared <span className="italic normal-case tracking-normal text-[#A68042]">Legacy</span>
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-40 border border-zinc-50 bg-zinc-50/30">
            <Package className="mx-auto text-zinc-200 w-20 h-20 mb-8" strokeWidth={0.5} />
            <h2 className="text-2xl font-heading uppercase tracking-widest text-zinc-400 mb-6">No Acquisitions Found</h2>
            <p className="text-zinc-400 italic mb-10 max-w-sm mx-auto">Your journey with us is just beginning. Explore our latest collections to find your first masterpiece.</p>
            <Link href="/products" className="inline-block bg-zinc-900 text-white px-12 py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-[#A68042] transition-all">
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, idx) => (
              <div
                key={order.id}
                className="group bg-white border border-zinc-100 p-8 lg:p-12 hover:shadow-2xl hover:shadow-zinc-100 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row gap-12">
                  {/* Order Meta */}
                  <div className="lg:w-1/4 space-y-6">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-2">Reference ID</p>
                      <p className="text-lg font-bold text-zinc-900">ORD-{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-2">Acquisition Date</p>
                      <p className="text-sm italic text-zinc-500">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className={`inline-flex items-center px-4 py-1.5 border text-[9px] uppercase tracking-widest font-black ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </div>
                  </div>

                  {/* Order Content Summary */}
                  <div className="flex-1 lg:border-l lg:border-zinc-100 lg:pl-12 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="flex items-start gap-4 text-zinc-600">
                        <MapPin size={18} className="text-[#A68042] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[9px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Dispatch Address</p>
                          <p className="text-xs italic leading-relaxed line-clamp-2">{order.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 text-zinc-600">
                        <CreditCard size={18} className="text-[#A68042] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[9px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Settlement Type</p>
                          <p className="text-xs italic uppercase tracking-widest">{order.payment_method}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end">
                      <div className="text-right">
                        <p className="text-[9px] uppercase tracking-widest font-bold text-zinc-400 mb-2">Investment Total</p>
                        <p className="text-3xl font-heading text-zinc-900 tracking-wider">₹{Number(order.total_amount || 0).toLocaleString()}</p>
                      </div>
                      <Link
                        href={`/orders/${order.id}`}
                        className="mt-8 flex items-center gap-3 text-zinc-900 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-zinc-900 pb-1 hover:text-[#A68042] hover:border-[#A68042] transition-all group/btn"
                      >
                        Examine Details
                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Concierge Info */}
        <div className="mt-40 p-16 bg-zinc-900 relative overflow-hidden text-center">
          <div className="absolute inset-0 b-white/5 opacity-5 pointer-events-none" />
          <Star size={40} className="mx-auto text-[#A68042] mb-8 opacity-50" strokeWidth={1} />
          <h3 className="text-2xl font-heading text-white uppercase tracking-widest mb-6">Concierge Support</h3>
          <p className="text-zinc-400 italic mb-10 max-w-xl mx-auto leading-relaxed">Questions regarding your acquisitions or tracking details? Our dedicated specialist team is available 24/7 for our elite members.</p>
          <div className="flex justify-center gap-12">
            <div className="text-center">
              <span className="block text-[#A68042] text-[10px] uppercase tracking-widest font-bold mb-2">Tele-Consult</span>
              <span className="text-white text-sm font-light">+91 999 999 9999</span>
            </div>
            <div className="text-center">
              <span className="block text-[#A68042] text-[10px] uppercase tracking-widest font-bold mb-2">Digital Inquiry</span>
              <span className="text-white text-sm font-light">concierge@hridika.com</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
