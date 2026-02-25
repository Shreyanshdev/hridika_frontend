"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import {
  MapPin,
  CreditCard,
  Truck,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Lock,
  Clock,
  CheckCircle2,
  X,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import Footer from "../../components/Footer";

const RAZORPAY_KEY = "rzp_test_S8wngj4bEmdq8P";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-green-50 border-green-500 text-green-800",
    error: "bg-red-50 border-red-500 text-red-800",
    info: "bg-blue-50 border-blue-500 text-blue-800",
  };
  const icons = {
    success: <CheckCircle size={18} className="text-green-500 flex-shrink-0" />,
    error: <AlertCircle size={18} className="text-red-500 flex-shrink-0" />,
    info: <AlertCircle size={18} className="text-blue-500 flex-shrink-0" />,
  };

  return (
    <div className={`fixed top-6 right-6 z-[9999] max-w-sm border-l-4 px-5 py-4 shadow-2xl rounded-lg animate-in slide-in-from-right duration-300 ${styles[type]}`}>
      <div className="flex items-start gap-3">
        {icons[type]}
        <p className="text-sm font-medium flex-1">{message}</p>
        <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, loading: cartLoading } = useCart();
  const router = useRouter();
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => setToast({ message, type });

  const address = `${addressLine}, ${city}, ${stateVal} - ${pincode}`.trim();

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout");
    }
  }, [user, router]);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.total_price || (item.price * item.quantity)), 0);
  const outOfStockItems = cartItems.filter(item => (item.stock || 0) <= 0);
  const hasStockIssue = outOfStockItems.length > 0;

  const handleOrder = async () => {
    if (!addressLine.trim() || !city.trim() || !stateVal.trim() || !pincode.trim()) {
      showToast("Please fill in all address fields to proceed.");
      return;
    }
    if (pincode.length !== 6) {
      showToast("Please enter a valid 6-digit pincode.");
      return;
    }

    const token = localStorage.getItem("access_token");
    setLoading(true);

    try {
      // 1. Create Order
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          address,
          payment_method: paymentMethod
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Initialization failed");

      // 2. COD Flow
      if (paymentMethod === "cod") {
        showToast("Order placed successfully! Redirecting...", "success");
        setTimeout(() => router.push(`/orders/${data.order_id}?status=success`), 1500);
        return;
      }

      // 3. Online Payment Flow
      if (!window.Razorpay) throw new Error("Payment gateway offline");

      const options = {
        key: RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        order_id: data.razorpay_order_id,
        name: "Hridika Jewels",
        description: "Luxury Purchase Selection",
        prefill: {
          email: user?.email || "",
          contact: user?.phone,
        },
        config: {
          display: {
            blocks: {
              utib: {
                name: "Pay using UPI",
                instruments: [
                  { method: "upi", flows: ["collect", "intent", "qr"] }
                ]
              },
              other: {
                name: "Other Methods",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" }
                ]
              }
            },
            sequence: ["block.utib", "block.other"],
            preferences: { show_default_blocks: true }
          }
        },
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const result = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(result.msg || "Verification failed");

            router.push(`/orders/${data.order_id}?status=success`);
          } catch (err) {
            showToast("Payment verification failed: " + err.message);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        },
        theme: {
          color: "#A68042"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (err) => {
        showToast("Payment failed: " + err.error.description);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      showToast("Transaction error: " + err.message);
      setLoading(false);
    }
  };

  if (cartLoading) return null;

  return (
    <main className="bg-white min-h-screen">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="mb-16">
          <Link href="/cart" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/50 hover:backdrop-blur-md px-4 py-2 rounded-full -ml-4 transition-all duration-300 mb-8 group cursor-pointer">
            <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Return to Bag</span>
          </Link>
          <h1 className="text-4xl font-heading uppercase tracking-widest text-zinc-900">Final Procurement</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-20">
          {/* Left Side - Checkout Form */}
          <div className="flex-1 space-y-16">
            {/* Shipping Section */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-xl shadow-zinc-200">1</div>
                <h2 className="text-xl font-heading uppercase tracking-widest text-zinc-900">Shipping Repository</h2>
              </div>

              <div className="bg-zinc-50 p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-focus-within:opacity-30 transition-opacity">
                  <MapPin size={40} className="text-[#A68042]" />
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Street Address / Flat / Landmark</label>
                    <input
                      type="text"
                      placeholder="E.g. 42, MG Road, Near City Mall"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      autoComplete="street-address"
                      className="w-full bg-white border-2 border-zinc-200 focus:border-[#A68042] p-4 text-sm text-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400 shadow-sm rounded-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block">City</label>
                      <input
                        type="text"
                        placeholder="E.g. Lucknow"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        autoComplete="address-level2"
                        className="w-full bg-white border-2 border-zinc-200 focus:border-[#A68042] p-4 text-sm text-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400 shadow-sm rounded-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block">State</label>
                      <input
                        type="text"
                        placeholder="E.g. Uttar Pradesh"
                        value={stateVal}
                        onChange={(e) => setStateVal(e.target.value)}
                        autoComplete="address-level1"
                        className="w-full bg-white border-2 border-zinc-200 focus:border-[#A68042] p-4 text-sm text-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400 shadow-sm rounded-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="max-w-[200px]">
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-2 block">Pincode</label>
                    <input
                      type="text"
                      placeholder="E.g. 226001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                      maxLength="6"
                      autoComplete="postal-code"
                      className="w-full bg-white border-2 border-zinc-200 focus:border-[#A68042] p-4 text-sm text-zinc-900 focus:outline-none transition-all placeholder:text-zinc-400 shadow-sm rounded-sm tracking-widest"
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-xl shadow-zinc-200">2</div>
                <h2 className="text-xl font-heading uppercase tracking-widest text-zinc-900">Settlement Protocol</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`relative p-8 text-left border-2 transition-all duration-500 overflow-hidden group ${paymentMethod === "razorpay" ? "border-[#A68042] bg-white shadow-2xl shadow-zinc-100" : "border-zinc-50 bg-zinc-50 hover:border-zinc-200"}`}
                >
                  <div className="relative z-10">
                    <CreditCard className={`mb-4 transition-colors ${paymentMethod === "razorpay" ? "text-[#A68042]" : "text-zinc-300"}`} />
                    <h4 className="text-[11px] uppercase tracking-widest font-bold text-zinc-900 mb-2">Digital Settlement</h4>
                    <p className="text-zinc-400 text-[10px] italic">Credit Cards, UPI, NetBanking</p>
                  </div>
                  {paymentMethod === "razorpay" && (
                    <div className="absolute top-4 right-4 text-[#A68042]">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`relative p-8 text-left border-2 transition-all duration-500 overflow-hidden group ${paymentMethod === "cod" ? "border-[#A68042] bg-white shadow-2xl shadow-zinc-100" : "border-zinc-50 bg-zinc-50 hover:border-zinc-200"}`}
                >
                  <div className="relative z-10">
                    <Truck className={`mb-4 transition-colors ${paymentMethod === "cod" ? "text-[#A68042]" : "text-zinc-300"}`} />
                    <h4 className="text-[11px] uppercase tracking-widest font-bold text-zinc-900 mb-2">Heritage Protocol</h4>
                    <p className="text-zinc-400 text-[10px] italic">Cash on Delivery Authorization</p>
                  </div>
                  {paymentMethod === "cod" && (
                    <div className="absolute top-4 right-4 text-[#A68042]">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </button>
              </div>
            </section>

            {/* CTA */}
            <div className="pt-8 border-t border-zinc-100 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
              <button
                onClick={handleOrder}
                disabled={loading || cartItems.length === 0 || hasStockIssue}
                className="w-full bg-zinc-900 text-white py-6 uppercase tracking-[0.4em] text-[12px] font-bold hover:bg-[#A68042] transition-all duration-700 shadow-2xl shadow-zinc-200 disabled:opacity-50 group flex items-center justify-center gap-4 overflow-hidden relative"
              >
                <span className="relative z-10">{loading ? "Authorizing Engagement..." : hasStockIssue ? "Remove Out-of-Stock Items to Proceed" : "Finalize Procurement"}</span>
                {!hasStockIssue && <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
              </button>

              <div className="mt-8 flex items-center justify-center gap-8 text-[9px] uppercase tracking-[0.2em] text-zinc-300 font-bold">
                <div className="flex items-center gap-2">
                  <Lock size={12} className="text-zinc-200" />
                  <span>Encrypted 256-bit</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={12} className="text-zinc-200" />
                  <span>Insured Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-zinc-200" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Summary Column */}
          <div className="lg:w-[400px]">
            <div className="bg-zinc-50 p-12 sticky top-32">
              <h3 className="text-[12px] uppercase tracking-[0.3em] font-bold text-zinc-900 mb-8 border-b border-zinc-200 pb-4">Order Summary</h3>

              <div className="max-h-[300px] overflow-y-auto space-y-8 pr-4 custom-scrollbar mb-10">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-20 h-20 bg-white flex-shrink-0 relative overflow-hidden">
                      <Image
                        src={(Array.isArray(item.images) && item.images.length > 0) ? item.images[0] : (item.images || '/assets/unsplash/jewel-gold-1.jpg')}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-zinc-900 line-clamp-1">{item.name}</h4>
                      <p className="text-[9px] text-zinc-400 italic mb-2">Qty: {item.quantity} {item.size && `| Size: ${item.size}`}</p>
                      <p className="text-xs font-medium text-zinc-800">₹{(item.price * item.quantity).toLocaleString()}</p>
                      {(item.stock || 0) <= 0 && (
                        <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider mt-1">Out of Stock — Remove to proceed</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-10 border-t border-zinc-200">
                <div className="flex justify-between text-[11px] uppercase tracking-widest font-medium text-zinc-400 italic">
                  <span>Sub-Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-widest font-medium text-zinc-400 italic">
                  <span>Premium Delivery</span>
                  <span className="text-zinc-900">Zero Fee</span>
                </div>
                <div className="flex justify-between text-zinc-900 pt-6">
                  <span className="text-[12px] uppercase tracking-[0.3em] font-black">Final Total</span>
                  <span className="text-2xl font-bold font-heading italic">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-12 bg-white p-6 border border-zinc-100">
                <p className="text-[10px] text-center text-zinc-400 italic">
                  "Exquisite pieces deserve exceptional service. Your purchase is protected by our Hridika Assurance Protocol."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main >
  );
}
