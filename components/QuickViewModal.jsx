"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, ShoppingBag, Heart, ExternalLink } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { addToCart } from "../lib/api";

export default function QuickViewModal({ isOpen, onClose, product }) {
    const { user } = useAuth();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { refreshCart } = useCart();
    const router = useRouter();
    const [quantity, setQuantity] = useState(10);
    const [isAdding, setIsAdding] = useState(false);
    const [addedStatus, setAddedStatus] = useState(null);
    const [cartToast, setCartToast] = useState(null);

    if (!isOpen) return null;

    const wishlisted = isInWishlist(product.id);

    const handleAddToCart = async () => {
        if (!user) {
            onClose();
            router.push("/login");
            return;
        }
        setIsAdding(true);
        setAddedStatus(null);
        try {
            await addToCart({ product_id: product.id, quantity });
            refreshCart();
            setAddedStatus('success');
            setTimeout(() => setAddedStatus(null), 3000);
        } catch (err) {
            console.error("Add to cart error:", err);
            setAddedStatus('error');
            const msg = err?.response?.data?.msg || "Could not add to cart. Please try again.";
            setCartToast(msg);
            setTimeout(() => { setCartToast(null); setAddedStatus(null); }, 4000);
        } finally {
            setIsAdding(false);
        }
    };

    const handleWishlist = () => {
        if (!user) {
            onClose();
            router.push("/login");
            return;
        }
        if (wishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Cart Toast */}
            {cartToast && (
                <div className="fixed top-6 right-6 z-[200] max-w-sm border-l-4 border-red-500 bg-red-50 px-5 py-4 shadow-2xl rounded-lg animate-in slide-in-from-right duration-300">
                    <div className="flex items-start gap-3">
                        <p className="text-sm font-medium text-red-800 flex-1">{cartToast}</p>
                        <button onClick={() => setCartToast(null)} className="opacity-50 hover:opacity-100 text-red-400">
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-inner"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 hover:bg-zinc-100 transition-colors"
                >
                    <X size={24} className="text-zinc-500" />
                </button>

                <div className="flex flex-col md:flex-row">
                    {/* Product Image Section */}
                    <div className="w-full md:w-1/2 bg-zinc-50 p-8 flex items-center justify-center min-h-[400px]">
                        <div className="relative w-full aspect-square">
                            <Image
                                src={(() => {
                                    const fallback = "https://placehold.co/800x800/f8f8f8/666?text=Product";
                                    if (Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === 'string' && product.images[0].trim() !== "") return product.images[0];
                                    if (typeof product.images === 'string' && product.images.trim() !== "") return product.images;
                                    return fallback;
                                })()}
                                alt={product.name}
                                fill
                                className="object-contain mix-blend-multiply transition-transform duration-700 hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="w-full md:w-1/2 p-10 flex flex-col">
                        {product.category && (
                            <span className="text-[10px] uppercase tracking-widest text-[#A68042] font-bold mb-2">
                                {product.category}
                            </span>
                        )}

                        <h2 className="text-[24px] font-heading font-medium text-zinc-900 mb-2 uppercase tracking-wide leading-tight">
                            {product.name}
                        </h2>

                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-100">
                            <span className="text-[22px] font-medium text-[#A68042]">₹ {product.price?.toLocaleString()}</span>
                            {product.oldPrice && (
                                <span className="text-[16px] text-zinc-300 line-through">₹ {product.oldPrice?.toLocaleString()}</span>
                            )}
                        </div>

                        <div className="prose prose-sm text-zinc-500 mb-6 italic leading-relaxed border-l-2 border-zinc-100 pl-4">
                            <p>{product.description || "A truly exquisite piece from our collection, crafted with the finest attention to detail and premium materials."}</p>
                        </div>

                        {/* Product Details */}
                        {(product.metal_name || product.weight || product.making_charge) && (
                            <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-zinc-50 border border-zinc-100">
                                {product.metal_name && (
                                    <div>
                                        <span className="text-[9px] uppercase tracking-widest text-zinc-400 block font-bold">Metal</span>
                                        <span className="text-[12px] text-zinc-800 font-medium">{product.metal_name}</span>
                                    </div>
                                )}
                                {product.weight && (
                                    <div>
                                        <span className="text-[9px] uppercase tracking-widest text-zinc-400 block font-bold">Weight</span>
                                        <span className="text-[12px] text-zinc-800 font-medium">{product.weight}g</span>
                                    </div>
                                )}
                                {product.making_charge && (
                                    <div>
                                        <span className="text-[9px] uppercase tracking-widest text-zinc-400 block font-bold">Making Charge ({product.making_charge}%)</span>
                                        <span className="text-[12px] text-zinc-800 font-medium">₹{(((product.price_per_gram || 0) * (product.weight || 0)) * (product.making_charge || 0) / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                    </div>
                                )}
                                {product.material && (
                                    <div>
                                        <span className="text-[9px] uppercase tracking-widest text-zinc-400 block font-bold">Material</span>
                                        <span className="text-[12px] text-zinc-800 font-medium">{product.material}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Stock Status */}
                        <div className="mb-4">
                            {(product.stock || 0) <= 0 ? (
                                <span className="text-[10px] uppercase tracking-widest font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 inline-block">Out of Stock</span>
                            ) : (product.stock || 0) <= 10 ? (
                                <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 inline-block">Only {product.stock} Left</span>
                            ) : (
                                <span className="text-[10px] uppercase tracking-widest font-bold text-green-700 bg-green-50 border border-green-100 px-3 py-1.5 inline-block">In Stock</span>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[11px] uppercase tracking-widest text-zinc-400 mb-2 block font-bold">Quantity <span className="text-[9px] text-[#A68042] normal-case tracking-normal">(Min. 10 pieces)</span></label>
                                <div className="flex items-center border border-zinc-200 w-fit h-12">
                                    <button
                                        onClick={() => setQuantity(Math.max(10, quantity - 1))}
                                        disabled={quantity <= 10 || (product.stock || 0) <= 0}
                                        className={`px-4 transition-colors ${quantity <= 10 || (product.stock || 0) <= 0 ? 'text-zinc-200 cursor-not-allowed' : 'text-zinc-400 hover:text-black hover:bg-zinc-50'}`}
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        readOnly
                                        className="w-14 text-center focus:outline-none font-bold text-zinc-800 text-sm"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock || quantity, quantity + 1))}
                                        disabled={(product.stock || 0) <= 0 || quantity >= (product.stock || 0)}
                                        className={`px-5 transition-colors ${(product.stock || 0) <= 0 || quantity >= (product.stock || 0) ? 'text-zinc-200 cursor-not-allowed' : 'text-zinc-400 hover:text-black hover:bg-zinc-50'}`}
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isAdding || (product.stock || 0) <= 0}
                                    className={`flex-1 flex items-center justify-center gap-3 py-4 px-8 uppercase tracking-[0.2em] text-[12px] font-bold transition-all duration-300 border ${(product.stock || 0) <= 0
                                        ? "bg-zinc-200 border-zinc-200 text-zinc-400 cursor-not-allowed"
                                        : addedStatus === 'success'
                                            ? "bg-green-600 border-green-600 text-white"
                                            : addedStatus === 'error'
                                                ? "bg-red-500 border-red-500 text-white"
                                                : "bg-zinc-900 border-zinc-900 text-white hover:bg-[#A68042] hover:border-[#A68042]"
                                        } ${isAdding ? "opacity-70 cursor-not-allowed" : "shadow-xl shadow-zinc-200"}`}
                                >
                                    {(product.stock || 0) <= 0 ? (
                                        "Out of Stock"
                                    ) : isAdding ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : addedStatus === 'success' ? (
                                        "Added Successfully!"
                                    ) : addedStatus === 'error' ? (
                                        "Failed — Try Again"
                                    ) : (
                                        <>
                                            <ShoppingBag size={18} />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleWishlist}
                                    className={`p-4 border transition-all duration-300 group flex items-center justify-center ${wishlisted ? "border-[#A68042] text-[#A68042]" : "border-zinc-200 hover:bg-zinc-50"
                                        }`}
                                >
                                    <Heart
                                        size={20}
                                        strokeWidth={1.5}
                                        className={`transition-all duration-300 ${wishlisted ? "fill-[#A68042] scale-125" : "text-zinc-400 group-hover:text-zinc-600"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className="mt-auto pt-8 border-t border-zinc-50 flex items-center justify-between">
                            <div className="flex flex-col gap-2 text-[10px] uppercase tracking-wider text-zinc-400">
                                <p><span className="text-zinc-800 font-medium">Category:</span> {product.category || "Jewelry"}</p>
                                {product.id && <p><span className="text-zinc-800 font-medium">ID:</span> {String(product.id).substring(0, 12)}</p>}
                            </div>
                            <Link
                                href={`/products/${product.id}`}
                                onClick={onClose}
                                className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-400 hover:text-[#A68042] transition-colors"
                            >
                                Full Details <ExternalLink size={12} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
