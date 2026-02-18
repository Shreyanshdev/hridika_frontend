"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mail, ShieldCheck, CheckCircle2, Lock, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState("email"); // email | otp | newPassword | success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgetpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Unable to send OTP");

      setStep("otp");
      setTimer(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP + Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-reset-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.msg === "expired") throw new Error("OTP has expired. Please request a new one.");
        if (data.msg === "invalid") throw new Error("Invalid OTP. Please try again.");
        throw new Error(data.msg || "Password reset failed");
      }

      setStep("success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgetpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to resend");
      setTimer(60);
      setOtp("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Success screen
  if (step === "success") {
    return (
      <main className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-6 text-center">
        <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-700">
          <CheckCircle2 size={64} className="text-[#A68042] mx-auto mb-8" strokeWidth={1} />
          <h1 className="text-4xl font-heading text-white uppercase tracking-widest leading-tight">
            Password <span className="italic normal-case tracking-normal border-b border-white/10">Restored</span>
          </h1>
          <p className="text-zinc-400 italic text-lg leading-relaxed">
            Your account security has been updated successfully. You can now sign in with your new password.
          </p>
          <div className="pt-12">
            <Link href="/login" className="inline-flex items-center gap-4 bg-[#A68042] text-white px-12 py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-[#8e6b36] transition-all">
              Sign In Now
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row">
      {/* Visual Side */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-950/40 z-10" />
        <Image
          src="/assets/unsplash/jewel-diamond-1.jpg"
          alt="Luxury Jewelry"
          fill
          priority
          className="object-cover animate-in fade-in scale-105 duration-[10s]"
        />
        <div className="absolute bottom-20 left-20 z-20 max-w-md">
          <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold mb-4 block">Security Protocol</span>
          <h2 className="text-5xl font-heading text-white uppercase tracking-widest leading-tight">Access <br /> Restoration</h2>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 py-20 bg-zinc-950 text-white">
        <div className="max-w-md w-full mx-auto space-y-12">
          <Link href="/login" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white px-4 py-2 rounded-full -ml-4 transition-all duration-300 group cursor-pointer">
            <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Return to Login</span>
          </Link>

          <div>
            <h1 className="text-4xl font-heading text-white uppercase tracking-widest mb-4">
              {step === "email" ? "Forgotten Access?" : "Reset Password"}
            </h1>
            <p className="text-zinc-500 italic text-sm">
              {step === "email"
                ? "Enter your registered email. We will send you a secure OTP to reset your password."
                : "Enter the OTP sent to your email and set a new password."}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-3 text-red-400 text-[10px] uppercase tracking-wider font-bold italic animate-in fade-in slide-in-from-top-2">
              <ShieldCheck size={14} />
              {error}
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === "email" && (
            <form onSubmit={handleRequestOtp} className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={14} className="text-[#A68042]" />
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Registered Email</label>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent border-b border-zinc-800 focus:border-[#A68042] py-4 text-sm focus:outline-none transition-all placeholder:italic text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-6 uppercase tracking-[0.4em] text-[11px] font-bold hover:bg-[#A68042] hover:text-white transition-all duration-700 shadow-2xl disabled:opacity-50 group flex items-center justify-center gap-4"
              >
                {loading ? "Sending OTP..." : "Send Reset Code"}
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
          )}

          {/* Step 2: OTP + New Password */}
          {step === "otp" && (
            <form onSubmit={handleResetPassword} className="space-y-8">
              {/* OTP Input */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound size={14} className="text-[#A68042]" />
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Verification Code</label>
                </div>
                <p className="text-zinc-500 text-xs mb-1">OTP sent to {email}</p>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  className="w-full bg-transparent border-b border-zinc-800 focus:border-[#A68042] py-4 text-2xl tracking-[0.5em] text-center font-bold focus:outline-none transition-all placeholder:text-sm placeholder:tracking-normal placeholder:font-normal text-white"
                />
                <div className="flex justify-between items-center pt-1">
                  <button
                    type="button"
                    onClick={() => { setStep("email"); setOtp(""); setError(""); setNewPassword(""); setConfirmPassword(""); }}
                    className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors font-bold"
                  >
                    Change Email
                  </button>
                  {timer > 0 ? (
                    <span className="text-[10px] text-zinc-500 font-medium">Resend in {timer}s</span>
                  ) : (
                    <button type="button" onClick={handleResend} className="text-[10px] text-[#A68042] font-bold hover:underline uppercase tracking-widest">
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock size={14} className="text-[#A68042]" />
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">New Password</label>
                </div>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-zinc-800 focus:border-[#A68042] py-4 text-sm focus:outline-none transition-all placeholder:italic text-white"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={14} className="text-[#A68042]" />
                  <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Confirm Password</label>
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-zinc-800 focus:border-[#A68042] py-4 text-sm focus:outline-none transition-all placeholder:italic text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-white text-black py-6 uppercase tracking-[0.4em] text-[11px] font-bold hover:bg-[#A68042] hover:text-white transition-all duration-700 shadow-2xl disabled:opacity-50 group flex items-center justify-center gap-4"
              >
                {loading ? "Resetting..." : "Reset Password"}
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </form>
          )}

          <div className="text-center pt-8">
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest">
              Technical assistance? <Link href="/contact" className="text-white hover:text-[#A68042] border-b border-white/10 ml-2">Inquire here</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
