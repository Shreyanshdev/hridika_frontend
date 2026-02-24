"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";
import {
  ChevronLeft,
  Sparkles,
  MessageSquare,
  Phone,
  User,
  Image as ImageIcon,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  Scale,
  X,
  Clock,
  ChevronDown,
  Mail,
  Trash2
} from "lucide-react";

export default function AdminBespokePage() {
  const router = useRouter();
  const [bespokeList, setBespokeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchBespokeRequests();
  }, [token]);

  const fetchBespokeRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/bespoke-requests`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setBespokeList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching bespoke requests", err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique product types for filter
  const productTypes = useMemo(() => {
    const types = [...new Set(bespokeList.map(b => b.product).filter(Boolean))];
    return ["All", ...types.sort()];
  }, [bespokeList]);

  // Filtered list
  const filteredList = useMemo(() => {
    let result = bespokeList;

    // Filter by product type
    if (selectedType !== "All") {
      result = result.filter(item => item.product === selectedType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item =>
        (item.name || "").toLowerCase().includes(q) ||
        (item.phone || "").toLowerCase().includes(q) ||
        (item.product || "").toLowerCase().includes(q) ||
        (item.details || "").toLowerCase().includes(q)
      );
    }

    return result;
  }, [bespokeList, selectedType, searchQuery]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 border-2 border-zinc-200 border-t-[#A68042] rounded-full animate-spin" />
        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-400">Loading Consultations...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-zinc-50 pb-40">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="space-y-4">
            <Link href="/admin" className="inline-flex items-center gap-3 text-zinc-400 hover:text-zinc-900 transition-colors group">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Heritage Dashboard</span>
            </Link>
            <div className="space-y-2">
              <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold block italic border-l-2 border-[#A68042] pl-4">Creative Direction</span>
              <h1 className="text-5xl font-heading text-zinc-900 uppercase tracking-widest leading-tight">
                Bespoke <span className="italic normal-case tracking-normal text-[#A68042]">Requests</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="text-right hidden md:block">
              <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-1">Total Artisanal Inquiries</p>
              <p className="text-2xl font-heading text-zinc-900">{bespokeList.length}</p>
            </div>
            <div className="h-12 w-px bg-zinc-200 mx-4 hidden md:block" />

            {/* Working Search */}
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-50 border border-zinc-300 py-2.5 pl-10 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-zinc-900 w-full sm:w-64 transition-all placeholder:text-zinc-500 text-zinc-900 font-bold"
              />
            </div>

            {/* Working Refinement Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="bg-white border border-zinc-200 px-8 py-3 text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-900 hover:border-zinc-900 transition-all flex items-center gap-4 shadow-sm"
              >
                <Filter size={14} className="text-[#A68042]" />
                {selectedType === "All" ? "Refinement" : selectedType}
                <ChevronDown size={12} className={`text-zinc-400 transition-transform ${showFilterDropdown ? "rotate-180" : ""}`} />
              </button>
              {showFilterDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-zinc-200 shadow-xl z-50 min-w-[200px] max-h-64 overflow-y-auto">
                  {productTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => { setSelectedType(type); setShowFilterDropdown(false); }}
                      className={`block w-full text-left px-6 py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-zinc-50 transition-colors ${selectedType === type ? "text-[#A68042] bg-zinc-50" : "text-zinc-700"}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter Active Indicator */}
        {(selectedType !== "All" || searchQuery.trim()) && (
          <div className="flex items-center gap-4 mb-8 animate-in fade-in duration-300">
            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
              Showing {filteredList.length} of {bespokeList.length} requests
            </p>
            <button
              onClick={() => { setSelectedType("All"); setSearchQuery(""); }}
              className="text-[10px] uppercase tracking-widest font-bold text-[#A68042] hover:text-zinc-900 transition-colors flex items-center gap-2"
            >
              <X size={12} /> Clear Filters
            </button>
          </div>
        )}

        {/* Content Grid */}
        {filteredList.length === 0 ? (
          <div className="text-center py-40 border-y border-zinc-100 animate-in fade-in zoom-in-95 duration-1000">
            <Sparkles className="mx-auto text-zinc-100 w-24 h-24 mb-10" strokeWidth={1} />
            <h2 className="text-2xl font-heading text-zinc-900 uppercase tracking-widest mb-6">
              {bespokeList.length === 0 ? "No pending consultations" : "No matching requests"}
            </h2>
            <p className="text-zinc-500 italic mb-12 text-lg">
              {bespokeList.length === 0 ? "The artisanal queue is currently clear." : "Try adjusting your search or filter criteria."}
            </p>
            {bespokeList.length === 0 ? (
              <Link href="/admin" className="text-[10px] uppercase tracking-widest font-bold border-b border-zinc-900 pb-1">Return to Dashboard</Link>
            ) : (
              <button onClick={() => { setSelectedType("All"); setSearchQuery(""); }} className="text-[10px] uppercase tracking-widest font-bold border-b border-zinc-900 pb-1">
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredList.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white border border-zinc-100 group hover:shadow-2xl transition-all duration-700 animate-in fade-in slide-in-from-bottom-8 cursor-pointer"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Image Reveal Area */}
                <div className="relative aspect-square bg-zinc-50 overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt="Artisanal Concept"
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-200 italic space-y-4">
                      <ImageIcon size={48} strokeWidth={1} />
                      <span className="text-[10px] uppercase tracking-widest font-medium">No Concept Image Provided</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute top-6 right-6">
                    <div className="bg-white/90 backdrop-blur px-4 py-2 text-[9px] uppercase tracking-widest font-black text-zinc-900 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#A68042]" />
                      {item.product}
                    </div>
                  </div>
                  {item.created_at && (
                    <div className="absolute bottom-6 left-6">
                      <div className="bg-white/90 backdrop-blur px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold text-zinc-600 flex items-center gap-2">
                        <Clock size={10} />
                        {formatDate(item.created_at)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-10 space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-heading text-zinc-900 uppercase tracking-widest mb-1">{item.name}</h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">{item.phone}</p>
                      </div>
                    </div>
                    {item.details && (
                      <div className="p-6 bg-zinc-50 border-l-2 border-[#A68042] italic">
                        <p className="text-[13px] text-zinc-600 leading-relaxed line-clamp-3">
                          &ldquo;{item.details}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                    {item.size && (
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-zinc-50 text-zinc-400">
                          <Scale size={14} />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-900">Size: {item.size}</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                      className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-black text-zinc-500 hover:text-zinc-900 transition-all group/btn ml-auto"
                    >
                      View Details
                      <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Aesthetic Disclaimer */}
        <div className="mt-40 pt-24 border-t border-zinc-100 text-center">
          <p className="text-zinc-500 italic text-[12px] max-w-2xl mx-auto leading-relaxed">
            The bespoke consultations represent the pinnacle of Hridika&apos;s artisanal journey. Please ensure all creative narratives are reviewed with the utmost attention to detail before engaging with the collector.
          </p>
        </div>

      </div>

      {/* ─── Detail Modal ─── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 fade-in duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative aspect-video bg-zinc-100 overflow-hidden">
              {selectedItem.image ? (
                <Image src={selectedItem.image} alt="Design Reference" fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-300 space-y-3">
                  <ImageIcon size={64} strokeWidth={1} />
                  <span className="text-xs uppercase tracking-widest font-medium">No Reference Image</span>
                </div>
              )}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 hover:bg-white transition-colors"
              >
                <X size={18} className="text-zinc-700" />
              </button>
              <div className="absolute bottom-4 left-4">
                <div className="bg-white/90 backdrop-blur px-4 py-2 text-[10px] uppercase tracking-widest font-black text-zinc-900 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#A68042]" />
                  {selectedItem.product}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-10 space-y-8">
              {/* Client Info */}
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#A68042] mb-2">Client</p>
                  <h2 className="text-3xl font-heading text-zinc-900 uppercase tracking-widest">{selectedItem.name}</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-zinc-50">
                    <Phone size={16} className="text-[#A68042]" />
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Phone</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedItem.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-zinc-50">
                    <Sparkles size={16} className="text-[#A68042]" />
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Product Type</p>
                      <p className="text-sm font-bold text-zinc-900">{selectedItem.product}</p>
                    </div>
                  </div>
                  {selectedItem.size && (
                    <div className="flex items-center gap-4 p-4 bg-zinc-50">
                      <Scale size={16} className="text-[#A68042]" />
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Size</p>
                        <p className="text-sm font-bold text-zinc-900">{selectedItem.size}</p>
                      </div>
                    </div>
                  )}
                  {selectedItem.created_at && (
                    <div className="flex items-center gap-4 p-4 bg-zinc-50">
                      <Clock size={16} className="text-[#A68042]" />
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Submitted</p>
                        <p className="text-sm font-bold text-zinc-900">{formatDate(selectedItem.created_at)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Design Details */}
              {selectedItem.details && (
                <div className="space-y-3">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#A68042]">Design Details</p>
                  <div className="p-6 bg-zinc-50 border-l-2 border-[#A68042]">
                    <p className="text-sm text-zinc-700 leading-relaxed italic whitespace-pre-wrap">
                      &ldquo;{selectedItem.details}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-zinc-100">
                <a
                  href={`tel:${selectedItem.phone}`}
                  className="flex-1 flex items-center justify-center gap-3 bg-zinc-900 text-white py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-zinc-800 transition-colors"
                >
                  <Phone size={14} />
                  Call Client
                </a>
                <a
                  href={`https://wa.me/${(selectedItem.phone || '').replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 bg-[#A68042] text-white py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#8B6A35] transition-colors"
                >
                  <MessageSquare size={14} />
                  WhatsApp
                </a>
              </div>
              <button
                onClick={() => setDeleteTarget(selectedItem.id)}
                className="w-full mt-4 flex items-center justify-center gap-3 border border-red-200 text-red-500 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-red-50 hover:border-red-400 transition-colors"
              >
                <Trash2 size={14} />
                Resolve & Delete Request
              </button>
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
                <h3 className="text-[12px] uppercase tracking-widest font-black text-zinc-900">Delete Request</h3>
                <p className="text-[10px] text-zinc-400 italic mt-0.5">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
              Are you sure you want to resolve and permanently delete this bespoke request?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 text-[10px] uppercase tracking-widest font-bold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`${API_BASE}/api/bespoke-requests/${deleteTarget}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.ok) {
                      showToast("Bespoke request resolved and deleted.", "success");
                      setSelectedItem(null);
                      fetchBespokeRequests();
                    }
                  } catch (err) {
                    showToast("Failed to delete request.", "error");
                  }
                  setDeleteTarget(null);
                }}
                className="flex-1 py-3 text-[10px] uppercase tracking-widest font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
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
