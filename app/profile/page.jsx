"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { getFullProfile, updateProfile as updateProfileApi } from "../../lib/api";
import api from "../../lib/api";
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
  X,
  Pencil,
  Mail,
  Phone,
  Check,
  Loader2
} from "lucide-react";
import Footer from "../../components/Footer";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();

  // Edit Profile State
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");
  const [profileData, setProfileData] = useState({ username: "", email: "", phone: "" });
  const [originalData, setOriginalData] = useState({ username: "", email: "", phone: "" });

  // OTP verification state
  const [emailOtpStep, setEmailOtpStep] = useState("idle"); // idle | sent | verified
  const [phoneOtpStep, setPhoneOtpStep] = useState("idle"); // idle | sent | verified
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneSessionToken, setPhoneSessionToken] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    router.push("/login");
  };

  const openEditModal = async () => {
    setEditError("");
    setEditSuccess("");
    setEmailOtpStep("idle");
    setPhoneOtpStep("idle");
    setEmailOtp("");
    setPhoneOtp("");
    setPhoneSessionToken("");

    try {
      setEditLoading(true);
      const res = await getFullProfile();
      const data = res.data;
      const p = {
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || ""
      };
      setProfileData(p);
      setOriginalData(p);
      setShowEditModal(true);
    } catch (err) {
      setEditError("Failed to load profile data");
    } finally {
      setEditLoading(false);
    }
  };

  const emailChanged = profileData.email !== originalData.email;
  const phoneChanged = profileData.phone !== originalData.phone;

  // Send Email OTP
  const handleSendEmailOtp = async () => {
    if (!profileData.email || !emailChanged) return;
    setOtpLoading(true);
    setEditError("");
    try {
      await api.post("/auth/request-email-otp", { email: profileData.email, context: "update" });
      setEmailOtpStep("sent");
    } catch (err) {
      setEditError(err.response?.data?.message || err.response?.data?.error || "Failed to send email OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify Email OTP
  const handleVerifyEmailOtp = async () => {
    if (!emailOtp) return;
    setOtpLoading(true);
    setEditError("");
    try {
      await api.post("/auth/verify-email-otp", { email: profileData.email, otp: emailOtp });
      setEmailOtpStep("verified");
    } catch (err) {
      const msg = err.response?.data?.msg;
      if (msg === "expired") setEditError("Email OTP expired. Please request a new one.");
      else if (msg === "invalid") setEditError("Invalid OTP. Please try again.");
      else setEditError("Email OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  // Send Phone OTP
  const handleSendPhoneOtp = async () => {
    if (!profileData.phone || !phoneChanged) return;
    if (profileData.phone.length !== 10) {
      setEditError("Enter a valid 10-digit phone number");
      return;
    }
    setOtpLoading(true);
    setEditError("");
    try {
      const res = await api.post("/auth/request-phone-otp", { phone: profileData.phone });
      setPhoneSessionToken(res.data.sessionToken);
      setPhoneOtpStep("sent");
    } catch (err) {
      setEditError(err.response?.data?.error || "Failed to send phone OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify Phone OTP
  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp) return;
    setOtpLoading(true);
    setEditError("");
    try {
      await api.post("/auth/verify-phone-otp", { phone: profileData.phone, otp: phoneOtp, sessionToken: phoneSessionToken });
      setPhoneOtpStep("verified");
    } catch (err) {
      const msg = err.response?.data?.msg;
      if (msg === "expired") setEditError("Phone OTP expired. Please request a new one.");
      else if (msg === "invalid") setEditError("Invalid OTP. Please try again.");
      else setEditError("Phone OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  // Save Profile
  const handleSaveProfile = async () => {
    setEditError("");
    setEditSuccess("");

    // Validate: if email changed, must be verified
    if (emailChanged && emailOtpStep !== "verified") {
      setEditError("Please verify your new email address before saving.");
      return;
    }
    // Validate: if phone changed, must be verified
    if (phoneChanged && phoneOtpStep !== "verified") {
      setEditError("Please verify your new phone number before saving.");
      return;
    }

    setEditLoading(true);
    try {
      const payload = {};
      if (profileData.username !== originalData.username) payload.username = profileData.username;
      if (emailChanged) payload.email = profileData.email;
      if (phoneChanged) payload.phone = profileData.phone;

      if (Object.keys(payload).length === 0) {
        setEditError("No changes to save.");
        setEditLoading(false);
        return;
      }

      const res = await updateProfileApi(payload);
      const updatedUser = res.data.user;

      // Update local auth state
      updateUser({
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone
      });

      setEditSuccess("Profile updated successfully!");
      setOriginalData({
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone || ""
      });

      // Reset OTP steps
      setEmailOtpStep("idle");
      setPhoneOtpStep("idle");
      setEmailOtp("");
      setPhoneOtp("");

      // Close after short delay
      setTimeout(() => {
        setShowEditModal(false);
        setEditSuccess("");
      }, 1500);
    } catch (err) {
      setEditError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  };

  // Can user save? All required verifications done
  const canSave =
    profileData.username &&
    (!emailChanged || emailOtpStep === "verified") &&
    (!phoneChanged || phoneOtpStep === "verified");

  useEffect(() => {
    if (showLogoutModal || showEditModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showLogoutModal, showEditModal]);

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
      title: "Contact Support",
      description: "Reach out to our heritage concierge team.",
      link: "/contact",
      label: "Get in Touch"
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
              <button
                onClick={openEditModal}
                className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 text-white text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-2"
              >
                <Pencil size={14} />
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-md transition-all duration-500"
            onClick={() => setShowEditModal(false)}
          />
          <div className="relative bg-white w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Top accent line */}
            <div className="h-1.5 w-full bg-[#A68042]" />

            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-heading uppercase tracking-widest text-zinc-900">
                  Edit Profile
                </h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-zinc-300 hover:text-zinc-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {editError && (
                <div className="bg-red-50 border-l-2 border-red-500 p-4 mb-6 animate-in fade-in duration-300">
                  <p className="text-red-800 text-xs font-medium uppercase tracking-widest">{editError}</p>
                </div>
              )}
              {editSuccess && (
                <div className="bg-green-50 border-l-2 border-green-500 p-4 mb-6 animate-in fade-in duration-300 flex items-center gap-2">
                  <Check size={16} className="text-green-600" />
                  <p className="text-green-800 text-xs font-medium uppercase tracking-widest">{editSuccess}</p>
                </div>
              )}

              <div className="space-y-8">
                {/* Username Field */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black mb-2 block">
                    <User size={12} className="inline mr-2" />Username
                  </label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full border-b-2 border-zinc-100 focus:border-[#A68042] bg-transparent py-3 text-zinc-900 font-bold focus:outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>

                {/* Email Field with OTP */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black mb-2 block">
                    <Mail size={12} className="inline mr-2" />Email Address
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => {
                        setProfileData(prev => ({ ...prev, email: e.target.value }));
                        setEmailOtpStep("idle");
                        setEmailOtp("");
                      }}
                      className="flex-1 border-b-2 border-zinc-100 focus:border-[#A68042] bg-transparent py-3 text-zinc-900 font-bold focus:outline-none transition-all"
                      placeholder="your@email.com"
                    />
                    {emailChanged && emailOtpStep === "idle" && (
                      <button
                        onClick={handleSendEmailOtp}
                        disabled={otpLoading}
                        className="text-[9px] uppercase tracking-widest font-bold bg-[#A68042] text-white px-4 py-2.5 hover:bg-[#8e6b36] transition-all disabled:opacity-50 flex-shrink-0"
                      >
                        {otpLoading ? "..." : "Verify"}
                      </button>
                    )}
                    {emailOtpStep === "verified" && (
                      <div className="flex items-center gap-1 text-green-600 flex-shrink-0">
                        <Check size={16} />
                        <span className="text-[9px] uppercase tracking-widest font-bold">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Email OTP Input */}
                  {emailChanged && emailOtpStep === "sent" && (
                    <div className="mt-4 p-4 bg-zinc-50 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-3">OTP sent to {profileData.email}</p>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                          maxLength="6"
                          placeholder="Enter 6-digit OTP"
                          className="flex-1 border-b-2 border-zinc-200 focus:border-[#A68042] bg-transparent py-2 text-center tracking-[0.5em] font-bold text-zinc-900 focus:outline-none transition-all"
                        />
                        <button
                          onClick={handleVerifyEmailOtp}
                          disabled={otpLoading || emailOtp.length < 6}
                          className="text-[9px] uppercase tracking-widest font-bold bg-zinc-900 text-white px-4 py-2.5 hover:bg-[#A68042] transition-all disabled:opacity-50"
                        >
                          {otpLoading ? <Loader2 size={14} className="animate-spin" /> : "Confirm"}
                        </button>
                      </div>
                      <button
                        onClick={handleSendEmailOtp}
                        disabled={otpLoading}
                        className="mt-2 text-[9px] uppercase tracking-widest text-zinc-400 hover:text-zinc-700 font-bold transition-all"
                      >
                        Resend OTP
                      </button>
                    </div>
                  )}
                </div>

                {/* Phone Field with OTP */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black mb-2 block">
                    <Phone size={12} className="inline mr-2" />Phone Number
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 font-medium py-3">+91</span>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => {
                        setProfileData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, "") }));
                        setPhoneOtpStep("idle");
                        setPhoneOtp("");
                      }}
                      maxLength="10"
                      className="flex-1 border-b-2 border-zinc-100 focus:border-[#A68042] bg-transparent py-3 text-zinc-900 font-bold tracking-widest focus:outline-none transition-all"
                      placeholder="1234567890"
                    />
                    {phoneChanged && phoneOtpStep === "idle" && (
                      <button
                        onClick={handleSendPhoneOtp}
                        disabled={otpLoading}
                        className="text-[9px] uppercase tracking-widest font-bold bg-[#A68042] text-white px-4 py-2.5 hover:bg-[#8e6b36] transition-all disabled:opacity-50 flex-shrink-0"
                      >
                        {otpLoading ? "..." : "Verify"}
                      </button>
                    )}
                    {phoneOtpStep === "verified" && (
                      <div className="flex items-center gap-1 text-green-600 flex-shrink-0">
                        <Check size={16} />
                        <span className="text-[9px] uppercase tracking-widest font-bold">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Phone OTP Input */}
                  {phoneChanged && phoneOtpStep === "sent" && (
                    <div className="mt-4 p-4 bg-zinc-50 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-3">OTP sent to +91 {profileData.phone} via SMS</p>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ""))}
                          maxLength="4"
                          placeholder="Enter 4-digit OTP"
                          className="flex-1 border-b-2 border-zinc-200 focus:border-[#A68042] bg-transparent py-2 text-center tracking-[0.5em] font-bold text-zinc-900 focus:outline-none transition-all"
                        />
                        <button
                          onClick={handleVerifyPhoneOtp}
                          disabled={otpLoading || phoneOtp.length < 4}
                          className="text-[9px] uppercase tracking-widest font-bold bg-zinc-900 text-white px-4 py-2.5 hover:bg-[#A68042] transition-all disabled:opacity-50"
                        >
                          {otpLoading ? <Loader2 size={14} className="animate-spin" /> : "Confirm"}
                        </button>
                      </div>
                      <button
                        onClick={handleSendPhoneOtp}
                        disabled={otpLoading}
                        className="mt-2 text-[9px] uppercase tracking-widest text-zinc-400 hover:text-zinc-700 font-bold transition-all"
                      >
                        Resend OTP
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400 hover:text-zinc-900 transition-all border border-zinc-100 hover:border-zinc-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={!canSave || editLoading}
                  className="flex-1 bg-zinc-900 text-white px-8 py-4 text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-[#A68042] transition-all shadow-xl shadow-zinc-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {editLoading ? (
                    <><Loader2 size={14} className="animate-spin" /> Saving...</>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
