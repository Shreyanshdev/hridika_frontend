"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import { getProducts } from "../lib/api";


export default function ProductGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await getProducts();
                const data = Array.isArray(res.data) ? res.data : [];
                // Latest 8 products
                setProducts(data.length > 0 ? data.slice(-8).reverse() : []);
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleQuickView = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-[14px] tracking-[0.4em] uppercase text-zinc-800 font-medium mb-4">
                            New Products
                        </h2>
                        <div className="flex justify-center items-center gap-2">
                            <div className="h-[1px] w-12 bg-zinc-200"></div>
                            <div className="flex gap-1">
                                <span className="text-[10px]">★</span>
                                <span className="text-[10px]">★</span>
                                <span className="text-[10px]">★</span>
                            </div>
                            <div className="h-[1px] w-12 bg-zinc-200"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {Array(8).fill(0).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-square bg-zinc-100 mb-4" />
                                <div className="h-3 bg-zinc-100 w-1/4 mx-auto mb-2" />
                                <div className="h-3 bg-zinc-100 w-3/4 mx-auto mb-2" />
                                <div className="h-3 bg-zinc-100 w-1/2 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold mb-3 block italic">
                        Latest Arrivals
                    </span>
                    <h2 className="text-[14px] tracking-[0.4em] uppercase text-zinc-800 font-medium mb-4">
                        New Products
                    </h2>
                    <div className="flex justify-center items-center gap-2">
                        <div className="h-[1px] w-12 bg-zinc-200"></div>
                        <div className="flex gap-1">
                            <span className="text-[10px]">★</span>
                            <span className="text-[10px]">★</span>
                            <span className="text-[10px]">★</span>
                        </div>
                        <div className="h-[1px] w-12 bg-zinc-200"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                    {products.map((product, idx) => (
                        <div
                            key={product.id}
                            className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${idx * 80}ms` }}
                        >
                            <ProductCard
                                product={product}
                                onQuickView={handleQuickView}
                            />
                        </div>
                    ))}
                </div>

                {selectedProduct && (
                    <QuickViewModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        product={selectedProduct}
                    />
                )}
            </div>
        </section>
    );
}
