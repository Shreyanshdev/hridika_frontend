"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { submitContact } from "../../lib/api";
import Footer from "../../components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await submitContact(formData);
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again later or contact us directly.");
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-2 pb-32">
        {/* Header Section */}
        <div className="max-w-3xl mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/50 hover:backdrop-blur-md px-4 py-2 rounded-full -ml-4 transition-all duration-300 mb-12 group cursor-pointer">
            <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Back to Home</span>
          </Link>
          <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold mb-4 block">Get In Touch</span>
          <h1 className="text-5xl md:text-6xl font-heading text-zinc-900 uppercase tracking-widest leading-tight mb-8">
            Connect With <br /> Our <span className="italic normal-case tracking-normal text-[#A68042]">Concierge</span>
          </h1>
          <p className="text-zinc-500 text-lg leading-relaxed italic border-l-2 border-zinc-100 pl-8">
            Whether you seek a bespoke creation or have inquiries about our collections, our team of experts is here to assist you with every detail.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-24">
          {/* Contact Info Column */}
          <div className="lg:w-[40%] space-y-16 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="space-y-12">
              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center group-hover:bg-[#A68042]/10 transition-all">
                  <MapPin className="text-[#A68042] w-6 h-6" strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-[12px] uppercase tracking-[0.2em] font-bold text-zinc-900 mb-3">Principal Boutique</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed italic">
                    Greenland Apartment, 108, First Floor,<br />
                    Babukhan Mall, Somajiguda,<br />
                    Hyderabad, India 500082
                  </p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center group-hover:bg-[#A68042]/10 transition-all">
                  <Phone className="text-[#A68042] w-6 h-6" strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-[12px] uppercase tracking-[0.2em] font-bold text-zinc-900 mb-3">Direct Inquiries</h4>
                  <a href="tel:+912312564589" className="text-zinc-500 hover:text-black text-sm block transition-colors mb-1 italic">+91 2312 564589</a>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold">Mon-Sat, 10:00 — 19:00</p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center group-hover:bg-[#A68042]/10 transition-all">
                  <Mail className="text-[#A68042] w-6 h-6" strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-[12px] uppercase tracking-[0.2em] font-bold text-zinc-900 mb-3">Digital Correspondence</h4>
                  <a href="mailto:jscompany1027@gmail.com" className="text-zinc-500 hover:text-black text-sm block transition-colors italic">jscompany1027@gmail.com</a>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="w-14 h-14 bg-zinc-50 rounded-full flex items-center justify-center group-hover:bg-[#A68042]/10 transition-all">
                  <Clock className="text-[#A68042] w-6 h-6" strokeWidth={1} />
                </div>
                <div>
                  <h4 className="text-[12px] uppercase tracking-[0.2em] font-bold text-zinc-900 mb-3">Business Hours</h4>
                  <p className="text-zinc-500 text-sm italic">Monday - Saturday: 10:00 AM - 7:00 PM</p>
                  <p className="text-zinc-400 text-sm italic">Sunday: Strictly By Appointment</p>
                </div>
              </div>
            </div>

            {/* Social Links placeholder or Map placeholder */}
            <div className="pt-12 border-t border-zinc-100">
              <div className="relative aspect-video bg-zinc-50 w-full overflow-hidden shadow-sm group">
                <div className="absolute inset-0 bg-zinc-200 animate-pulse group-hover:opacity-50 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Interactive Map Unavailable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:w-[60%] animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="bg-zinc-50 p-12 lg:p-16 relative overflow-hidden group">
              {/* Texture overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />

              {status === "success" ? (
                <div className="text-center py-20 relative z-10 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle className="text-green-600 w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-heading mb-4 uppercase tracking-widest text-zinc-900">Message Received</h3>
                  <p className="text-zinc-500 italic mb-10">Thank you for contacting Hridika Jewels. <br /> A consultant will reach out to you within 24 hours.</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-[11px] uppercase tracking-[0.3em] font-bold text-[#A68042] border-b border-[#A68042] pb-1 hover:text-black hover:border-black transition-all"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <div className="relative z-10">
                  <h2 className="text-2xl font-heading text-zinc-900 uppercase tracking-widest mb-10 text-center">Inquiry Form</h2>
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="group">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-3 block group-focus-within:text-[#A68042] transition-colors">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="E.g. Alexander Pierce"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b border-zinc-200 focus:border-[#A68042] focus:outline-none pb-2 text-zinc-800 transition-all font-light"
                          required
                        />
                      </div>
                      <div className="group">
                        <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-3 block group-focus-within:text-[#A68042] transition-colors">Digital Mail *</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="preferred@domain.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b border-zinc-200 focus:border-[#A68042] focus:outline-none pb-2 text-zinc-800 transition-all font-light"
                          required
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-3 block group-focus-within:text-[#A68042] transition-colors">Contact Number (Optional)</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 — — — — — — — — — —"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-zinc-200 focus:border-[#A68042] focus:outline-none pb-2 text-zinc-800 transition-all font-light"
                      />
                    </div>

                    <div className="group">
                      <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-3 block group-focus-within:text-[#A68042] transition-colors">Brief Inquiry *</label>
                      <textarea
                        name="message"
                        placeholder="Tell us about the piece You are looking for..."
                        value={formData.message}
                        onChange={handleChange}
                        rows="5"
                        className="w-full bg-transparent border-b border-zinc-200 focus:border-[#A68042] focus:outline-none pb-2 text-zinc-800 transition-all font-light resize-none mt-2"
                        required
                      ></textarea>
                    </div>

                    {status === "error" && (
                      <div className="bg-red-50 p-4 text-center animate-in fade-in duration-300">
                        <p className="text-red-800 text-[10px] uppercase tracking-widest font-bold">{errorMessage}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full bg-zinc-900 text-white py-6 uppercase tracking-[0.4em] text-[11px] font-bold hover:bg-[#A68042] transition-all duration-500 disabled:opacity-50 group flex items-center justify-center gap-4 shadow-xl shadow-zinc-200 shadow-zinc-200/50"
                    >
                      {status === "loading" ? "Transmitting..." : "Send Correspondence"}
                      <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
