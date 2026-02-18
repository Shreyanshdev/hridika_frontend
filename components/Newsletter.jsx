"use client";

import React, { useState } from "react";
import { subscribeNewsletter } from "../lib/api";
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        try {
            const response = await subscribeNewsletter(email);
            setStatus("success");
            setMessage(response.data.message || "Thank you for subscribing!");
            setEmail("");
        } catch (error) {
            setStatus("error");
            setMessage(error.response?.data?.error || "Subscription failed. Please try again.");
        }
    };

    return (
        <section className="py-24 bg-zinc-50 border-t border-zinc-100 overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none translate-x-1/4 -translate-y-1/4">
                <Sparkles size={400} />
            </div>

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <h2 className="text-[14px] tracking-[0.4em] uppercase text-zinc-800 font-bold mb-4">
                    The Heritage Letter
                </h2>

                <div className="flex justify-center items-center gap-2 mb-8">
                    <div className="h-[1px] w-8 bg-[#A68042]/30"></div>
                    <div className="flex gap-1 text-[#A68042]">
                        <span className="text-[10px]">★</span>
                        <span className="text-[10px]">★</span>
                        <span className="text-[10px]">★</span>
                    </div>
                    <div className="h-[1px] w-8 bg-[#A68042]/30"></div>
                </div>

                <p className="text-zinc-500 text-[15px] mb-12 italic tracking-wide max-w-lg mx-auto leading-relaxed">
                    Subscribe to receive invitations to private viewings, early access to heritage collections, and stories from our archive.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto shadow-xl shadow-zinc-200/50 rounded-lg overflow-hidden border border-zinc-100">
                    <input
                        type="email"
                        placeholder="Your Professional Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 px-8 py-5 bg-white focus:outline-none focus:ring-1 focus:ring-[#A68042] text-[14px] text-zinc-800"
                        required
                        disabled={status === "loading"}
                    />
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="bg-zinc-900 text-white px-12 py-5 text-[12px] uppercase tracking-[0.3em] font-bold hover:bg-[#A68042] transition-all duration-500 flex items-center justify-center gap-3 disabled:bg-zinc-400"
                    >
                        {status === "loading" ? (
                            <>
                                <Loader2 className="animate-spin" size={16} />
                                processing
                            </>
                        ) : (
                            "Join Archive"
                        )}
                    </button>
                </form>

                {/* Feedback Messages */}
                <div className="mt-8 h-6 flex justify-center items-center">
                    {status === "success" && (
                        <div className="flex items-center gap-2 text-green-600 text-[13px] font-medium animate-in fade-in slide-in-from-top-2">
                            <CheckCircle2 size={16} />
                            {message}
                        </div>
                    )}
                    {status === "error" && (
                        <div className="flex items-center gap-2 text-red-500 text-[13px] font-medium animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={16} />
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
