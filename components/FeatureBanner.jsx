"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Shield, Gem, Truck } from "lucide-react";

export default function FeatureBanner() {
  const features = [
    {
      icon: Gem,
      title: "Pure Craftsmanship",
      desc: "Every piece is handcrafted by master artisans with decades of heritage.",
    },
    {
      icon: Shield,
      title: "Certified Quality",
      desc: "BIS hallmarked with purity guarantee on every piece of jewelry.",
    },
    {
      icon: Truck,
      title: "Pan-India Delivery",
      desc: "Secure, insured shipping to your doorstep across all states.",
    },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#FDF6EE]">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#A68042]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#A68042]/20 to-transparent" />

      {/* Subtle decorative circles */}
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full border border-[#A68042]/[0.06] opacity-60" />
      <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full border border-[#A68042]/[0.06] opacity-60" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-px bg-[#A68042]" />
            <Sparkles size={14} className="text-[#A68042]" />
            <span className="text-[#A68042] text-[10px] uppercase tracking-[0.5em] font-bold">
              Why Hridika
            </span>
            <Sparkles size={14} className="text-[#A68042]" />
            <div className="w-8 h-px bg-[#A68042]" />
          </div>
          <h2 className="text-zinc-900 text-3xl md:text-5xl font-heading uppercase tracking-[0.12em] leading-tight mb-4">
            The Hridika <span className="normal-case tracking-normal text-[#A68042]">Promise</span>
          </h2>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto italic">
            A legacy of trust, quality, and exquisite artistry in every creation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-14">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group text-center p-10 bg-white/60 rounded-sm border border-[#A68042]/[0.08] hover:bg-white/90 hover:border-[#A68042]/15 hover:shadow-lg hover:shadow-[#A68042]/5 transition-all duration-500"
            >
              <div className="mx-auto w-16 h-16 rounded-full border border-[#A68042]/20 flex items-center justify-center mb-6 bg-[#FDF6EE] group-hover:border-[#A68042]/40 group-hover:bg-[#A68042]/5 transition-all duration-500">
                <feature.icon size={24} className="text-[#A68042]" strokeWidth={1.2} />
              </div>
              <h3 className="text-zinc-800 text-sm uppercase tracking-[0.2em] font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-zinc-500 text-[13px] leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/about"
            className="group inline-flex items-center gap-3 text-[#A68042] text-[11px] uppercase tracking-[0.3em] font-semibold hover:text-zinc-900 transition-colors duration-300"
          >
            Discover Our Heritage
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
