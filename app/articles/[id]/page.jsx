"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowRight, Calendar, Clock, User, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";

const articlesData = [
    {
        id: 1,
        title: "The Art of Jewelry Making",
        excerpt: "Discover the intricate process of crafting exquisite jewelry pieces from base metal to masterpiece.",
        content: `Jewelry making is an ancient art that combines skill, creativity, and precision. Each piece is carefully crafted to showcase the beauty of gemstones and precious metals. From the initial sketch to the final polish, every step is a testament to the artisan's dedication.

The process begins with a concept — a vision of beauty brought to life through sketches on paper. Master artisans study the proportions, the way light will interact with surfaces, and how the piece will sit against the skin.

From there, the raw materials are selected: precious metals are weighed and prepared, gemstones are evaluated for cut, clarity, color, and carat. The metal is then shaped through a combination of ancient techniques — casting, forging, soldering — each requiring years of practice to perfect.

The setting of stones is perhaps the most delicate stage. A single slip can crack a gemstone or misalign a prong. Artisans work under magnification, using tools so fine they could be mistaken for surgical instruments.

Finally, the piece undergoes finishing: polishing to a mirror sheen, oxidizing for contrast where needed, and a final quality inspection that leaves no detail unchecked. The result is not merely jewelry — it is wearable art, a legacy meant to be treasured across generations.`,
        date: "2025-12-20",
        author: "Siddharth Jain",
        category: "Craftsmanship",
        image: "/assets/pic1.jpg",
        readTime: "8 min read"
    },
    {
        id: 2,
        title: "Silver Care Guide: Ensuring Eternal Luster",
        excerpt: "Learn the secrets to maintaining and caring for your silver jewelry to keep it shining for generations.",
        content: `Silver jewelry requires proper care to maintain its shine. Regular cleaning with a soft cloth and storing in a dry place will keep your pieces looking beautiful for years to come. Avoid exposure to harsh chemicals and perfumes to prevent premature tarnishing.

Here are five essential tips to keep your silver jewelry looking its best:

1. **Store Properly** — Keep each silver piece in a separate soft cloth pouch or anti-tarnish bag. Exposure to air accelerates tarnishing, so airtight containers or ziplock bags with the air pressed out work wonders.

2. **Clean Regularly** — A gentle polish with a microfiber or silver polishing cloth after every wear removes oils and residue. For deeper cleaning, a paste of baking soda and water applied with a soft toothbrush works beautifully.

3. **Avoid Chemicals** — Remove silver jewelry before swimming, showering, or applying lotions, perfumes, and hairsprays. Chlorine and sulfur compounds are particularly harmful to silver.

4. **Wear Often** — Ironically, wearing your silver regularly helps prevent tarnish. The natural oils in your skin provide a gentle polish, keeping the surface bright and lustrous.

5. **Professional Maintenance** — For heavily tarnished or intricate pieces, consider an annual professional cleaning. A jeweler can also check for loose stones or weakened clasps, preventing loss and damage.

With these simple practices, your silver collection will remain a source of pride and beauty for decades to come.`,
        date: "2025-12-15",
        author: "Meera Reddy",
        category: "Education",
        image: "/assets/pic2.jpg",
        readTime: "5 min read"
    },
    {
        id: 3,
        title: "Understanding Hallmarks & Certification",
        excerpt: "A comprehensive guide to understanding what jewelry hallmarks mean and why they matter for your investment.",
        content: `Hallmarks are official marks stamped on jewelry to indicate its purity and authenticity. A 925 hallmark indicates 92.5% pure silver, ensuring quality and value. Understanding these marks is crucial for making informed purchases and protecting your investment.

**What is a Hallmark?**
A hallmark is a guarantee of fineness — the purity of the precious metal in your jewelry. In India, the Bureau of Indian Standards (BIS) manages the hallmarking process for gold and silver.

**Common Hallmark Symbols:**
- **BIS Logo** — The triangle mark of the Bureau of Indian Standards
- **Purity Grade** — For gold: 916 (22K), 750 (18K), 585 (14K). For silver: 925 (Sterling), 999 (Fine)
- **Assaying Centre Mark** — Identifies which certified centre tested and marked the piece
- **Jeweler's Identification Mark** — A unique code for the manufacturer or retailer

**Why Hallmarks Matter:**
Without hallmarks, you have no guarantee of purity. Unscrupulous sellers may mix lower-grade metals, reducing value while charging premium prices. A hallmarked piece has been independently verified, protecting your investment.

**Tips for Buyers:**
- Always ask for a hallmarked piece and verify the marks with a magnifying glass
- Request a certificate of authenticity for high-value purchases
- Compare the hallmark against BIS standards to ensure legitimacy
- Keep your receipts and certificates for insurance and resale purposes

Understanding hallmarks transforms you from a casual buyer into an informed collector — and that knowledge is worth its weight in gold.`,
        date: "2025-12-10",
        author: "Arjun Mehta",
        category: "Buying Guide",
        image: "/assets/pic3.jpg",
        readTime: "6 min read"
    },
    {
        id: 4,
        title: "The Renaissance of Temple Jewelry",
        excerpt: "Exploring the revival of traditional temple jewelry designs in modern high-fashion circles.",
        content: `Temple jewelry, once reserved for divine idols, has found its way into the bridal trousseaus of modern women. Its intricate carvings and historical significance make it more than just an ornament; it's a wearable piece of history.

**Origins in Devotion**
Temple jewelry originated in the 9th century during the Chola dynasty in South India. Artisans created elaborate gold pieces to adorn the idols of Hindu deities. These designs featured motifs of gods, goddesses, peacocks, and lotuses — each carrying deep spiritual symbolism.

**From Sacred to Secular**
Over centuries, temple jewelry transitioned from purely devotional use to being worn by Devadasis (temple dancers) during performances. The bharatanatyam tradition kept these designs alive, and gradually they entered mainstream fashion, particularly in bridal wear.

**The Modern Revival**
Today, temple jewelry is experiencing a renaissance in the fashion world. Designers are reinterpreting traditional motifs with contemporary sensibilities — pairing ornate temple necklaces with minimalist Western wear, or creating lighter versions suitable for everyday elegance.

**Key Characteristics:**
- **Coin Work (Kaasu Malai)** — Necklaces strung with embossed gold coins
- **Kemp Stones** — Red and green stones set in gold, creating vibrant contrast
- **Nagas Work** — Serpent motifs representing protection and divinity
- **Lakshmi Motifs** — The goddess of wealth, a recurring theme in prosperity-themed pieces

The beauty of temple jewelry lies in its duality: it connects us to centuries of tradition while remaining strikingly relevant in modern aesthetics. Each piece tells a story that transcends time.`,
        date: "2025-11-28",
        author: "Priya Sharma",
        category: "Trends",
        image: "/assets/pic4.jpg",
        readTime: "10 min read"
    }
];

export default function ArticleDetailPage() {
    const params = useParams();
    const article = articlesData.find(a => a.id === parseInt(params.id));

    if (!article) {
        return (
            <main className="bg-white min-h-screen">
                <div className="max-w-4xl mx-auto px-6 py-40 text-center">
                    <h1 className="text-4xl font-heading text-zinc-900 uppercase tracking-widest mb-6">Article Not Found</h1>
                    <p className="text-zinc-500 italic mb-12">The article you are looking for does not exist.</p>
                    <Link href="/articles" className="text-[11px] uppercase tracking-widest font-bold border-b border-zinc-900 pb-1 hover:text-[#A68042] hover:border-[#A68042] transition-all">
                        Return to Journal
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    // Get related articles (others in same category, or just others)
    const relatedArticles = articlesData.filter(a => a.id !== article.id).slice(0, 2);

    return (
        <main className="bg-white min-h-screen">
            {/* Hero Image */}
            <div className="relative h-[400px] md:h-[560px] overflow-hidden bg-zinc-950">
                <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    priority
                    className="object-cover opacity-40 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                <div className="relative z-10 h-full flex flex-col justify-end max-w-4xl mx-auto px-6 pb-16">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="bg-[#A68042] text-white px-4 py-1.5 text-[9px] uppercase tracking-widest font-bold">
                                {article.category}
                            </span>
                            <span className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                                <Clock size={12} /> {article.readTime}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-heading text-white uppercase tracking-widest leading-tight">
                            {article.title}
                        </h1>
                        <div className="flex items-center gap-6 text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
                            <span className="flex items-center gap-2">
                                <User size={12} /> {article.author}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar size={12} /> {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <div className="max-w-3xl mx-auto px-6 py-20">
                {/* Back Link */}
                <Link href="/articles" className="inline-flex items-center gap-3 text-zinc-400 hover:text-zinc-900 transition-colors group mb-16 block">
                    <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Back to Journal</span>
                </Link>

                {/* Excerpt */}
                <p className="text-xl text-zinc-600 italic leading-relaxed border-l-2 border-[#A68042] pl-8 mb-16">
                    {article.excerpt}
                </p>

                {/* Body */}
                <div className="prose prose-zinc prose-lg max-w-none">
                    {article.content.split('\n\n').map((paragraph, idx) => {
                        // Handle bold headings
                        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                            return (
                                <h3 key={idx} className="text-xl font-heading text-zinc-900 uppercase tracking-widest mt-12 mb-4">
                                    {paragraph.replace(/\*\*/g, '')}
                                </h3>
                            );
                        }
                        if (paragraph.startsWith('**')) {
                            const parts = paragraph.split('**');
                            return (
                                <div key={idx} className="mb-6">
                                    {parts.map((part, i) =>
                                        i % 2 === 1 ? (
                                            <h4 key={i} className="text-lg font-bold text-zinc-900 mb-2">{part}</h4>
                                        ) : part.trim() ? (
                                            <p key={i} className="text-zinc-600 leading-relaxed">{part}</p>
                                        ) : null
                                    )}
                                </div>
                            );
                        }
                        if (paragraph.match(/^\d+\./)) {
                            const items = paragraph.split('\n').filter(l => l.trim());
                            return (
                                <div key={idx} className="my-8 space-y-4">
                                    {items.map((item, i) => (
                                        <div key={i} className="flex gap-4 p-4 bg-zinc-50 border-l-2 border-[#A68042]">
                                            <p className="text-zinc-700 leading-relaxed text-sm">
                                                {item.replace(/^\d+\.\s*/, '').split('**').map((part, j) =>
                                                    j % 2 === 1 ? <strong key={j} className="text-zinc-900">{part}</strong> : part
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                        if (paragraph.startsWith('- ')) {
                            const items = paragraph.split('\n').filter(l => l.startsWith('- '));
                            return (
                                <ul key={idx} className="my-8 space-y-3">
                                    {items.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-zinc-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#A68042] mt-2.5 shrink-0" />
                                            <span className="leading-relaxed">
                                                {item.replace(/^- /, '').split('**').map((part, j) =>
                                                    j % 2 === 1 ? <strong key={j} className="text-zinc-900">{part}</strong> : part
                                                )}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            );
                        }
                        return (
                            <p key={idx} className="text-zinc-600 leading-relaxed mb-6 text-[16px]">
                                {paragraph}
                            </p>
                        );
                    })}
                </div>

                {/* Author Sign-off */}
                <div className="mt-20 pt-12 border-t border-zinc-100 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center">
                        <User size={20} className="text-zinc-400" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Written by</p>
                        <p className="font-heading text-zinc-900 tracking-wider uppercase">{article.author}</p>
                    </div>
                </div>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <div className="border-t border-zinc-100">
                    <div className="max-w-5xl mx-auto px-6 py-24">
                        <h2 className="text-2xl font-heading text-zinc-900 uppercase tracking-widest mb-16 text-center">
                            Continue <span className="italic normal-case tracking-normal text-[#A68042]">Reading</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {relatedArticles.map((related) => (
                                <Link key={related.id} href={`/articles/${related.id}`} className="group">
                                    <div className="relative aspect-video overflow-hidden mb-6">
                                        <Image src={related.image} alt={related.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-[9px] uppercase tracking-widest font-bold text-zinc-900">
                                            {related.category}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-zinc-400 text-[9px] uppercase tracking-widest font-bold mb-3">
                                        <span>{new Date(related.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        <span className="w-1 h-1 bg-zinc-200 rounded-full" />
                                        <span>{related.readTime}</span>
                                    </div>
                                    <h3 className="text-lg font-heading text-zinc-900 uppercase tracking-widest group-hover:text-[#A68042] transition-colors">
                                        {related.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
}
