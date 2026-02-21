"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  MessageCircle,
  Instagram,
  Phone,
  Mail,
  ChevronRight,
  Whatsapp 
} from "lucide-react";

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
    <footer className="bg-zinc-950 text-white pt-24 pb-8 font-body relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

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

            {/* Social Icons */}
            <div className="flex items-center gap-5 pt-4">

              {/* Facebook */}
              <Link
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center 
                hover:bg-[#1877F2] hover:border-[#1877F2] transition-all duration-300 group"
              >
                <Facebook size={16} className="text-zinc-400 group-hover:text-white" />
              </Link>

              {/* WhatsApp */}
              <Link
                href="https://wa.me/919876543210"
                title="WhatsApp Us"
                className="w-10 h-10 rounded-full border border-white/10 
                              flex items-center justify-center 
                              hover:bg-[#25D366] hover:border-[#25D366] 
                              transition-all duration-300 group"
                            >
                              <MessageCircle
                                size={16}
                  className="text-zinc-400 group-hover:text-white transition-colors"
                />
              </Link>

              {/* Instagram */}
              <Link
                href="#"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center 
                hover:border-transparent transition-all duration-300 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                <Instagram size={16} className="relative z-10 text-zinc-400 group-hover:text-white" />
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
                  <Link
                    href={link.href}
                    className="text-zinc-500 hover:text-white text-[13px] flex items-center gap-2 transition-colors uppercase tracking-widest group"
                  >
                    <ChevronRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-300 text-[#A68042]"
                    />
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
                  <Link
                    href={link.href}
                    className="text-zinc-500 hover:text-white text-[13px] flex items-center gap-2 transition-colors uppercase tracking-widest group"
                  >
                    <ChevronRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-300 text-[#A68042]"
                    />
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

              {/* Phone */}
              <div className="flex gap-4 group">
                <div className="w-10 h-10 rounded border border-white/5 flex items-center justify-center group-hover:bg-[#A68042]/10 transition-colors">
                  <Phone size={16} className="text-[#A68042]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">
                    Call Us
                  </p>
                  <a
                    href="tel:+919876543210"
                    className="text-zinc-300 hover:text-white text-[14px] transition-colors"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 group">
                <div className="w-10 h-10 rounded border border-white/5 flex items-center justify-center group-hover:bg-[#A68042]/10 transition-colors">
                  <Mail size={16} className="text-[#A68042]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">
                    Email Us
                  </p>
                  <a
                    href="mailto:hrdikajewels@gmail.com"
                    className="text-zinc-300 hover:text-white text-[14px] transition-colors"
                  >
                    hrdikajewels@gmail.com
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Bar - FIXED ALIGNMENT */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <p className="text-zinc-600 text-[11px] uppercase tracking-[0.2em] whitespace-nowrap">
            © 2026 Hridika Jewels, INC. All rights reserved.
          </p>

          <div className="flex items-center gap-8 flex-wrap md:flex-nowrap">
            <span className="text-zinc-600 text-[10px] uppercase tracking-widest cursor-pointer hover:text-white transition-colors whitespace-nowrap">
              Privacy Policy
            </span>
            <span className="text-zinc-600 text-[10px] uppercase tracking-widest cursor-pointer hover:text-white transition-colors whitespace-nowrap">
              Terms of Service
            </span>

            <div className="flex items-center gap-4 border-l border-white/10 pl-8 whitespace-nowrap">
              <Image src="https://placehold.co/40x25/transparent/white?text=VISA&font=roboto" alt="Visa" width={40} height={25} className="opacity-30 hover:opacity-100 transition-opacity" unoptimized />
              <Image src="https://placehold.co/40x25/transparent/white?text=MC&font=roboto" alt="Mastercard" width={40} height={25} className="opacity-30 hover:opacity-100 transition-opacity" unoptimized />
              <Image src="https://placehold.co/40x25/transparent/white?text=UPI&font=roboto" alt="UPI" width={40} height={25} className="opacity-30 hover:opacity-100 transition-opacity" unoptimized />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#A68042]/20 to-transparent" />
    </footer>
  );
}