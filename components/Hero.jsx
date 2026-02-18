"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/assets/pic24.jpg",
    sub: "Live the moment",
    title: "Why Settle For\nLimited Options?",
    desc: "Create your own designs with our master craftsmen.",
    cta: "Custom Design",
    link: "/bespoke"
  },
  {
    image: "/assets/pic26.jpg",
    sub: "Exquisite Craftsmanship",
    title: "Best Finish &\nPremium Quality",
    desc: "Customised designs at the best rates in the industry.",
    cta: "Explore Finish",
    link: "/products"
  },
  {
    image: "/assets/pic3.jpg",
    sub: "Handcrafted Luxury",
    title: "Unique Jewelry\nFor Unique You",
    desc: "Every piece tells a story of elegance and passion.",
    cta: "See Collection",
    link: "/products"
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () =>
    setCurrent(current === 0 ? slides.length - 1 : current - 1);

  const nextSlide = () =>
    setCurrent((current + 1) % slides.length);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className={`object-cover object-center transition-transform duration-[6000ms] ease-linear ${index === current ? "scale-110" : "scale-100"
                }`}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 z-10" />
          </div>

          {/* Content */}
          <div className="relative z-20 h-full max-w-7xl mx-auto px-6 pt-40 md:pt-48 pb-24 flex flex-col items-center justify-center text-center text-white">
            <div className={`space-y-6 transition-all duration-1000 transform ${index === current ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}>
              <p className="text-xl md:text-2xl font-heading italic tracking-wide text-zinc-200">
                {slide.sub}
              </p>

              <div className="space-y-2">
                <h1 className="text-5xl md:text-8xl font-heading tracking-tight leading-tight whitespace-pre-line">
                  {slide.title}
                </h1>

                <div className="w-48 h-px bg-zinc-400 mx-auto my-8 opacity-50" />

                <p className="max-w-xl mx-auto text-sm md:text-base font-body tracking-widest uppercase text-zinc-300">
                  {slide.desc}
                </p>
              </div>

              <div className="pt-8">
                <Link
                  href={slide.link}
                  className="inline-block bg-zinc-900/80 backdrop-blur-sm hover:bg-black text-white px-10 py-4 text-xs tracking-[0.3em] uppercase transition-all duration-300 border border-zinc-700 hover:border-zinc-500"
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors z-30 hidden md:block"
      >
        <ChevronLeft size={48} strokeWidth={1} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-colors z-30 hidden md:block"
      >
        <ChevronRight size={48} strokeWidth={1} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white w-8" : "bg-white/30"
              }`}
          />
        ))}
      </div>
    </section>
  );
}
