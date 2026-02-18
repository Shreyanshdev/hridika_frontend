"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Heart, Truck, Scale } from "lucide-react";
import Footer from "../../../components/Footer";

export default function PoliciesPage() {
  const { type } = useParams();
  const router = useRouter();

  const policies = {
    return: {
      icon: Heart,
      title: "Return & Exchange Policy",
      subtitle: "Our Assurance of Satisfaction",
      intro: "We want you to be completely satisfied with your purchase. If you're not happy with your jewelry, we offer a hassle-free 30-day return or exchange policy.",
      content: [
        {
          heading: "30-Day Return Policy",
          text: "Items must be in original condition (unused, unworn) and include all original packaging and tags. This allows us to ensure the integrity of our collection."
        },
        {
          heading: "Refund Timeline",
          text: "Once we receive and inspect your return at our atelier, refunds will be processed within 7-10 business days. We will notify you at every step."
        },
        {
          heading: "Exchanges",
          text: "We offer free exchanges for size or design changes within 30 days of purchase, ensuring you find the piece that truly speaks to you."
        }
      ]
    },
    privacy: {
      icon: ShieldCheck,
      title: "Privacy Policy",
      subtitle: "Guardians of Your Data",
      intro: "Your privacy is paramount to our brand. We are committed to protecting your personal information and your right to privacy with institutional-grade security.",
      content: [
        {
          heading: "Information We Collect",
          text: "We collect only essential data: contact details, billing/shipping addresses, and your order preferences to personalize your journey."
        },
        {
          heading: "Data Protection",
          text: "We use industry-standard security measures and encrypted protocols to protect your personal information from unauthorized access."
        },
        {
          heading: "Your Sovereign Rights",
          text: "You have the absolute right to access, correct, or request deletion of your personal information at any time via our privacy concierge."
        }
      ]
    },
    shipping: {
      icon: Truck,
      title: "Shipping Policy",
      subtitle: "Global Concierge Dispatch",
      intro: "We offer reliable, secure shipping options to deliver your jewelry safely and on time, anywhere in the world.",
      content: [
        {
          heading: "Secure Shipping Methods",
          text: "Standard (5-7 days), Express (2-3 days), or Overnight. All dispatches are fully insured and tracked for your peace of mind."
        },
        {
          heading: "Valuation-Based Shipping",
          text: "As a courtesy, we offer complimentary shipping on all orders above ₹2,00,000, reflecting our commitment to elite service."
        },
        {
          heading: "International Customs",
          text: "We ship to select global destinations. Please note that destination-specific customs and import duties may apply."
        }
      ]
    },
    terms: {
      icon: Scale,
      title: "Terms & Conditions",
      subtitle: "Our Governance",
      intro: "By using our digital environment and making acquisitions, you agree to these refined terms and conditions of engagement.",
      content: [
        {
          heading: "Acquisition & License",
          text: "Our digital content is provided for personal, non-commercial viewing. All designs and assets remain the exclusive property of Hridika."
        },
        {
          heading: "Product Integrity",
          text: "While we strive for absolute accuracy in imagery and pricing, we reserve the right to correct any clerical errors in our archives."
        },
        {
          heading: "Authenticity Guarantee",
          text: "All our jewelry comes with a hallmark certification, guaranteeing 92.5% pure silver or higher as indicated."
        }
      ]
    }
  };

  const currentPolicy = policies[type] || policies.return;

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 pt-2 pb-40">
        <div className="max-w-4xl">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/50 hover:backdrop-blur-md px-4 py-2 rounded-full -ml-4 transition-all duration-300 mb-12 group cursor-pointer"
          >
            <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Return to Navigation</span>
          </button>

          <span className="text-[#A68042] text-[11px] uppercase tracking-[0.4em] font-bold mb-4 block italic">{currentPolicy.subtitle}</span>
          <h1 className="text-5xl lg:text-7xl font-heading text-zinc-900 uppercase tracking-widest leading-tight mb-12">
            {currentPolicy.title}
          </h1>
          <p className="text-zinc-500 text-lg leading-relaxed italic border-l-2 border-zinc-100 pl-8 max-w-xl mb-32">
            {currentPolicy.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          <div className="space-y-24">
            {currentPolicy.content.map((section, idx) => (
              <section key={idx} className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 200}ms` }}>
                <h3 className="text-xs uppercase tracking-[0.2em] font-black text-zinc-900 border-b border-zinc-100 pb-4">
                  0{idx + 1}. {section.heading}
                </h3>
                <p className="text-zinc-500 text-sm italic leading-relaxed pl-4">
                  {section.text}
                </p>
              </section>
            ))}
          </div>

          <div className="lg:sticky lg:top-40 h-fit space-y-12">
            <div className="bg-zinc-900 p-12 text-white">
              <currentPolicy.icon className="text-[#A68042] mb-8" size={32} strokeWidth={1.5} />
              <h4 className="text-xl font-heading uppercase tracking-widest mb-6">Inquiry Needed?</h4>
              <p className="text-zinc-400 text-sm italic mb-10 leading-relaxed">
                Our legal and compliance team is available to clarify any aspect of our governance and policies.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-4 text-white text-[10px] uppercase tracking-widest font-bold border-b border-[#A68042] pb-1 hover:text-[#A68042] transition-colors group">
                Contact Policy Specialist
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.keys(policies).map((key) => (
                <Link
                  key={key}
                  href={`/policy/${key}`}
                  className={`p-6 border text-[10px] uppercase tracking-widest font-bold transition-all text-center ${type === key ? 'bg-zinc-50 border-zinc-900 text-zinc-900' : 'border-zinc-100 text-zinc-400 hover:border-zinc-300'}`}
                >
                  {key === 'return' ? 'Returns' : key}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
