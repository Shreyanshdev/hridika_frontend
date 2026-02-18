"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowRight, Lock, ShieldCheck, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("The provided security token is invalid or has expired.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The protocols do not match. Please verify your password entry.");
      return;
    }

    setStatus('submitting');
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resetpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Password reset failed");

      setStatus('success');
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-md w-full space-y-8 animate-in fade-in zoom-in-95 duration-700 text-center">
        <CheckCircle2 size={64} className="text-[#A68042] mx-auto mb-8" strokeWidth={1} />
        <h1 className="text-4xl font-heading text-white uppercase tracking-widest leading-tight">
          Credential <span className="italic normal-case tracking-normal border-b border-white/10">Restored</span>
        </h1>
        <p className="text-zinc-400 italic text-lg leading-relaxed">
          Your account security has been updated successfully. We are redirecting you to the vault entry.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto space-y-12">
      <div>
        <h1 className="text-4xl font-heading text-white uppercase tracking-widest mb-4">New Credentials</h1>
        <p className="text-zinc-500 italic text-sm">Define your new access protocol. Ensure it remains private and secure.</p>
      </div>

      <form onSubmit={handleReset} className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock size={14} className="text-[#A68042]" />
            <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">New Security Password</label>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-transparent border-b border-zinc-900 focus:border-[#A68042] py-4 text-sm focus:outline-none transition-all placeholder:italic"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={14} className="text-[#A68042]" />
            <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Confirm Protocol</label>
          </div>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-transparent border-b border-zinc-900 focus:border-[#A68042] py-4 text-sm focus:outline-none transition-all placeholder:italic"
          />
        </div>

        {error && (
          <div className="flex items-center gap-3 text-red-400 text-[10px] uppercase tracking-wider font-bold italic animate-in fade-in slide-in-from-top-2">
            <ShieldCheck size={14} />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-white text-black py-6 uppercase tracking-[0.4em] text-[11px] font-bold hover:bg-[#A68042] hover:text-white transition-all duration-700 shadow-2xl disabled:opacity-50 group flex items-center justify-center gap-4"
        >
          {status === 'submitting' ? 'Authenticating...' : 'Restore Credentials'}
          <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row">
      {/* Visual Side */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-950/40 z-10" />
        <Image
          src="/assets/unsplash/jewel-craft-1.jpg"
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
        <Suspense fallback={<div className="text-white text-[10px] uppercase tracking-widest">Initialising Secure Environment...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
