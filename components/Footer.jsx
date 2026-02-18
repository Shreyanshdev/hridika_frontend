"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin, ChevronRight } from "lucide-react";

export default function Footer() {
  const quickLinks = [
    { name: "Articles", href: "/articles" },
    { name: "Bangles", href: "/category/bangles" },
    { name: "Brooches", href: "/category/brooches" },
    { name: "Necklace", href: "/category/necklace" },
    { name: "Rings", href: "/category/rings" },
  ];

  const quickInfo = [
    { name: "Sizing Chart", href: "/sizing-chart" },
    { name: "Contact", href: "/contact" },
    { name: "Privacy Policy", href: "/policy/privacy" },
    { name: "Shipping Policy", href: "/policy/shipping" },
    { name: "Terms & Conditions", href: "/policy/terms" },
  ];

  return (
    <footer className="bg-zinc-950 text-white pt-24 pb-8 font-body overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 whitespace-normal">

          {/* Brand Section */}
          <div className="flex flex-col gap-8">
            <Link href="/" className="inline-block transition-transform hover:scale-105 origin-left">
              <Image
                src="/logo/logohridika.png"
                alt="Hridika Jewels"
                width={200}
                height={80}
                className="brightness-0 invert object-contain h-14 w-auto"
              />
            </Link>
            <p className="text-zinc-500 text-[14px] leading-relaxed italic max-w-xs">
              "Where ancient art meets modern elegance. We craft pieces that tell a story of timeless beauty and exceptional craftsmanship."
            </p>
            <div className="flex items-center gap-5 pt-4">
              <Link href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#A68042] hover:border-[#A68042] transition-all duration-300 group">
                <Facebook size={16} className="text-zinc-400 group-hover:text-white" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#A68042] hover:border-[#A68042] transition-all duration-300 group">
                <Twitter size={16} className="text-zinc-400 group-hover:text-white" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#A68042] hover:border-[#A68042] transition-all duration-300 group">
                <Instagram size={16} className="text-zinc-400 group-hover:text-white" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[14px] uppercase tracking-[0.3em] font-bold mb-10 text-white relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-[1px] after:bg-[#A68042]">
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-zinc-500 hover:text-white text-[13px] flex items-center gap-2 transition-colors uppercase tracking-widest group">
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-300 text-[#A68042]" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Info */}
          <div>
            <h4 className="text-[14px] uppercase tracking-[0.3em] font-bold mb-10 text-white relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-[1px] after:bg-[#A68042]">
              Quick Info
            </h4>
            <ul className="space-y-4">
              {quickInfo.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-zinc-500 hover:text-white text-[13px] flex items-center gap-2 transition-colors uppercase tracking-widest group">
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-300 text-[#A68042]" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col gap-10">
            <h4 className="text-[14px] uppercase tracking-[0.3em] font-bold mb-10 text-white relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-[1px] after:bg-[#A68042]">
              Quick Connect
            </h4>
            <div className="space-y-6">
              <div className="flex gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded border border-white/5 flex items-center justify-center group-hover:bg-[#A68042]/10 transition-colors">
                  <Phone size={16} className="text-[#A68042]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Call Us</p>
                  <a href="tel:+911234567890" className="text-zinc-300 hover:text-white text-[14px] transition-colors">+91-1234567890</a>
                </div>
              </div>
              <div className="flex gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded border border-white/5 flex items-center justify-center group-hover:bg-[#A68042]/10 transition-colors">
                  <Mail size={16} className="text-[#A68042]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Email Us</p>
                  <a href="mailto:jscompany1027@gmail.com" className="text-zinc-300 hover:text-white text-[14px] transition-colors">jscompany1027@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-[11px] uppercase tracking-[0.2em]">
            &copy; 2026 Hridika Jewels, INC All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <span className="text-zinc-600 text-[10px] uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
            <span className="text-zinc-600 text-[10px] uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Terms of Service</span>
            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <Image src="https://placehold.co/40x25/transparent/white?text=VISA&font=roboto" unoptimized={true} alt="Visa" width={40} height={25} className="opacity-30 hover:opacity-100 transition-opacity" />
              <Image src="https://placehold.co/40x25/transparent/white?text=MC&font=roboto" unoptimized={true} alt="Mastercard" width={40} height={25} className="opacity-30 hover:opacity-100 transition-opacity" />
              <Image src="https://placehold.co/40x25/transparent/white?text=UPI&font=roboto" unoptimized={true} alt="UPI" width={40} height={25} className="opacity-30 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A68042]/20 to-transparent" />
    </footer>
  );
}
