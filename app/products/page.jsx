"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  LayoutGrid,
  ArrowUpDown,
  Sparkles,
  Filter as FilterIcon,
} from "lucide-react";
import ProductCard from "../../components/ProductCard";
import QuickViewModal from "../../components/QuickViewModal";
import Footer from "../../components/Footer";
import { getProducts, getCategories } from "../../lib/api";

const CATEGORIES = ["All", "Bangles", "Rings", "Earrings", "Bracelets", "Necklaces"];
const METALS = ["All", "Gold", "Silver", "Platinum", "White Gold"];
const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A to Z", value: "name_asc" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMetal, setSelectedMetal] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [gridCols, setGridCols] = useState(3);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        const data = res.data || [];
        const formatted = data.map(name => ({
          name,
          href: `/category/${name.toLowerCase()}`,
          image: `/assets/pic4.jpg` // Default placeholder
        }));
        setAllCategories(formatted);
      } catch {
        setAllCategories([]);
      }
    };
    fetchProducts();
    fetchCats();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Metal filter
    if (selectedMetal !== "All") {
      result = result.filter(
        (p) => p.metal_name?.toLowerCase() === selectedMetal.toLowerCase()
      );
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
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
        // newest — reverse order
        result.reverse();
    }

    return result;
  }, [products, selectedCategory, selectedMetal, searchQuery, sortBy]);

  const activeFilterCount = [
    selectedCategory !== "All",
    selectedMetal !== "All",
    searchQuery.trim().length > 0,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedMetal("All");
    setSearchQuery("");
    setSortBy("newest");
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[400px] md:h-[480px] overflow-hidden bg-zinc-950">
        <Image
          src="/assets/unsplash/jewel-display-1.jpg"
          alt="The Collection"
          fill
          priority
          className="object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end max-w-7xl mx-auto px-6 pb-16">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-zinc-500 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">The Collection</span>
          </nav>
          <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold mb-4 block italic">
            Heritage Archive
          </span>
          <h1 className="text-5xl md:text-7xl font-heading text-white uppercase tracking-widest leading-tight">
            The <span className="italic normal-case tracking-normal text-[#A68042]">Collection</span>
          </h1>
        </div>
      </div>

      {/* Mobile Header (Breadcrumb + Controls) - Mobile Only */}
      <div className="sticky top-[64px] z-30 bg-white/95 backdrop-blur-sm border-b border-zinc-100 md:hidden">
        <div className="px-6 py-4 space-y-4">
          {/* Mobile Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-zinc-400">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="text-[8px] opacity-30">/</span>
            <span className="text-zinc-800 font-medium">The Collection</span>
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
      <div className="sticky top-[80px] z-30 bg-white border-b border-zinc-100 shadow-sm scrollbar-hide hidden md:block">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Desktop Filter Button - Hidden since we force open, but kept for logic consistency if we want to toggle */}
            {/* Actually, user said FORCE OPEN, so maybe we don't need the toggle on desktop? 
                 But the toggle logic controls the sidebar width. 
                 Since we forced sidebar width in CSS for lg screens, this button visual state might mismatch, 
                 but functionally it's fine. Let's hide it on Large screens if it's always open? 
                 User said "don't allow to disable filter". So sidebar is always there. 
                 The button becomes redundant on Large screens. 
                 We can hide it on LG. 
             */}
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

            {/* On Desktop/Large, Show "Filters Active" badge or nothing? */}
            <div className="hidden lg:flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-zinc-400">
              <SlidersHorizontal size={14} /> Filters Enabled
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-2"
              >
                <X size={12} /> Clear All
              </button>
            )}
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 hidden md:block">
              {filteredProducts.length} {filteredProducts.length === 1 ? "Piece" : "Pieces"}
            </span>

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
              <ArrowUpDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>

            <div className="hidden md:flex items-center border border-zinc-100">
              <button
                onClick={() => setGridCols(3)}
                className={`p-2.5 transition-colors ${gridCols === 3 ? "bg-zinc-900 text-white" : "text-zinc-300 hover:text-zinc-600"}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-2.5 transition-colors ${gridCols === 4 ? "bg-zinc-900 text-white" : "text-zinc-300 hover:text-zinc-600"}`}
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

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-12">
          {/* Filters Sidebar */}
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
                  <Search size={12} className="text-[#A68042]" /> Search Archive
                </h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search pieces..."
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

              {/* Category Filter */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest font-black text-zinc-900 flex items-center gap-3">
                  <FilterIcon size={12} className="text-[#A68042]" /> Classification
                </h4>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-4 py-3 text-[11px] uppercase tracking-widest font-medium transition-all ${selectedCategory === cat
                        ? "bg-zinc-900 text-white font-bold"
                        : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
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

              {/* Category Images */}
              <div className="space-y-4 pt-8 border-t border-zinc-100">
                <h4 className="text-[10px] uppercase tracking-widest font-black text-zinc-900">
                  Explore Collections
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {allCategories.map((cat) => (
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
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-square bg-zinc-100 mb-4" />
                      <div className="h-3 bg-zinc-100 w-3/4 mx-auto mb-2" />
                      <div className="h-3 bg-zinc-100 w-1/2 mx-auto" />
                    </div>
                  ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-40">
                <Search className="mx-auto text-zinc-100 w-20 h-20 mb-8" strokeWidth={1} />
                <h2 className="text-2xl font-heading uppercase tracking-widest text-zinc-400 mb-4">
                  No Pieces Found
                </h2>
                <p className="text-zinc-400 italic mb-10 max-w-md mx-auto">
                  Your search criteria did not match any pieces in our heritage archive. Please refine your filters or explore our full collection.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-block bg-zinc-900 text-white px-12 py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-[#A68042] transition-all"
                >
                  View Full Collection
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-2 ${gridCols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
                  } gap-x-8 gap-y-12`}
              >
                {filteredProducts.map((product, idx) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${(idx % 8) * 80}ms` }}
                  >
                    <ProductCard
                      product={product}
                      onQuickView={handleQuickView}
                    />
                  </div>
                ))}
              </div>
            )}
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
