"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
    ChevronLeft,
    Printer,
    Truck,
    CreditCard,
    Package,
    User,
    Mail,
    MapPin,
    Calendar,
    ArrowRight,
    Search,
    Clock,
    CheckCircle2
} from "lucide-react";
import AdminHeader from "@/components/AdminHeader";

export default function AdminOrderDetailPage() {
    const { id: order_id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [toast, setToast] = useState(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL;
    const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;

    const fetchOrder = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/orders/${order_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setOrder(data);
                setSelectedStatus(data.status);
            } else {
                setOrder(null);
            }
        } catch (err) {
            console.error("Order fetch failed:", err);
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }
        fetchOrder();
    }, [order_id, token]);

    const handleUpdateStatus = async () => {
        if (!selectedStatus || isUpdating) return;
        setIsUpdating(true);
        try {
            const res = await fetch(`${API_BASE}/api/admin/orders/${order_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: selectedStatus })
            });

            if (res.ok) {
                await fetchOrder();
                setToast({ msg: "Status updated successfully.", type: "success" });
                setTimeout(() => setToast(null), 4000);
            } else {
                setToast({ msg: "Failed to update status.", type: "error" });
                setTimeout(() => setToast(null), 4000);
            }
        } catch (err) {
            console.error("Update failed:", err);
            setToast({ msg: "An error occurred during status update.", type: "error" });
            setTimeout(() => setToast(null), 4000);
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400">Securing Audit Record...</p>
            </div>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-center">
            <Search size={48} className="text-zinc-200 mb-8" strokeWidth={1} />
            <h2 className="text-2xl font-heading uppercase tracking-widest mb-4">Record Not Located</h2>
            <p className="text-zinc-500 italic mb-8">The requested acquisition record could not be found in the heritage archive.</p>
            <Link href="/admin" className="text-[10px] uppercase tracking-widest font-bold border-b border-zinc-900 pb-1">Return to Dashboard</Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-zinc-50 pb-20">
            {toast && (
                <div className="fixed bottom-8 right-8 z-[200] animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <div className={`flex items-center gap-3 px-6 py-4 shadow-2xl border ${toast.type === "success" ? "bg-white border-green-200" : "bg-white border-red-200"}`}>
                        <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`} />
                        <p className="text-[11px] uppercase tracking-widest font-bold text-zinc-800">{toast.msg}</p>
                        <button onClick={() => setToast(null)} className="ml-4 text-zinc-400 hover:text-zinc-900 text-lg leading-none">&times;</button>
                    </div>
                </div>
            )}
            <AdminHeader />
            <div className="max-w-6xl mx-auto px-6">

                {/* Audit Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="space-y-4">
                        <Link href="/admin" className="inline-flex items-center gap-3 text-zinc-400 hover:text-zinc-900 transition-colors group">
                            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] uppercase tracking-widest font-black text-zinc-600">Heritage Dashboard</span>
                        </Link>
                        <div className="flex items-center gap-6">
                            <h1 className="text-4xl font-heading text-zinc-900 uppercase tracking-widest leading-tight">
                                Acquisition <span className="italic normal-case tracking-normal text-[#A68042]">Audit</span>
                            </h1>
                            <div className="px-4 py-2 border border-zinc-300 text-[11px] font-mono text-zinc-900 font-bold tracking-wider">
                                #{String(order.id).substring(0, 12)}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.print()} className="bg-white border border-zinc-200 px-5 py-4 hover:border-zinc-900 transition-all shadow-sm flex items-center gap-2 text-zinc-800">
                            <Printer size={16} strokeWidth={1.5} />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Print</span>
                        </button>
                        <div className="bg-zinc-900 text-white px-8 py-4 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl">
                            <Clock size={14} className="text-[#A68042]" />
                            {order.status}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Primary Audit: Items & Valuation */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-white border border-zinc-100 p-10 shadow-sm animate-in fade-in duration-1000">
                            <h2 className="text-xs uppercase tracking-[0.25em] font-black text-zinc-900 mb-10 pb-6 border-b border-zinc-50 flex items-center gap-4">
                                <Package size={14} className="text-[#A68042]" />
                                Masterpiece Breakdown
                            </h2>

                            <div className="space-y-8">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-8">
                                            <div className="w-16 h-20 bg-zinc-50 relative overflow-hidden">
                                                <Image src={item.images || "/assets/unsplash/jewel-craft-1.jpg"} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                            </div>
                                            <div>
                                                <h4 className="text-[12px] uppercase tracking-widest font-bold text-zinc-900 mb-1">{item.name}</h4>
                                                <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.1em]">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[12px] font-medium text-zinc-900 mb-1">₹{item.price}</p>
                                            <p className="text-[10px] text-zinc-600 font-bold italic">Settled Valuation</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-16 pt-10 border-t border-zinc-50 space-y-4">
                                <div className="flex justify-between text-[11px] uppercase tracking-wider text-zinc-900 font-bold">
                                    <span>Sub-Acquisition Total</span>
                                    <span>₹{order.total_amount}</span>
                                </div>
                                <div className="flex justify-between text-[11px] uppercase tracking-wider text-zinc-900 font-bold">
                                    <span>Heritage Packaging & Insurance</span>
                                    <span className="italic">Complimentary</span>
                                </div>
                                <div className="flex justify-between items-end pt-6">
                                    <span className="text-xs uppercase tracking-[0.3em] font-black text-zinc-900">Total Estate Value</span>
                                    <span className="text-3xl font-heading text-zinc-900 tracking-tight">₹{order.total_amount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Verification */}
                        <div className="bg-white border border-zinc-100 p-10 shadow-sm animate-in fade-in duration-1000 delay-150">
                            <h2 className="text-xs uppercase tracking-[0.25em] font-black text-zinc-900 mb-10 pb-6 border-b border-zinc-50 flex items-center gap-4">
                                <CreditCard size={14} className="text-[#A68042]" />
                                Settlement Verification
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-2">
                                    <span className="text-[9px] uppercase tracking-widest font-black text-zinc-600 block">Settlement Method</span>
                                    <p className="text-sm font-medium text-zinc-900 flex items-center gap-3">
                                        <CheckCircle2 size={16} className="text-[#A68042]" />
                                        {order.payment_method}
                                    </p>
                                </div>
                                {order.razorpay_payment_id && (
                                    <div className="space-y-2">
                                        <span className="text-[9px] uppercase tracking-widest font-black text-zinc-600 block">Digital Transaction ID</span>
                                        <p className="text-[11px] font-mono text-zinc-900 font-bold break-all">{order.razorpay_payment_id}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Customer & Logistics */}
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-1000 delay-300">

                        {/* Customer Profiling */}
                        <div className="bg-zinc-900 text-white p-10 shadow-2xl">
                            <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-[#A68042] mb-10 flex items-center gap-4">
                                <User size={14} />
                                Collector Profile
                            </h2>
                            <div className="space-y-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/5 flex items-center justify-center text-xl font-heading text-[#A68042]">
                                        {order.customer_name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-[12px] uppercase tracking-widest font-bold">{order.customer_name}</h3>
                                        <p className="text-[10px] text-zinc-300 italic">Established Elite Member</p>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors cursor-pointer">
                                        <Mail size={14} className="text-[#A68042]" />
                                        <span className="text-[10px] tracking-widest truncate">{order.customer_email}</span>
                                    </div>
                                    <div className="flex items-start gap-4 text-zinc-300">
                                        <MapPin size={14} className="text-[#A68042] mt-0.5" />
                                        <span className="text-[10px] leading-relaxed tracking-widest uppercase">{order.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Logistics Timeline */}
                        <div className="bg-white border border-zinc-100 p-10 shadow-sm">
                            <h2 className="text-xs uppercase tracking-[0.25em] font-black text-zinc-900 mb-10 flex items-center gap-4">
                                <Truck size={14} className="text-[#A68042]" />
                                Logistics Pathway
                            </h2>
                            <div className="space-y-8">
                                <div className="relative pl-8 pb-8 border-l border-zinc-100 last:pb-0 last:border-0">
                                    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-zinc-900" />
                                    <p className="text-[9px] uppercase tracking-widest font-black text-zinc-600 mb-1">Acquisition Inaugurated</p>
                                    <p className="text-[10px] text-zinc-600">{new Date(order.created_at).toLocaleString()}</p>
                                </div>
                                <div className="relative pl-8">
                                    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full border border-zinc-200 bg-white" />
                                    <p className="text-[9px] uppercase tracking-widest font-black text-zinc-600 mb-1">Status Progression</p>
                                    <select
                                        value={selectedStatus || ""}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                        className="bg-transparent border-b border-zinc-300 py-2 text-[10px] uppercase tracking-widest focus:outline-none w-full cursor-pointer hover:border-zinc-900 transition-colors text-zinc-900 font-bold"
                                    >
                                        <option value="Awaiting Confirmation">Awaiting Confirmation</option>
                                        <option value="Artisanal Preparation">Artisanal Preparation</option>
                                        <option value="Heritage Transit">Heritage Transit</option>
                                        <option value="Successfully Delivered">Successfully Delivered</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handleUpdateStatus}
                                disabled={isUpdating || (selectedStatus === order.status)}
                                className="w-full bg-zinc-900 text-white py-5 mt-12 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#A68042] transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUpdating ? "Processing Progression..." : "Update Trajectory"}
                            </button>
                        </div>

                    </div>
                </div>

                {/* Audit Footer */}
                <div className="mt-20 pt-12 border-t border-zinc-100 text-center">
                    <p className="text-zinc-400 italic text-[12px] max-w-2xl mx-auto">
                        This digital audit record serves as a legal confirmation of acquisition from the Hridika Atelier. All pieces are secured with heritage-grade insurance during transit.
                    </p>
                </div>

            </div>
        </main>
    );
}
