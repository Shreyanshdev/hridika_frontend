import Hero from "../components/Hero";
import FeatureBanner from "../components/FeatureBanner";
import FeaturedProduct from "../components/FeaturedProduct";
import CategorySection from "../components/CategorySection";
import ProductGrid from "../components/ProductGrid";
import Newsletter from "../components/Newsletter";
import ParallaxSection from "../components/ParallaxSection";
import BlogSection from "../components/BlogSection";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <CategorySection />
      <FeatureBanner />
      <ProductGrid />
      <ParallaxSection />
      <FeaturedProduct />
      <BlogSection />
      <FAQSection />
      <Newsletter />
      <Footer />
    </main>
  );
}
