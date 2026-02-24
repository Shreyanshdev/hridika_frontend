"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { Mail, Phone, Lock, ChevronRight, ArrowRight, Eye, EyeOff } from "lucide-react";
import LoginGoogleButton from "../../components/LoginGoogleButton";

export default function LoginPage() {
  const [mode, setMode] = useState("phone"); // phone | email
  const [step, setStep] = useState("phone"); // phone | otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionToken, setSessionToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, loginset } = useAuth();
  const router = useRouter();

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (phone.length !== 10) {
      setError("Enter valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/request-phone-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }

      setSessionToken(data.sessionToken);
      setStep("otp");
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-phone-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, sessionToken, phone, context: "login" })
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.msg === "expired") setError("OTP expired. Please request a new one.");
        else if (data.msg === "invalid") setError("Invalid OTP. Please try again.");
        else if (data.msg === "user_not_found") setError("No account found with this phone number. Please register first.");
        else setError("OTP verification failed");
        return;
      }

      if (data.access_token && data.user) {
        const user = loginset(data.user, data.access_token, data.refresh_token);
        window.location.href = user.role === "admin" ? "/admin" : "/products-dashboard";
      } else if (data.verified) {
        // Phone verified but no user — redirect to register
        setError("No account found. Please register first.");
      }
    } catch (err) {
      setError("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(email, password);
      window.location.href = user.role === "admin" ? "/admin" : "/products-dashboard";
    } catch (err) {
      setError("Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex relative bg-zinc-900 items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-60 scale-110"
          style={{
            backgroundImage: "url('/assets/unsplash/jewel-gold-1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />

        <div className="relative z-10 text-center px-12">
          <h2 className="text-white text-5xl font-heading mb-6 tracking-widest uppercase">
            Hridika <br /> <span className="text-[#A68042] italic normal-case tracking-normal">Jewels</span>
          </h2>
          <p className="text-white/70 text-lg uppercase tracking-[0.3em] font-light max-w-sm mx-auto border-t border-white/20 pt-6">
            Exquisite Artistry. <br /> Eternal Elegance.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-12 relative overflow-hidden">
        {/* Decorative Element */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-zinc-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-[#A68042]/5 rounded-full blur-3xl opacity-50" />

        <div className="max-w-md w-full mx-auto relative z-10">
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/50 hover:backdrop-blur-md px-4 py-2 rounded-full -ml-4 transition-all duration-300 mb-8 group cursor-pointer">
              <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Back to Home</span>
            </Link>
            <h1 className="text-4xl font-heading mb-4 uppercase tracking-widest text-zinc-900">Welcome Back</h1>
            <p className="text-zinc-500 italic">
              {mode === "phone"
                ? "Enter your mobile number to receive a secure OTP via SMS."
                : "Sign in with your email and password to access your collection."}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-2 border-red-500 p-4 mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-red-800 text-xs font-medium uppercase tracking-widest">{error}</p>
            </div>
          )}

          {/* Login Method Toggle */}
          <div className="flex mb-8 border-b border-zinc-100">
            <button
              onClick={() => { setMode('email'); setError(''); }}
              className={`pb-2 px-4 text-[11px] uppercase tracking-widest font-bold transition-all ${mode === 'email' ? 'text-[#A68042] border-b-2 border-[#A68042]' : 'text-zinc-400'}`}
            >
              Email
            </button>
            <button
              onClick={() => { setMode('phone'); setError(''); }}
              className={`pb-2 px-4 text-[11px] uppercase tracking-widest font-bold transition-all ${mode === 'phone' ? 'text-[#A68042] border-b-2 border-[#A68042]' : 'text-zinc-400'}`}
            >
              Phone
            </button>
          </div>

          {/* Phone Step */}
          {mode === "phone" && step === "phone" && (
            <form onSubmit={handlePhoneLogin} className="space-y-6">
              <div className="group">
                <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black mb-2 block group-focus-within:text-[#A68042] transition-colors">Mobile Number</label>
                <div className="flex items-center border-b-2 border-zinc-100 group-focus-within:border-[#A68042] transition-all pb-2">
                  <span className="text-zinc-400 mr-2 font-medium">+91</span>
                  <input
                    type="tel"
                    placeholder="1234567890"
                    className="flex-1 bg-transparent focus:outline-none text-lg tracking-widest text-zinc-900 font-bold"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    maxLength="10"
                    required
                  />
                  <Phone size={18} className="text-zinc-400" />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 text-white py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-[#A68042] transition-all duration-500 disabled:opacity-50 group flex items-center justify-center gap-3"
              >
                {loading ? "Sending OTP..." : "Request Access Code"}
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}

          {/* OTP Step */}
          {mode === "phone" && step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="group">
                <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black mb-2 block group-focus-within:text-[#A68042] transition-colors">Verification Code</label>
                <p className="text-zinc-500 text-xs mb-3">OTP sent to +91 {phone} via SMS</p>
                <div className="flex items-center border-b-2 border-zinc-100 group-focus-within:border-[#A68042] transition-all pb-2">
                  <input
                    type="text"
                    placeholder="Enter 4-digit OTP"
                    className="flex-1 bg-transparent focus:outline-none text-2xl tracking-[1em] text-center text-zinc-900 font-black placeholder:tracking-normal placeholder:text-sm"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    maxLength="4"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#A68042] text-white py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-zinc-900 transition-all duration-500 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Secure Login"}
              </button>
              <button
                type="button"
                onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                className="w-full text-[10px] uppercase tracking-widest text-zinc-400 hover:text-zinc-800 transition-colors font-bold mt-4"
              >
                Change Phone Number
              </button>
            </form>
          )}

          {/* Email Mode */}
          {mode === "email" && (
            <form onSubmit={handleEmailLogin} className="space-y-6">
              <div className="group">
                <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black mb-2 block group-focus-within:text-[#A68042] transition-colors">Email Address</label>
                <div className="flex items-center border-b-2 border-zinc-100 group-focus-within:border-[#A68042] transition-all pb-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 bg-transparent focus:outline-none text-zinc-900 font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail size={18} className="text-zinc-400" />
                </div>
              </div>
              <div className="group">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] uppercase tracking-widest text-zinc-600 font-black group-focus-within:text-[#A68042] transition-colors">Password</label>
                  <Link href="/forgot-password" className="text-[10px] uppercase tracking-widest text-zinc-400 hover:text-black font-bold">Forgot?</Link>
                </div>
                <div className="flex items-center border-b-2 border-zinc-100 group-focus-within:border-[#A68042] transition-all pb-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="flex-1 bg-transparent focus:outline-none text-zinc-900 font-bold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-zinc-400 hover:text-zinc-700 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-900 text-white py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-[#A68042] transition-all duration-500 disabled:opacity-50"
              >
                {loading ? "Validating Account..." : "Login to Collection"}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-zinc-100"></div>
            <span className="px-4 text-[10px] uppercase tracking-widest text-zinc-300 font-bold">or</span>
            <div className="flex-1 border-t border-zinc-100"></div>
          </div>

          {/* Google Sign-In */}
          <LoginGoogleButton text="signin_with" />

          <div className="mt-12 pt-12 border-t border-zinc-50 text-center">
            <p className="text-zinc-400 text-xs mb-4 italic uppercase tracking-widest">New to Hridika Jewels?</p>
            <Link
              href="/register"
              className="inline-block text-[11px] uppercase tracking-[0.3em] font-bold text-zinc-900 hover:text-[#A68042] transition-all border-b border-zinc-900 hover:border-[#A68042] pb-1 animate-pulse"
            >
              Establish an Account
            </Link>
          </div>
        </div>

        {/* Footer credit */}
        <div className="mt-auto pt-10 text-center">
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-300 font-medium font-bold">
            &copy; 2026 Hridika Jewels, INC. Protected by SSL Encryption.
          </p>
        </div>
      </div>
    </main>
  );
}
