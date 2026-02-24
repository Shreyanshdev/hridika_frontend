"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Search,
  ArrowUpDown,
  X,
  Grid3X3,
  LayoutGrid,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import ProductCard from "../../../components/ProductCard";
import QuickViewModal from "../../../components/QuickViewModal";
import Footer from "../../../components/Footer";
import { getProductsByCategory, getCategories } from "../../../lib/api";

const VALID_CATEGORIES = ["bangles", "bracelets", "earrings", "necklaces", "rings"];
const METALS = ["All", "Gold", "Silver"];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A to Z", value: "name_asc" },
];

const CATEGORY_IMAGES = {
  bangles: "/assets/pic8.jpg",
  bracelets: "/assets/pic3.jpg",
  earrings: "/assets/pic9.jpg",
  necklaces: "/assets/pic1.jpg",
  necklace: "/assets/pic1.jpg",
  rings: "/assets/pic6.jpg",
};

const CATEGORY_TAGLINES = {
  bangles: "Circles of heritage, crafted with devotion.",
  rings: "Symbols of permanence, designed for eternity.",
  earrings: "Delicate accents that frame your radiance.",
  necklaces: "Cascading elegance that captures the light.",
  necklace: "Cascading elegance that captures the light.",
  bracelets: "Adorning the wrist with timeless artistry.",
  pendant: "Graceful pendants that speak of sophistication.",
  mala: "Sacred strands woven with spiritual significance.",
  brooches: "Ornamental accents of timeless distinction.",
  buttons: "Functional elegance in miniature detail.",
};

export default function CategoryPage() {
  const { category } = useParams();
  const categoryName =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [gridCols, setGridCols] = useState(3);
  const [selectedMetal, setSelectedMetal] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setProducts([]);
      try {
        const res = await getProductsByCategory(category);
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Metal filter
    if (selectedMetal !== "All") {
      result = result.filter(
        (p) => p.metal_name?.toLowerCase() === selectedMetal.toLowerCase()
      );
    }

    // Sort
    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price_desc":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name_asc":
        result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      default:
        result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, searchQuery, sortBy, selectedMetal]);

  const [otherCategories, setOtherCategories] = useState([]);

  useEffect(() => {
    const fetchOther = async () => {
      try {
        const res = await getCategories();
        const data = res.data || [];
        const formatted = data
          .filter(name =>
            VALID_CATEGORIES.includes(name.toLowerCase()) &&
            name.toLowerCase() !== category.toLowerCase()
          )
          .map(name => ({
            name,
            href: `/category/${name.toLowerCase()}`,
            image: CATEGORY_IMAGES[name.toLowerCase()] || `/assets/pic4.jpg`
          }));
        setOtherCategories(formatted);
      } catch {
        setOtherCategories([]);
      }
    };
    fetchOther();
  }, [category]);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Prevent scroll when mobile filters are open
  useEffect(() => {
    if (showFilters && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showFilters]);

  const heroImage =
    CATEGORY_IMAGES[category.toLowerCase()] ||
    "/assets/unsplash/jewel-display-1.jpg";
  const tagline =
    CATEGORY_TAGLINES[category.toLowerCase()] ||
    "Discover our curated selection of fine jewelry.";

  const activeFilterCount = [
    selectedMetal !== "All",
    searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  return (
    <main className="bg-white min-h-screen">
      {/* Category Hero */}
      <div className="relative h-[300px] md:h-[560px] overflow-hidden bg-zinc-950">
        <Image
          src={heroImage}
          alt={categoryName}
          fill
          priority
          className="object-cover opacity-30 scale-110 transition-transform duration-[10s] hover:scale-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 pb-20">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-zinc-500 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/products"
              className="hover:text-white transition-colors"
            >
              Collection
            </Link>
            <span>/</span>
            <span className="text-white">{categoryName}</span>
          </nav>

          <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold mb-4 block italic">
            Curated Selection
          </span>
          <h1 className="text-6xl md:text-8xl font-heading text-white uppercase tracking-widest leading-tight mb-6">
            {categoryName}
          </h1>
          <p className="text-zinc-400 italic text-lg max-w-lg">{tagline}</p>
        </div>
      </div>

      {/* Mobile Header (Breadcrumb + Controls) - Mobile Only */}
      <div className="sticky top-[64px] z-30 bg-white/95 backdrop-blur-sm border-b border-zinc-100 md:hidden">
        <div className="px-6 py-4 space-y-4">
          {/* Mobile Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-zinc-400">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="text-[8px] opacity-30">/</span>
            <Link href="/products" className="hover:text-black transition-colors">Collection</Link>
            <span className="text-[8px] opacity-30">/</span>
            <span className="text-zinc-800 font-medium">{categoryName}</span>
          </nav>

          {/* Mobile Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-all border ${showFilters
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-white text-zinc-600 border-zinc-200"
                }`}
            >
              <SlidersHorizontal size={12} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-[#A68042] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full ml-1">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <div className="relative flex-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-zinc-50 border border-zinc-200 px-4 py-3 pr-8 text-[10px] uppercase tracking-widest font-bold focus:outline-none focus:border-zinc-300 text-zinc-600 rounded-none"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar - Desktop Only */}
      <div className="sticky top-[60px] md:top-[80px] z-30 bg-white border-b border-zinc-100 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`lg:hidden flex items-center gap-3 px-6 py-3 text-[10px] uppercase tracking-widest font-bold transition-all border ${showFilters
                ? "bg-zinc-900 text-white border-zinc-900"
                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-900"
                }`}
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-[#A68042] text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Desktop Filters Label */}
            <div className="hidden lg:flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-400">
              <SlidersHorizontal size={14} /> Filters Enabled
            </div>

            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 hidden sm:block">
              {loading
                ? "Loading..."
                : `${filteredProducts.length} ${filteredProducts.length === 1 ? "Piece" : "Pieces"}`}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-zinc-50 border border-zinc-100 px-6 py-3 pr-10 text-[10px] uppercase tracking-widest font-bold focus:outline-none focus:border-zinc-300 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown
                size={12}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
              />
            </div>

            <div className="hidden md:flex items-center border border-zinc-100">
              <button
                onClick={() => setGridCols(3)}
                className={`p-2.5 transition-colors ${gridCols === 3
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-300 hover:text-zinc-600"
                  }`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-2.5 transition-colors ${gridCols === 4
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-300 hover:text-zinc-600"
                  }`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Product List Section */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-12">
          {/* Filters Sidebar / Drawer */}
          <div
            className={`
              fixed lg:sticky top-0 lg:top-[140px] md:lg:top-[160px] left-0 z-50 lg:z-0
              h-full lg:h-[calc(100vh-140px)] md:lg:h-[calc(100vh-160px)]
              w-[300px] lg:w-[260px] bg-white lg:bg-transparent
              transition-all duration-500 ease-in-out
              overflow-y-auto py-12 px-6 lg:px-0 scrollbar-hide flex-shrink-0
              ${showFilters
                ? "translate-x-0 opacity-100 lg:w-[260px]"
                : "-translate-x-full lg:translate-x-0 lg:w-[260px] lg:opacity-100 lg:px-0"
              }
            `}
          >
            <div className="w-full lg:w-[260px] space-y-12">
              {/* Mobile Close Button */}
              <div className="flex lg:hidden items-center justify-between mb-8 pb-4 border-b border-zinc-100">
                <span className="text-[10px] uppercase tracking-widest font-black text-zinc-900">Filters</span>
                <button onClick={() => setShowFilters(false)} className="text-zinc-400 hover:text-zinc-900">
                  <X size={20} />
                </button>
              </div>

              {/* Search */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest font-black text-zinc-900 flex items-center gap-3">
                  <Search size={12} className="text-[#A68042]" /> Filter Archive
                </h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search in category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-50 border-b border-zinc-100 focus:border-zinc-900 py-3 pr-10 text-sm text-zinc-900 font-medium focus:outline-none transition-all placeholder:text-zinc-400 placeholder:italic"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Metal Filter */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest font-black text-zinc-900 flex items-center gap-3">
                  <Sparkles size={12} className="text-[#A68042]" /> Noble Metal
                </h4>
                <div className="space-y-1">
                  {METALS.map((metal) => (
                    <button
                      key={metal}
                      onClick={() => setSelectedMetal(metal)}
                      className={`w-full text-left px-4 py-3 text-[11px] uppercase tracking-widest font-medium transition-all ${selectedMetal === metal
                        ? "bg-zinc-900 text-white font-bold"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                        }`}
                    >
                      {metal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Other Collections */}
              <div className="space-y-4 pt-8 border-t border-zinc-100">
                <h4 className="text-[10px] uppercase tracking-widest font-black text-zinc-900">
                  Other Collections
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {otherCategories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="group relative aspect-square overflow-hidden"
                    >
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-zinc-950/40 group-hover:bg-zinc-950/20 transition-colors" />
                      <span className="absolute bottom-3 left-3 text-white text-[9px] uppercase tracking-widest font-bold">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 py-12">
            {loading ? (
              <div className={`grid grid-cols-2 ${gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-x-8 gap-y-12`}>
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-square bg-zinc-100 mb-4" />
                    <div className="h-3 bg-zinc-100 w-3/4 mx-auto mb-2" />
                    <div className="h-3 bg-zinc-100 w-1/2 mx-auto" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-40">
                <Sparkles className="mx-auto text-zinc-100 w-20 h-20 mb-8" strokeWidth={1} />
                <h2 className="text-2xl font-heading uppercase tracking-widest text-zinc-400 mb-4">Collection Arriving Soon</h2>
                <button
                  onClick={() => setSearchQuery("")}
                  className="inline-block bg-zinc-900 text-white px-12 py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-[#A68042] transition-all"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className={`grid grid-cols-2 ${gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-x-8 gap-y-12`}>
                {filteredProducts.map((product, idx) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${(idx % 8) * 80}ms` }}
                  >
                    <ProductCard product={product} onQuickView={handleQuickView} />
                  </div>
                ))}
              </div>
            )}

            {/* Related Collections */}
            {otherCategories.length > 0 && (
              <div className="mt-24 pt-24 border-t border-zinc-100">
                <div className="text-center mb-16">
                  <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold mb-4 block italic">Discover More</span>
                  <h2 className="text-xl font-heading text-zinc-900 uppercase tracking-widest">Bridal & Heritage Selections</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {otherCategories.slice(0, 3).map((cat, idx) => (
                    <Link key={cat.name} href={cat.href} className="group relative aspect-square overflow-hidden rounded-lg">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                      <div className="absolute inset-0 bg-zinc-950/40" />
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <h3 className="text-white text-center font-heading text-lg uppercase tracking-widest">{cat.name}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* QuickView Modal */}
      {selectedProduct && (
        <QuickViewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
        />
      )}
    </main>
  );
}
