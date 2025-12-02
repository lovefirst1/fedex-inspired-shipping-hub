import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ShippingMethodsSection from "@/components/ShippingMethodsSection";
import CustomerHappinessSection from "@/components/CustomerHappinessSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import FastDeliverySection from "@/components/FastDeliverySection";
import FAQSection from "@/components/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <FastDeliverySection />
        <ShippingMethodsSection />
        <CustomerHappinessSection />
        <WhyChooseUsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;