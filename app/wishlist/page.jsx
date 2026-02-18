"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "../../context/WishlistContext";
import { Trash2, ShoppingBag, ArrowRight, Heart } from "lucide-react";
import Footer from "../../components/Footer";

export default function WishlistPage() {
    const { wishlist, removeFromWishlist } = useWishlist();

    return (
        <main className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-6 pt-20 pb-40">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
                    <div className="space-y-4">
                        <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold block italic animate-in fade-in slide-in-from-left-4 duration-700">Curated Aspiration</span>
                        <h1 className="text-5xl lg:text-7xl font-heading text-zinc-900 uppercase tracking-widest leading-tight animate-in fade-in slide-in-from-left-8 duration-1000">
                            Your <br /> <span className="italic normal-case tracking-normal text-[#A68042]">Wishlist</span>
                        </h1>
                    </div>
                    <div className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold pb-2 border-b border-zinc-100 hidden lg:block animate-in fade-in duration-1000 delay-500">
                        {wishlist.length} {wishlist.length === 1 ? 'Masterpiece' : 'Masterpieces'} Reserved
                    </div>
                </div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-40 border-y border-zinc-50 animate-in fade-in zoom-in-95 duration-1000">
                        <Heart className="mx-auto text-zinc-100 w-24 h-24 mb-10" strokeWidth={1} />
                        <h2 className="text-2xl font-heading text-zinc-900 uppercase tracking-widest mb-6">Your collection is empty</h2>
                        <p className="text-zinc-500 italic mb-12 text-lg">Every great journey begins with a single moment of inspiration.</p>
                        <Link href="/products" className="inline-flex items-center gap-4 bg-zinc-900 text-white px-12 py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-[#A68042] transition-all group">
                            Explore Collections
                            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                        {wishlist.map((product, idx) => (
                            <div key={product.id} className="group animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                                <div className="relative aspect-[4/5] bg-zinc-50 mb-8 overflow-hidden">
                                    <Image
                                        src={(Array.isArray(product.images) && product.images.length > 0) ? product.images[0] : (product.images || "/assets/unsplash/jewel-gold-1.jpg")}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-[2s]"
                                    />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                                    {/* Action Overlays */}
                                    <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                        <button
                                            onClick={() => removeFromWishlist(product.id)}
                                            className="w-10 h-10 bg-white shadow-xl flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} strokeWidth={1.5} />
                                        </button>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                        <Link
                                            href={`/products/${product.id}`}
                                            className="w-full bg-zinc-900 text-white py-4 flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest font-black"
                                        >
                                            <ShoppingBag size={14} />
                                            View Acquisition
                                        </Link>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-[10px] uppercase tracking-widest text-[#A68042] font-bold block mb-1">{product.category || "Fine Jewelry"}</span>
                                            <h3 className="text-xl font-heading text-zinc-900 uppercase tracking-wider">{product.name}</h3>
                                        </div>
                                        <p className="text-sm font-medium text-zinc-900">{product.price}</p>
                                    </div>
                                    <p className="text-zinc-400 text-[11px] italic leading-relaxed line-clamp-2">{product.description || "A masterpiece of artisanal craftsmanship, reflecting timeless elegance and modern luxury."}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Aesthetic Footer Note */}
                <div className="mt-40 pt-24 border-t border-zinc-50 text-center max-w-xl mx-auto">
                    <p className="text-zinc-400 italic text-[13px] leading-relaxed">
                        Pieces in your wishlist are not reserved until acquisition is complete. Due to the high-demand nature of our hand-crafted selections, we recommend finalizing your choice to ensure its presence in your private collection.
                    </p>
                </div>
            </div>

            <Footer />
        </main>
    );
}
