"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, Heart, Star, ChevronLeft, ChevronRight, Mail, Share2, ArrowRight, Package } from "lucide-react";
import ProductCard from "../../../components/ProductCard";
import Newsletter from "../../../components/Newsletter";
import QuickViewModal from "../../../components/QuickViewModal";
import { getProductById, addToCart, getProducts } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addedStatus, setAddedStatus] = useState(null);
  const [quantity, setQuantity] = useState(10);
  const [cartToast, setCartToast] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);

  // Quick View State
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState(null);

  const openQuickView = (product) => {
    setSelectedQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    // ... fetchProduct logic ... 
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await getProductById(id);
        const data = res.data;
        if (data) {
          setProduct(data);
          // Fetch related products from the same category
          try {
            const allRes = await getProducts();
            const allData = Array.isArray(allRes.data) ? allRes.data : [];
            setRelatedProducts(
              allData
                .filter(p => p.category === data.category && p.id !== data.id)
                .slice(0, 4)
            );
          } catch (err) {
            console.error("Error fetching related products:", err);
            setRelatedProducts([]);
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    // ... existing handleAddToCart ...
    if (!user) {
      router.push(`/login?redirect=/products/${id}`);
      return;
    }

    setIsAdding(true);
    setAddedStatus(null);
    try {
      await addToCart({ product_id: id, quantity: quantity });
      refreshCart();
      setAddedStatus('success');
      // Reset status after a few seconds
      setTimeout(() => setAddedStatus(null), 3000);
    } catch (err) {
      console.error("Add to cart error:", err);
      setAddedStatus('error');
      const msg = err?.response?.data?.msg || "Could not add to cart. Please try again.";
      setCartToast(msg);
      setTimeout(() => { setCartToast(null); setAddedStatus(null); }, 4000);
    } finally {
      setIsAdding(false);
    }
  };

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    // ... keeping loading the same ... 
    return (
      <div className="bg-white min-h-screen">
        {/* Placeholder Breadcrumb */}
        <div className="sticky top-[64px] md:top-[74px] z-40 bg-white border-b border-zinc-100 py-4">
          <div className="max-w-7xl mx-auto px-6">
            <div className="h-3 w-48 bg-zinc-100 animate-pulse rounded"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-24 mt-10">
          <div className="flex flex-col lg:flex-row gap-20">
            {/* Left Skeleton: Gallery */}
            <div className="w-full lg:w-[55%] flex flex-col md:flex-row gap-6">
              <div className="flex md:flex-col gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-20 h-20 bg-zinc-50 animate-pulse rounded border border-zinc-100"></div>
                ))}
              </div>
              <div className="flex-1 aspect-square bg-zinc-50 animate-pulse rounded border border-zinc-100"></div>
            </div>

            {/* Right Skeleton: Info */}
            <div className="w-full lg:w-[45%] space-y-8">
              <div className="space-y-4">
                <div className="h-10 w-3/4 bg-zinc-100 animate-pulse rounded"></div>
                <div className="h-6 w-1/4 bg-zinc-100 animate-pulse rounded"></div>
              </div>
              <div className="h-32 w-full bg-zinc-50 animate-pulse rounded border border-zinc-50"></div>
              <div className="space-y-4 pt-10">
                <div className="h-12 w-full bg-zinc-900/10 animate-pulse rounded"></div>
                <div className="h-12 w-1/2 bg-zinc-100 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    // ... keeping product not found same ...
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center">
        <Package className="mx-auto text-zinc-100 w-24 h-24 mb-6" strokeWidth={0.5} />
        <h1 className="text-4xl font-heading text-zinc-900 uppercase tracking-widest mb-4">Product Not Found</h1>
        <p className="text-zinc-400 italic mb-12">The masterpiece you seek is currently unavailable in our active collection.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/50 hover:backdrop-blur-md px-8 py-4 rounded-full transition-all duration-300 group cursor-pointer border border-zinc-100">
          <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
          <span className="text-[10px] uppercase tracking-widest font-bold">Return to Navigation</span>
        </Link>
      </div>
    );
  }

  // Use dynamic images from API or fallbacks
  const thumbnails = (() => {
    const rawImages = product.images;
    const defaultThumbs = ["/assets/pic1.jpg", "/assets/pic2.jpg", "/assets/pic3.jpg", "/assets/pic4.jpg"];

    if (Array.isArray(rawImages)) {
      const validImages = rawImages.filter(img => typeof img === 'string' && img.trim() !== "");
      return validImages.length > 0 ? validImages : defaultThumbs;
    }

    if (typeof rawImages === 'string' && rawImages.trim() !== "") {
      return [rawImages];
    }

    return defaultThumbs;
  })();

  return (
    <main className="bg-white min-h-screen">
      {/* Cart Toast */}
      {cartToast && (
        <div className="fixed top-6 right-6 z-[9999] max-w-sm border-l-4 border-red-500 bg-red-50 px-5 py-4 shadow-2xl rounded-lg animate-in slide-in-from-right duration-300">
          <div className="flex items-start gap-3">
            <p className="text-sm font-medium text-red-800 flex-1">{cartToast}</p>
            <button onClick={() => setCartToast(null)} className="opacity-50 hover:opacity-100 text-red-400">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      {/* Sticky Breadcrumbs Section - Relative to Navbar */}
      <div
        className={`sticky z-40 bg-white/95 backdrop-blur-sm border-b border-zinc-100 transition-all duration-500 ease-in-out ${isScrolled ? "top-[64px] md:top-[72px]" : "top-[64px] md:top-[160px]"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-zinc-400">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="text-[8px] opacity-30">/</span>
            <Link href={`/category/${product.category?.toLowerCase()}`} className="hover:text-black transition-colors">{product.category || "Jewelry"}</Link>
            <span className="text-[8px] opacity-30">/</span>
            <span className="text-zinc-800 font-medium truncate max-w-[300px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24 relative">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* Left Side: Sticky Image Gallery */}
          <div className="w-full lg:w-[55%] lg:sticky lg:top-[160px] lg:h-fit self-start">
            <div className="flex flex-col-reverse md:flex-row gap-6">
              {/* Thumbnails */}
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible no-scrollbar shrink-0">
                {thumbnails.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-16 md:w-24 md:h-24 border overflow-hidden transition-all duration-300 shrink-0 ${selectedImage === idx ? "border-[#A68042]" : "border-zinc-100 hover:border-zinc-300"}`}
                  >
                    <Image src={img} alt={`${product.name} view ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="relative flex-1 aspect-square bg-zinc-50 overflow-hidden border border-zinc-100 shadow-sm group">
                <Image
                  src={thumbnails[selectedImage] || "/assets/pic1.jpg"}
                  alt={product.name}
                  fill
                  className="object-contain p-8 transition-all duration-1000 group-hover:scale-105"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Side: Scrollable Info Section */}
          <div className="w-full lg:w-[45%] flex flex-col pt-4 lg:pt-10">
            <h1 className="text-3xl md:text-5xl font-heading font-medium text-zinc-900 mb-6 uppercase tracking-wider leading-[1.1] text-balance">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 mb-10">
              <div className="flex flex-col">
                <span className="text-[12px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Our Price</span>
                <span className="text-3xl font-medium text-[#A68042]">₹ {product.price?.toLocaleString()}</span>
              </div>
              {product.oldPrice && (
                <div className="flex flex-col opacity-40">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">Was</span>
                  <span className="text-xl text-zinc-400 line-through">₹ {product.oldPrice?.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Product Details Strip */}
            <div className="flex flex-wrap gap-3 mb-10">
              {product.metal_name && (
                <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 px-4 py-2.5">
                  <div className={`w-2 h-2 rounded-full ${product.metal_name?.toLowerCase() === 'gold' ? 'bg-[#A68042]' : 'bg-zinc-400'}`} />
                  <span className="text-[10px] uppercase tracking-widest font-black text-zinc-800">{product.metal_name}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 px-4 py-2.5">
                  <span className="text-[10px] uppercase tracking-widest font-black text-zinc-800">{product.weight}g</span>
                </div>
              )}
              {product.category && (
                <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 px-4 py-2.5">
                  <span className="text-[10px] uppercase tracking-widest font-black text-zinc-800">{product.category}</span>
                </div>
              )}
              {product.stock > 0 ? (
                product.stock <= 10 ? (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700">Only {product.stock} Left</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-4 py-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] uppercase tracking-widest font-bold text-green-700">In Stock</span>
                  </div>
                )
              ) : (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-4 py-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-red-700">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            {product.price > 0 && (
              <div className="mb-10 bg-zinc-50 border border-zinc-100 p-6">
                <h3 className="text-[10px] uppercase tracking-widest font-black text-zinc-500 mb-4">Price Breakdown</h3>
                <div className="space-y-2.5 text-[11px]">
                  <div className="flex justify-between text-zinc-600">
                    <span>Base ({product.metal_name || 'Metal'} × {product.weight}g)</span>
                    <span className="font-medium text-zinc-800">₹{((product.price_per_gram || 0) * (product.weight || 0)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                  {(product.making_charge > 0) && (
                    <div className="flex justify-between text-zinc-600">
                      <span>Making Charge ({product.making_charge}%)</span>
                      <span className="font-medium text-zinc-800">₹{(((product.price_per_gram || 0) * (product.weight || 0)) * (product.making_charge || 0) / 100).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-600">
                    <span>GST (3%)</span>
                    <span className="font-medium text-zinc-800">Inclusive</span>
                  </div>
                  {(product.other_charges > 0) && (
                    <div className="flex justify-between text-zinc-600">
                      <span>Other Charges</span>
                      <span className="font-medium text-zinc-800">₹{parseFloat(product.other_charges).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2.5 mt-2.5 border-t border-zinc-200 font-bold text-zinc-900">
                    <span className="uppercase tracking-wider text-[10px]">Total per piece</span>
                    <span>₹{product.price?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="prose prose-sm text-zinc-400 mb-12 leading-loose italic border-l-2 border-[#A68042]/20 pl-8">
              <p>{product.description || "Indulge in the timeless elegance of this meticulously crafted piece. Designed for those who appreciate the finer things in life, it combines classic sophistication with modern luxury."}</p>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Quantity</label>
                <div className="flex items-center border border-zinc-200 w-fit h-12">
                  <button
                    onClick={() => setQuantity(Math.max(10, quantity - 1))}
                    disabled={quantity <= 10 || (product.stock || 0) <= 0}
                    className="px-4 hover:bg-zinc-50 transition-colors text-zinc-400 hover:text-black disabled:opacity-30"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    readOnly
                    className="w-12 text-center focus:outline-none font-bold text-zinc-800 text-sm"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || quantity, quantity + 1))}
                    disabled={(product.stock || 0) <= 0 || quantity >= (product.stock || 0)}
                    className="px-4 hover:bg-zinc-50 transition-colors text-zinc-400 hover:text-black disabled:opacity-30"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || (product.stock || 0) <= 0}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-8 uppercase tracking-[0.25em] text-[12px] font-bold transition-all duration-300 border ${(product.stock || 0) <= 0
                    ? "bg-zinc-200 border-zinc-200 text-zinc-400 cursor-not-allowed"
                    : addedStatus === 'success'
                      ? "bg-green-600 border-green-600 text-white"
                      : "bg-zinc-900 border-zinc-900 text-white hover:bg-[#A68042] hover:border-[#A68042]"
                    } ${isAdding ? "opacity-70 cursor-not-allowed" : "shadow-lg shadow-zinc-100"}`}
                >
                  {(product.stock || 0) <= 0 ? (
                    "Out of Stock"
                  ) : isAdding ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : addedStatus === 'success' ? (
                    "Added Successfully!"
                  ) : (
                    <>
                      <ShoppingBag size={18} strokeWidth={1.5} />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`p-4 border transition-all duration-300 flex items-center justify-center group ${isWishlisted ? "border-[#A68042] text-[#A68042]" : "border-zinc-200 hover:border-[#A68042]"
                    }`}
                >
                  <Heart
                    size={20}
                    strokeWidth={1.5}
                    className={`transition-all duration-300 ${isWishlisted ? "fill-[#A68042] scale-125" : "text-zinc-400 group-hover:text-[#A68042]"}`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-6 pt-6 border-t border-zinc-50">
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: `Check out this ${product.name} on Hridika Jewels!`,
                        url: window.location.href,
                      })
                        .catch((error) => console.log('Error sharing', error));
                    } else {
                      // Fallback for desktop - Copy to clipboard
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                  className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-zinc-400 hover:text-black transition-colors font-bold"
                >
                  <Share2 size={12} /> Share
                </button>
                <button
                  onClick={() => window.location.href = `mailto:jscompany1027@gmail.com?subject=Inquiry regarding ${product.name}&body=Hello Hridika Team,%0D%0A%0D%0AI am interested in the ${product.name}.%0D%0A%0D%0APlease provide more details.`}
                  className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-zinc-400 hover:text-black transition-colors font-bold"
                >
                  <Mail size={12} /> Email Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Tabs */}
        <div className="border-t border-zinc-100 pt-16 mb-24">
          <div className="flex flex-wrap justify-center gap-12 mb-12">
            {["description", "measurements & specs", "shipping & returns", "size charts"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[12px] uppercase tracking-[0.25em] font-bold pb-2 border-b-2 transition-all ${activeTab === tab ? "border-[#A68042] text-zinc-900" : "border-transparent text-zinc-300 hover:text-zinc-500"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto text-zinc-500 text-[14px] leading-relaxed">
            {activeTab === "description" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="mb-4">Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis amet voluptas assumenda est, omnis dolor repellendus quis nostrum.</p>
                <p>Temporibus autem quibusdam et aut officiis debitis aut rerum dolorem necessitatibus saepe eveniet ut et neque porro quisquam est, qui dolorem ipsum quia dolor s...</p>
              </div>
            )}
            {activeTab === "measurements & specs" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-zinc-900 font-bold mb-2 uppercase tracking-widest text-[11px]">Dimensions</h4>
                  <p>Width: 2mm, Height: 24mm</p>
                </div>
                <div>
                  <h4 className="text-zinc-900 font-bold mb-2 uppercase tracking-widest text-[11px]">Material</h4>
                  <p>{product.metal_name || "18K White Gold"}, {product.weight || "2.5"}g</p>
                </div>
              </div>
            )}
            {activeTab === "shipping & returns" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-6">
                <div>
                  <h4 className="text-zinc-900 font-bold mb-2 uppercase tracking-widest text-[11px]">Shipping Policy</h4>
                  <p>We provide free insured shipping on all orders within India. Your piece will be securely packaged in our signature velvet box and delivered within 5-7 business days.</p>
                </div>
                <div>
                  <h4 className="text-zinc-900 font-bold mb-2 uppercase tracking-widest text-[11px]">Returns & Exchanges</h4>
                  <p>We offer a 15-day no-questions-asked return policy. If you are not completely satisfied with your purchase, you may return it for a full refund or exchange. Custom-made items are not eligible for return.</p>
                </div>
              </div>
            )}
            {activeTab === "size charts" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[12px]">
                    <thead>
                      <tr className="border-b border-zinc-200">
                        <th className="py-2 font-bold uppercase tracking-widest text-zinc-900">Size (IN)</th>
                        <th className="py-2 font-bold uppercase tracking-widest text-zinc-900">Diameter (mm)</th>
                        <th className="py-2 font-bold uppercase tracking-widest text-zinc-900">Circumference (mm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-50">
                        <td className="py-2 text-zinc-500">6</td>
                        <td className="py-2 text-zinc-500">16.5</td>
                        <td className="py-2 text-zinc-500">51.9</td>
                      </tr>
                      <tr className="border-b border-zinc-50">
                        <td className="py-2 text-zinc-500">7</td>
                        <td className="py-2 text-zinc-500">17.3</td>
                        <td className="py-2 text-zinc-500">54.4</td>
                      </tr>
                      <tr className="border-b border-zinc-50">
                        <td className="py-2 text-zinc-500">8</td>
                        <td className="py-2 text-zinc-500">18.2</td>
                        <td className="py-2 text-zinc-500">57.0</td>
                      </tr>
                      <tr className="border-b border-zinc-50">
                        <td className="py-2 text-zinc-500">9</td>
                        <td className="py-2 text-zinc-500">18.9</td>
                        <td className="py-2 text-zinc-500">59.5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-[10px] italic text-zinc-400">* For precise fitting, we recommend visiting a local jeweler to have your size measured.</p>
              </div>
            )}
          </div>
        </div>



        {/* Related Products */}
        <div className="border-t border-zinc-100 pt-24">
          <div className="text-center mb-16">
            <h2 className="text-[14px] tracking-[0.4em] uppercase text-zinc-800 font-medium mb-4">
              You may also like the related products
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
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={() => openQuickView(p)} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedQuickViewProduct && (
        <QuickViewModal
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          product={selectedQuickViewProduct}
        />
      )}

      <Newsletter />
    </main>
  );
}
