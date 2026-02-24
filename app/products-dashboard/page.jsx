"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowRight,
  ShoppingBag,
  Heart,
  Package,
  Sparkles,
  ChevronRight,
  Star,
  Gem,
  Crown,
} from "lucide-react";
import ProductCard from "../../components/ProductCard";
import QuickViewModal from "../../components/QuickViewModal";
import Footer from "../../components/Footer";
import { getProductsDash, getCategories } from "../../lib/api";

// Only show these 5 categories
const VALID_CATEGORIES = ["bangles", "bracelets", "earrings", "necklaces", "rings"];

// Map category names to images for display (same as home CategorySection)
const CATEGORY_IMAGES = {
  bangles: "/assets/pic8.jpg",
  bracelets: "/assets/pic3.jpg",
  earrings: "/assets/pic9.jpg",
  necklaces: "/assets/pic1.jpg",
  necklace: "/assets/pic1.jpg",
  rings: "/assets/pic6.jpg",
};

const DEFAULT_IMAGE = "/assets/pic4.jpg";

export default function ProductsDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/products-dashboard");
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await getProductsDash();
        console.log("DASHBOARD API RESPONSE:", res.data);
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
      } catch (err) {
        console.error("DASHBOARD FETCH ERROR:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchCats = async () => {
      try {
        const res = await getCategories();
        const data = res.data || [];
        const filtered = data.filter(name =>
          VALID_CATEGORIES.includes(name.toLowerCase())
        );
        const formatted = filtered.map(name => ({
          name,
          href: `/category/${name.toLowerCase()}`,
          image: CATEGORY_IMAGES[name.toLowerCase()] || DEFAULT_IMAGE,
        }));
        setAllCategories(formatted);
      } catch {
        setAllCategories([]);
      }
    };

    fetchProducts();
    fetchCats();
  }, [user, router]);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  if (!user) return null;

  const featuredProducts = products.slice(0, 4);
  const newArrivals = products.slice(0, 8);

  return (
    <main className="bg-white min-h-screen">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0">
          <Image
            src="/assets/unsplash/jewel-craft-1.jpg"
            alt="Welcome"
            fill
            priority
            className="object-cover opacity-20 scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#A68042] flex items-center justify-center">
                <Crown size={20} className="text-white" />
              </div>
              <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold italic">
                Private Access
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-heading text-white uppercase tracking-widest leading-tight">
              Welcome back,{" "}
              <span className="italic normal-case tracking-normal text-[#A68042] block mt-2">
                {user.username || "Connoisseur"}
              </span>
            </h1>

            <p className="text-zinc-400 italic text-lg leading-relaxed max-w-lg border-l-2 border-zinc-800 pl-6">
              Your curated selection of heritage pieces awaits. Explore our
              latest acquisitions and continue your journey of artisanal
              excellence.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/products"
                className="bg-white text-black px-10 py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-[#A68042] hover:text-white transition-all duration-500 group flex items-center gap-4"
              >
                Browse Collection
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </Link>
              <Link
                href="/bespoke"
                className="bg-transparent border border-white/20 text-white px-10 py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:border-[#A68042] hover:text-[#A68042] transition-all duration-500 flex items-center gap-4"
              >
                <Gem size={14} />
                Bespoke Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: ShoppingBag,
              title: "Your Cart",
              link: "/cart",
              desc: "Review selections",
            },
            {
              icon: Heart,
              title: "Wishlist",
              link: "/wishlist",
              desc: "Saved pieces",
            },
            {
              icon: Package,
              title: "Orders",
              link: "/orders",
              desc: "Track acquisitions",
            },
            {
              icon: Sparkles,
              title: "Bespoke",
              link: "/bespoke",
              desc: "Custom design",
            },
          ].map((item, idx) => (
            <Link
              key={item.title}
              href={item.link}
              className="group bg-white border border-zinc-100 p-6 hover:shadow-xl hover:border-zinc-200 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <item.icon
                size={20}
                className="text-[#A68042] mb-4 group-hover:scale-110 transition-transform"
                strokeWidth={1.5}
              />
              <h3 className="text-[11px] uppercase tracking-widest font-bold text-zinc-900 mb-1">
                {item.title}
              </h3>
              <p className="text-[10px] text-zinc-400 italic">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Curated For You - Featured Products */}
      <div className="max-w-7xl mx-auto px-6 mb-32">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold mb-4 block italic">
              Curated Selection
            </span>
            <h2 className="text-3xl font-heading text-zinc-900 uppercase tracking-widest">
              Handpicked For You
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden md:flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-zinc-400 hover:text-zinc-900 transition-colors group border-b border-zinc-200 pb-1"
          >
            View Full Collection
            <ChevronRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-zinc-100 mb-4" />
                  <div className="h-3 bg-zinc-100 w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-zinc-100 w-1/2 mx-auto" />
                </div>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {featuredProducts.map((product, idx) => (
              <div
                key={product.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <ProductCard
                  product={product}
                  onQuickView={handleQuickView}
                  showActions={false}
                  showPrice={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shop by Category */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold mb-4 block italic">
              Heritage Collections
            </span>
            <h2 className="text-3xl font-heading text-zinc-900 uppercase tracking-widest">
              Shop by Category
            </h2>
          </div>

          <div className="flex justify-center items-center gap-2 mb-12">
            <div className="h-[1px] w-12 bg-zinc-200"></div>
            <div className="flex gap-1">
              <span className="text-[10px]">★</span>
              <span className="text-[10px]">★</span>
              <span className="text-[10px]">★</span>
            </div>
            <div className="h-[1px] w-12 bg-zinc-200"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allCategories.map((cat, idx) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-zinc-50 mb-6 transition-all duration-700 group-hover:shadow-xl">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-[16px] tracking-[0.2em] uppercase text-zinc-900 mb-2 font-medium">
                  {cat.name}
                </h3>
                <div className="h-[1px] w-8 bg-zinc-300 mb-3 group-hover:w-16 transition-all duration-300"></div>
                <span className="text-[11px] tracking-[0.15em] text-zinc-500 uppercase font-medium">
                  See the Collection
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals Section */}
      {!loading && newArrivals.length > 4 && (
        <div className="max-w-7xl mx-auto px-6 py-32">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold mb-4 block italic">
                Recently Added
              </span>
              <h2 className="text-3xl font-heading text-zinc-900 uppercase tracking-widest">
                Latest Acquisitions
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-zinc-400 hover:text-zinc-900 transition-colors group border-b border-zinc-200 pb-1"
            >
              See All
              <ChevronRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {newArrivals.slice(4, 8).map((product, idx) => (
              <div
                key={product.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <ProductCard
                  product={product}
                  onQuickView={handleQuickView}
                  showActions={false}
                  showPrice={false}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concierge CTA */}
      <div className="bg-zinc-900 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Star
            size={40}
            className="mx-auto text-[#A68042] mb-8 opacity-50"
            strokeWidth={1}
          />
          <h2 className="text-3xl font-heading text-white uppercase tracking-widest mb-6">
            Need Guidance?
          </h2>
          <p className="text-zinc-400 italic mb-12 max-w-xl mx-auto leading-relaxed text-lg">
            Our dedicated concierge team is available to help you find the
            perfect piece, answer questions about our collection, or begin your
            bespoke journey.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/contact"
              className="bg-white text-black px-12 py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-[#A68042] hover:text-white transition-all"
            >
              Contact Concierge
            </Link>
            <Link
              href="/bespoke"
              className="border border-white/20 text-white px-12 py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:border-[#A68042] hover:text-[#A68042] transition-all"
            >
              Start Bespoke
            </Link>
          </div>
        </div>
      </div>

      {/* QuickView Modal */}
      {selectedProduct && (
        <QuickViewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
        />
      )}

      <Footer />
    </main>
  );
}
