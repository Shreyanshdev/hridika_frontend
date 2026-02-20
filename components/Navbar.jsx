"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  ShoppingBag,
  User,
  Facebook,
  MessageCircle,
  Instagram,
  Phone,
  LogOut,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

// Pages that have a hero/banner image behind the navbar
const HERO_PAGES = ["/", "/products", "/about", "/articles", "/bespoke"];

// Pages where navbar is completely hidden
const HIDDEN_NAVBAR_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

function isHeroPath(pathname) {
  if (HERO_PAGES.includes(pathname)) return true;
  if (pathname.startsWith("/category/")) return true;
  return false;
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const { cartCount } = useCart();
  const pathname = usePathname();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isHeroPage = isHeroPath(pathname);
  const isHidden = HIDDEN_NAVBAR_PAGES.includes(pathname) || pathname.startsWith("/admin");

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setMobileMenuOpen(false); // Close mobile drawer if open
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setWishlistCount(wishlist.length);
  }, [wishlist]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen || showLogoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen, showLogoutModal]);

  // Hide navbar on auth pages (after all hooks)
  if (isHidden) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "All Products", href: "/products" },
    { name: "Articles", href: "/articles" },
    { name: "Bespoke Customisation", href: "/bespoke" }
  ];

  // Determine text/icon colors based on page type and scroll state
  const isTransparent = isHeroPage && !isScrolled;
  const textColor = isTransparent ? "text-white/80" : "text-zinc-400";
  const hoverTextColor = isTransparent ? "hover:text-white" : "hover:text-black";
  const navTextColor = isTransparent ? "text-white/90" : "text-zinc-600";
  const navActiveColor = isTransparent ? "text-white font-semibold" : "text-black font-semibold";
  const iconColor = isTransparent ? "text-white" : "text-zinc-800";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 font-body ${isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-1"
          : isHeroPage
            ? "bg-transparent"
            : "bg-white"
          }`}
      >
        {/* Top Bar */}
        <div
          className={`w-full px-4 md:px-8 transition-all duration-500 overflow-hidden ${isScrolled
            ? "max-h-0 py-0 opacity-0"
            : "max-h-20 py-2.5 opacity-100"
            } ${isTransparent ? "border-b border-white/10" : "bg-zinc-50 border-b border-zinc-100"}`}
        >
          <div
            className={`max-w-7xl mx-auto flex justify-between items-center text-[10px] tracking-[0.15em] uppercase font-medium ${textColor}`}
          >
            <div className="flex items-center gap-6">
              <div className={`flex items-center gap-2 ${hoverTextColor} transition-colors`}>
                <Phone size={11} className={isTransparent ? "text-white/40" : "text-zinc-300"} />
                <span>+91 98765 43210</span>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className={`hidden md:flex items-center gap-5 border-r pr-8 ${isTransparent ? "border-white/20" : "border-zinc-200"}`}>
                <Link href="#" className={`${hoverTextColor} transition-all hover:scale-110`}><Facebook size={12} /></Link>
                <Link href="https://wa.me/919876543210" className={`flex items-center gap-1 ${hoverTextColor} transition-all hover:scale-105`}>
                  <MessageCircle size={12} />
                  <span>+91 98765 43210</span>
                </Link>
                <Link href="#" className={`${hoverTextColor} transition-all hover:scale-110`}><Instagram size={12} /></Link>
              </div>

              <div className="flex items-center gap-6">
                {user ? (
                  <div className="flex items-center gap-5">
                    <Link href="/profile" title="My Profile" className={`flex items-center gap-2 ${hoverTextColor} transition-colors`}>
                      <User size={13} />
                      <span className="hidden sm:inline">My Account</span>
                    </Link>
                    <button onClick={handleLogoutClick} title="Logout" className={`flex items-center gap-1 ${hoverTextColor} transition-colors`}>
                      <LogOut size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/login" className={`${hoverTextColor} transition-colors`}>Login</Link>
                    <span className={isTransparent ? "text-white/20" : "text-zinc-200"}>/</span>
                    <Link href="/register" className={`${hoverTextColor} transition-colors`}>Register</Link>
                  </div>
                )}

                <div className={`hidden sm:block pl-6 border-l ${isTransparent ? "border-white/20" : "border-zinc-200"}`}>
                  <span>₹ INR</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className={`w-full px-4 md:px-8 transition-all duration-500 ${isScrolled ? "py-2" : "py-5"}`}>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 transition-transform duration-500 hover:opacity-80">
              <Image
                src="/assets/logo.png"
                alt="Hridika Logo"
                width={180}
                height={72}
                priority
                className={`w-auto object-contain transition-all duration-500 ${isTransparent ? "brightness-0 invert" : ""
                  } ${isScrolled ? "h-10 md:h-12" : "h-14 md:h-20"}`}
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link text-[14px] tracking-[0.2em] uppercase ${pathname === link.href ? navActiveColor : navTextColor
                    } ${hoverTextColor}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Icons + Hamburger */}
            <div className="flex items-center gap-6 md:gap-8">
              <Link href="/wishlist" className={`relative group ${iconColor} hover:text-[#A68042] transition-all hover:scale-110`}>
                <Heart size={22} strokeWidth={1.2} className={`${wishlistCount > 0 ? "fill-[#A68042] text-[#A68042]" : ""} transition-transform`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#A68042] text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow-sm animate-in zoom-in duration-300">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link href="/cart" className={`relative group ${iconColor} hover:text-[#A68042] transition-all hover:scale-110`}>
                <ShoppingBag size={22} strokeWidth={1.2} className="transition-transform" />
                <span className="absolute -top-1.5 -right-2.5 bg-black text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {cartCount}
                </span>
              </Link>

              {/* Hamburger - mobile/tablet only */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`lg:hidden ${iconColor} hover:opacity-70 transition-opacity`}
                aria-label="Open menu"
              >
                <Menu size={26} strokeWidth={1.4} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-[320px] max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-400 ease-out lg:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-zinc-100">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <Image
              src="/logo/logohridika.png"
              alt="Hridika Logo"
              width={120}
              height={48}
              className="h-10 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-zinc-500 hover:text-black transition-colors"
            aria-label="Close menu"
          >
            <X size={24} strokeWidth={1.4} />
          </button>
        </div>

        {/* Drawer Navigation */}
        <div className="px-6 py-8 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-3.5 text-[13px] uppercase tracking-[0.2em] border-b border-zinc-50 transition-colors ${pathname === link.href
                ? "text-[#A68042] font-semibold"
                : "text-zinc-600 hover:text-[#A68042]"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Drawer Auth & Info */}
        <div className="px-6 pt-4 space-y-6">
          {user ? (
            <div className="space-y-3">
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-zinc-600 hover:text-[#A68042] transition-colors text-[12px] uppercase tracking-[0.2em]"
              >
                <User size={16} strokeWidth={1.4} />
                My Account
              </Link>
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-3 text-zinc-400 hover:text-red-500 transition-colors text-[12px] uppercase tracking-[0.2em]"
              >
                <LogOut size={16} strokeWidth={1.4} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-3 bg-zinc-900 text-white text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#A68042] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-3 border border-zinc-300 text-zinc-700 text-[11px] uppercase tracking-[0.2em] font-semibold hover:border-[#A68042] hover:text-[#A68042] transition-colors"
              >
                Register
              </Link>
            </div>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-5 pt-4 border-t border-zinc-100">
            <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-300 mr-2">Follow</span>
            <Link href="#" className="text-zinc-400 hover:text-[#A68042] transition-colors"><Facebook size={16} /></Link>
            <Link href="https://wa.me/919876543210" className="flex items-center gap-1 text-zinc-400 hover:text-[#A68042] transition-colors">
              <MessageCircle size={16} />
              <span className="text-[10px]">+91 98765 43210</span>
            </Link>
            <Link href="#" className="text-zinc-400 hover:text-[#A68042] transition-colors"><Instagram size={16} /></Link>
          </div>

          <div className="flex items-center gap-2 text-zinc-400 text-[10px] tracking-[0.15em] uppercase">
            <Phone size={11} />
            <span>+91 98765 43210</span>
          </div>
        </div>
      </div>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md transition-all duration-500"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-white w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden">
            {/* Top accent line */}
            <div className="h-1.5 w-full bg-[#A68042]" />

            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut size={24} className="text-[#A68042]" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-heading uppercase tracking-widest text-zinc-900 mb-4">
                Confirm Departure
              </h3>

              <p className="text-zinc-500 italic mb-10 text-sm leading-relaxed">
                Are you sure you wish to conclude your current session with Hridika?
                Your curated selections and wishlist will remain safe for your return.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400 hover:text-zinc-900 transition-all border border-zinc-100 hover:border-zinc-200"
                >
                  Stay
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 bg-zinc-900 text-white px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#A68042] transition-all shadow-xl shadow-zinc-200"
                >
                  Logout
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-4 right-4 text-zinc-300 hover:text-zinc-900 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
