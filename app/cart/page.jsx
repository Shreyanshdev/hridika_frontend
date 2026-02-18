"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import api, { getCart, removeFromCart } from "../../lib/api";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Info, AlertCircle } from "lucide-react";
import Footer from "../../components/Footer";

export default function CartPage() {
  const { user } = useAuth();
  const { cartItems, loading, refreshCart, updateLocalItem } = useCart();
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/cart");
    }
  }, [user, router]);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      await refreshCart();
    } catch (err) {
      setError("Error removing item: " + err.message);
      setTimeout(() => setError(null), 4000);
    }
  };

  const updateQuantityInDB = async (productId, newQty, endpoint = "/cart/update") => {
    try {
      await api.put(endpoint, {
        product_id: productId,
        quantity: newQty,
      });

      // Sync global cart state
      await refreshCart();
    } catch (err) {
      console.error(err);
      setError("Quantity update failed: " + (err.response?.data?.msg || err.message));
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleSizeChange = (productId, value) => {
    // Update local state in context so it's reflected in the UI
    updateLocalItem(productId, { size: value });
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.total_price || (item.price * item.quantity)), 0);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const minRequiredQuantity = cartItems.length * 10;

  const handleCheckout = () => {
    if (totalQuantity < minRequiredQuantity) {
      setError(`Minimum order quantity requirement not met. Your collection must include at least ${minRequiredQuantity} pieces (${totalQuantity} currently).`);
      setTimeout(() => setError(null), 5000);
      return;
    }
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-zinc-100 border-t-[#A68042] rounded-full animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400">Loading Your Selection</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6  pb-32">
        <div className="flex flex-col lg:flex-row gap-20">

          {/* Left Side: Cart Items */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-12 pb-6 border-b border-zinc-100">
              <div>
                <h1 className="text-4xl font-heading uppercase tracking-widest text-zinc-900 mb-2">Shopping Bag</h1>
                <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                  {cartItems.length} {cartItems.length === 1 ? 'Unique Creation' : 'Unique Creations'}
                </p>
              </div>
              <Link href="/products" className="text-[10px] uppercase tracking-widest font-bold text-[#A68042] border-b border-[#A68042] pb-1 hover:text-black hover:border-black transition-all">
                Continue Selection
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 p-4 mb-8 flex items-center gap-3">
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-red-800 text-xs font-medium uppercase tracking-widest">{error}</p>
              </div>
            )}

            {cartItems.length === 0 ? (
              <div className="py-24 text-center">
                <ShoppingBag className="mx-auto text-zinc-100 w-24 h-24 mb-8" strokeWidth={1} />
                <h2 className="text-2xl font-heading uppercase tracking-widest text-zinc-400 mb-8">Your bag is currently empty</h2>
                <Link href="/products" className="inline-block bg-zinc-900 text-white px-12 py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-[#A68042] transition-all">
                  Begin Exploration
                </Link>
              </div>
            ) : (
              <div className="space-y-12">
                {cartItems.map((item) => (
                  <div key={item.product_id} className="group flex flex-col sm:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="relative aspect-square w-full sm:w-40 bg-zinc-50 overflow-hidden flex-shrink-0">
                      <Image
                        src={(Array.isArray(item.images) && item.images.length > 0) ? item.images[0] : (item.images || '/assets/unsplash/jewel-gold-1.jpg')}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-heading uppercase tracking-widest text-zinc-900 mb-1">{item.name}</h3>
                          <p className="text-[#A68042] font-medium tracking-widest text-sm italic">₹{item.price?.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => handleRemove(item.product_id)}
                          className="text-zinc-400 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 size={20} strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="mt-auto grid grid-cols-2 sm:grid-cols-3 gap-6 items-end">
                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-2 block">Ring Size</label>
                          <input
                            type="text"
                            placeholder="Add Size"
                            value={item.size}
                            onChange={(e) => handleSizeChange(item.product_id, e.target.value)}
                            className="w-full bg-zinc-100/50 border-b border-zinc-200 focus:border-[#A68042] px-3 py-2 text-xs text-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400 placeholder:italic"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-2 block">Quantity</label>
                          <div className="flex items-center bg-zinc-50 px-3 py-1 w-fit">
                            <button
                              onClick={() => updateQuantityInDB(item.product_id, item.quantity - 1, "/cart/update/min")}
                              className="p-2 text-zinc-600 hover:text-black disabled:opacity-20"
                              disabled={item.quantity <= 10}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center text-sm font-bold text-zinc-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantityInDB(item.product_id, item.quantity + 1, "/cart/update")}
                              className="p-2 text-zinc-600 hover:text-black"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="text-right sm:text-left hidden sm:block">
                          <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-2 block">Sub-Total</label>
                          <p className="text-zinc-900 font-bold text-sm">₹{(item.total_price || (item.price * item.quantity)).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Summary */}
          <div className="lg:w-[350px]">
            <div className="bg-zinc-50 p-10 sticky top-32">
              <h2 className="text-xl font-heading uppercase tracking-widest text-zinc-900 mb-8 border-b border-zinc-200 pb-4">Bag Summary</h2>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-zinc-500 text-xs italic">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-500 text-xs italic">
                  <span>Delivery Protocol</span>
                  <span className="text-green-600 uppercase tracking-widest font-bold text-[10px]">Complimentary</span>
                </div>
                <div className="flex justify-between text-zinc-500 text-xs italic">
                  <span>Insurance & Handling</span>
                  <span className="text-zinc-400 uppercase tracking-widest font-bold text-[10px]">Inclusive</span>
                </div>
                <div className="pt-6 border-t border-zinc-200 flex justify-between items-baseline">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-900">Total Investment</span>
                  <span className="text-2xl font-bold text-zinc-900">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {cartItems.length > 0 && totalQuantity < minRequiredQuantity && (
                <div className="mb-8 p-4 bg-[#A68042]/5 border border-[#A68042]/20 flex gap-3">
                  <Info size={20} className="text-[#A68042] flex-shrink-0" />
                  <p className="text-[9px] uppercase tracking-[0.15em] text-[#A68042] font-bold leading-relaxed">
                    Policy: A minimum of {minRequiredQuantity} pieces total is required for this collection. Please adjust quantities to proceed.
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full bg-zinc-900 text-white py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-[#A68042] transition-all duration-500 mb-6 disabled:opacity-50 group flex items-center justify-center gap-3"
              >
                Proceed to Checkout
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-[9px] text-zinc-300 uppercase tracking-widest text-center italic">
                Secure Checkout. SSL Encrypted Transaction.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
