"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Quote } from "lucide-react";
import Footer from "../../components/Footer";

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Editorial Hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 scale-105 animate-slow-zoom grayscale"
          style={{
            backgroundImage: "url('/assets/Intro.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        {/* Dark Overlay (No Blur) */}
        <div className="absolute inset-0 bg-black/45 z-10" />

        <div className="relative z-20 text-center px-6 max-w-4xl transform animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <span className="text-white/80 text-[10px] uppercase tracking-[0.5em] mb-6 block font-bold">The Heritage of Excellence</span>
          <h1 className="text-white text-5xl md:text-7xl font-heading mb-8 uppercase tracking-widest leading-tight">
            Our Legacy <br /> in Every <span className="italic normal-case tracking-normal text-[#A68042]">Detail</span>
          </h1>
          <div className="w-24 h-[1px] bg-[#A68042] mx-auto mb-8" />
          <p className="text-white/60 text-lg md:text-xl font-light italic max-w-2xl mx-auto leading-relaxed">
            "For decades, we have been crafting timeless stories through the artistry of fine jewelry."
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 relative">
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden shadow-2xl">
                <Image
                  src="/assets/pic17.jpg"
                  alt="Jewellery Crafting"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 hidden xl:block w-64 h-64 border-2 border-[#A68042]/20 -z-10" />
              <div className="absolute -top-10 -left-10 hidden xl:block w-40 h-40 bg-zinc-50 -z-10" />
            </div>

            <div className="lg:w-1/2 space-y-12">
              <div>
                <span className="text-[#A68042] text-[11px] uppercase tracking-[0.3em] font-bold mb-4 block">Our Story</span>
                <h2 className="text-4xl md:text-5xl font-heading text-zinc-900 uppercase tracking-widest leading-tight mb-8">
                  Where Ancient Art <br /> Meets Modern <span className="text-[#A68042]">Elegance</span>
                </h2>
                <p className="text-zinc-500 text-lg leading-relaxed mb-6 italic">
                  Hridika Jewels was founded with a singular passion: creating jewellery that celebrates individuality through unmatched elegance and beauty.
                </p>
                <p className="text-zinc-500 leading-relaxed mb-8">
                  Our journey began with a vision to bridge the gap between traditional craftsmanship and contemporary style. Each piece in our collection is meticulously designed and handcrafted, ensuring that it carries not just a price, but a legacy of trust and exquisite artistry.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-zinc-100">
                <div className="space-y-3">
                  <h4 className="text-zinc-900 font-bold uppercase tracking-widest text-[11px]">Premium Quality</h4>
                  <p className="text-zinc-400 text-xs italic">Only the finest ethically sourced materials touch our hands.</p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-zinc-900 font-bold uppercase tracking-widest text-[11px]">Timeless Design</h4>
                  <p className="text-zinc-400 text-xs italic">Elegance that transcends generations and fleeting trends.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="bg-zinc-50 py-32 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 text-zinc-100 text-[200px] font-heading font-black select-none pointer-events-none transform translate-x-1/4 -translate-y-1/4">HRIDIKA</div>

        <div className="max-w-7xl mx-auto relative z-10 text-center mb-20">
          <span className="text-[#A68042] text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">The Hridika Standard</span>
          <h2 className="text-4xl font-heading text-zinc-900 uppercase tracking-widest">Our Unwavering Promise</h2>
          <div className="w-16 h-[1px] bg-zinc-900 mx-auto mt-6" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { title: "Quality", desc: "Premium quality materials and precision in every facet." },
            { title: "Authenticity", desc: "Authentic and certified jewellery with guaranteed purity." },
            { title: "Elegance", desc: "Aesthetic designs that evoke emotion and sophistication." },
            { title: "Trust", desc: "Customer satisfaction is the cornerstone of our heritage." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-10 text-center shadow-lg group hover:-translate-y-2 transition-all duration-500">
              <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#A68042]/10 transition-colors">
                <Star className="text-[#A68042] w-6 h-6" strokeWidth={1} />
              </div>
              <h3 className="text-[12px] uppercase tracking-[0.2em] font-bold text-zinc-900 mb-4">{item.title}</h3>
              <p className="text-zinc-400 text-xs italic leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto bg-zinc-900 p-20 text-white relative overflow-hidden group">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

          <div className="relative z-10">
            <Quote className="text-[#A68042] w-12 h-12 mx-auto mb-8 opacity-50" strokeWidth={1} />
            <h2 className="text-3xl font-heading uppercase tracking-[0.2em] mb-8 leading-tight">
              Discover Your Next <br /> Heirloom Piece
            </h2>
            <Link
              href="/products"
              className="inline-flex items-center gap-4 bg-[#A68042] text-white px-12 py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-white hover:text-black transition-all duration-500 shadow-xl shadow-[#A68042]/20"
            >
              Explore Collection
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
