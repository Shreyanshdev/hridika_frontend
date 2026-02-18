"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts } from "../lib/api";
// import { staticProducts } from "../lib/staticData";

export default function FeaturedProduct() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getProducts();
                const data = Array.isArray(res.data) ? res.data : [];
                setAllProducts(data);
                setProduct(data[0] || null);
            } catch (err) {
                console.error("Failed to fetch featured products:", err);
                setAllProducts([]);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handlePrev = () => {
        const newIdx = currentIdx === 0 ? allProducts.length - 1 : currentIdx - 1;
        setCurrentIdx(newIdx);
        setProduct(allProducts[newIdx]);
    };

    const handleNext = () => {
        const newIdx = currentIdx === allProducts.length - 1 ? 0 : currentIdx + 1;
        setCurrentIdx(newIdx);
        setProduct(allProducts[newIdx]);
    };

    if (loading || !product) {
        return (
            <section className="py-20 bg-[#FDF6EE]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="animate-pulse flex flex-col md:flex-row items-center gap-12 p-12">
                        <div className="w-full md:w-1/3 space-y-4">
                            <div className="h-8 bg-[#EDE4D7] w-3/4" />
                            <div className="h-4 bg-[#EDE4D7] w-1/2" />
                            <div className="h-20 bg-[#EDE4D7] w-full" />
                        </div>
                        <div className="w-full md:w-1/3 aspect-square bg-[#EDE4D7]" />
                        <div className="w-full md:w-1/3 space-y-4">
                            <div className="h-6 bg-[#EDE4D7] w-1/3" />
                            <div className="h-10 bg-[#EDE4D7] w-2/3" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-24 bg-[#FDF6EE] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold mb-3 block italic">
                        Spotlight
                    </span>
                    <h2 className="text-[14px] tracking-[0.4em] uppercase text-zinc-800 font-medium">
                        Featured Masterpiece
                    </h2>
                </div>

                {/* Featured Card */}
                <div className="relative bg-[#F8F0E5] rounded-2xl p-6 md:p-12 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">

                        {/* Left — Product Info */}
                        <div className="space-y-6 order-2 md:order-1">
                            <div>
                                {product.category && (
                                    <span className="text-[10px] uppercase tracking-widest text-[#A68042] font-bold mb-2 block">
                                        {product.category}
                                    </span>
                                )}
                                <h3 className="text-3xl md:text-4xl font-heading text-zinc-900 leading-tight italic">
                                    {product.name}
                                </h3>
                            </div>

                            {/* Stars */}
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className="text-[#A68042] fill-[#A68042]"
                                        />
                                    ))}
                                </div>
                                <span className="text-zinc-500 text-[12px] italic">
                                    (5/5)
                                </span>
                                <span className="text-zinc-700 text-[12px] font-medium">
                                    Premium Quality
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-zinc-600 text-[14px] leading-relaxed">
                                {product.description ||
                                    "A truly exquisite piece from our collection, crafted with the finest attention to detail and premium materials."}
                            </p>

                            <Link
                                href={`/products/${product.id}`}
                                className="inline-block border border-[#A68042] text-[#A68042] px-8 py-3 text-[11px] uppercase tracking-widest font-bold hover:bg-[#A68042] hover:text-white transition-all duration-300 rounded-full"
                            >
                                Learn More
                            </Link>
                        </div>

                        {/* Center — Product Image */}
                        <div className="relative order-1 md:order-2 flex justify-center">
                            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl bg-zinc-900">
                                <Image
                                    src={
                                        (Array.isArray(product.images) && product.images.length > 0 && typeof product.images[0] === 'string' && product.images[0].trim() !== "")
                                            ? product.images[0]
                                            : (typeof product.images === 'string' && product.images.trim() !== "")
                                                ? product.images
                                                : "https://placehold.co/600x600/1a1a1a/A68042?text=Product"
                                    }
                                    alt={product.name}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            {/* Nav Arrows */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-[#A68042] hover:text-white transition-colors"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-[#A68042] hover:text-white transition-colors"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* Right — Price & Materials */}
                        <div className="space-y-6 order-3">
                            {/* Price */}
                            <div>
                                <span className="text-zinc-500 text-[12px] uppercase tracking-widest font-bold block mb-1">
                                    Price:
                                </span>
                                <span className="text-4xl md:text-5xl font-heading text-zinc-900">
                                    ₹{Number(product.price).toLocaleString("en-IN")}
                                </span>
                                {product.oldPrice && (
                                    <span className="text-zinc-400 text-lg line-through ml-3">
                                        ₹{Number(product.oldPrice).toLocaleString("en-IN")}
                                    </span>
                                )}
                            </div>

                            {/* Materials */}
                            {(product.metal_name || product.material) && (
                                <div>
                                    <span className="text-zinc-500 text-[12px] uppercase tracking-widest font-bold block mb-3">
                                        Materials:
                                    </span>
                                    <div className="space-y-2">
                                        {product.metal_name && (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2
                                                    size={16}
                                                    className="text-[#A68042]"
                                                />
                                                <span className="text-zinc-700 text-[13px]">
                                                    {product.metal_name}
                                                </span>
                                            </div>
                                        )}
                                        {product.material && (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2
                                                    size={16}
                                                    className="text-[#A68042]"
                                                />
                                                <span className="text-zinc-700 text-[13px]">
                                                    {product.material}
                                                </span>
                                            </div>
                                        )}
                                        {product.weight && (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2
                                                    size={16}
                                                    className="text-[#A68042]"
                                                />
                                                <span className="text-zinc-700 text-[13px]">
                                                    Weight: {product.weight}g
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Testimonial quote */}
                            <div className="border-t border-[#E8DED0] pt-5">
                                <p className="text-zinc-600 italic text-[13px] leading-relaxed mb-4">
                                    &ldquo;Crafted with perfection, this piece embodies the heritage of traditional Indian artistry.&rdquo;
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#A68042] flex items-center justify-center text-white font-heading text-sm">
                                        H
                                    </div>
                                    <div>
                                        <p className="text-zinc-900 text-[12px] font-bold">
                                            Hridika Atelier
                                        </p>
                                        <p className="text-[#A68042] text-[10px] uppercase tracking-widest">
                                            Master Artisan
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Slide indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {allProducts.slice(0, Math.min(allProducts.length, 8)).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setCurrentIdx(i);
                                    setProduct(allProducts[i]);
                                }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIdx
                                    ? "w-8 bg-[#A68042]"
                                    : "w-1.5 bg-zinc-300 hover:bg-zinc-400"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
