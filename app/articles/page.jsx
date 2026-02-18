"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, User, MessageSquare, ChevronRight } from "lucide-react";
import Footer from "../../components/Footer";

const articlesData = [
  {
    id: 1,
    title: "The Art of Jewelry Making",
    excerpt: "Discover the intricate process of crafting exquisite jewelry pieces from base metal to masterpiece.",
    content: "Jewelry making is an ancient art that combines skill, creativity, and precision. Each piece is carefully crafted to showcase the beauty of gemstones and precious metals. From the initial sketch to the final polish, every step is a testament to the artisan's dedication.",
    date: "2025-12-20",
    author: "Siddharth Jain",
    category: "Craftsmanship",
    image: "/assets/pic1.jpg",
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "Silver Care Guide: Ensuring Eternal Luster",
    excerpt: "Learn the secrets to maintaining and caring for your silver jewelry to keep it shining for generations.",
    content: "Silver jewelry requires proper care to maintain its shine. Regular cleaning with a soft cloth and storing in a dry place will keep your pieces looking beautiful for years to come. Avoid exposure to harsh chemicals and perfumes to prevent premature tarnishing.",
    date: "2025-12-15",
    author: "Meera Reddy",
    category: "Education",
    image: "/assets/pic2.jpg",
    readTime: "5 min read"
  },
  {
    id: 3,
    title: "Understanding Hallmarks & Certification",
    excerpt: "A comprehensive guide to understanding what jewelry hallmarks mean and why they matter for your investment.",
    content: "Hallmarks are official marks stamped on jewelry to indicate its purity and authenticity. A 925 hallmark indicates 92.5% pure silver, ensuring quality and value. Understanding these marks is crucial for making informed purchases and protecting your investment.",
    date: "2025-12-10",
    author: "Arjun Mehta",
    category: "Buying Guide",
    image: "/assets/pic3.jpg",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "The Renaissance of Temple Jewelry",
    excerpt: "Exploring the revival of traditional temple jewelry designs in modern high-fashion circles.",
    content: "Temple jewelry, once reserved for divine idols, has found its way into the bridal trousseaus of modern women. Its intricate carvings and historical significance make it more than just an ornament; it's a wearable piece of history.",
    date: "2025-11-28",
    author: "Priya Sharma",
    category: "Trends",
    image: "/assets/pic4.jpg",
    readTime: "10 min read"
  }
];

export default function ArticlesPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[400px] md:h-[480px] overflow-hidden bg-zinc-950">
        <Image
          src="/assets/pic17.jpg"
          alt="Journal & Articles"
          fill
          priority
          className="object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 pb-16">
          <span className="text-[#A68042] text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">The Journal</span>
          <h1 className="text-4xl md:text-6xl font-heading text-white uppercase tracking-widest mb-4">
            Articles & <span className="italic normal-case tracking-normal text-zinc-300">Insights</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-xl tracking-wider">
            Stories of craftsmanship, heritage, and the artistry behind every masterpiece.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        {/* Editorial Header */}
        <div className="max-w-4xl mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/50 hover:backdrop-blur-md px-4 py-2 rounded-full -ml-4 transition-all duration-300 mb-12 group cursor-pointer">
            <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Back to Home</span>
          </Link>
          <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold mb-4 block">The Hridika Journal</span>
          <h1 className="text-5xl md:text-7xl font-heading text-zinc-900 uppercase tracking-widest leading-tight mb-8">
            Our World of <br /> <span className="italic normal-case tracking-normal text-[#A68042]">Elegance</span> & Art
          </h1>
          <p className="text-zinc-500 text-lg leading-relaxed italic border-l-2 border-zinc-100 pl-8 max-w-2xl">
            Explore stories of craftsmanship, guides on preserving beauty, and deep dives into the heritage of fine jewelry.
          </p>
        </div>

        {/* Featured Post (Optional first one) */}
        <section className="mb-32 group cursor-pointer animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
            <div className="lg:w-3/5 relative aspect-video overflow-hidden">
              <Image
                src={articlesData[0].image}
                alt={articlesData[0].title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1">
                <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-900">{articlesData[0].category}</span>
              </div>
            </div>
            <div className="lg:w-2/5 space-y-6">
              <div className="flex items-center gap-4 text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                <span>{new Date(articlesData[0].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                <span>{articlesData[0].readTime}</span>
              </div>
              <h2 className="text-4xl font-heading text-zinc-900 uppercase tracking-widest group-hover:text-[#A68042] transition-colors leading-tight">
                {articlesData[0].title}
              </h2>
              <p className="text-zinc-500 italic leading-relaxed text-lg">
                {articlesData[0].excerpt}
              </p>
              <Link href={`/articles/${articlesData[0].id}`} className="inline-flex items-center gap-4 text-zinc-900 text-[11px] uppercase tracking-[0.2em] font-bold border-b border-zinc-900 pb-1 hover:text-[#A68042] hover:border-[#A68042] transition-all">
                Read Full Story <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        <div className="w-full h-[1px] bg-zinc-100 mb-32" />

        {/* Grid of Other Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {articlesData.slice(1).map((article, idx) => (
            <article key={article.id} className="flex flex-col group animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="relative aspect-[4/5] overflow-hidden mb-8">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute bottom-6 left-6 bg-zinc-900/80 backdrop-blur-sm px-3 py-1 text-white">
                  <span className="text-[9px] uppercase tracking-widest font-bold">{article.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-zinc-400 text-[9px] uppercase tracking-widest font-bold mb-4">
                <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                <span>{article.readTime}</span>
              </div>
              <h3 className="text-xl font-heading text-zinc-900 uppercase tracking-widest mb-4 group-hover:text-[#A68042] transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-zinc-500 text-sm italic leading-relaxed mb-6 line-clamp-3">
                {article.excerpt}
              </p>
              <Link href={`/articles/${article.id}`} className="mt-auto inline-flex items-center gap-2 text-zinc-900 text-[10px] uppercase tracking-[0.2em] font-bold hover:text-[#A68042] transition-colors w-fit">
                View Piece <ChevronRight size={12} />
              </Link>
            </article>
          ))}
        </div>

        {/* Newsletter Box (Optional here if not wanted, but good for editorial) */}
        <div className="mt-40 bg-zinc-50 p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-[#A68042]/20 translate-x-10 translate-y-10" />
          <div className="absolute bottom-0 right-0 w-24 h-24 border-r border-b border-[#A68042]/20 -translate-x-10 -translate-y-10" />

          <div className="relative z-10 max-w-xl mx-auto">
            <span className="text-[#A68042] text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block italic">Curated Inspiration</span>
            <h2 className="text-3xl font-heading text-zinc-900 uppercase tracking-widest mb-6">Join Our Narrative</h2>
            <p className="text-zinc-500 italic mb-10">Receive a monthly digest of our latest pieces, heritage stories, and exclusive styling guides.</p>
            <form className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your digital address"
                className="flex-1 bg-white border-b border-zinc-200 focus:border-black focus:outline-none px-4 text-sm font-light italic"
              />
              <button className="bg-zinc-900 text-white px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-[#A68042] transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
