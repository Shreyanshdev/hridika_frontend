"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "../lib/api";

// Only show these 5 categories
const VALID_CATEGORIES = ["bangles", "bracelets", "earrings", "necklaces", "rings"];

// Map category names to images for display
const CATEGORY_IMAGES = {
    bangles: "/assets/pic8.jpg",
    bracelets: "/assets/pic3.jpg",
    earrings: "/assets/pic9.jpg",
    necklaces: "/assets/pic1.jpg",
    necklace: "/assets/pic1.jpg",
    rings: "/assets/pic6.jpg",
};

const DEFAULT_IMAGE = "/assets/pic4.jpg";

export default function CategorySection() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                const data = res.data;
                if (Array.isArray(data) && data.length > 0) {
                    // Filter to only valid categories
                    const filtered = data.filter((name) =>
                        VALID_CATEGORIES.includes(name.toLowerCase())
                    );
                    const formatted = filtered.map((name) => ({
                        name: name,
                        image: CATEGORY_IMAGES[name.toLowerCase()] || DEFAULT_IMAGE,
                        href: `/category/${name.toLowerCase()}`,
                    }));
                    setCategories(formatted);
                } else {
                    setCategories([]);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-[14px] tracking-[0.4em] uppercase text-zinc-800 font-medium mb-4">
                            Popular Collections
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {Array(4).fill(0).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-square bg-zinc-100 mb-6" />
                                <div className="h-4 bg-zinc-100 w-1/2 mx-auto mb-2" />
                                <div className="h-2 bg-zinc-100 w-1/3 mx-auto" />
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
                        Heritage Collections
                    </span>
                    <h2 className="text-[14px] tracking-[0.4em] uppercase text-zinc-800 font-medium mb-4">
                        Popular Collections
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categories.map((category, idx) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="group flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="relative aspect-square w-full overflow-hidden bg-zinc-50 mb-6 transition-all duration-700 group-hover:shadow-xl">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <h3 className="text-[16px] tracking-[0.2em] uppercase text-zinc-900 mb-2 font-medium">
                                {category.name}
                            </h3>
                            <div className="h-[1px] w-8 bg-zinc-300 mb-3 group-hover:w-16 transition-all duration-300"></div>
                            <span className="text-[11px] tracking-[0.15em] text-zinc-500 uppercase font-medium">
                                See the Collection
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
