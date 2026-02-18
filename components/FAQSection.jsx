"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
    {
        question: "What Shipping Methods Are Available?",
        answer:
            "We offer standard and express shipping across India. All orders are insured and securely packaged. Standard delivery takes 5-7 business days, while express delivery takes 2-3 business days.",
    },
    {
        question: "How Long Will It Take To Get My Item?",
        answer:
            "Standard orders are typically delivered within 5-7 business days. Custom and bespoke pieces may take 2-4 weeks depending on the complexity of the design and craftsmanship involved.",
    },
    {
        question: "Do You Ship Internationally?",
        answer:
            "Currently, we ship across India. International shipping is coming soon. Please contact our team for special international requests and we will do our best to accommodate.",
    },
    {
        question: "How Can I Return Or Exchange An Item?",
        answer:
            "We accept returns and exchanges within 7 days of delivery. Items must be in their original condition with all tags and packaging intact. Please contact our support team to initiate the process.",
    },
    {
        question: "Is My Payment Information Secure?",
        answer:
            "Absolutely. We use industry-standard SSL encryption and partner with trusted payment gateways like Razorpay. Your financial information is never stored on our servers.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState(2); // 3rd item open by default like screenshot

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? -1 : index);
    };

    return (
        <section className="bg-[#FDF6EE] py-24 md:py-32">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-20 items-start">
                    {/* Left Column — Heading & CTA */}
                    <div className="lg:w-[38%] lg:sticky lg:top-48">
                        <h2 className="text-4xl md:text-5xl lg:text-[3.4rem] font-heading text-zinc-900 leading-tight mb-6">
                            Frequently Asked{" "}
                            <span className="italic text-[#A68042]">Questions</span>
                        </h2>
                        <p className="text-zinc-500 text-[15px] leading-relaxed mb-10 max-w-md">
                            Everything you need to know about our jewelry, shipping, and
                            bespoke services. Can&apos;t find your answer? Reach out to our
                            concierge team.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block border border-[#A68042]/40 text-[#A68042] px-8 py-3.5 rounded-full text-[12px] uppercase tracking-[0.2em] font-semibold hover:bg-[#A68042] hover:text-white transition-all duration-400"
                        >
                            Learn More
                        </Link>
                    </div>

                    {/* Right Column — Accordion */}
                    <div className="lg:w-[62%] w-full space-y-3">
                        {faqs.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <div key={index} className="group">
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className={`w-full flex items-center gap-4 px-6 py-5 rounded-sm text-left transition-all duration-300 ${isOpen
                                                ? "bg-white border border-[#A68042]/15 shadow-sm"
                                                : "bg-[#D4AF6A]/15 hover:bg-[#D4AF6A]/25 border border-transparent"
                                            }`}
                                    >
                                        <HelpCircle
                                            size={18}
                                            className={`flex-shrink-0 transition-colors duration-300 ${isOpen ? "text-[#A68042]" : "text-[#A68042]/60"
                                                }`}
                                            strokeWidth={1.5}
                                        />
                                        <span
                                            className={`flex-1 text-[14px] md:text-[15px] font-semibold tracking-wide transition-colors duration-300 ${isOpen ? "text-zinc-900" : "text-zinc-700"
                                                }`}
                                        >
                                            {faq.question}
                                        </span>
                                        <ChevronDown
                                            size={18}
                                            className={`flex-shrink-0 text-[#A68042]/50 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>

                                    {/* Answer */}
                                    <div
                                        className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                                            }`}
                                    >
                                        <div className="px-6 pt-4 pb-6 ml-10">
                                            <p className="text-zinc-500 text-[13px] md:text-[14px] leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
