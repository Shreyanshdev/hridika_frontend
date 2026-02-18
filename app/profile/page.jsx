"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  ShoppingBag,
  Gift,
  MapPin,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Star,
  ShieldCheck,
  Clock,
  X
} from "lucide-react";
import Footer from "../../components/Footer";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const router = useRouter();

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    router.push("/login");
  };

  React.useEffect(() => {
    if (showLogoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showLogoutModal]);

  if (!user) {
    if (typeof window !== "undefined") {
      router.push("/login");
    }
    return null;
  }

  const dashboardItems = [
    {
      icon: ShoppingBag,
      title: "Your Acquisitions",
      description: "View and track your previous jewelry selections.",
      link: "/orders",
      label: "View Orders"
    },
    {
      icon: Gift,
      title: "Bespoke Journey",
      description: "Initiate or continue your custom design journey.",
      link: "/bespoke",
      label: "Explore Custom"
    },
    {
      icon: MapPin,
      title: "Private Addresses",
      description: "Manage your collection of delivery locations.",
      link: "/profile/addresses",
      label: "Configure"
    },
    {
      icon: Star,
      title: "Curated Wishlist",
      description: "A private gallery of pieces you desire.",
      link: "/wishlist",
      label: "View Gallery"
    }
  ];

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-2 pb-32">

        {/* Profile Header Block */}
        <div className="relative mb-24 overflow-hidden bg-zinc-900 p-12 lg:p-20 group">
          <div className="absolute top-0 right-0 w-1/3 h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-l from-zinc-900 to-transparent z-10" />
            <Image
              src="/assets/unsplash/jewel-craft-1.jpg"
              alt="Background"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-[5s]"
            />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end gap-12">
            <div className="relative">
              <div className="w-40 h-40 bg-zinc-800 border-2 border-[#A68042] flex items-center justify-center overflow-hidden">
                <User size={80} className="text-zinc-700" strokeWidth={0.5} />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#A68042] p-3 shadow-2xl">
                <ShieldCheck size={24} className="text-white" />
              </div>
            </div>

            <div className="text-center lg:text-left space-y-4">
              <div>
                <span className="text-[#A68042] text-[10px] uppercase tracking-[0.4em] font-bold mb-2 block">Collector Status: Elite</span>
                <h1 className="text-5xl font-heading text-white uppercase tracking-widest">{user.username || "Valued Customer"}</h1>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                <div className="text-zinc-500 flex items-center gap-2">
                  <Clock size={14} className="text-[#A68042]" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Member Since {new Date(user.created_at || Date.now()).getFullYear()}</span>
                </div>
                <div className="text-zinc-500 flex items-center gap-2">
                  <CreditCard size={14} className="text-[#A68042]" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="lg:ml-auto flex gap-4">
              <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 text-white text-[10px] uppercase tracking-widest font-bold transition-all">
                Edit Profile
              </button>
              <button
                onClick={handleLogoutClick}
                className="bg-[#A68042] text-white px-8 py-4 text-[10px] uppercase tracking-widest font-bold hover:bg-[#8e6b36] transition-all flex items-center gap-2"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {dashboardItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className="group bg-zinc-50 p-10 hover:bg-white border border-transparent hover:border-zinc-100 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="w-12 h-12 bg-white flex items-center justify-center text-zinc-400 group-hover:text-[#A68042] group-hover:scale-110 transition-all mb-8 shadow-sm">
                <item.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-sm font-heading uppercase tracking-widest text-zinc-900 mb-4">{item.title}</h3>
              <p className="text-zinc-400 text-xs italic leading-relaxed mb-10">{item.description}</p>
              <div className="flex items-center gap-2 text-[#A68042] text-[10px] uppercase tracking-widest font-bold border-b border-[#A68042] pb-1 w-fit">
                {item.label} <ChevronRight size={12} />
              </div>
            </Link>
          ))}
        </div>

        {/* Account Settings / Security Block */}
        <div className="mt-32 border-t border-zinc-100 pt-32">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/3">
              <span className="text-[#A68042] text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Security & Private</span>
              <h2 className="text-3xl font-heading text-zinc-900 uppercase tracking-widest leading-snug">Private Account <br /> Governance</h2>
              <p className="text-zinc-500 italic mt-6 leading-relaxed">
                Manage your authentication protocols and collection preferences to ensure a secure and personalized experience.
              </p>
            </div>
            <div className="flex-1 space-y-4">
              {[
                { title: "Password Protocol", meta: "Last updated 3 months ago" },
                { title: "Two-Factor Verification", meta: "Status: Highly Secure" },
                { title: "Communication Preferences", meta: "Concierge Email: Active" },
                { title: "Privacy & Data Access", meta: "Managed according to GDPR" }
              ].map((setting, idx) => (
                <div key={idx} className="flex items-center justify-between p-8 bg-zinc-50 hover:bg-zinc-100 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-6">
                    <div className="w-2 h-2 rounded-full bg-[#A68042] opacity-20 group-hover:opacity-100 transition-opacity" />
                    <div>
                      <h4 className="text-[11px] uppercase tracking-widest font-bold text-zinc-900">{setting.title}</h4>
                      <p className="text-[9px] text-zinc-400 italic mt-1">{setting.meta}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
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

      <Footer />
    </main>
  );
}
