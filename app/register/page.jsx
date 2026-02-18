"use client";
/**
 * GOOGLE REDIRECT URI CONFIGURATION:
 * Ensure your Google Cloud Console Credentials > OAuth 2.0 Client IDs
 * has the following "Authorized JavaScript origins":
 * 1. http://localhost:3000
 * 2. http://localhost
 * 
 * No specific "Redirect URI" is needed for the GSIV2 popup flow, 
 * but Origins must match exactly.
 */

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Lock, Phone, ArrowRight, ChevronRight, ShieldCheck, Pencil, CheckCircle2, AlertCircle, X } from "lucide-react";
import LoginGoogleButton from "../../components/LoginGoogleButton";

// ─── Toast Component ───────────────────────────────────────────
function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-zinc-900",
  };
  const icons = {
    success: <CheckCircle2 size={16} />,
    error: <AlertCircle size={16} />,
    info: <Mail size={16} />,
  };

  return (
    <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-lg shadow-2xl text-white text-sm font-medium animate-in fade-in slide-in-from-top-3 duration-300 ${colors[type]}`}>
      {icons[type]}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity"><X size={14} /></button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Verification States
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneSessionToken, setPhoneSessionToken] = useState("");
  const [emailTimer, setEmailTimer] = useState(0);
  const [phoneTimer, setPhoneTimer] = useState(0);

  // Toast State
  const [toast, setToast] = useState(null);
  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
  }, []);

  const { register, requestEmailVerify, confirmEmailVerify, requestPhoneVerify, confirmPhoneVerify, verifyWithGoogle } = useAuth();
  const router = useRouter();

  // Timer Effects
  useEffect(() => {
    let interval;
    if (emailTimer > 0) {
      interval = setInterval(() => setEmailTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [emailTimer]);

  useEffect(() => {
    let interval;
    if (phoneTimer > 0) {
      interval = setInterval(() => setPhoneTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [phoneTimer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ─── Email Verification ──────────────────────────────────────
  const handleRequestEmailOtp = async () => {
    if (!formData.email) return setError("Please enter email first");
    setError("");
    try {
      await requestEmailVerify(formData.email);
      setShowEmailOtp(true);
      setEmailTimer(60);
      showToast(`OTP sent to ${formData.email}`, "success");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Email already registered. Please login.");
        showToast("Email already registered", "error");
      } else {
        setError(err.response?.data?.message || "Failed to send Email OTP");
        showToast("Failed to send OTP", "error");
      }
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp) return setError("Please enter OTP");
    try {
      await confirmEmailVerify(formData.email, emailOtp);
      setEmailVerified(true);
      setShowEmailOtp(false);
      setError("");
      showToast("Email verified successfully ✓", "success");
    } catch (err) {
      setError("Invalid Email OTP");
      showToast("Invalid OTP. Please try again.", "error");
    }
  };

  const handleEditEmail = () => {
    setShowEmailOtp(false);
    setEmailOtp("");
    setEmailTimer(0);
  };

  // ─── Phone Verification ──────────────────────────────────────
  const handleRequestPhoneOtp = async () => {
    if (!formData.phone) return setError("Please enter phone first");
    setError("");
    try {
      const res = await requestPhoneVerify(formData.phone);
      if (res.data.sessionToken) setPhoneSessionToken(res.data.sessionToken);
      setShowPhoneOtp(true);
      setPhoneTimer(60);
      showToast(`OTP sent to +91 ${formData.phone}`, "success");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send Phone OTP");
      showToast("Failed to send OTP", "error");
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!phoneOtp) return setError("Please enter OTP");
    try {
      await confirmPhoneVerify(formData.phone, phoneOtp, phoneSessionToken);
      setPhoneVerified(true);
      setShowPhoneOtp(false);
      setError("");
      showToast("Phone verified successfully ✓", "success");
    } catch (err) {
      setError("Invalid Phone OTP");
      showToast("Invalid OTP. Please try again.", "error");
    }
  };

  const handleEditPhone = () => {
    setShowPhoneOtp(false);
    setPhoneOtp("");
    setPhoneTimer(0);
  };

  // ─── Registration ─────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!emailVerified || !phoneVerified) {
      setError("Please verify both Email and Phone to proceed.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const user = await register(
        formData.username,
        formData.email,
        formData.password,
        formData.phone
      );

      showToast("Account created successfully!", "success");

      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/products-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
      showToast("Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Right Side - Image & Branding */}
      <div className="hidden lg:flex relative bg-zinc-900 items-center justify-center overflow-hidden order-2">
        <div
          className="absolute inset-0 opacity-60 scale-110"
          style={{
            backgroundImage: "url('/assets/Intro.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />

        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
            <ShieldCheck className="text-[#A68042] w-10 h-10" />
          </div>
          <h2 className="text-white text-5xl font-heading mb-6 tracking-widest uppercase">
            Join The <br /> <span className="text-[#A68042] italic normal-case tracking-normal">Inner Circle</span>
          </h2>
          <p className="text-white/70 text-lg uppercase tracking-[0.3em] font-light max-w-sm mx-auto border-t border-white/20 pt-6">
            Unlock Exclusive Access <br /> to Our Finest Pieces.
          </p>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 relative overflow-hidden order-1">
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-zinc-50 rounded-full blur-3xl opacity-50" />

        <div className="max-w-md w-full mx-auto relative z-10">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/50 hover:backdrop-blur-md px-4 py-2 rounded-full -ml-4 transition-all duration-300 mb-8 group cursor-pointer">
              <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Back to Home</span>
            </Link>
            <h1 className="text-4xl font-heading mb-4 uppercase tracking-widest text-zinc-900">Create Account</h1>
            <p className="text-zinc-500 italic">Embark on a journey of timeless luxury and exceptional craftsmanship.</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-2 border-red-500 p-4 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-red-800 text-xs font-medium uppercase tracking-widest">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-8">
            {/* 1. Name */}
            <div className="group animate-in fade-in slide-in-from-left-1 duration-500">
              <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black mb-2 block group-focus-within:text-[#A68042] transition-colors">Full Identity</label>
              <div className="flex items-center border-b-2 border-zinc-100 group-focus-within:border-[#A68042] transition-all pb-2">
                <input
                  type="text"
                  name="username"
                  placeholder="Display name"
                  className="flex-1 bg-transparent focus:outline-none text-zinc-800"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                <User size={18} className="text-zinc-200" />
              </div>
            </div>

            {/* ── 2. Email Verification ──────────────────────────── */}
            <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-500 delay-100">
              <div className="group">
                <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black mb-2 block group-focus-within:text-[#A68042] transition-colors flex justify-between">
                  Email Address
                  {emailVerified && <span className="text-green-600 flex items-center gap-1"><ShieldCheck size={12} /> Verified</span>}
                </label>
                <div className="flex items-end gap-3">
                  <div className={`flex-1 flex items-center border-b-2 transition-all pb-2 ${error.includes("Email already registered") ? "border-red-500" :
                    emailVerified ? "border-green-500" :
                      "border-zinc-100 group-focus-within:border-[#A68042]"
                    }`}>
                    <input
                      type="email"
                      name="email"
                      placeholder="preferred@email.com"
                      className="flex-1 bg-transparent focus:outline-none text-zinc-900 font-bold disabled:opacity-50"
                      value={formData.email}
                      onChange={(e) => {
                        handleChange(e);
                        if (error.includes("Email")) setError("");
                      }}
                      required
                      disabled={emailVerified || showEmailOtp}
                    />
                    <Mail size={18} className={emailVerified ? "text-green-500" : "text-zinc-200"} />
                  </div>

                  {/* Send OTP Button */}
                  {!emailVerified && !showEmailOtp && (
                    <button
                      type="button"
                      onClick={handleRequestEmailOtp}
                      disabled={!formData.email || !/\S+@\S+\.\S+/.test(formData.email)}
                      className={`px-4 py-2 text-[10px] uppercase font-bold tracking-wider transition-all duration-300 rounded-sm
                        ${(!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
                          ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                          : "bg-zinc-900 text-white hover:bg-[#A68042] shadow-md transform hover:-translate-y-0.5"}`}
                    >
                      Send OTP
                    </button>
                  )}

                  {/* Edit Button (when OTP is shown) */}
                  {showEmailOtp && !emailVerified && (
                    <button
                      type="button"
                      onClick={handleEditEmail}
                      className="flex items-center gap-1 px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-zinc-500 hover:text-[#A68042] transition-colors"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Email OTP Input */}
              {showEmailOtp && !emailVerified && (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 bg-zinc-50/50 p-4 border border-zinc-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Enter 6-digit Email OTP"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full bg-white px-4 py-3 text-lg border border-zinc-200 focus:border-[#A68042] focus:ring-1 focus:ring-[#A68042] focus:outline-none tracking-[0.5em] text-center font-bold text-zinc-800 rounded-md placeholder:tracking-normal placeholder:text-sm placeholder:font-normal"
                        maxLength="6"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyEmailOtp}
                      disabled={emailOtp.length !== 6}
                      className={`px-6 py-3 text-[10px] uppercase font-bold tracking-wider transition-all duration-300 rounded-md
                        ${emailOtp.length === 6
                          ? 'bg-[#A68042] text-white hover:bg-zinc-900 shadow-md transform hover:-translate-y-0.5'
                          : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                        }`}
                    >
                      Verify
                    </button>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <p className="text-[10px] text-zinc-400">
                      Sent to {formData.email}
                    </p>
                    {emailTimer > 0 ? (
                      <span className="text-[10px] text-zinc-400 font-medium">Resend in {emailTimer}s</span>
                    ) : (
                      <button onClick={handleRequestEmailOtp} type="button" className="text-[10px] text-[#A68042] font-bold hover:underline">
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Google Verify Option */}
              {!emailVerified && !showEmailOtp && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px bg-zinc-100 flex-1" />
                    <span className="text-[9px] uppercase tracking-widest text-zinc-300">OR</span>
                    <div className="h-px bg-zinc-100 flex-1" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold text-center mb-3">Verify Email via Google</p>
                  <LoginGoogleButton
                    text="continue_with"
                    onSuccess={async (credentialResponse) => {
                      try {
                        const data = await verifyWithGoogle(credentialResponse.credential);
                        if (data.email_verified) {
                          setEmailVerified(true);
                          setFormData(prev => ({ ...prev, email: data.email, username: data.name || prev.username }));
                          setError("");
                          showToast(`Email verified via Google ✓`, "success");
                        }
                      } catch (err) {
                        setError("Google Verification Failed");
                        showToast("Google verification failed", "error");
                      }
                    }}
                  />
                </div>
              )}
            </div>

            {/* ── 3. Phone Verification ─────────────────────────── */}
            <div className="space-y-4 animate-in fade-in slide-in-from-left-3 duration-500 delay-200">
              <div className="group">
                <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black mb-2 block group-focus-within:text-[#A68042] transition-colors flex justify-between">
                  Phone Number
                  {phoneVerified && <span className="text-green-600 flex items-center gap-1"><ShieldCheck size={12} /> Verified</span>}
                </label>
                <div className="flex items-end gap-3">
                  <div className={`flex-1 flex items-center border-b-2 transition-all pb-2 ${phoneVerified ? "border-green-500" :
                    "border-zinc-100 group-focus-within:border-[#A68042]"
                    }`}>
                    <span className="text-zinc-400 mr-2 font-medium text-sm">+91</span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="9876543210"
                      className="flex-1 bg-transparent focus:outline-none text-zinc-900 disabled:opacity-50 tracking-widest font-bold"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      required
                      disabled={phoneVerified || showPhoneOtp}
                      maxLength="10"
                    />
                    <Phone size={18} className={phoneVerified ? "text-green-500" : "text-zinc-200"} />
                  </div>

                  {/* Send OTP Button */}
                  {!phoneVerified && !showPhoneOtp && (
                    <button
                      type="button"
                      onClick={handleRequestPhoneOtp}
                      disabled={formData.phone.length !== 10}
                      className={`px-6 py-2 text-[10px] uppercase font-bold tracking-wider transition-all duration-300 rounded-sm shadow-sm
                        ${formData.phone.length === 10
                          ? 'bg-zinc-900 text-white hover:bg-[#A68042] hover:shadow-md cursor-pointer'
                          : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                        }`}
                    >
                      Send OTP
                    </button>
                  )}

                  {/* Edit Button (when OTP is shown) */}
                  {showPhoneOtp && !phoneVerified && (
                    <button
                      type="button"
                      onClick={handleEditPhone}
                      className="flex items-center gap-1 px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-zinc-500 hover:text-[#A68042] transition-colors"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Phone OTP Input */}
              {showPhoneOtp && !phoneVerified && (
                <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 bg-zinc-50/50 p-4 border border-zinc-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Enter 4-digit Code"
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full bg-white px-4 py-3 text-lg border border-zinc-200 focus:border-[#A68042] focus:ring-1 focus:ring-[#A68042] focus:outline-none tracking-[0.5em] text-center font-bold text-zinc-800 rounded-md placeholder:tracking-normal placeholder:text-sm placeholder:font-normal"
                        maxLength="4"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyPhoneOtp}
                      disabled={phoneOtp.length !== 4}
                      className={`px-6 py-3 text-[10px] uppercase font-bold tracking-wider transition-all duration-300 rounded-md
                        ${phoneOtp.length === 4
                          ? 'bg-[#A68042] text-white hover:bg-zinc-900 shadow-md transform hover:-translate-y-0.5'
                          : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                        }`}
                    >
                      Verify
                    </button>
                  </div>
                  <div className="flex justify-between items-center px-1">
                    <p className="text-[10px] text-zinc-400">
                      Code sent to +91 {formData.phone}
                    </p>
                    {phoneTimer > 0 ? (
                      <span className="text-[10px] text-zinc-400 font-medium">Resend in {phoneTimer}s</span>
                    ) : (
                      <button onClick={handleRequestPhoneOtp} type="button" className="text-[10px] text-[#A68042] font-bold hover:underline">
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Password & Register */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
              <div className="group">
                <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black mb-2 block group-focus-within:text-[#A68042] transition-colors">Password</label>
                <div className="flex items-center border-b-2 border-zinc-100 group-focus-within:border-[#A68042] transition-all pb-2">
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="flex-1 bg-transparent focus:outline-none text-zinc-900 font-bold"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <Lock size={18} className="text-zinc-200" />
                </div>
              </div>
              <div className="group">
                <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black mb-2 block group-focus-within:text-[#A68042] transition-colors">Confirm</label>
                <div className="flex items-center border-b-2 border-zinc-100 group-focus-within:border-[#A68042] transition-all pb-2">
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter"
                    className="flex-1 bg-transparent focus:outline-none text-zinc-900 font-bold"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <ShieldCheck size={18} className="text-zinc-200" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !emailVerified || !phoneVerified}
              className="w-full bg-zinc-900 text-white py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-[#A68042] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3 shadow-xl shadow-zinc-200 animate-in fade-in slide-in-from-bottom-4 delay-500"
            >
              {loading ? "Creating Profile..." : (!emailVerified || !phoneVerified) ? "Verify Email & Phone to Join" : "Complete Registration"}
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-zinc-100 flex-1" />
            <span className="text-[10px] uppercase tracking-widest text-zinc-400">OR</span>
            <div className="h-px bg-zinc-100 flex-1" />
          </div>

          <div className="mt-12 text-center">
            <p className="text-zinc-400 text-xs mb-4 uppercase tracking-widest font-medium">Already have an account?</p>
            <Link
              href="/login"
              className="inline-block text-[11px] uppercase tracking-[0.3em] font-bold text-zinc-900 hover:text-[#A68042] transition-all"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>

        <div className="mt-auto pt-10 text-center">
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-300 font-bold">
            Hridika Jewels &copy; 2026. Handcrafted Excellence.
          </p>
        </div>
      </div>
    </main>
  );
}
