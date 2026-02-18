"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Ruler, Gem, Layers } from "lucide-react";
import Footer from "../../components/Footer";

export default function SizingChartPage() {
  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-2 pb-40">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-20 mb-40 items-center">
          <div className="lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold mb-4 block">Precision & Fit</span>
            <h1 className="text-5xl lg:text-7xl font-heading text-zinc-900 uppercase tracking-widest leading-tight">
              The <span className="italic normal-case tracking-normal text-[#A68042]">Sizing</span> <br />
              Manifesto
            </h1>
            <p className="text-zinc-500 text-lg leading-relaxed italic border-l-2 border-zinc-100 pl-8 max-w-xl">
              A masterpiece is only as perfect as its fit. Our comprehensive guide ensures that your selected Hridika piece rests with absolute grace and comfort, matching the precision of its craftsmanship.
            </p>
          </div>
          <div className="lg:w-1/2 relative aspect-[16/9] w-full animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 shadow-2xl overflow-hidden">
            <Image
              src="/assets/unsplash/jewel-ring-1.jpg"
              alt="Precision Crafting"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Ring Guide */}
          <section className="space-y-12">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center text-[#A68042]">
                <Gem size={20} />
              </div>
              <h2 className="text-xl font-heading uppercase tracking-widest text-zinc-900">Rings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400">US Size</th>
                    <th className="py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400">Circumference</th>
                    <th className="py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400 text-right">Diameter</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-zinc-900">
                  {[
                    { us: "5", circ: "49.3 mm", diam: "15.7 mm" },
                    { us: "6", circ: "52.4 mm", diam: "16.7 mm" },
                    { us: "7", circ: "55.4 mm", diam: "17.6 mm" },
                    { us: "8", circ: "58.5 mm", diam: "18.6 mm" },
                    { us: "9", circ: "61.5 mm", diam: "19.6 mm" },
                    { us: "10", circ: "64.6 mm", diam: "20.6 mm" },
                    { us: "11", circ: "67.6 mm", diam: "21.5 mm" },
                    { us: "12", circ: "70.7 mm", diam: "22.5 mm" },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-zinc-50 group hover:bg-zinc-50 transition-colors">
                      <td className="py-4 font-heading">{row.us}</td>
                      <td className="py-4 italic text-zinc-500">{row.circ}</td>
                      <td className="py-4 italic text-zinc-500 text-right">{row.diam}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bracelet Guide */}
          <section className="space-y-12">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center text-[#A68042]">
                <Layers size={20} />
              </div>
              <h2 className="text-xl font-heading uppercase tracking-widest text-zinc-900">Bracelets</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100">
                    <th className="py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400">Size</th>
                    <th className="py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400">Wrist Circ.</th>
                    <th className="py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-400 text-right">Length</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-zinc-900">
                  {[
                    { size: "XS", circ: "5.5\" - 6\"", len: "6.5\"" },
                    { size: "S", circ: "6\" - 6.5\"", len: "7\"" },
                    { size: "M", circ: "6.5\" - 7\"", len: "7.5\"" },
                    { size: "L", circ: "7\" - 7.5\"", len: "8\"" },
                    { size: "XL", circ: "7.5\" - 8\"", len: "8.5\"" },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-zinc-50 group hover:bg-zinc-50 transition-colors">
                      <td className="py-4 font-heading">{row.size}</td>
                      <td className="py-4 italic text-zinc-500">{row.circ}</td>
                      <td className="py-4 italic text-zinc-500 text-right">{row.len}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Necklace Guide */}
          <section className="space-y-12">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center text-[#A68042]">
                <Ruler size={20} />
              </div>
              <h2 className="text-xl font-heading uppercase tracking-widest text-zinc-900">Necklaces</h2>
            </div>
            <div className="space-y-8">
              {[
                { title: "14\" - 16\"", meta: "Choker", desc: "Sits elegantly at the base of the neck. Ideal for open-neck silhouettes." },
                { title: "16\" - 18\"", meta: "Princess", desc: "Rests gracefully on the collarbone. Our most versatile selection." },
                { title: "18\" - 20\"", meta: "Matinee", desc: "Lands mid-chest. Perfect for both professional and evening attire." },
                { title: "24\" - 30\"", meta: "Opera", desc: "Extended length for a dramatic statement. Often layered for effect." },
              ].map((row, idx) => (
                <div key={idx} className="p-8 border border-zinc-50 bg-zinc-50/30 space-y-4 hover:bg-white hover:border-zinc-100 transition-all">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-lg font-heading text-zinc-900">{row.title}</h3>
                    <span className="text-[#A68042] text-[9px] uppercase tracking-widest font-bold">{row.meta}</span>
                  </div>
                  <p className="text-zinc-500 text-xs italic leading-relaxed">{row.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Consultation CTA */}
        <div className="mt-40 border-t border-zinc-100 pt-32 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading text-zinc-900 uppercase tracking-widest mb-6">Unsure of your <span className="italic normal-case tracking-normal">Size?</span></h2>
          <p className="text-zinc-500 italic mb-12 leading-relaxed text-lg">Our specialists can provide a physical sizing kit or a virtual consultation to ensure your piece is absolute in its perfection.</p>
          <Link href="/contact" className="inline-flex items-center gap-4 bg-zinc-900 text-white px-12 py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-[#A68042] transition-all group">
            Inquire for Specialist Guidance
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
