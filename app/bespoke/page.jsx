"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Upload,
  Send,
  CheckCircle2,
  Sparkles,
  PenTool,
  Gem,
  User,
  Phone,
  MessageSquare,
  Ruler
} from "lucide-react";
import Footer from "../../components/Footer";

export default function BespokePage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    product: "Ring",
    details: "",
    size: "",
    image: null, // Will hold a File object
  });
  const [imagePreview, setImagePreview] = useState(""); // For display only
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store raw File object for FormData upload
    setFormData({ ...formData, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    const token = localStorage.getItem("access_token");
    try {
      // Build FormData for multipart upload
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('phone', formData.phone);
      fd.append('product', formData.product);
      fd.append('details', formData.details);
      fd.append('size', formData.size);
      if (formData.image instanceof File) {
        fd.append('image', formData.image);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bespoke-request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type — browser sets it with boundary for FormData
        },
        body: fd,
      });

      if (!res.ok) throw new Error("Submission failed");
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="text-center max-w-xl animate-in fade-in zoom-in-95 duration-700">
          <CheckCircle2 className="mx-auto text-[#A68042] w-20 h-20 mb-8" strokeWidth={1} />
          <h1 className="text-4xl font-heading text-zinc-900 uppercase tracking-widest mb-6">A Vision <span className="italic normal-case tracking-normal border-b border-zinc-100">Initiated</span></h1>
          <p className="text-zinc-500 italic mb-12 text-lg">Your request for a bespoke masterpiece has been received. Our specialist concierge will contact you shortly to begin the collaborative design process.</p>
          <Link href="/profile" className="inline-block bg-zinc-900 text-white px-12 py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-[#A68042] transition-all">
            Return to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[400px] md:h-[480px] overflow-hidden bg-zinc-950">
        <Image
          src="/assets/pic11.jpg"
          alt="Bespoke Customisation"
          fill
          priority
          className="object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 pb-16">
          <span className="text-[#A68042] text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Personalized Artistry</span>
          <h1 className="text-4xl md:text-6xl font-heading text-white uppercase tracking-widest mb-4">
            The <span className="italic normal-case tracking-normal text-zinc-300">Bespoke</span> Narrative
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-xl tracking-wider">
            Co-create a masterpiece that mirrors your soul with our master craftsmen.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-40">
        {/* Hero Section - Editorial Style */}
        <div className="flex flex-col lg:flex-row gap-20 mb-40 items-center">
          <div className="lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold mb-4 block">Personalized Artistry</span>
            <h2 className="text-4xl lg:text-6xl font-heading text-zinc-900 uppercase tracking-widest leading-tight">
              The <span className="italic normal-case tracking-normal text-[#A68042]">Bespoke</span> <br />
              Narrative
            </h2>
            <p className="text-zinc-500 text-lg leading-relaxed italic border-l-2 border-zinc-100 pl-8 max-w-xl">
              Embark on an exclusive journey to co-create a jewelry piece that mirrors your soul. From initial vision to final polish, every detail is a collaborative whisper between your heart and our artisan&apos;s hands.
            </p>
          </div>
          <div className="lg:w-1/2 relative aspect-[4/5] w-full animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <Image
              src="/assets/pic12.jpg"
              alt="Bespoke Craftsmanship"
              fill
              className="object-cover shadow-2xl"
            />
            <div className="absolute -bottom-10 -left-10 bg-zinc-900 p-12 hidden lg:block shadow-2xl">
              <div className="text-[#A68042] text-[10px] uppercase tracking-widest font-bold mb-4">The Promise</div>
              <p className="text-white text-xs italic leading-relaxed max-w-[200px]">"One artisan. One vision. One unique treasure that belongs only to you."</p>
            </div>
          </div>
        </div>

        {/* The Process - Minimalist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-40">
          {[
            { icon: Sparkles, title: "Collaborative Vision", desc: "Share your initial sketches, references, or abstract ideas with our specialist." },
            { icon: PenTool, title: "Artistic Blueprint", desc: "Our designers translate your intent into precision technical drawings and renders." },
            { icon: Gem, title: "Elemental Curation", desc: "Select from our private reserve of ethically sourced metals and exquisite stones." },
            { icon: CheckCircle2, title: "Artisanal Birth", desc: "Meticulously hand-crafted in our atelier to your exact specifications." }
          ].map((step, idx) => (
            <div key={idx} className="group p-8 border border-zinc-50 bg-zinc-50/30 hover:bg-white hover:border-zinc-100 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="w-12 h-12 bg-white flex items-center justify-center text-[#A68042] mb-8 group-hover:scale-110 transition-transform">
                <step.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs uppercase tracking-widest font-black text-zinc-900 mb-4">{idx + 1}. {step.title}</h3>
              <p className="text-zinc-500 text-[11px] italic leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Consultation Form - Premium Design */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-heading text-zinc-900 uppercase tracking-widest mb-6">Commence Your Consultation</h2>
            <p className="text-zinc-400 italic text-sm">Our bespoke service is currently refined for Rings and Bangles only.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              {/* Personal Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} className="text-[#A68042]" />
                  <label className="text-[10px] uppercase text-zinc-700 font-black">Full Identity</label>
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your name"
                  onChange={handleChange}
                  className="w-full bg-zinc-50/50 border-b border-zinc-300 focus:border-zinc-900 px-4 py-4 text-sm focus:outline-none transition-all placeholder:italic text-zinc-900 font-bold"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Phone size={14} className="text-[#A68042]" />
                  <label className="text-[10px] uppercase tracking-widest text-zinc-700 font-black">Secure Contact</label>
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="WhatsApp preferred"
                  onChange={handleChange}
                  className="w-full bg-zinc-50/50 border-b border-zinc-300 focus:border-zinc-900 px-4 py-4 text-sm focus:outline-none transition-all placeholder:italic text-zinc-900 font-bold"
                />
              </div>

              {/* Selection Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Gem size={14} className="text-[#A68042]" />
                  <label className="text-[10px] uppercase tracking-widest text-zinc-700 font-black">Piece Architecture</label>
                </div>
                <div className="flex gap-8">
                  {['Ring', 'Bangle'].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="product"
                        value={type}
                        checked={formData.product === type}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div className={`w-5 h-5 border flex items-center justify-center transition-all ${formData.product === type ? 'border-zinc-900 bg-zinc-900' : 'border-zinc-200 bg-white group-hover:border-zinc-400'}`}>
                        {formData.product === type && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className={`text-[11px] uppercase tracking-widest font-bold ${formData.product === type ? 'text-zinc-900' : 'text-zinc-400'}`}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Ruler size={14} className="text-[#A68042]" />
                  <label className="text-[10px] uppercase tracking-widest text-zinc-700 font-black">Precision Measurements</label>
                </div>
                <input
                  type="text"
                  name="size"
                  required
                  placeholder="Enter your size"
                  onChange={handleChange}
                  className="w-full bg-zinc-50/50 border-b border-zinc-300 focus:border-zinc-900 px-4 py-4 text-sm focus:outline-none transition-all placeholder:italic text-zinc-900 font-bold"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} className="text-[#A68042]" />
                <label className="text-[10px] uppercase tracking-widest text-zinc-700 font-black">The Vision Narrative</label>
              </div>
              <textarea
                name="details"
                required
                placeholder="Describe your masterpiece vision or special requirements..."
                onChange={handleChange}
                className="w-full bg-zinc-50/50 border-b border-zinc-300 focus:border-zinc-900 px-4 py-8 text-sm focus:outline-none transition-all placeholder:italic min-h-[160px] text-zinc-900 font-bold"
              />
            </div>

            {/* File Upload - Styled */}
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-widest text-zinc-700 font-black mb-4 block">Visual References (Optional)</label>
              <label className="relative border-2 border-dashed border-zinc-100 hover:border-[#A68042] transition-colors p-12 flex flex-col items-center justify-center cursor-pointer bg-zinc-50/30 group overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {formData.image ? (
                  <div className="text-center">
                    <CheckCircle2 size={32} className="text-green-500 mx-auto mb-4" />
                    <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest italic">Reference Image Secured</p>
                    <p className="text-[10px] text-zinc-400 mt-2">Click to replace</p>
                  </div>
                ) : (
                  <>
                    <Upload size={32} className="text-zinc-200 group-hover:text-[#A68042] transition-colors mb-4" />
                    <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Share a sketch or reference image</p>
                    <p className="text-[10px] text-zinc-400 mt-2">Maximum file size: 5MB</p>
                  </>
                )}
              </label>
            </div>

            <div className="pt-12 text-center">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="bg-zinc-900 text-white px-20 py-6 uppercase tracking-[0.4em] text-[12px] font-bold hover:bg-[#A68042] transition-all duration-700 shadow-2xl shadow-zinc-200 disabled:opacity-50 group flex items-center justify-center gap-4 mx-auto"
              >
                {status === 'submitting' ? 'Authenticating Request...' : 'Initiate Bespoke Journey'}
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
              {status === 'error' && (
                <p className="text-red-500 text-[10px] uppercase tracking-widest font-bold mt-6 italic animate-placeholder">A secure connection error occurred. Please try again.</p>
              )}
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main >
  );
}
