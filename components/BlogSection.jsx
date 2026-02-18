"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
    {
        id: 1,
        title: "Sample Blog Post With Left Sidebar",
        author: "Jin Alcold",
        comments: 58,
        date: { month: "JUL", day: "08" },
        excerpt: "Shoe street style leather tote oversized sweatshirt A.P.C. Prada Saffiano crop slipper denim shorts specmint...",
        image: "/assets/pic5.jpg"
    },
    {
        id: 2,
        title: "Vel Illum Qui Dolorem Eum Fugiat",
        author: "Jin Alcold",
        comments: 4,
        date: { month: "JUNE", day: "30" },
        excerpt: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem...",
        image: "/assets/pic6.jpg"
    },
    {
        id: 3,
        title: "Sample Blog Post Full Width",
        author: "Jin Alcold",
        comments: 149,
        date: { month: "JUNE", day: "30" },
        excerpt: "Shoe street style leather tote oversized sweatshirt A.P.C. Prada Saffiano crop slipper denim shorts specmint...",
        image: "/assets/pic7.jpg"
    }
];

export default function BlogSection() {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-[14px] tracking-[0.4em] uppercase text-zinc-800 font-medium mb-4">
                        Latest News
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

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Featured Post */}
                    <div className="lg:w-1/2 group">
                        <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 mb-8">
                            <Image
                                src="/assets/pic8.jpg"
                                alt="Featured News"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            <div className="absolute bottom-10 left-10 text-white z-10">
                                <span className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2 block">Premium Collection</span>
                                <h3 className="text-3xl font-heading uppercase tracking-widest leading-tight">
                                    THE | QUEEN <br /> <span className="italic normal-case tracking-normal">Jeweller</span>
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* List Posts */}
                    <div className="lg:w-1/2 flex flex-col gap-10">
                        {blogPosts.map((post) => (
                            <div key={post.id} className="flex gap-8 group/item">
                                <div className="flex flex-col items-center justify-center min-w-[70px] h-[70px] border border-zinc-100 text-center uppercase tracking-tighter">
                                    <span className="text-[10px] text-zinc-400 font-bold">{post.date.month}</span>
                                    <span className="text-[20px] text-zinc-800 font-heading font-medium leading-none">{post.date.day}</span>
                                </div>
                                <div>
                                    <h4 className="text-[16px] font-heading-upper font-medium text-zinc-900 mb-2 group-hover/item:text-[#A68042] transition-colors leading-snug uppercase tracking-wider">
                                        <Link href={`/articles/${post.id}`}>{post.title}</Link>
                                    </h4>
                                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-zinc-400 mb-4">
                                        <span className="flex items-center gap-1 italic lowercase bg-zinc-50 px-2 py-0.5">by {post.author}</span>
                                        <span className="flex items-center gap-1 italic lowercase bg-zinc-50 px-2 py-0.5">{post.comments} Comments</span>
                                    </div>
                                    <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-2 italic">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
