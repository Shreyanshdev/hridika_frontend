"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
    LogOut,
    ShieldCheck,
    LayoutDashboard,
    MessageSquare,
    User as UserIcon,
    AlertTriangle,
    X
} from "lucide-react";

export default function AdminHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const confirmLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_data");
        setShowLogoutModal(false);
        router.push("/login");
    };

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Bespoke", href: "/admin/bespoke", icon: MessageSquare },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-[90] bg-white/80 backdrop-blur-md border-b border-zinc-100 h-16">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    {/* Left: Brand & Portal Name */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center">
                                <span className="text-white font-heading text-xs">H</span>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-900 leading-none mb-1">Hridika</h1>
                                <p className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#A68042] leading-none">Management Portal</p>
                            </div>
                        </div>

                        <div className="h-4 w-[1px] bg-zinc-200 mx-2 hidden md:block" />

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <button
                                        key={item.href}
                                        onClick={() => router.push(item.href)}
                                        className={`flex items-center gap-2 text-[9px] uppercase tracking-widest font-bold transition-all ${isActive ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"
                                            }`}
                                    >
                                        <item.icon size={12} strokeWidth={isActive ? 2.5 : 2} />
                                        {item.name}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right: Auth & Actions */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 pr-6 border-r border-zinc-100 hidden sm:flex">
                            <div className="text-right">
                                <p className="text-[9px] uppercase tracking-widest font-black text-zinc-900 leading-none mb-1">System Admin</p>
                                <p className="text-[8px] uppercase tracking-widest font-bold text-zinc-500 leading-none">Archivist</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                                <UserIcon size={14} className="text-zinc-500" />
                            </div>
                        </div>

                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="flex items-center gap-2 text-[9px] uppercase tracking-widest font-black text-red-500 hover:text-red-600 transition-all group"
                        >
                            <span className="hidden sm:inline">Logout Session</span>
                            <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </header>

            {/* ─── Logout Confirmation Modal ─── */}
            {showLogoutModal && (
                <div
                    className="fixed inset-0 z-[200] bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200"
                    onClick={() => setShowLogoutModal(false)}
                >
                    <div
                        className="bg-white max-w-sm w-full shadow-2xl animate-in zoom-in-95 fade-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8 text-center space-y-6">
                            <div className="w-14 h-14 mx-auto bg-red-50 rounded-full flex items-center justify-center">
                                <AlertTriangle size={24} className="text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-heading text-zinc-900 uppercase tracking-widest">End Session?</h3>
                                <p className="text-sm text-zinc-500 leading-relaxed">
                                    You will be logged out and redirected to the login page. Any unsaved changes will be lost.
                                </p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 py-3 border border-zinc-200 text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-700 hover:bg-zinc-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="flex-1 py-3 bg-red-500 text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <LogOut size={12} />
                                    Confirm Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
