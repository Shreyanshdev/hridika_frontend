"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  Plus,
  Search,
  Edit2,
  Trash2,
  TrendingUp,
  Coins,
  DollarSign,
  X,
  Upload,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Settings
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AdminHeader from "@/components/AdminHeader";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Prevent browser back button from leaving admin dashboard
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const [activeTab, setActiveTab] = useState("products");
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0, revenue: "₹0" });
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [metalRates, setMetalRates] = useState({ gold: null, silver: null });

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [showRateModal, setShowRateModal] = useState(false);
  const [rateForm, setRateForm] = useState({ metal_type: "gold", base_rate: "", premium: "" });

  const [form, setForm] = useState({
    name: "",
    category: "Rings",
    description: "",
    stock: "",
    quantity: "",
    metal_name: "Gold",
    images: [],
    weight: "",
    making_charge: "",
    price_per_gram: "",
    gst_val: "3",
    other_charges: "",
    final_price: ""
  });
  const [toast, setToast] = useState(null);
  const toastTimeout = useRef(null);

  const showToast = (message, type = "success") => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ message, type });
    toastTimeout.current = setTimeout(() => setToast(null), 4000);
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    // Simple auth check for admin (assuming role-based check exists in real scenario or just token presence for now)
    if (!token) {
      router.push('/login');
      return;
    }
    fetchAllData();
  }, [token]);

  const fetchAllData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [prodRes, orderRes, userRes, rateRes] = await Promise.all([
        fetch(`${API_BASE}/api/products`, { headers }),
        fetch(`${API_BASE}/api/admin/orders`, { headers }),
        fetch(`${API_BASE}/api/admin/users`, { headers }),
        fetch(`${API_BASE}/api/admin/metal-rates`, { headers })
      ]);

      const [prodData, orderData, userData, rateData] = await Promise.all([
        prodRes.json(), orderRes.json(), userRes.json(), rateRes.json()
      ]);

      setProducts(Array.isArray(prodData) ? prodData : []);
      setOrders(Array.isArray(orderData) ? orderData : []);
      setCustomers(Array.isArray(userData) ? userData : []);
      setMetalRates(rateData);

      setStats({
        products: prodData.length || 0,
        orders: orderData.length || 0,
        customers: userData.length || 0,
        revenue: "₹2,64,600" // Placeholder as in original code
      });
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    }
  };

  // Price Calculations based on Original Logic
  useEffect(() => {
    if (!showModal || !metalRates) return;

    const metal = form.metal_name?.toLowerCase();
    let calculatedPrice = 0;

    if (metal === "gold" && metalRates.gold) {
      const goldRate = Number(metalRates.gold.base_rate || 0);
      const goldPremium = Number(metalRates.gold.premium || 0);
      calculatedPrice = goldRate + goldPremium / 10;
    } else if (metal === "silver" && metalRates.silver) {
      const silverRate = Number(metalRates.silver.base_rate || 0);
      const silverPremium = Number(metalRates.silver.premium || 0);
      calculatedPrice = silverRate + silverPremium / 1000;
    }

    if (calculatedPrice) {
      setForm(prev => ({ ...prev, price_per_gram: calculatedPrice.toFixed(2) }));
    }
  }, [showModal, form.metal_name, metalRates]);

  useEffect(() => {
    const price = Number(form.price_per_gram);
    const weight = Number(form.weight);
    if (!price || !weight) {
      setForm(prev => ({ ...prev, final_price: "" }));
      return;
    }
    const baseFinal = price * weight;
    const makingAmount = (baseFinal * Number(form.making_charge || 0)) / 100;
    const totalBeforeGst = baseFinal + makingAmount;
    const finalWithGst = (totalBeforeGst * (Number(form.gst_val || 0) + 100)) / 100;
    const otherCharges = Number(form.other_charges || 0);
    const grandTotal = finalWithGst + otherCharges;

    setForm(prev => ({ ...prev, final_price: grandTotal.toFixed(2) }));
  }, [form.weight, form.making_charge, form.gst_val, form.price_per_gram, form.other_charges]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Store raw File objects for FormData upload
    setForm(prev => ({
      ...prev,
      images: [...(Array.isArray(prev.images) ? prev.images : [prev.images].filter(Boolean)), ...files]
    }));
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Helper: get a displayable src for an image (File object or URL string)
  const getImageSrc = (img) => {
    if (img instanceof File) return URL.createObjectURL(img);
    return img; // already a URL string (e.g. Cloudinary URL)
  };

  const handleSaveProduct = async () => {
    // Basic Validation
    if (!form.name || !form.metal_name || !form.weight) {
      showToast("Please ensure the Masterpiece Name, Metal, and Weight are chronicled.", "error");
      return;
    }

    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode ? `${API_BASE}/products/${editProductId}` : `${API_BASE}/products`;

    try {
      // Build FormData for multipart upload
      const formData = new FormData();
      formData.append('name', form.name || '');
      formData.append('category', form.category || 'Rings');
      formData.append('description', form.description || '');
      formData.append('stock', form.stock || '0');
      formData.append('quantity', form.quantity || '0');
      formData.append('metal_name', form.metal_name || 'Gold');
      formData.append('weight', form.weight || '0');
      formData.append('making_charge', form.making_charge || '0');
      formData.append('other_charges', form.other_charges || '0');

      // Separate File objects (new uploads) from URL strings (existing Cloudinary images)
      const existingUrls = [];
      if (Array.isArray(form.images)) {
        for (const img of form.images) {
          if (img instanceof File) {
            formData.append('images', img);
          } else if (typeof img === 'string' && img.trim()) {
            existingUrls.push(img);
          }
        }
      }
      if (isEditMode && existingUrls.length > 0) {
        formData.append('existingImages', JSON.stringify(existingUrls));
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type — browser sets it with boundary for FormData
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        showToast(isEditMode ? "Legacy updated successfully." : "New masterpiece archived successfully.", "success");
        setShowModal(false);
        fetchAllData();
      } else {
        showToast(`Failed to chronicle: ${data.msg || data.error || "Unknown error"}`, "error");
      }
    } catch (err) {
      showToast("A critical error occurred while accessing the archives.", "error");
    }
  };

  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        showToast("Product removed from the archive.", "success");
        fetchAllData();
      }
    } catch (err) {
      showToast("Failed to remove product.", "error");
    }
    setDeleteTarget(null);
  };

  const handleSaveRate = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/metal-rates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rateForm),
      });
      if (res.ok) {
        setShowRateModal(false);
        fetchAllData();
      }
    } catch (err) {
      console.error("Rate save failed:", err);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 pb-20">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-6">

        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div className="space-y-2">
            <span className="text-[#A68042] text-[10px] uppercase tracking-[0.4em] font-bold block italic">Atelier Control Center</span>
            <h1 className="text-4xl font-heading text-zinc-900 uppercase tracking-widest leading-tight">
              Heritage <span className="italic normal-case tracking-normal text-[#A68042]">Management</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setRateForm({ metal_type: "gold", base_rate: "", premium: "" });
                setShowRateModal(true);
              }}
              className="bg-white border border-zinc-200 px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:border-zinc-900 transition-all flex items-center gap-3 text-zinc-900"
            >
              <Coins size={14} className="text-[#A68042]" />
              Update Rates
            </button>
            <button
              onClick={() => {
                setIsEditMode(false);
                setForm({
                  name: "", category: "Rings", description: "", stock: "", quantity: "", metal_name: "Gold", images: [],
                  weight: "", making_charge: "", price_per_gram: "", gst_val: "3", other_charges: "", final_price: ""
                });
                setShowModal(true);
              }}
              className="bg-zinc-900 text-white px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-[#A68042] transition-all flex items-center gap-3 shadow-xl"
            >
              <Plus size={14} />
              Add Masterpiece
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Total Collection", value: stats.products, icon: Package, color: "text-zinc-400" },
            { label: "Pending Orders", value: stats.orders, icon: ShoppingBag, color: "text-[#A68042]" },
            { label: "Elite Members", value: stats.customers, icon: Users, color: "text-zinc-400" },
            { label: "Estate Revenue", value: stats.revenue, icon: TrendingUp, color: "text-zinc-900" }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-8 border border-zinc-100 shadow-sm hover:shadow-md transition-shadow group animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-zinc-50 rounded-none group-hover:bg-zinc-100 transition-colors ${stat.color}`}>
                  <stat.icon size={20} strokeWidth={1.5} />
                </div>
                <ArrowUpRight size={14} className="text-zinc-200 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
              <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-2">{stat.label}</h3>
              <p className="text-3xl font-heading text-zinc-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Secondary Header: Metal Rates Ticker */}
        <div className="bg-zinc-900 text-white px-8 py-4 mb-12 flex flex-wrap gap-12 items-center text-[10px] uppercase tracking-widest font-bold">
          <span className="text-zinc-500">Live Atelier Rates:</span>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-[#A68042] rounded-full animate-pulse" />
            Gold / Gram: <span className="text-[#A68042]">₹{metalRates.gold?.base_rate || '---'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
            Silver / Gram: <span className="text-zinc-500">₹{metalRates.silver?.base_rate || '---'}</span>
          </div>
          <button onClick={() => router.push('/admin/bespoke')} className="ml-auto flex items-center gap-3 hover:text-[#A68042] transition-colors group">
            Bespoke Consultations
            <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-12 border-b border-zinc-200 mb-8 overflow-x-auto no-scrollbar">
          {['products', 'orders', 'customers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[11px] uppercase tracking-[0.3em] font-bold transition-all relative ${activeTab === tab ? 'text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900 animate-in slide-in-from-left-4 duration-500" />
              )}
            </button>
          ))}
        </div>

        {/* Products Tab Content */}
        {activeTab === 'products' && (
          <div className="bg-white border border-zinc-100 shadow-sm animate-in fade-in duration-700">
            <div className="p-8 border-b border-zinc-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xs uppercase tracking-[0.2em] font-black text-zinc-900">Archive Collection</h2>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300" size={14} />
                <input
                  type="text"
                  placeholder="Search archive..."
                  className="bg-zinc-50 border border-zinc-300 py-2.5 pl-10 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-zinc-900 w-full sm:w-64 transition-all placeholder:text-zinc-500 text-zinc-900 font-bold"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[9px] uppercase tracking-widest font-black text-zinc-400">Piece</th>
                    <th className="px-8 py-5 text-[9px] uppercase tracking-widest font-black text-zinc-400">Classification</th>
                    <th className="px-8 py-5 text-[9px] uppercase tracking-widest font-black text-zinc-400">Valuation</th>
                    <th className="px-8 py-5 text-[9px] uppercase tracking-widest font-black text-zinc-400">Inventory</th>
                    <th className="px-8 py-5 text-[9px] uppercase tracking-widest font-black text-zinc-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, idx) => (
                    <tr key={p.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-6">
                          <div className="relative w-12 h-12 bg-zinc-100 flex-shrink-0">
                            <Image src={(() => { const fallback = "/assets/unsplash/jewel-craft-1.jpg"; if (Array.isArray(p.images) && p.images.length > 0 && p.images[0]) return p.images[0]; if (typeof p.images === 'string' && p.images.trim()) return p.images; return fallback; })()} alt={p.name || "Product"} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="text-[11px] uppercase tracking-widest font-bold text-zinc-900 mb-1">{p.name}</h4>
                            <p className="text-[9px] italic text-zinc-600 line-clamp-1">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-700 font-medium">{p.category}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[11px] font-bold text-zinc-900">₹{p.price}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${p.stock < 10 ? 'bg-red-400' : 'bg-green-400'}`} />
                          <span className={`text-[10px] uppercase tracking-widest font-bold ${p.stock < 10 ? 'text-red-500' : 'text-zinc-600'}`}>{p.stock} units</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setIsEditMode(true);
                              setEditProductId(p.id);
                              setForm({
                                ...p,
                                gst_val: p.gst_val || "3",
                                other_charges: p.other_charges || "",
                                price_per_gram: "",
                                final_price: ""
                              });
                              setShowModal(true);
                            }}
                            className="text-zinc-300 hover:text-zinc-900 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p.id)}
                            className="text-zinc-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab Content */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-zinc-100 shadow-sm animate-in fade-in duration-700">
            <div className="p-8 border-b border-zinc-50">
              <h2 className="text-xs uppercase tracking-[0.2em] font-black text-zinc-900">Acquisition History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[9px] uppercase tracking-widest font-black text-zinc-400">ID</th>
                    <th className="px-8 py-5 text-[9px] uppercase tracking-widest font-black text-zinc-400">Destination</th>
                    <th className="px-8 py-5 text-[9px] uppercase tracking-widest font-black text-zinc-400">Status</th>
                    <th className="px-8 py-5 text-[9px] uppercase tracking-widest font-black text-zinc-400">Settlement</th>
                    <th className="px-8 py-5 text-[9px] uppercase tracking-widest font-black text-zinc-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="px-8 py-6 text-[11px] font-mono text-zinc-400 uppercase">#{String(o.id).substring(0, 8)}</td>
                      <td className="px-8 py-6 text-[10px] uppercase tracking-widest text-zinc-700 truncate max-w-[200px]">{o.address}</td>
                      <td className="px-8 py-6">
                        <span className={`text-[9px] uppercase tracking-widest font-black px-3 py-1.5 ${o.status === 'Delivered' ? 'bg-green-50 text-green-600' : 'bg-zinc-100 text-zinc-600'
                          }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-[10px] uppercase tracking-widest text-zinc-500">{o.payment_method}</td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => router.push(`/admin/orders/${o.id}`)}
                          className="text-[9px] uppercase tracking-widest font-black text-[#A68042] hover:text-zinc-900 transition-colors"
                        >
                          Audit Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Customers Tab Content */}
        {activeTab === 'customers' && (
          <div className="bg-white border border-zinc-100 shadow-sm animate-in fade-in duration-700">
            <div className="p-8 border-b border-zinc-50">
              <h2 className="text-xs uppercase tracking-[0.2em] font-black text-zinc-900">Registered Collectors</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[9px] uppercase tracking-widest font-black text-zinc-400">Identity</th>
                    <th className="px-8 py-5 text-[9px] uppercase tracking-widest font-black text-zinc-400">Communication</th>
                    <th className="px-8 py-5 text-[9px] uppercase tracking-widest font-black text-zinc-400">Registered Since</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.user_id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                      <td className="px-8 py-6">
                        <h4 className="text-[11px] uppercase tracking-widest font-bold text-zinc-900">{c.username}</h4>
                      </td>
                      <td className="px-8 py-6 space-y-1">
                        <p className="text-[10px] font-medium text-zinc-700">{c.email}</p>
                        <p className="text-[9px] text-zinc-600 italic">{c.Phone}</p>
                      </td>
                      <td className="px-8 py-6 text-[10px] text-zinc-400">
                        {new Date(c.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* PRODUCT MODAL - Refined Luxury Styling */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="p-12">
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-2xl font-heading uppercase tracking-widest text-zinc-900">
                  {isEditMode ? "Amend Piece Record" : "Archive New Masterpiece"}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-zinc-900 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-10">
                {/* Left Side: Details */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[9px] uppercase tracking-widest font-black text-zinc-700">Piece Identity</label>
                    <input
                      value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-zinc-50 border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-zinc-900 placeholder:text-zinc-500 text-zinc-900 font-bold"
                      placeholder="Exquisite Gold Band"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[9px] uppercase tracking-widest font-black text-zinc-700">The Narrative (Description)</label>
                    <textarea
                      value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full bg-zinc-50 border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-zinc-900 min-h-[100px] italic placeholder:text-zinc-500 text-zinc-900 font-bold"
                      placeholder="Describe the craftsmanship..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[9px] uppercase tracking-widest font-black text-zinc-700">Classification</label>
                      <select
                        value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full bg-zinc-50 border-b border-zinc-300 py-3 text-xs focus:outline-none appearance-none cursor-pointer text-zinc-900 font-bold"
                      >
                        {["Bangles", "Rings", "Earrings", "Bracelets", "Necklaces"].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[9px] uppercase tracking-widest font-black text-zinc-700">Noble Metal</label>
                      <select
                        value={form.metal_name} onChange={(e) => setForm({ ...form, metal_name: e.target.value })}
                        className="w-full bg-zinc-50 border-b border-zinc-300 py-3 text-xs focus:outline-none appearance-none text-zinc-900 font-bold"
                      >
                        {["Gold", "Silver"].map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[9px] uppercase tracking-widest font-black text-zinc-700">Inventory Status</label>
                      <input
                        type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                        className="w-full bg-zinc-50 border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-zinc-900 text-zinc-900 font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[9px] uppercase tracking-widest font-black text-zinc-700">Bespoke Size Option</label>
                      <input
                        value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        className="w-full bg-zinc-50 border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-zinc-900 placeholder:text-zinc-500 text-zinc-900 font-bold"
                        placeholder="e.g. 14, 16, 18"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side: Financials & Media */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[9px] uppercase tracking-widest font-black text-zinc-700">Visual Documentation</label>
                    <label className="relative border-2 border-dashed border-zinc-300 hover:border-[#A68042] transition-colors p-8 flex flex-col items-center justify-center cursor-pointer group">
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
                      <div className="text-center">
                        <Upload size={24} className="text-zinc-200 group-hover:text-[#A68042] mx-auto mb-4" />
                        <p className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-700">Upload Atelier Imagery</p>
                      </div>
                    </label>

                    {Array.isArray(form.images) && form.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {form.images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square bg-zinc-50 border border-zinc-200 group/img">
                            <Image src={getImageSrc(img)} alt={`Preview ${idx}`} fill className="object-cover" />
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                removeImage(idx);
                              }}
                              className="absolute top-1 right-1 bg-zinc-900/80 text-white p-1 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-8 bg-zinc-50 p-6">
                    <div className="space-y-2">
                      <label className="text-[8px] uppercase tracking-[0.3em] font-black text-zinc-500">Weight (grams)</label>
                      <input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="w-full bg-transparent border-b border-zinc-300 py-2 text-sm focus:outline-none font-bold text-zinc-900" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] uppercase tracking-[0.3em] font-black text-zinc-500">Rate / Gram</label>
                      <div className="text-sm font-black py-2 text-zinc-900 italic border-b border-zinc-300">₹{form.price_per_gram}</div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] uppercase tracking-[0.3em] font-black text-zinc-500">Artisan Fee (%)</label>
                      <input value={form.making_charge} onChange={(e) => setForm({ ...form, making_charge: e.target.value })} className="w-full bg-transparent border-b border-zinc-300 py-2 text-sm focus:outline-none font-bold text-[#A68042]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] uppercase tracking-[0.3em] font-black text-zinc-500">Other Charges (₹)</label>
                      <input value={form.other_charges} onChange={(e) => setForm({ ...form, other_charges: e.target.value })} className="w-full bg-transparent border-b border-zinc-300 py-2 text-sm focus:outline-none font-bold text-zinc-900" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] uppercase tracking-[0.3em] font-black text-zinc-500">Statutory Tax (%)</label>
                      <input value={form.gst_val} onChange={(e) => setForm({ ...form, gst_val: e.target.value })} className="w-full bg-transparent border-b border-zinc-300 py-2 text-sm focus:outline-none font-bold text-zinc-900" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-100 flex flex-col items-end">
                    <span className="text-[9px] uppercase tracking-widest font-black text-zinc-600 mb-2">Final Masterpiece Valuation</span>
                    <h4 className="text-4xl font-heading text-zinc-900 tracking-tight">₹{form.final_price}</h4>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex justify-end gap-6">
                <button onClick={() => setShowModal(false)} className="px-10 py-5 text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-600 hover:text-zinc-900 transition-all">Cancel Consultation</button>
                <button onClick={handleSaveProduct} className="bg-zinc-900 text-white px-12 py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#A68042] transition-all shadow-xl shadow-zinc-200">
                  {isEditMode ? "Authenticate Changes" : "Confirm Archival"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* METAL RATE MODAL */}
      {showRateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setShowRateModal(false)} />
          <div className="relative bg-white w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="p-12">
              <h3 className="text-xl font-heading uppercase tracking-widest mb-12 flex items-center gap-4 text-zinc-900">
                <Settings className="text-[#A68042]" size={20} />
                Adjust Atelier Core Rates
              </h3>
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-zinc-600">Metal Class</label>
                  <div className="flex gap-10">
                    {['gold', 'silver'].map(m => (
                      <label key={m} className="flex items-center gap-3 cursor-pointer group">
                        <input type="radio" checked={rateForm.metal_type === m} onChange={() => setRateForm({ ...rateForm, metal_type: m })} className="hidden" />
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${rateForm.metal_type === m ? 'border-zinc-900' : 'border-zinc-200'}`}>
                          {rateForm.metal_type === m && <div className="w-2 h-2 rounded-full bg-zinc-900" />}
                        </div>
                        <span className={`text-[10px] uppercase tracking-widest font-bold ${rateForm.metal_type === m ? 'text-zinc-900' : 'text-zinc-500'}`}>{m}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-zinc-600">Market Base Rate (per gram)</label>
                  <input value={rateForm.base_rate} onChange={(e) => setRateForm({ ...rateForm, base_rate: e.target.value })} className="w-full bg-zinc-50 border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-zinc-900 placeholder:text-zinc-400 text-zinc-900 font-bold" placeholder="e.g. 5800" />
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] uppercase tracking-widest font-bold text-zinc-600">Brand Premium / Mark-up</label>
                  <input value={rateForm.premium} onChange={(e) => setRateForm({ ...rateForm, premium: e.target.value })} className="w-full bg-zinc-50 border-b border-zinc-300 py-3 text-sm focus:outline-none focus:border-zinc-900 placeholder:text-zinc-400 text-zinc-900 font-bold" placeholder="e.g. 450" />
                </div>
              </div>
              <div className="mt-12 flex justify-end">
                <button onClick={handleSaveRate} className="bg-zinc-900 text-white px-10 py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-[#A68042] transition-all shadow-xl">Secure New Rates</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md mx-4 p-8 shadow-2xl border border-zinc-100 animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-50 border border-red-100 flex items-center justify-center">
                <Trash2 size={16} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-[12px] uppercase tracking-widest font-black text-zinc-900">Remove Product</h3>
                <p className="text-[10px] text-zinc-400 italic mt-0.5">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
              Are you sure you want to permanently remove this masterpiece from the archive?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 text-[10px] uppercase tracking-widest font-bold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteTarget)}
                className="flex-1 py-3 text-[10px] uppercase tracking-widest font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[200] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 shadow-2xl border ${toast.type === "success" ? "bg-white border-green-200" : "bg-white border-red-200"}`}>
            <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`} />
            <p className="text-[11px] uppercase tracking-widest font-bold text-zinc-800">{toast.message}</p>
            <button onClick={() => setToast(null)} className="ml-4 text-zinc-400 hover:text-zinc-900 transition-colors text-lg leading-none">&times;</button>
          </div>
        </div>
      )}
    </main>
  );
}
