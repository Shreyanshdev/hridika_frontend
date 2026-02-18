"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Eye, Heart, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { addToCart } from "../lib/api";

export default function ProductCard({ product, onQuickView, showActions = true, showPrice = true }) {
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { refreshCart } = useCart();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const wishlisted = isInWishlist(product.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    setIsAdding(true);
    try {
      await addToCart({ product_id: product.id, quantity: 10 });
      refreshCart(); // Update global cart state
      setShowCheck(true);
      setTimeout(() => setShowCheck(false), 2000);
    } catch (err) {
      console.error("Add to cart error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group bg-white flex flex-col items-center">
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-50 mb-4 cursor-pointer">
        {/* Sale Badge */}
        {product.onSale && (
          <div className="absolute top-4 right-4 z-10 bg-[#A68042] text-white text-[10px] px-3 py-3 rounded-full uppercase tracking-wider font-bold shadow-md">
            Sale
          </div>
        )}

        {/* Product Image */}
        <Link href={`/products/${product.id}`}>
          <Image
            src={(() => {
              const fallback = "https://placehold.co/800x800/f8f8f8/666?text=Product";
              if (Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === 'string' && product.images[0].trim() !== "") return product.images[0];
              if (typeof product.images === 'string' && product.images.trim() !== "") return product.images;
              return fallback;
            })()}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>

        {/* Hover Action Icons */}
        {showActions && (
          <div className="absolute bottom-0 left-0 w-full flex justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex bg-white shadow-xl border border-zinc-200">
              <button
                onClick={handleAddToCart}
                className={`p-3.5 transition-all duration-300 border-r border-zinc-200 relative ${showCheck
                  ? "bg-green-600 text-white border-green-600"
                  : "text-zinc-800 hover:bg-[#A68042] hover:text-white"
                  }`}
                title="Add to Cart"
              >
                {isAdding ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                ) : showCheck ? (
                  <Check size={20} strokeWidth={2.5} className="animate-in zoom-in duration-300" />
                ) : (
                  <ShoppingCart size={20} strokeWidth={2} />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (onQuickView) onQuickView(product);
                }}
                className="p-3.5 text-zinc-800 hover:bg-[#A68042] hover:text-white transition-all duration-300 border-r border-zinc-200"
                title="Quick view"
              >
                <Eye size={20} strokeWidth={2} />
              </button>
              <button
                onClick={handleWishlist}
                className={`p-3.5 transition-all duration-300 ${wishlisted ? "text-[#A68042]" : "text-zinc-800 hover:bg-[#A68042] hover:text-white"
                  }`}
                title="Add to Wishlist"
              >
                <Heart
                  size={20}
                  strokeWidth={2}
                  className={`transition-all duration-300 ${wishlisted ? "fill-[#A68042] scale-125" : ""
                    }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center px-2 py-2 w-full border-t border-zinc-50 group-hover:border-zinc-100 transition-colors">
        <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
          {product.category || "Jewelry"}
        </p>
        <h3 className="text-[13px] tracking-wide text-zinc-800 mb-1 hover:text-[#A68042] transition-colors line-clamp-1">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        {showPrice && (
          <div className="flex items-center justify-center gap-3">
            <span className="text-[15px] font-medium text-zinc-900">
              ₹ {product.price?.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-[12px] text-zinc-400 line-through">
                ₹ {product.oldPrice?.toLocaleString()}
              </span>
            )}
          </div>
        )}
        {product.metal_name && (
          <p className="text-[9px] uppercase tracking-wider text-[#A68042] mt-1">{product.metal_name}</p>
        )}
      </div>
    </div>
  );
}
