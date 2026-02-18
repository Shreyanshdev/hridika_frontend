"use client";

import React from "react";
import Link from "next/link";

export default function ParallaxSection() {
    return (
        <section
            className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden"
            style={{
                backgroundImage:
                    "url('/assets/pic10.jpg')",
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Very slight blur + dark tint overlay */}
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] z-10" />

            {/* Decorative corner accents */}
            <div className="absolute top-8 left-8 w-20 h-20 border-t border-l border-white/15 z-20" />
            <div className="absolute top-8 right-8 w-20 h-20 border-t border-r border-white/15 z-20" />
            <div className="absolute bottom-8 left-8 w-20 h-20 border-b border-l border-white/15 z-20" />
            <div className="absolute bottom-8 right-8 w-20 h-20 border-b border-r border-white/15 z-20" />

            {/* Content */}
            <div className="relative z-20 text-center px-6 max-w-3xl">
                {/* Diamond Icon */}
                <div className="mb-10 flex justify-center">
                    <div className="w-[72px] h-[72px] border border-white/20 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-sm">
                        <svg
                            viewBox="0 0 24 24"
                            className="w-8 h-8 text-[#D4AF6A]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                        >
                            <path d="M12 2L4.5 9L12 22L19.5 9L12 2Z" />
                            <path d="M4.5 9H19.5" />
                            <path d="M12 2V9" />
                            <path d="M8.5 2L4.5 9" />
                            <path d="M15.5 2L19.5 9" />
                        </svg>
                    </div>
                </div>

                <p className="text-[#D4AF6A] text-[11px] uppercase tracking-[0.5em] mb-5 font-semibold">
                    Timeless Elegance & Craftsmanship
                </p>

                <h2 className="text-white text-4xl md:text-6xl font-heading mb-6 uppercase tracking-[0.15em] leading-tight">
                    Modern Luxury <br />
                    <span className="italic normal-case tracking-normal text-white/80 text-3xl md:text-5xl">
                        for Every Moment
                    </span>
                </h2>

                <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#D4AF6A] to-transparent mx-auto mb-8" />

                <p className="text-white/50 text-base md:text-lg max-w-xl mx-auto leading-relaxed italic mb-10 font-light">
                    &ldquo;Jewelry has the power to be the one little thing that makes you feel unique.&rdquo;
                </p>

                <Link
                    href="/products"
                    className="group inline-flex items-center gap-3 bg-transparent border border-white/40 text-white px-12 py-4 uppercase tracking-[0.3em] text-[11px] font-semibold hover:bg-white hover:text-zinc-900 transition-all duration-500"
                >
                    Shop Now
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}
